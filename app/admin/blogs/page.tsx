"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type BlogRow = {
  _id: string
  title: string
  excerpt?: string
  date?: string
  status?: 'approved' | 'pending' | 'rejected'
}

const PER_PAGE = 25

export default function AdminBlogsPage() {
  const [rows, setRows] = useState<BlogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => { fetchBlogs() }, [])

  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) setRows(await res.json())
    } catch (error) { console.error('Failed to fetch blogs:', error) }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(r => {
      if (q && !r.title?.toLowerCase().includes(q) && !r.excerpt?.toLowerCase().includes(q)) return false
      if (statusFilter && r.status !== statusFilter) return false
      return true
    })
  }, [rows, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const toggleSelect = (id: string) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }
  const toggleAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(r => r._id))) }

  const bulkAction = async (action: 'approved' | 'rejected' | 'delete') => {
    if (selected.size === 0) return
    if (!confirm(`${action} ${selected.size} blogs?`)) return
    for (const id of selected) {
      if (action === 'delete') {
        await fetch('/api/blogs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        setRows(r => r.filter(x => x._id !== id))
      } else {
        await fetch('/api/blogs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: action }) })
        setRows(r => r.map(x => x._id === id ? { ...x, status: action } : x))
      }
    }
    setSelected(new Set())
  }

  const approve = async (id: string) => { const res = await fetch('/api/blogs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) }); if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'approved' } : x)) }
  const reject = async (id: string) => { const res = await fetch('/api/blogs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'rejected' }) }); if (res.ok) setRows(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x)) }
  const remove = async (id: string) => { if (!confirm('Delete this blog?')) return; const res = await fetch('/api/blogs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (res.ok) setRows(r => r.filter(x => x._id !== id)) }

  if (loading) return <div className="space-y-4"><h1 className="admin-page-title">Blogs</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div></div>

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p className="admin-section-subtitle">{rows.length} total · {filtered.length} shown</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="flex flex-wrap gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs..." className="admin-input flex-1 min-w-[200px]" />
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
          <button onClick={() => bulkAction('approved')} className="admin-btn admin-btn-success">Approve</button>
          <button onClick={() => bulkAction('rejected')} className="admin-btn admin-btn-primary">Reject</button>
          <button onClick={() => bulkAction('delete')} className="admin-btn admin-btn-danger">Delete</button>
          <button onClick={() => setSelected(new Set())} className="admin-btn admin-btn-ghost">Clear</button>
        </div>
      )}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(r => (
              <tr key={r._id} className={selected.has(r._id) ? 'bg-orange-50/40' : ''}>
                <td><input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelect(r._id)} className="rounded" /></td>
                <td className="font-medium text-gray-900">{r.title}</td>
                <td>
                  <span className={r.status === 'approved' ? 'admin-badge-green' : r.status === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'}>{r.status || 'draft'}</span>
                </td>
                <td className="text-gray-500">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                <td>
                  <div className="flex gap-1.5">
                    <button onClick={() => approve(r._id)} className="admin-btn admin-btn-success">Approve</button>
                    <button onClick={() => reject(r._id)} className="admin-btn admin-btn-danger">Reject</button>
                    <button onClick={() => remove(r._id)} className="admin-btn" style={{ background: '#1F2937', color: 'white' }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No blog posts found.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
