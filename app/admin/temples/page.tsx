"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

type TempleRow = {
  _id: string
  title: string
  slug?: string
  titleHi?: string
  deity?: string
  state?: string
  type?: string
  templeType?: string
  sacredCategories?: string[]
  categories?: string[]
  location?: string
  city?: string
  district?: string
  country?: string
  description?: string
  descriptionHi?: string
  speciality?: string
  specialityHi?: string
  status?: 'approved' | 'pending' | 'rejected'
  verified?: 'verified' | 'not-verified'
}

type CsvImportResult = {
  ok?: boolean
  totalRows?: number
  created?: number
  updated?: number
  skipped?: number
  failed?: number
  errors?: { row: number; title?: string; reason: string }[]
  warnings?: { row: number; title?: string; reason: string }[]
  error?: string
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
  const [csvImportLoading, setCsvImportLoading] = useState(false)
  const [csvImportResult, setCsvImportResult] = useState<CsvImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => { fetchTemples() }, [])
  
  async function fetchTemples() {
    try {
      const res = await fetch(`/api/temples?fresh=1&t=${Date.now()}`, { credentials: 'include', cache: 'no-store' })
      if (res.ok) setRows(await res.json())
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    } finally { setLoading(false) }
  }

  const deities = useMemo(() => Array.from(new Set(rows.map(r => r.deity).filter(Boolean))).sort(), [rows])
  const states = useMemo(() => Array.from(new Set(rows.map(r => r.state).filter(Boolean))).sort(), [rows])
  const types = useMemo(() => Array.from(new Set(rows.map(r => r.templeType || r.type).filter(Boolean))).sort(), [rows])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows
      .filter(r => {
        if (q && !r.title?.toLowerCase().includes(q) && !r.location?.toLowerCase().includes(q) && !r.deity?.toLowerCase().includes(q)) return false
        if (deityFilter && r.deity !== deityFilter) return false
        if (stateFilter && r.state !== stateFilter) return false
        if (typeFilter && (r.templeType || r.type) !== typeFilter) return false
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

  const csvEscape = (value: unknown) => `"${String(value || '').replace(/"/g, '""')}"`

  const downloadCSVTemplate = () => {
    const header = [
      'Title',
      'TempleNameHi',
      'Location',
      'City',
      'District',
      'State',
      'Country',
      'Deity',
      'Type',
      'SacredCategories',
      'Description',
      'DescriptionHi',
      'Speciality',
      'SpecialityHi',
      'Status',
      'Verified',
    ]
    const sample = [
      'Pushkar Brahma Temple',
      'बद्रीनाथ मंदिर',
      'Pushkar, Rajasthan',
      'Pushkar',
      'Ajmer',
      'Rajasthan',
      'India',
      'Brahma',
      'Ancient Temple',
      'Brahma Temples;Desert Temple Circuit',
      'Rare sacred temple dedicated to Lord Brahma.',
      'हिमालय में स्थित पवित्र विष्णु मंदिर।',
      'One of the rare Brahma temples in India.',
      'विष्णु भक्तों के लिए अत्यंत पवित्र तीर्थ।',
      'approved',
      'verified',
    ]
    const csv = [header.join(','), sample.map(csvEscape).join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sarvdev-temple-import-template.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importCSV = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      alert('Please choose a CSV file first.')
      return
    }
    setCsvImportLoading(true)
    setCsvImportResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/temples/import-csv', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      setCsvImportResult(data)
      if (!res.ok) throw new Error(data.error || 'CSV import failed')
      await fetchTemples()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setCsvImportResult((prev) => prev || { error: err?.message || 'CSV import failed' })
    } finally {
      setCsvImportLoading(false)
    }
  }

  const exportCSV = () => {
    const header = ['Title', 'TempleNameHi', 'Location', 'City', 'District', 'State', 'Country', 'Deity', 'Type', 'SacredCategories', 'Description', 'DescriptionHi', 'Speciality', 'SpecialityHi', 'Status', 'Verified']
    const csvRows = [
      header.join(','),
      ...filtered.map(r =>
        [
          r.title,
          r.titleHi || '',
          r.location || '',
          r.city || '',
          r.district || '',
          r.state || '',
          r.country || '',
          r.deity || '',
          r.templeType || r.type || '',
          (r.sacredCategories || r.categories || []).join(';'),
          r.description || '',
          r.descriptionHi || '',
          r.speciality || '',
          r.specialityHi || '',
          r.status || 'approved',
          r.verified || 'not-verified',
        ]
          .map(csvEscape)
          .join(',')
      ),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sarvdev-temples-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
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
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">⬇ CSV</button>
          <button onClick={downloadCSVTemplate} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">CSV Template</button>
          <label className="admin-btn admin-btn-ghost cursor-pointer px-4 py-2 text-sm">
            Choose CSV
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" />
          </label>
          <button
            onClick={importCSV}
            disabled={csvImportLoading}
            className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {csvImportLoading ? 'Importing...' : 'Import CSV'}
          </button>
          <Link href="/admin/temples/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">+ New Temple</Link>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500">
        CSV SacredCategories supports semicolon-separated values, for example: Brahma Temples;Surya Temples;Ashta Lakshmi Temples.
      </p>

      {csvImportResult && (
        <div
          className="admin-card p-4"
          style={{
            background: csvImportResult.error || (csvImportResult.failed || 0) > 0 ? '#FEF2F2' : '#F0FDF4',
            borderColor: csvImportResult.error || (csvImportResult.failed || 0) > 0 ? 'rgba(220,38,38,0.18)' : 'rgba(22,163,74,0.18)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <div>
                <p className={`font-semibold text-sm mb-1 ${csvImportResult.error || (csvImportResult.failed || 0) > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  Temple CSV Import
                </p>
                {csvImportResult.error ? (
                  <p className="text-sm text-red-700">{csvImportResult.error}</p>
                ) : (
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="admin-badge-blue">{csvImportResult.totalRows || 0} rows</span>
                    <span className="admin-badge-green">{csvImportResult.created || 0} created</span>
                    <span className="admin-badge-blue">{csvImportResult.updated || 0} safely updated</span>
                    <span className="admin-badge-yellow">{csvImportResult.skipped || 0} skipped</span>
                    {(csvImportResult.failed || 0) > 0 && <span className="admin-badge-red">{csvImportResult.failed} failed</span>}
                  </div>
                )}
              </div>
              {(csvImportResult.errors || []).length > 0 && (
                <div className="space-y-1 text-xs text-red-700">
                  {csvImportResult.errors!.slice(0, 5).map((item) => (
                    <p key={`${item.row}-${item.reason}`}>Row {item.row}: {item.reason}</p>
                  ))}
                </div>
              )}
              {(csvImportResult.warnings || []).length > 0 && (
                <div className="space-y-1 text-xs text-yellow-700">
                  {csvImportResult.warnings!.slice(0, 5).map((item) => (
                    <p key={`${item.row}-${item.reason}`}>Warning row {item.row}: {item.reason}</p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setCsvImportResult(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
              aria-label="Dismiss CSV import result"
            >
              x
            </button>
          </div>
        </div>
      )}

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
