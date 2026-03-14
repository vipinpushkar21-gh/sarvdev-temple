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
      <div className="space-y-5">
        <h1 className="admin-page-title">Devotionals</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        <div className="animate-pulse space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Devotionals</h1>
          <p className="admin-section-subtitle">{stats.total} total · {filtered.length} shown</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Export CSV</button>
          <Link href="/admin/devotionals/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">+ New Devotional</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: '📊' },
          { label: 'Approved', value: stats.approved, icon: '✅' },
          { label: 'Pending', value: stats.pending, icon: '⏳' },
          { label: 'Rejected', value: stats.rejected, icon: '❌' },
          { label: 'With Audio', value: stats.withAudio, icon: '🎵' },
          { label: 'With Lyrics', value: stats.withLyrics, icon: '📜' },
        ].map(s => (
          <div key={s.label} className="admin-stat">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
              <span className="text-xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategoryFilter('')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${!categoryFilter ? 'admin-badge-orange' : 'admin-btn admin-btn-ghost'}`}>
          All ({stats.total})
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${categoryFilter === c ? 'admin-badge-orange' : 'admin-btn admin-btn-ghost'}`}>
            {c} ({catCounts[c] || 0})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, deity, artist..." className="admin-input" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="admin-input">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={deityFilter} onChange={e => setDeityFilter(e.target.value)} className="admin-input">
            <option value="">All Deities</option>
            {deities.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={languageFilter} onChange={e => setLanguageFilter(e.target.value)} className="admin-input">
            <option value="">All Languages</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-input">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {(search || categoryFilter || deityFilter || languageFilter || statusFilter) && (
          <button onClick={() => { setSearch(''); setCategoryFilter(''); setDeityFilter(''); setLanguageFilter(''); setStatusFilter('') }} className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold">
            ✕ Clear all filters
          </button>
        )}
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
                <th className="cursor-pointer group select-none" onClick={() => handleSort('title')}>Title<SortIcon col="title" /></th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('category')}>Category<SortIcon col="category" /></th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('deity')}>Deity<SortIcon col="deity" /></th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('language')}>Language<SortIcon col="language" /></th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('artist')}>Artist<SortIcon col="artist" /></th>
                <th className="w-16 text-center">Audio</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(d => (
                <tr key={d._id} className={selected.has(d._id) ? 'bg-orange-50/40' : ''}>
                  <td><input type="checkbox" checked={selected.has(d._id)} onChange={() => toggleSelect(d._id)} className="rounded" /></td>
                  <td className="font-medium text-gray-900 max-w-[250px]">
                    <div className="truncate">{d.title}</div>
                    {d.duration && <span className="text-[10px] text-gray-400">{d.duration}</span>}
                  </td>
                  <td><span className="admin-badge-purple text-[10px]">{d.category || '-'}</span></td>
                  <td className="text-gray-500 text-xs">{d.deity || '-'}</td>
                  <td className="text-gray-500 text-xs">{d.language || '-'}</td>
                  <td className="text-gray-500 text-xs truncate max-w-[100px]">{d.artist || '-'}</td>
                  <td className="text-center">
                    {d.audio ? (
                      <span className="inline-block w-5 h-5 rounded-full text-xs leading-5" style={{ background: '#ECFDF5', color: '#059669' }}>♫</span>
                    ) : (
                      <span className="inline-block w-5 h-5 rounded-full text-xs leading-5" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className={(d.status || 'approved') === 'approved' ? 'admin-badge-green' : d.status === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'}>
                      {d.status || 'approved'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setPreviewId(d._id)} className="admin-btn admin-btn-ghost text-[10px]" title="Preview">View</button>
                      <Link href={`/admin/devotionals/${d._id}/edit`} className="admin-btn admin-btn-ghost text-[10px]" title="Edit">Edit</Link>
                      <button onClick={() => approve(d._id)} className="admin-btn admin-btn-success text-[10px]">✓</button>
                      <button onClick={() => reject(d._id)} className="admin-btn admin-btn-danger text-[10px]">✗</button>
                      <button onClick={() => remove(d._id)} className="admin-btn text-[10px]" style={{ background: '#1F2937', color: 'white' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-400">No devotionals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-sm text-gray-400">Page {page} of {totalPages} · {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                if (p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={`admin-btn ${p === page ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>{p}</button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">Last</button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{previewItem.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewItem.category && <span className="admin-badge-orange">{previewItem.category}</span>}
                    {previewItem.deity && <span className="admin-badge-blue">{previewItem.deity}</span>}
                    {previewItem.language && <span className="admin-badge-purple">{previewItem.language}</span>}
                  </div>
                </div>
                <button onClick={() => setPreviewId(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {previewItem.description && <p className="text-sm text-gray-500">{previewItem.description}</p>}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {previewItem.artist && <div><span className="text-gray-400">Artist:</span> <span className="text-gray-700 ml-1">{previewItem.artist}</span></div>}
                {previewItem.duration && <div><span className="text-gray-400">Duration:</span> <span className="text-gray-700 ml-1">{previewItem.duration}</span></div>}
                <div><span className="text-gray-400">Status:</span> <span className={`ml-1 ${(previewItem.status || 'approved') === 'approved' ? 'admin-badge-green' : previewItem.status === 'pending' ? 'admin-badge-yellow' : 'admin-badge-red'}`}>{previewItem.status || 'approved'}</span></div>
                <div><span className="text-gray-400">Audio:</span> <span className="text-gray-700 ml-1">{previewItem.audio ? 'Available' : 'No'}</span></div>
              </div>
              {previewItem.audio && (
                <div className="rounded-xl p-3" style={{ background: '#F9FAFB' }}>
                  <p className="text-xs text-gray-400 mb-2">Audio Preview</p>
                  <audio controls className="w-full h-8" src={previewItem.audio}>Your browser does not support audio.</audio>
                </div>
              )}
              {previewItem.lyrics && (
                <div className="rounded-xl p-4" style={{ background: '#F9FAFB' }}>
                  <p className="text-xs text-gray-400 mb-2">Lyrics Preview</p>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif max-h-48 overflow-y-auto leading-relaxed">{previewItem.lyrics.slice(0, 1000)}{previewItem.lyrics.length > 1000 ? '\n...' : ''}</pre>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { approve(previewItem._id); setPreviewId(null) }} className="admin-btn admin-btn-success px-4 py-1.5">Approve</button>
                <button onClick={() => { reject(previewItem._id); setPreviewId(null) }} className="admin-btn admin-btn-danger px-4 py-1.5">Reject</button>
                <button onClick={() => { remove(previewItem._id); setPreviewId(null) }} className="admin-btn px-4 py-1.5" style={{ background: '#1F2937', color: 'white' }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
