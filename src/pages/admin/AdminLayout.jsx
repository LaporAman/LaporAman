import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/comments', label: 'Comments' },
  { to: '/admin/users', label: 'Users' }
]

function tabClass({ isActive }) {
  return [
    'block px-3 py-2.5 rounded-lg text-sm font-semibold mb-1 whitespace-nowrap',
    isActive ? 'bg-teal-soft text-navy-900' : 'text-ink-soft hover:bg-black/[0.03] dark:hover:bg-white/5'
  ].join(' ')
}

export default function AdminLayout() {
  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-[70vh]">
      <aside className="border-b md:border-b-0 md:border-r border-line dark:border-white/10 p-5 md:p-8 flex md:block gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={tabClass}>
            {t.label}
          </NavLink>
        ))}
      </aside>
      <div className="p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  )
}
