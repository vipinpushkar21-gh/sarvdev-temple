"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type DarshanRow = {
  _id: string
  title: string
  temple: string
  media?: string
  time?: string
  date?: string
  status?: 'approved' | 'pending' | 'rejected'
}

const PER_PAGE = 25

export default function AdminDarshanPage() {
  const [rows, setRows] = useState<DarshanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [templeFilter, setTempleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => { fetchDarshans() }, [])

  async function fetchDarshans() {
    try {
      const res = await fetch('/api/darshan')
      if (res.ok) setRows(await res.json())
    } catch (error) { console.error('Failed to fetch darshans:', error) }
    finally { setLoading(false) }
  }

  const temples = useMemo(() => Array.from(new Set(rows.map(r => r.temple).filter(Boolean))).sort(), [rows])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(r => {
      if (q && !r.title?.toLowerCase().includes(q) && !r.temple?.toLowerCase().includes(q)) return false
      if (templeFilter && r.temple !== templeFilter) return false
      if (statusFilter && r.status !== statusFilter) return false
      return true
    })
  }, [rows, search, templeFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(() => { setPage(1) }, [search, templeFilter, statusFilter])

  const toggleSelect = (id: string) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }
  const toggleAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(r => r._id))) }

  const bulkAction = async (action: 'approved' | 'rejected' | 'delete') => {
    if (selected.size === 0) return
    if (!confirm(`${action} ${selected.size} darshans?`)) return
    for (const id of selected) {
      if (action === 'delete') {
        await fetch('/api/darshan', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        setRows(r => r.filter(x => x._id !== id))
      } else {
        await fetch('/api/darshan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: action }) })
        setRows(r => r.map(x => x._id === id ? { ...x, status: action } : x))
      }
    }
    setSelected(new Set())
  }

  const approve = async (id: string) => { const res = await fetch('/api/darshan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) }); if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x)) }
  const reject = async (id: string) => { const res = await fetch('/api/darshan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'rejected' }) }); if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x)) }
  const remove = async (id: string) => { if (!confirm('Delete this darshan?')) return; const res = await fetch('/api/darshan', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (res.ok) setRows(r => r.filter(x => x._id !== id)) }

  if (loading) return <div className="space-y-5"><h1 className="admin-page-title">Darshan</h1><div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div></div>

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Daily Darshan</h1>
          <p className="admin-section-subtitle">{rows.length} total · {filtered.length} shown</p>
        </div>
        <Link href="/admin" className="admin-btn admin-btn-primary px-4 py-2 text-sm">+ New Darshan</Link>
      </div>

      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, temple..." className="admin-input" />
          <select value={templeFilter} onChange={e => setTempleFilter(e.target.value)} className="admin-input">
            <option value="">All Temples</option>
            {temples.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-input">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-card flex items-center gap-3 px-5 py-3" style={{ background: '#FFF7ED', borderColor: 'rgba(234,88,12,0.15)' }}>
          <span className="admin-badge-orange">{selected.size} selected</span>
          <button onClick={() => bulkAction('approved')} className="admin-btn admin-btn-success">Approve All</button>
          <button onClick={() => bulkAction('rejected')} className="admin-btn admin-btn-primary">Reject All</button>
          <button onClick={() => bulkAction('delete')} className="admin-btn admin-btn-danger">Delete All</button>
          <button onClick={() => setSelected(new Set())} className="admin-btn admin-btn-ghost">Clear</button>
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th>Title</th>
                <th>Temple</th>
                <th>Time</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r._id} className={selected.has(r._id) ? 'bg-orange-50/40' : ''}>
                  <td><input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelect(r._id)} className="rounded" /></td>
                  <td className="font-medium text-gray-900">{r.title}</td>
                  <td className="text-gray-500">{r.temple}</td>
                  <td className="text-gray-500">{r.time}</td>
                  <td className="text-gray-500">{r.date}</td>
                  <td><span className={r.status === 'approved' ? 'admin-badge-green' : r.status === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'}>{r.status || 'pending'}</span></td>
                  <td>
                    <div className="flex gap-1.5">
                      {r.media && <a href={r.media} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost">View</a>}
                      <button onClick={() => approve(r._id)} className="admin-btn admin-btn-success">Approve</button>
                      <button onClick={() => reject(r._id)} className="admin-btn admin-btn-danger">Reject</button>
                      <button onClick={() => remove(r._id)} className="admin-btn" style={{ background: '#1F2937', color: 'white' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No darshan submissions found.</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
