import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'

const BADGE_CLASS = {
  Received: 'bg-[#eef1f6] text-[#455270]',
  Reviewing: 'bg-[#fdf3e2] text-[#96650f]',
  'Follow-up': 'bg-teal-soft text-[#2f6459]',
  Resolved: 'bg-[#e3f2e8] text-[#1f7a44]'
}

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [reports, setReports] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [form, setForm] = useState({ nama: '', username: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({ nama: profile?.nama || '', username: profile?.username || '' })

    supabase
      .from('reports')
      .select('id, report_code, jenis, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReports(data || []))

    supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setCommentCount(count || 0))
  }, [user, profile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const { error } = await supabase
      .from('profiles')
      .update({ nama: form.nama, username: form.username })
      .eq('id', user.id)
    if (!error) {
      await refreshProfile()
      setMsg('Profil diperbarui.')
    } else {
      setMsg(error.message)
    }
    setSaving(false)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    setMsg('')
    try {
      const path = `${user.id}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)
      if (updErr) throw updErr

      await refreshProfile()
      setMsg('Foto profil diperbarui.')
    } catch (err) {
      setMsg(err.message || 'Gagal mengunggah foto.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="flex items-center gap-5 mb-9">
        <div className="relative">
          <Avatar name={profile?.nama} src={profile?.avatar_url} size="lg" />
          <label className="absolute -bottom-1 -right-1 bg-navy-900 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs cursor-pointer shadow-sm hover:bg-navy-800">
            {uploading ? '…' : '✎'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-medium">{profile?.nama}</h2>
          <p className="text-ink-soft">
            @{profile?.username} · Bergabung{' '}
            {profile?.created_at && new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
          {msg && <p className="text-sm text-teal mt-1">{msg}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-9 max-w-xl">
        <div className="border border-line dark:border-white/10 rounded-xl p-4.5 text-center">
          <b className="font-display text-2xl block">{reports.length}</b>
          <span className="text-xs text-ink-soft">Laporan dibuat</span>
        </div>
        <div className="border border-line dark:border-white/10 rounded-xl p-4.5 text-center">
          <b className="font-display text-2xl block">{commentCount}</b>
          <span className="text-xs text-ink-soft">Komentar</span>
        </div>
        <div className="border border-line dark:border-white/10 rounded-xl p-4.5 text-center">
          <b className="font-display text-2xl block">{reports.filter((r) => r.status === 'Resolved').length}</b>
          <span className="text-xs text-ink-soft">Selesai</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-semibold mb-3.5">Laporan saya</h3>
          {reports.length === 0 ? (
            <p className="text-ink-soft text-sm">Belum ada laporan.</p>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="flex justify-between items-center py-3.5 border-b border-line dark:border-white/10 text-sm">
                <span>{r.report_code} · {r.jenis}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${BADGE_CLASS[r.status]}`}>{r.status}</span>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3.5">Ubah profil</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="field-label">Nama</label>
              <input className="field-input" value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Username</label>
              <input className="field-input" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="btn btn-ghost">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {msg && <p className="text-sm text-teal">{msg}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
