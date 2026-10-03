import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleSuspend(id, status) {
    const next = status === 'suspended' ? 'active' : 'suspended'
    await supabase.from('profiles').update({ status: next }).eq('id', id)
    load()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-ink-soft text-xs uppercase tracking-wide border-b border-line dark:border-white/10">
            <th className="text-left py-2.5 px-3 font-semibold">Nama</th>
            <th className="text-left py-2.5 px-3 font-semibold">Username</th>
            <th className="text-left py-2.5 px-3 font-semibold">Role</th>
            <th className="text-left py-2.5 px-3 font-semibold">Status</th>
            <th className="py-2.5 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-7 text-ink-soft">Memuat...</td></tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-b border-line dark:border-white/10">
                <td className="py-3 px-3">{u.nama}</td>
                <td className="py-3 px-3">@{u.username}</td>
                <td className="py-3 px-3 capitalize">{u.role}</td>
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${u.status === 'suspended' ? 'bg-[#fbeceb] text-[#a5372a]' : 'bg-[#e3f2e8] text-[#1f7a44]'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  {u.role !== 'admin' ? (
                    <button onClick={() => toggleSuspend(u.id, u.status)} className="border border-line dark:border-white/10 rounded-md px-2.5 py-1 text-xs font-semibold">
                      {u.status === 'suspended' ? 'Restore' : 'Suspend'}
                    </button>
                  ) : (
                    <span className="text-ink-soft text-xs">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
