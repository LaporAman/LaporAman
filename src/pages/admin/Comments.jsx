import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Comments() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('comment_reports')
      .select('id, reason, comment_id, comments ( id, body, hidden, profiles ( nama ) )')
      .order('created_at', { ascending: false })

    const seen = new Map()
    ;(data || []).forEach((r) => {
      if (r.comments) seen.set(r.comments.id, r.comments)
    })
    setRows([...seen.values()])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleHide(id, hidden) {
    await supabase.from('comments').update({ hidden: !hidden }).eq('id', id)
    load()
  }

  async function remove(id) {
    await supabase.from('comments').delete().eq('id', id)
    load()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-ink-soft text-xs uppercase tracking-wide border-b border-line dark:border-white/10">
            <th className="text-left py-2.5 px-3 font-semibold">Pengguna</th>
            <th className="text-left py-2.5 px-3 font-semibold">Komentar</th>
            <th className="text-left py-2.5 px-3 font-semibold">Status</th>
            <th className="py-2.5 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="text-center py-7 text-ink-soft">Memuat...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-7 text-ink-soft">Tidak ada komentar yang dilaporkan.</td></tr>
          ) : (
            rows.map((c) => (
              <tr key={c.id} className="border-b border-line dark:border-white/10">
                <td className="py-3 px-3">{c.profiles?.nama}</td>
                <td className="py-3 px-3 max-w-[320px]">{c.body}</td>
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.hidden ? 'bg-[#fbeceb] text-[#a5372a]' : 'bg-[#e3f2e8] text-[#1f7a44]'}`}>
                    {c.hidden ? 'Disembunyikan' : 'Tampil'}
                  </span>
                </td>
                <td className="py-3 px-3 flex gap-2">
                  <button onClick={() => toggleHide(c.id, c.hidden)} className="border border-line dark:border-white/10 rounded-md px-2.5 py-1 text-xs font-semibold">
                    {c.hidden ? 'Tampilkan' : 'Hide'}
                  </button>
                  <button onClick={() => remove(c.id)} className="border border-line dark:border-white/10 rounded-md px-2.5 py-1 text-xs font-semibold">
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
