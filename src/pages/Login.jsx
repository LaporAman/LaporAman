import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Email/username atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[420px] mx-auto my-14 px-6">
      <div className="card p-9">
        <h2 className="text-2xl font-medium mb-1.5">Masuk ke akunmu</h2>
        <p className="text-ink-soft text-sm mb-6">
          Untuk melapor sebagai anggota, ikut diskusi komunitas, dan memantau laporanmu.
        </p>

        {error && <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3.5 py-2.5 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <label className="field-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="field-input pr-16" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-[38px] text-ink-soft text-xs font-semibold flex items-center gap-1">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />} {showPw ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          Belum punya akun?{' '}
          <Link to="/register" className="text-teal font-semibold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
