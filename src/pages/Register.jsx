import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: '', username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    try {
      const data = await signUp({ email: form.email, password: form.password, nama: form.nama, username: form.username })
      if (data?.session) {
        // Email confirmation OFF di project Supabase-nya → langsung login
        navigate('/profile')
      } else {
        // Email confirmation ON (default Supabase project baru) → belum ada session aktif
        setNeedsConfirm(true)
      }
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (needsConfirm) {
    return (
      <div className="max-w-[420px] mx-auto my-14 px-6">
        <div className="card p-9 text-center">
          <h2 className="text-2xl font-medium mb-2">Cek email kamu</h2>
          <p className="text-ink-soft text-sm mb-6">
            Kami sudah kirim link konfirmasi ke <b>{form.email}</b>. Klik link itu dulu, baru kamu
            bisa login.
            <br />
            <span className="text-xs">
              (Kalau mau skip langkah ini saat development, matikan "Confirm email" di Supabase
              Dashboard → Authentication → Providers → Email.)
            </span>
          </p>
          <Link to="/login" className="btn btn-primary">Ke halaman Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[420px] mx-auto my-14 px-6">
      <div className="card p-9">
        <h2 className="text-2xl font-medium mb-1.5">Buat akun</h2>
        <p className="text-ink-soft text-sm mb-6">Butuh beberapa detik saja.</p>

        {error && <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3.5 py-2.5 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="field-label">Nama</label>
            <input type="text" className="field-input" value={form.nama} onChange={(e) => update('nama', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Username</label>
            <input type="text" className="field-input" value={form.username} onChange={(e) => update('username', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" className="field-input" minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Konfirmasi password</label>
            <input type="password" className="field-input" minLength={6} value={form.password2} onChange={(e) => update('password2', e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-teal font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
