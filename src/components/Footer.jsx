export default function Footer() {
  return (
    <footer className="border-t border-line dark:border-white/10 py-10 text-sm text-ink-soft">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} LaporAman</span>
        <span>Nizam</span>
      </div>
    </footer>
  )
}
