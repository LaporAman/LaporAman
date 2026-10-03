import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('laporaman_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('laporaman_theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema gelap/terang"
      title="Ganti tema"
      className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line dark:border-white/10 text-navy-900 dark:text-offwhite hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors"
    >
      {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  )
}
