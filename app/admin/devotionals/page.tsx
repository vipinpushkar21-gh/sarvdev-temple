"use client"

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  artist?: string
  duration?: string
  status?: 'approved' | 'pending' | 'rejected'
  createdAt?: string
}

type SortKey = 'title' | 'category' | 'deity' | 'language' | 'artist' | 'createdAt'
type SortDir = 'asc' | 'desc'

const PER_PAGE = 25

export default function AdminDevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [deityFilter, setDeityFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', category: '', deity: '', language: '', artist: '' })

  useEffect(() => { fetchDevotionals() }, [])

  async function fetchDevotionals() {
    try {
      const res = await fetch('/api/devotionals')
      if (res.ok) setDevotionals(await res.json())
    } catch (error) { console.error('Failed to fetch devotionals:', error) }
    finally { setLoading(false) }
  }

  // Derived data
  const categories = useMemo(() => Array.from(new Set(devotionals.map(d => d.category).filter(Boolean))).sort() as string[], [devotionals])
  const languages = useMemo(() => Array.from(new Set(devotionals.map(d => d.language).filter(Boolean))).sort() as string[], [devotionals])
  const deities = useMemo(() => Array.from(new Set(devotionals.map(d => d.deity).filter(Boolean))).sort() as string[], [devotionals])
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    devotionals.forEach(d => { if (d.category) m[d.category] = (m[d.category] || 0) + 1 })
    return m
  }, [devotionals])

  // Stats
  const stats = useMemo(() => {
    const approved = devotionals.filter(d => d.status === 'approved' || !d.status).length
    const pending = devotionals.filter(d => d.status === 'pending').length
    const rejected = devotionals.filter(d => d.status === 'rejected').length
    const withAudio = devotionals.filter(d => d.audio).length
    const withLyrics = devotionals.filter(d => d.lyrics).length
    return { total: devotionals.length, approved, pending, rejected, withAudio, withLyrics }
  }, [devotionals])

  // Filter + Sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let result = devotionals.filter(d => {
      if (q && !d.title?.toLowerCase().includes(q) && !d.deity?.toLowerCase().includes(q) && !d.artist?.toLowerCase().includes(q) && !d.category?.toLowerCase().includes(q)) return false
      if (categoryFilter && d.category !== categoryFilter) return false
      if (statusFilter && (d.status || 'approved') !== statusFilter) return false
      if (languageFilter && d.language !== languageFilter) return false
      if (deityFilter && d.deity !== deityFilter) return false
      return true
    })
    result.sort((a, b) => {
      const av = (a[sortKey] || '').toString().toLowerCase()
      const bv = (b[sortKey] || '').toString().toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return result
  }, [devotionals, search, categoryFilter, statusFilter, languageFilter, deityFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(() => { setPage(1) }, [search, categoryFilter, statusFilter, languageFilter, deityFilter])

  const toggleSelect = (id: string) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }
  const toggleAll = () => { selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map(r => r._id))) }

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }, [sortKey])

  const bulkAction = async (action: 'approved' | 'rejected' | 'delete') => {
    if (selected.size === 0) return
    if (!confirm(`${action === 'delete' ? 'Delete' : action === 'approved' ? 'Approve' : 'Reject'} ${selected.size} devotionals?`)) return
    for (const id of selected) {
      if (action === 'delete') {
        await fetch('/api/devotionals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        setDevotionals(d => d.filter(x => x._id !== id))
      } else {
        await fetch('/api/devotionals', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: action }) })
        setDevotionals(d => d.map(x => x._id === id ? { ...x, status: action } : x))
      }
    }
    setSelected(new Set())
  }

  const approve = async (id: string) => { const res = await fetch('/api/devotionals', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) }); if (res.ok) setDevotionals(d => d.map(x => x._id === id ? { ...x, status: 'approved' } : x)) }
  const reject = async (id: string) => { const res = await fetch('/api/devotionals', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'rejected' }) }); if (res.ok) setDevotionals(d => d.map(x => x._id === id ? { ...x, status: 'rejected' } : x)) }
  const remove = async (id: string) => { if (!confirm('Delete this devotional?')) return; const res = await fetch('/api/devotionals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (res.ok) setDevotionals(d => d.filter(x => x._id !== id)) }

  // Inline edit
  const startEdit = (d: Devotional) => {
    setEditingId(d._id)
    setEditForm({ title: d.title || '', category: d.category || '', deity: d.deity || '', language: d.language || '', artist: d.artist || '' })
  }
  const saveEdit = async () => {
    if (!editingId) return
    const res = await fetch('/api/devotionals', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...editForm }) })
    if (res.ok) {
      setDevotionals(d => d.map(x => x._id === editingId ? { ...x, ...editForm } : x))
      setEditingId(null)
    } else alert('Failed to update')
  }

  // Export CSV
  const exportCSV = () => {
    const headers = ['Title', 'Category', 'Deity', 'Language', 'Artist', 'Duration', 'Audio', 'Status']
    const rows = filtered.map(d => [d.title, d.category, d.deity, d.language, d.artist, d.duration, d.audio ? 'Yes' : 'No', d.status || 'approved'])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `devotionals-export-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // Preview modal item
  const previewItem = previewId ? devotionals.find(d => d._id === previewId) : null

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 inline-block opacity-40 group-hover:opacity-100">{sortKey === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Devotionals</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
        <div className="animate-pulse space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Devotionals</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} total · {filtered.length} shown</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">Export CSV</button>
          <Link href="/admin/devotionals/new" className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">+ New Devotional</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
          { label: 'Approved', value: stats.approved, color: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
          { label: 'With Audio', value: stats.withAudio, color: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
          { label: 'With Lyrics', value: stats.withLyrics, color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategoryFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!categoryFilter ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
          All ({stats.total})
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === c ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
            {c} ({catCounts[c] || 0})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, deity, artist..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={deityFilter} onChange={e => setDeityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Deities</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={languageFilter} onChange={e => setLanguageFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Languages</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {(search || categoryFilter || deityFilter || languageFilter || statusFilter) && (
          <button onClick={() => { setSearch(''); setCategoryFilter(''); setDeityFilter(''); setLanguageFilter(''); setStatusFilter('') }} className="mt-3 text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 font-medium">
            Clear all filters
          </button>
        )}
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
                <th className="px-4 py-3 font-semibold cursor-pointer group select-none" onClick={() => handleSort('title')}>Title<SortIcon col="title" /></th>
                <th className="px-4 py-3 font-semibold cursor-pointer group select-none" onClick={() => handleSort('category')}>Category<SortIcon col="category" /></th>
                <th className="px-4 py-3 font-semibold cursor-pointer group select-none" onClick={() => handleSort('deity')}>Deity<SortIcon col="deity" /></th>
                <th className="px-4 py-3 font-semibold cursor-pointer group select-none" onClick={() => handleSort('language')}>Language<SortIcon col="language" /></th>
                <th className="px-4 py-3 font-semibold cursor-pointer group select-none" onClick={() => handleSort('artist')}>Artist<SortIcon col="artist" /></th>
                <th className="px-4 py-3 font-semibold w-16 text-center">Audio</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(d => (
                <tr key={d._id} className={`border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selected.has(d._id) ? 'bg-orange-50/50 dark:bg-orange-950/30' : ''}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(d._id)} onChange={() => toggleSelect(d._id)} className="rounded" /></td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[250px]">
                    <div className="truncate">{d.title}</div>
                    {d.duration && <span className="text-[10px] text-gray-400">{d.duration}</span>}
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">{d.category || '-'}</span></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{d.deity || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.language || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[100px]">{d.artist || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {d.audio ? (
                      <span className="inline-block w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs leading-5">♫</span>
                    ) : (
                      <span className="inline-block w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs leading-5">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${(d.status || 'approved') === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : d.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                      {d.status || 'approved'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setPreviewId(d._id)} className="px-2 py-1 text-[10px] font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300" title="Preview">View</button>
                      <button onClick={() => startEdit(d)} className="px-2 py-1 text-[10px] font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300" title="Edit">Edit</button>
                      <button onClick={() => approve(d._id)} className="px-2 py-1 text-[10px] font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">✓</button>
                      <button onClick={() => reject(d._id)} className="px-2 py-1 text-[10px] font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">✗</button>
                      <button onClick={() => remove(d._id)} className="px-2 py-1 text-[10px] font-medium rounded-md bg-gray-800 text-white hover:bg-gray-900">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No devotionals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm text-gray-500">Page {page} of {totalPages} · Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                if (p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 text-sm rounded-lg ${p === page ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{p}</button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600">Last</button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{previewItem.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewItem.category && <span className="px-2 py-0.5 rounded-md text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">{previewItem.category}</span>}
                    {previewItem.deity && <span className="px-2 py-0.5 rounded-md text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{previewItem.deity}</span>}
                    {previewItem.language && <span className="px-2 py-0.5 rounded-md text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">{previewItem.language}</span>}
                  </div>
                </div>
                <button onClick={() => setPreviewId(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {previewItem.description && <p className="text-sm text-gray-600 dark:text-gray-300">{previewItem.description}</p>}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {previewItem.artist && <div><span className="text-gray-400">Artist:</span> <span className="text-gray-700 dark:text-gray-200">{previewItem.artist}</span></div>}
                {previewItem.duration && <div><span className="text-gray-400">Duration:</span> <span className="text-gray-700 dark:text-gray-200">{previewItem.duration}</span></div>}
                <div><span className="text-gray-400">Status:</span> <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${(previewItem.status || 'approved') === 'approved' ? 'bg-green-100 text-green-700' : previewItem.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{previewItem.status || 'approved'}</span></div>
                <div><span className="text-gray-400">Audio:</span> <span className="text-gray-700 dark:text-gray-200">{previewItem.audio ? 'Available' : 'No'}</span></div>
              </div>
              {previewItem.audio && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-2">Audio Preview</p>
                  <audio controls className="w-full h-8" src={previewItem.audio}>Your browser does not support audio.</audio>
                </div>
              )}
              {previewItem.lyrics && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Lyrics Preview</p>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-serif max-h-48 overflow-y-auto leading-relaxed">{previewItem.lyrics.slice(0, 1000)}{previewItem.lyrics.length > 1000 ? '\n...' : ''}</pre>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { approve(previewItem._id); setPreviewId(null) }} className="px-4 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700">Approve</button>
                <button onClick={() => { reject(previewItem._id); setPreviewId(null) }} className="px-4 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700">Reject</button>
                <button onClick={() => { remove(previewItem._id); setPreviewId(null) }} className="px-4 py-1.5 text-xs font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-900">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingId(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Edit</h2>
                <button onClick={() => setEditingId(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                  <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="">None</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Deity</label>
                    <input value={editForm.deity} onChange={e => setEditForm(f => ({ ...f, deity: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                    <input value={editForm.language} onChange={e => setEditForm(f => ({ ...f, language: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Artist</label>
                    <input value={editForm.artist} onChange={e => setEditForm(f => ({ ...f, artist: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={saveEdit} className="px-5 py-2 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700">Save Changes</button>
                <button onClick={() => setEditingId(null)} className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
