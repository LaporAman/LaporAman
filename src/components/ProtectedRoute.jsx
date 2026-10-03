import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="py-24 text-center text-ink-soft">Memuat...</div>
  if (!user) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h2 className="text-2xl font-medium mb-2">Masuk untuk melanjutkan</h2>
        <p className="text-ink-soft mb-6">Login untuk mengakses halaman ini.</p>
        <Link to="/login" className="btn btn-primary">
          Masuk
        </Link>
      </div>
    )
  }
  return children
}

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="py-24 text-center text-ink-soft">Memuat...</div>
  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h2 className="text-2xl font-medium mb-2">Khusus admin</h2>
        <p className="text-ink-soft mb-6">Masuk dengan akun admin untuk membuka dashboard ini.</p>
        <Link to="/login" className="btn btn-primary">
          Masuk
        </Link>
      </div>
    )
  }
  return children
}
