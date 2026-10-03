import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const STATUS_STEPS = ['Received', 'Reviewing', 'Follow-up', 'Resolved']

export default function Report() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    jenis: '',
    tanggal: '',
    lokasi: '',
    kronologi: '',
    masih_berlangsung: false,
    ada_saksi: false,
    anon: false
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) {
      setError('Kamu perlu login dulu untuk mengirim laporan.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      let bukti_url = null
      if (file) {
        const path = `${user.id}/${Date.now()}_${file.name}`
        const { error: upErr } = await supabase.storage.from('report-evidence').upload(path, file)
        if (upErr) throw upErr
        bukti_url = path
      }

      const { data, error: insErr } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          jenis: form.jenis,
          tanggal: form.tanggal,
          lokasi: form.lokasi,
          kronologi: form.kronologi,
          masih_berlangsung: form.masih_berlangsung,
          ada_saksi: form.ada_saksi,
          is_anonymous: form.anon,
          bukti_url
        })
        .select()
        .single()

      if (insErr) throw insErr
      setResult(data)
      setForm({ jenis: '', tanggal: '', lokasi: '', kronologi: '', masih_berlangsung: false, ada_saksi: false, anon: false })
      setFile(null)
    } catch (err) {
      setError(err.message || 'Gagal mengirim laporan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">Laporkan Kejadian</p>
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-3.5">Ceritakan apa yang terjadi</h2>
        <p className="text-ink-soft">Isi sesuai yang kamu ketahui kamu tidak perlu tahu semuanya untuk mulai melapor.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-14 items-start">
        <div>
          <div className="bg-teal-soft rounded-xl p-5 mb-6 text-sm text-navy-800">
            <strong className="block text-navy-950 mb-1">Privasi kamu terlindungi</strong>
            Informasi laporan hanya dapat diakses oleh pihak yang memiliki izin. Kami tidak meminta
            data pribadi yang tidak diperlukan.
          </div>

          {!user && (
            <div className="rounded-xl border border-line dark:border-white/10 bg-white dark:bg-[#16213a] p-5 mb-6">
              <p className="text-sm text-ink-soft mb-3">
                Kamu perlu login untuk mengirim laporan (supaya bisa dipantau statusnya).
              </p>
              <Link to="/login" className="btn btn-primary">Masuk</Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {error && <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3.5 py-2.5">{error}</div>}

            <div>
              <label className="field-label">Jenis kejadian</label>
              <select className="field-input" value={form.jenis} onChange={(e) => update('jenis', e.target.value)} required>
                <option value="">Pilih jenis kejadian</option>
                <option>Verbal</option>
                <option>Fisik</option>
                <option>Sosial/Relasional</option>
                <option>Cyberbullying</option>
              </select>
            </div>

            <div>
              <label className="field-label">Tanggal kejadian</label>
              <input type="date" className="field-input" value={form.tanggal} onChange={(e) => update('tanggal', e.target.value)} required />
            </div>

            <div>
              <label className="field-label">Lokasi umum</label>
              <input type="text" className="field-input" placeholder="Contoh: area kantin, luar sekolah" value={form.lokasi} onChange={(e) => update('lokasi', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Kronologi</label>
              <textarea className="field-input min-h-[110px]" placeholder="Ceritakan apa yang terjadi, sesuai yang kamu ingat" value={form.kronologi} onChange={(e) => update('kronologi', e.target.value)} required />
            </div>

            <label className="flex items-center gap-2.5 text-sm font-medium">
              <input type="checkbox" checked={form.masih_berlangsung} onChange={(e) => update('masih_berlangsung', e.target.checked)} />
              Kejadian masih berlangsung
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium">
              <input type="checkbox" checked={form.ada_saksi} onChange={(e) => update('ada_saksi', e.target.checked)} />
              Ada saksi yang melihat kejadian
            </label>

            <div>
              <label className="field-label">Unggah bukti (opsional)</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
              <p className="text-xs text-ink-soft mt-1">Format gambar atau dokumen, jika ada.</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-black/[0.02] dark:bg-white/5 border border-line dark:border-white/10 px-4 py-3.5">
              <div>
                <strong className="text-sm block">Kirim sebagai laporan anonim</strong>
                <p className="text-xs text-ink-soft mt-0.5">Identitasmu tidak ditampilkan di antarmuka komunitas/publik.</p>
              </div>
              <button
                type="button"
                onClick={() => update('anon', !form.anon)}
                className={`relative w-[42px] h-6 rounded-full flex-none transition-colors ${form.anon ? 'bg-teal' : 'bg-line dark:bg-white/15'}`}
                aria-pressed={form.anon}
              >
                <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${form.anon ? 'translate-x-[18px]' : ''}`} />
              </button>
            </div>

            <button type="submit" disabled={submitting || !user} className="btn btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </form>
        </div>

        <div>
          {result ? (
            <div className="bg-navy-950 text-offwhite rounded-2xl p-8">
              <h3 className="text-xl font-medium mb-1.5">Laporan berhasil diterima.</h3>
              <p className="text-[#c3cbdb] text-sm">Simpan kode ini untuk memantau status laporanmu.</p>
              <div className="font-mono bg-white/10 border border-white/20 inline-block px-3.5 py-2.5 rounded-lg my-3.5">
                {result.report_code}
              </div>
              <p className="text-[#c3cbdb] text-sm">
                {new Date(result.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <div className="flex mt-5">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="flex-1 text-center text-xs relative pt-4">
                    <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-teal' : 'bg-white/25'}`} />
                    <span className={i === 0 ? 'text-offwhite' : 'text-[#9fb0c9]'}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-ink-soft border border-dashed border-line dark:border-white/15 rounded-2xl p-8 text-sm">
              Setelah kamu kirim, ringkasan laporan dan status penanganannya akan muncul di sini.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
