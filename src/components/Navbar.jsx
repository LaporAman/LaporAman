import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/bullying', label: 'Kenali Bullying' },
  { to: '/check', label: 'Check Situation' },
  { to: '/report', label: 'Laporkan' },
  { to: '/community', label: 'Community' },
  { to: '/contact', label: 'Contact' }
]

function linkClass({ isActive }) {
  return [
    'rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
    isActive
      ? 'bg-white dark:bg-[#16213a] text-navy-900 dark:text-offwhite shadow-sm'
      : 'text-ink-soft hover:text-navy-900 dark:hover:text-offwhite hover:bg-white dark:hover:bg-[#16213a]'
  ].join(' ')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line dark:border-white/10 bg-paper/90 dark:bg-navy-950/85 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-navy-900 dark:text-offwhite" onClick={() => setOpen(false)}>
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-navy-900 text-offwhite">
            <Shield size={16} strokeWidth={2.2} />
          </span>
          LaporAman
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 rounded-[11px] border border-line dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" title={profile?.nama}>
                <Avatar name={profile?.nama} src={profile?.avatar_url} size="sm" />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn btn-ghost">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
              <Link to="/report" className="btn btn-primary">
                Laporkan
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/report" className="btn btn-primary">
                Laporkan Kejadian
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex flex-col gap-[5px] p-2"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line dark:border-white/10 px-6 pb-5 pt-2 flex flex-col gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-line dark:border-white/10 font-medium"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-2.5 pt-3 flex-wrap">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="btn btn-ghost">
                  Profil
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="btn btn-ghost">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn btn-ghost">
                Login
              </Link>
            )}
            <Link to="/report" onClick={() => setOpen(false)} className="btn btn-primary">
              Laporkan Kejadian
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
