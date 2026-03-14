"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type TempleRow = {
  _id: string
  title: string
  deity?: string
  state?: string
  type?: string
  location?: string
  status?: 'approved' | 'pending' | 'rejected'
  verified?: 'verified' | 'not-verified'
}

const PER_PAGE = 25

export default function AdminTemplesPage() {
  const [rows, setRows] = useState<TempleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deityFilter, setDeityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortCol, setSortCol] = useState<'title' | 'status'>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  
  useEffect(() => { fetchTemples() }, [])
  
  async function fetchTemples() {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) setRows(await res.json())
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    } finally { setLoading(false) }
  }

  const deities = useMemo(() => Array.from(new Set(rows.map(r => r.deity).filter(Boolean))).sort(), [rows])
  const states = useMemo(() => Array.from(new Set(rows.map(r => r.state).filter(Boolean))).sort(), [rows])
  const types = useMemo(() => Array.from(new Set(rows.map(r => r.type).filter(Boolean))).sort(), [rows])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows
      .filter(r => {
        if (q && !r.title?.toLowerCase().includes(q) && !r.location?.toLowerCase().includes(q) && !r.deity?.toLowerCase().includes(q)) return false
        if (deityFilter && r.deity !== deityFilter) return false
        if (stateFilter && r.state !== stateFilter) return false
        if (typeFilter && r.type !== typeFilter) return false
        if (statusFilter && r.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const av = (a[sortCol] || '').toLowerCase()
        const bv = (b[sortCol] || '').toLowerCase()
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
  }, [rows, search, deityFilter, stateFilter, typeFilter, statusFilter, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [search, deityFilter, stateFilter, typeFilter, statusFilter])

  const toggleSort = (col: 'title' | 'status') => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(r => r._id)))
  }

  const bulkAction = async (action: 'approved' | 'rejected' | 'delete') => {
    if (selected.size === 0) return
    const label = action === 'delete' ? 'delete' : action
    if (!confirm(`${label} ${selected.size} temples?`)) return
    for (const id of selected) {
      if (action === 'delete') {
        await fetch('/api/temples', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        setRows(r => r.filter(x => x._id !== id))
      } else {
        await fetch('/api/temples', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: action }) })
        setRows(r => r.map(x => x._id === id ? { ...x, status: action } : x))
      }
    }
    setSelected(new Set())
  }

  const approve = async (id: string) => {
    const res = await fetch('/api/temples', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) })
    if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x))
  }
  const reject = async (id: string) => {
    const res = await fetch('/api/temples', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'rejected' }) })
    if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
  }
  const updateVerification = async (id: string, verified: 'verified' | 'not-verified') => {
    const res = await fetch('/api/temples', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, verified }) })
    if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, verified } : x))
  }
  const remove = async (id: string) => {
    if (!confirm('Delete this temple?')) return
    const res = await fetch('/api/temples', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setRows(r => r.filter(x => x._id !== id))
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="admin-page-title">Temples</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Temples</h1>
          <p className="admin-section-subtitle">{rows.length} total · {filtered.length} shown</p>
        </div>
        <Link href="/admin/temples/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">+ New Temple</Link>
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, location, deity..." className="admin-input" />
          <select value={deityFilter} onChange={e => setDeityFilter(e.target.value)} className="admin-input">
            <option value="">All Deities</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="admin-input">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="admin-input">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-input">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="admin-card flex items-center gap-3 px-5 py-3" style={{ background: '#FFF7ED', borderColor: 'rgba(234,88,12,0.15)' }}>
          <span className="admin-badge-orange">{selected.size} selected</span>
          <button onClick={() => bulkAction('approved')} className="admin-btn admin-btn-success">Approve All</button>
          <button onClick={() => bulkAction('rejected')} className="admin-btn admin-btn-primary">Reject All</button>
          <button onClick={() => bulkAction('delete')} className="admin-btn admin-btn-danger">Delete All</button>
          <button onClick={() => setSelected(new Set())} className="admin-btn admin-btn-ghost">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th className="cursor-pointer hover:text-gray-900" onClick={() => toggleSort('title')}>
                  Name {sortCol === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Location</th>
                <th>Deity</th>
                <th className="cursor-pointer hover:text-gray-900" onClick={() => toggleSort('status')}>
                  Status {sortCol === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r._id} className={selected.has(r._id) ? 'bg-orange-50/40' : ''}>
                  <td><input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelect(r._id)} className="rounded" /></td>
                  <td className="font-medium text-gray-900">{r.title}</td>
                  <td className="text-gray-500 max-w-[200px] truncate">{r.location}</td>
                  <td className="text-gray-500">{r.deity}</td>
                  <td>
                    <span className={r.status === 'approved' ? 'admin-badge-green' : r.status === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'}>
                      {r.status || 'approved'}
                    </span>
                  </td>
                  <td>
                    <select value={r.verified || 'not-verified'} onChange={e => updateVerification(r._id, e.target.value as any)} className={`px-2 py-1 rounded-lg text-xs border-0 cursor-pointer font-semibold ${r.verified === 'verified' ? 'admin-badge-blue' : 'admin-badge-orange'}`}>
                      <option value="verified">Verified</option>
                      <option value="not-verified">Not Verified</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <Link href={`/admin/temples/edit/${r._id}`} className="admin-btn admin-btn-ghost">Edit</Link>
                      <button onClick={() => approve(r._id)} className="admin-btn admin-btn-success">Approve</button>
                      <button onClick={() => reject(r._id)} className="admin-btn admin-btn-danger">Reject</button>
                      <button onClick={() => remove(r._id)} className="admin-btn" style={{ background: '#1F2937', color: 'white' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No temples match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : Math.min(page - 2 + i, totalPages - 4 + i)
                if (p < 1 || p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={`admin-btn ${p === page ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>{p}</button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
