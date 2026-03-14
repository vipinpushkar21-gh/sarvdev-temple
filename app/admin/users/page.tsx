'use client'

import { useEffect, useState } from 'react'

type UserRow = {
  _id: string
  name: string
  email: string
  role: 'guest' | 'admin'
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsers(data) })
      .catch(err => console.error('Users fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'guest' : 'admin'
    if (!confirm(`Change role to ${newRole}?`)) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole })
      })
      if (res.ok) setUsers(u => u.map(x => x._id === id ? { ...x, role: newRole as 'guest' | 'admin' } : x))
    } catch { alert('Failed to update role') }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) setUsers(u => u.filter(x => x._id !== id))
    } catch { alert('Failed to delete user') }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="admin-page-title">Users</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-section-subtitle">{users.length} registered users</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="admin-input w-full sm:w-80"
        />
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td className="font-medium text-gray-900">{u.name}</td>
                <td className="text-gray-500">{u.email}</td>
                <td>
                  <span className={u.role === 'admin' ? 'admin-badge-orange' : 'admin-badge-purple'}>{u.role}</span>
                </td>
                <td className="text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRole(u._id, u.role)} className="admin-btn admin-btn-ghost">
                      {u.role === 'admin' ? 'Make Guest' : 'Make Admin'}
                    </button>
                    <button onClick={() => remove(u._id)} className="admin-btn admin-btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
