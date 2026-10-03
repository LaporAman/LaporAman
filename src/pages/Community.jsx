import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

export default function Community() {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  const [comments, setComments] = useState([])
  const [likedIds, setLikedIds] = useState(new Set())
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('comments')
      .select('id, body, created_at, likes_count, user_id, profiles ( nama, avatar_url )')
      .eq('hidden', false)
      .order('created_at', { ascending: false })

    if (!error) setComments(data || [])

    if (user) {
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id)

      setLikedIds(new Set((likes || []).map((l) => l.comment_id)))
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  async function postComment() {
    if (!user || !text.trim()) return

    setPosting(true)

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        body: text.trim(),
      })

    if (!error) {
      setText('')
      load()
    }

    setPosting(false)
  }

  async function toggleLike(id) {
    if (!user) return

    if (likedIds.has(id)) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', id)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: id,
          user_id: user.id,
        })
    }

    load()
  }

  async function reportComment(id) {
    if (!user) return

    await supabase
      .from('comment_reports')
      .insert({
        comment_id: id,
        reported_by: user.id,
      })

    alert('Komentar dilaporkan ke moderator.')
  }

  async function deleteComment(id) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Gagal menghapus komentar:', error)
      alert('Gagal menghapus komentar.')
      return
    }

    load()
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">
          Community
        </p>

        <h2 className="font-display text-2xl md:text-3xl font-medium mb-3.5">
          Ruang cerita yang aman
        </h2>

        <p className="text-ink-soft">
          Bagikan pengalaman atau dukung cerita orang lain. Semua komentar dimoderasi.
        </p>
      </div>

      {user ? (
        <div className="flex gap-3 mb-8">
          <Avatar
            name={profile?.nama}
            src={profile?.avatar_url}
          />

          <div className="flex-1">
            <textarea
              className="field-input min-h-[64px] resize-y"
              placeholder="Bagikan cerita atau dukunganmu..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="text-right mt-2">
              <button
                onClick={postComment}
                disabled={posting || !text.trim()}
                className="btn btn-accent disabled:opacity-50"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-teal-soft text-navy-800 rounded-xl p-5 mb-8 text-sm">
          <strong className="block text-navy-950 mb-1">
            Masuk untuk ikut berkomentar
          </strong>

          <Link
            to="/login"
            className="font-semibold underline"
          >
            Login atau daftar
          </Link>{' '}
          untuk berbagi cerita di komunitas.
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft text-sm">
          Memuat...
        </p>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-ink-soft">
          Belum ada cerita di sini. Jadilah orang pertama yang berbagi.
        </div>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            className="flex gap-3 py-5 border-b border-line dark:border-white/10"
          >
            <Avatar
              name={c.profiles?.nama}
              src={c.profiles?.avatar_url}
            />

            <div className="flex-1">
              <div className="flex items-baseline gap-2.5 mb-1">
                <b className="text-sm">
                  {c.profiles?.nama || 'Pengguna'}
                </b>

                <span className="text-xs text-ink-soft">
                  {timeAgo(c.created_at)}
                </span>
              </div>

              <p className="text-sm mb-2">
                {c.body}
              </p>

              <div className="flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => toggleLike(c.id)}
                  className={`hover:text-navy-900 dark:hover:text-offwhite ${
                    likedIds.has(c.id)
                      ? 'text-teal'
                      : 'text-ink-soft'
                  }`}
                >
                  Suka ({c.likes_count})
                </button>

                <button
                  onClick={() => reportComment(c.id)}
                  className="text-ink-soft hover:text-navy-900 dark:hover:text-offwhite"
                >
                  Laporkan
                </button>

                {(user?.id === c.user_id || isAdmin) && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-ink-soft hover:text-navy-900 dark:hover:text-offwhite"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}