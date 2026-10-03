import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUSES = ['Received', 'Reviewing', 'Follow-up', 'Resolved']
const JENIS = ['Verbal', 'Fisik', 'Sosial/Relasional', 'Cyberbullying']
const BADGE_CLASS = {
  Received: 'bg-[#eef1f6] text-[#455270]',
  Reviewing: 'bg-[#fdf3e2] text-[#96650f]',
  'Follow-up': 'bg-teal-soft text-[#2f6459]',
  Resolved: 'bg-[#e3f2e8] text-[#1f7a44]'
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [jenisFilter, setJenisFilter] = useState('')
  const [active, setActive] = useState(null)
  const [note, setNote] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  async function load() {
    setLoading(true)
    let query = supabase.from('reports').select('*').order('created_at', { ascending: false })
    if (statusFilter) query = query.eq('status', statusFilter)
    if (jenisFilter) query = query.eq('jenis', jenisFilter)
    const { data } = await query
    setReports(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, jenisFilter])

  async function openModal(r) {
    setActive(r)
    setNewStatus(r.status)
    setNote('')
    setHistoryLoading(true)
    const { data } = await supabase
      .from('report_updates')
      .select('*')
      .eq('report_id', r.id)
      .order('created_at', { ascending: false })
    setHistory(data || [])
    setHistoryLoading(false)
  }

  async function saveStatus() {
    if (!active) return
    setSaving(true)
    await supabase.from('reports').update({ status: newStatus }).eq('id', active.id)
    if (note.trim()) {
      await supabase.from('report_updates').insert({ report_id: active.id, status: newStatus, note: note.trim() })
    }
    setSaving(false)
    setActive(null)
    load()
  }

  async function deleteReport(id) {
    if (!confirm('Hapus laporan ini? Tindakan ini tidak bisa dibatalkan.')) return
    setDeleting(true)
    await supabase.from('reports').delete().eq('id', id)
    setDeleting(false)
    setActive(null)
    load()
  }

  return (
    <div>
      <div className="flex gap-2.5 mb-4.5 flex-wrap">
        <select className="field-input w-auto text-sm py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Semua status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="field-input w-auto text-sm py-2" value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
          <option value="">Semua kategori</option>
          {JENIS.map((j) => <option key={j}>{j}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-ink-soft text-xs uppercase tracking-wide border-b border-line dark:border-white/10">
              <th className="text-left py-2.5 px-3 font-semibold">Kode</th>
              <th className="text-left py-2.5 px-3 font-semibold">Kategori</th>
              <th className="text-left py-2.5 px-3 font-semibold">Waktu</th>
              <th className="text-left py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-7 text-ink-soft">Memuat...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-7 text-ink-soft">Tidak ada laporan yang cocok.</td></tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-line dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5">
                  <td className="py-3 px-3">{r.report_code}</td>
                  <td className="py-3 px-3">{r.jenis}{r.is_anonymous && <span className="ml-1.5 text-xs text-ink-soft">(anonim)</span>}</td>
                  <td className="py-3 px-3">{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 px-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${BADGE_CLASS[r.status]}`}>{r.status}</span></td>
                  <td className="py-3 px-3 flex gap-2">
                    <button onClick={() => openModal(r)} className="border border-line dark:border-white/10 rounded-md px-2.5 py-1 text-xs font-semibold hover:border-navy-900 dark:hover:border-offwhite">
                      Detail
                    </button>
                    <button onClick={() => deleteReport(r.id)} className="border border-line dark:border-white/10 rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 hover:border-red-400">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 bg-navy-950/55 flex items-center justify-center p-5 z-[60]" onClick={() => setActive(null)}>
          <div className="card max-w-[520px] w-full p-7 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-medium mb-1">{active.report_code}</h3>
            <p className="text-ink-soft text-sm mb-4.5">{active.jenis} · {new Date(active.created_at).toLocaleString('id-ID')}</p>
            <p className="text-sm mb-4.5 whitespace-pre-wrap">{active.kronologi}</p>

            {(historyLoading || history.length > 0) && (
              <div className="mb-5">
                <label className="field-label">Riwayat catatan admin</label>
                {historyLoading ? (
                  <p className="text-sm text-ink-soft">Memuat riwayat...</p>
                ) : (
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto border border-line dark:border-white/10 rounded-lg p-3">
                    {history.map((h) => (
                      <div key={h.id} className="text-xs border-b border-line dark:border-white/10 last:border-0 pb-2 last:pb-0">
                        <div className="flex justify-between text-ink-soft mb-0.5">
                          <span className="font-semibold">{h.status}</span>
                          <span>{new Date(h.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        {h.note && <p>{h.note}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="field-label">Ubah status</label>
              <select className="field-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="field-label">Catatan internal</label>
              <textarea className="field-input min-h-[80px]" placeholder="Catatan hanya untuk tim admin" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="flex gap-2.5 justify-between">
              <button onClick={() => deleteReport(active.id)} disabled={deleting} className="text-red-600 text-sm font-semibold hover:underline disabled:opacity-50">
                {deleting ? 'Menghapus...' : 'Hapus laporan'}
              </button>
              <div className="flex gap-2.5">
                <button onClick={() => setActive(null)} className="btn btn-ghost">Batal</button>
                <button onClick={saveStatus} disabled={saving} className="btn btn-primary disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
