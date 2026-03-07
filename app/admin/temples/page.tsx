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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Temples</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Temples</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} total · {filtered.length} shown</p>
        </div>
        <Link href="/admin/temples/new" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">+ New Temple</Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, location, deity..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          <select value={deityFilter} onChange={e => setDeityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Deities</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg px-4 py-3">
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{selected.size} selected</span>
          <button onClick={() => bulkAction('approved')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700">Approve All</button>
          <button onClick={() => bulkAction('rejected')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700">Reject All</button>
          <button onClick={() => bulkAction('delete')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700">Delete All</button>
          <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('title')}>
                  Name {sortCol === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Deity</th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => toggleSort('status')}>
                  Status {sortCol === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 font-semibold">Verified</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => (
                <tr key={r._id} className={`border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selected.has(r._id) ? 'bg-orange-50/50 dark:bg-orange-950/30' : ''}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(r._id)} onChange={() => toggleSelect(r._id)} className="rounded" /></td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{r.location}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.deity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                      {r.status || 'approved'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={r.verified || 'not-verified'} onChange={e => updateVerification(r._id, e.target.value as any)} className={`px-2 py-1 rounded-lg text-xs border-0 cursor-pointer font-medium ${r.verified === 'verified' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'}`}>
                      <option value="verified">Verified</option>
                      <option value="not-verified">Not Verified</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link href={`/admin/temples/edit/${r._id}`} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Edit</Link>
                      <button onClick={() => approve(r._id)} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">Approve</button>
                      <button onClick={() => reject(r._id)} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">Reject</button>
                      <button onClick={() => remove(r._id)} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-900">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No temples match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : Math.min(page - 2 + i, totalPages - 4 + i)
                if (p < 1 || p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 text-sm rounded-lg ${p === page ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{p}</button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
