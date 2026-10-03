import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Overview() {
  const [kpi, setKpi] = useState(null)

  useEffect(() => {
    async function load() {
      const [reports, users, comments] = await Promise.all([
        supabase.from('reports').select('status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true })
      ])
      const r = reports.data || []
      setKpi({
        total: r.length,
        received: r.filter((x) => x.status === 'Received').length,
        reviewing: r.filter((x) => x.status === 'Reviewing').length,
        resolved: r.filter((x) => x.status === 'Resolved').length,
        users: users.count || 0,
        comments: comments.count || 0
      })
    }
    load()
  }, [])

  if (!kpi) return <p className="text-ink-soft text-sm">Memuat...</p>

  const items = [
    ['Total laporan', kpi.total],
    ['Menunggu ditinjau', kpi.received],
    ['Sedang ditinjau', kpi.reviewing],
    ['Selesai', kpi.resolved],
    ['Total pengguna', kpi.users],
    ['Total komentar', kpi.comments]
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(([label, value]) => (
        <div key={label} className="border border-line dark:border-white/10 rounded-xl p-4.5">
          <b className="font-display text-[1.7rem] block">{value}</b>
          <span className="text-xs text-ink-soft">{label}</span>
        </div>
      ))}
    </div>
  )
}
