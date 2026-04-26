'use client'

import { useEffect, useState } from 'react'

type UserRow = {
  _id: string; name: string; email: string
  role: string; status: string; createdAt: string
  phone?: string; city?: string; state?: string
  templeName?: string; designation?: string; templeId?: string
  services?: string[]; languages?: string[]; experience?: number; bio?: string
  adminNote?: string
}

type Tab = 'all' | 'pending' | 'temple' | 'pandit' | 'user'

const ROLE_BADGE: Record<string, string> = {
  admin: 'admin-badge-orange',
  temple: 'admin-badge-yellow',
  pandit: 'admin-badge-purple',
  user: 'admin-badge-green',
  guest: 'admin-badge-green',
}

const STATUS_BADGE: Record<string, string> = {
  approved: 'admin-badge-green',
  pending: 'admin-badge-yellow',
  rejected: 'admin-badge-red',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [processing, setProcessing] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  const loadUsers = () => {
    setLoading(true)
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsers(data) })
      .catch(err => console.error('Users fetch error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const updateUser = async (id: string, update: Record<string, any>) => {
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...update }),
      })
      if (res.ok) {
        const updated = await res.json()
        setUsers(prev => prev.map(u => u._id === id ? { ...u, ...updated } : u))
      }
    } catch { alert('Failed to update') }
    finally { setProcessing(p => ({ ...p, [id]: false })) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setUsers(prev => prev.filter(u => u._id !== id))
    } catch { alert('Failed to delete user') }
  }

  const pendingCount = users.filter(u => u.status === 'pending').length
  const tabUsers = users.filter(u => {
    if (tab === 'pending') return u.status === 'pending'
    if (tab === 'temple') return u.role === 'temple'
    if (tab === 'pandit') return u.role === 'pandit'
    if (tab === 'user') return u.role === 'user' || u.role === 'guest'
    return true
  })
  const filtered = tabUsers.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
      (u.templeName || '').toLowerCase().includes(q) || (u.city || '').toLowerCase().includes(q)
  })

  const TABS = [
    { key: 'all', label: `All (${users.length})` },
    { key: 'pending', label: `⏳ Pending (${pendingCount})`, alert: pendingCount > 0 },
    { key: 'temple', label: `🛕 Temple (${users.filter(u => u.role === 'temple').length})` },
    { key: 'pandit', label: `🕉️ Pandit (${users.filter(u => u.role === 'pandit').length})` },
    { key: 'user', label: `👤 Users (${users.filter(u => u.role === 'user' || u.role === 'guest').length})` },
  ] as const

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
          <p className="admin-section-subtitle">{users.length} registered users{pendingCount > 0 && <span className="ml-2 text-amber-600 font-semibold">· {pendingCount} pending approval</span>}</p>
        </div>
        <button onClick={loadUsers} className="admin-btn admin-btn-ghost px-3 py-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === t.key ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'} ${'alert' in t && t.alert && tab !== t.key ? 'ring-2 ring-amber-400' : ''}`}
            style={tab === t.key ? { background: '#FF9933' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-filter-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, temple, city..."
          className="admin-input w-full sm:w-96"
        />
      </div>

      {/* Pending queue — prominent cards */}
      {tab === 'pending' && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(u => (
            <div key={u._id} className="admin-card p-5 border-l-4" style={{ borderLeftColor: u.role === 'temple' ? '#F59E0B' : '#8B5CF6' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-gray-900">{u.name}</span>
                    <span className={ROLE_BADGE[u.role] || 'admin-badge-purple'}>{u.role}</span>
                    <span className={STATUS_BADGE[u.status] || 'admin-badge-yellow'}>{u.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{u.email} {u.phone && `· ${u.phone}`}</p>
                  {u.role === 'temple' && (
                    <p className="text-xs text-orange-700 mt-1 font-medium">🛕 {u.templeName} {u.designation && `· ${u.designation}`}</p>
                  )}
                  {u.role === 'pandit' && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {u.services?.slice(0, 4).map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">{s}</span>
                      ))}
                      {(u.services?.length || 0) > 4 && <span className="text-[10px] text-gray-400">+{(u.services?.length || 0) - 4} more</span>}
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">Applied {new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                  {u.bio && <p className="text-[11px] text-gray-500 mt-1 italic">"{u.bio}"</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === u._id ? null : u._id)}
                    className="admin-btn admin-btn-ghost text-xs px-2.5 py-1.5"
                  >
                    {expanded === u._id ? 'Less' : 'Details'}
                  </button>
                  <button
                    onClick={() => updateUser(u._id, { status: 'rejected' })}
                    disabled={processing[u._id]}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {processing[u._id] ? '...' : '✕ Reject'}
                  </button>
                  <button
                    onClick={() => updateUser(u._id, { status: 'approved' })}
                    disabled={processing[u._id]}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    {processing[u._id] ? '...' : '✓ Approve'}
                  </button>
                </div>
              </div>
              {expanded === u._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'City', value: u.city },
                    { label: 'State', value: u.state },
                    { label: 'Experience', value: u.experience ? `${u.experience} yrs` : null },
                    { label: 'Languages', value: u.languages?.join(', ') },
                    { label: 'Services', value: u.services?.join(', ') },
                  ].filter(i => i.value).map(item => (
                    <div key={item.label}>
                      <p className="text-gray-400 uppercase tracking-wide text-[10px]">{item.label}</p>
                      <p className="text-gray-800 font-medium mt-0.5">{item.value}</p>
                    </div>
                  ))}
                  <div className="col-span-full">
                    <label className="text-gray-400 uppercase tracking-wide text-[10px] block mb-1">Admin Note (optional)</label>
                    <input
                      type="text"
                      defaultValue={u.adminNote}
                      onBlur={e => updateUser(u._id, { adminNote: e.target.value })}
                      className="admin-input text-xs w-full sm:w-64"
                      placeholder="Add note for this user..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Standard table for non-pending tabs */}
      {tab !== 'pending' && (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email / Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Extra Info</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td className="font-medium text-gray-900">{u.name}</td>
                  <td>
                    <p className="text-gray-700 text-sm">{u.email}</p>
                    {u.phone && <p className="text-gray-400 text-xs">{u.phone}</p>}
                    {u.city && <p className="text-gray-400 text-xs">{u.city}{u.state && `, ${u.state}`}</p>}
                  </td>
                  <td>
                    <span className={ROLE_BADGE[u.role] || 'admin-badge-purple'}>{u.role}</span>
                  </td>
                  <td>
                    <span className={STATUS_BADGE[u.status] || 'admin-badge-yellow'}>{u.status || 'approved'}</span>
                  </td>
                  <td className="text-xs text-gray-500 max-w-[160px]">
                    {u.role === 'temple' && <span>🛕 {u.templeName || '—'}<br/>{u.designation}</span>}
                    {u.role === 'pandit' && <span>{u.experience ? `${u.experience}yr exp · ` : ''}{u.services?.slice(0, 2).join(', ')}</span>}
                  </td>
                  <td className="text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div className="flex gap-1.5 flex-wrap">
                      {u.status === 'pending' && (
                        <>
                          <button onClick={() => updateUser(u._id, { status: 'approved' })} disabled={processing[u._id]}
                            className="text-[11px] font-semibold px-2 py-1 rounded-lg text-white disabled:opacity-50" style={{ background: '#10B981' }}>
                            Approve
                          </button>
                          <button onClick={() => updateUser(u._id, { status: 'rejected' })} disabled={processing[u._id]}
                            className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                      {u.status === 'rejected' && (
                        <button onClick={() => updateUser(u._id, { status: 'approved' })} disabled={processing[u._id]}
                          className="text-[11px] font-semibold px-2 py-1 rounded-lg text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                          Re-approve
                        </button>
                      )}
                      <button onClick={() => remove(u._id)} className="admin-btn admin-btn-danger text-[11px] py-1 px-2">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'pending' && filtered.length === 0 && (
        <div className="admin-card p-10 text-center">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-semibold text-gray-700">No pending approvals</p>
          <p className="text-sm text-gray-400 mt-1">All temple/pandit accounts have been reviewed.</p>
        </div>
      )}
    </div>
  )
}
