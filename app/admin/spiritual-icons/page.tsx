"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { SPIRITUAL_ICON_CATEGORIES } from '../../../data/spiritual-icon-categories'
import type { SpiritualIconRecord } from '../../../lib/spiritual-icons'
import AdminPagination from '@/components/admin/AdminPagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type FilterKey = 'all' | 'active' | 'draft' | 'inactive' | 'featured' | 'verified'
type SortKey = 'name' | 'category' | 'state' | 'priority' | 'status'
type SortDir = 'asc' | 'desc'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'featured', label: 'Featured' },
  { key: 'verified', label: 'Verified' },
]

export default function AdminSpiritualIconsPage() {
  const [rows, setRows] = useState<SpiritualIconRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [seedResult, setSeedResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importReport, setImportReport] = useState<any>(null)
  const [importError, setImportError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState<string | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => { load() }, [page, pageSize, debouncedSearch, filter, categoryFilter, stateFilter])
  useEffect(() => { setPage(1) }, [pageSize, debouncedSearch, filter, categoryFilter, stateFilter])

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (categoryFilter) params.set('category', categoryFilter)
      if (stateFilter) params.set('state', stateFilter)
      if (filter === 'active' || filter === 'draft' || filter === 'inactive') params.set('status', filter)
      if (filter === 'featured') params.set('featured', 'true')
      if (filter === 'verified') params.set('verified', 'true')
      const res = await fetch(`/api/admin/spiritual-icons?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        setRows(items)
        setTotal(Number(data.total || items.length || 0))
        setHasMore(Boolean(data.hasMore))
      }
      else setMessage({ type: 'error', text: 'Unable to load spiritual icons.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error while loading spiritual icons.' })
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => ({
    total,
    active: rows.filter((row) => row.status === 'active').length,
    featured: rows.filter((row) => row.featured).length,
    verified: rows.filter((row) => row.verified).length,
    inactiveDraft: rows.filter((row) => row.status !== 'active').length,
  }), [rows, total])

  const states = useMemo(() => Array.from(new Set(rows.map((row) => row.state).filter(Boolean) as string[])).sort(), [rows])

  const filtered = useMemo(() => {
    return [...rows].sort((left, right) => {
      const leftValue = String(left[sortKey] ?? '').toLowerCase()
      const rightValue = String(right[sortKey] ?? '').toLowerCase()
      const result = sortKey === 'priority'
        ? Number(left.priority ?? 999) - Number(right.priority ?? 999)
        : leftValue.localeCompare(rightValue)
      return sortDir === 'asc' ? result : -result
    })
  }, [rows, sortKey, sortDir])

  const toggleSelect = (id: string) => setSelected((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((row) => row._id).filter(Boolean) as string[]))

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((current) => current === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }, [sortKey])

  const bulkAction = async (action: 'approve' | 'draft' | 'disable' | 'delete') => {
    if (!selected.size) return
    const label = action === 'approve' ? 'Approve' : action === 'draft' ? 'Move to draft' : action === 'disable' ? 'Disable' : 'permanently delete'
    const confirmation = action === 'delete'
      ? `Permanently delete ${selected.size} selected spiritual icons? This cannot be undone.`
      : `${label} ${selected.size} selected spiritual icons?`
    if (!confirm(confirmation)) return

    setBulkLoading(action)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/spiritual-icons/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: Array.from(selected) }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Bulk action failed.' })
        return
      }
      setSelected(new Set())
      const completed = action === 'delete' ? 'deleted' : action === 'approve' ? 'approved' : action === 'draft' ? 'moved to draft' : 'disabled'
      setMessage({ type: 'success', text: `${data.affected || 0} spiritual icons ${completed}.` })
      await load()
    } catch {
      setMessage({ type: 'error', text: 'Network error while applying the bulk action.' })
    } finally {
      setBulkLoading(null)
    }
  }

  const sortIndicator = (column: SortKey) => sortKey === column ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'
  const previewItem = previewId ? rows.find((row) => row._id === previewId) : null

  async function seedStatic() {
    if (!confirm('Import static spiritual icon records into DB? Existing slug/name matches will be skipped.')) return
    setMessage(null)
    try {
      const res = await fetch('/api/admin/spiritual-icons/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Seed import failed.' })
        return
      }
      setSeedResult({ imported: data.imported, skipped: data.skipped })
      setMessage({ type: 'success', text: `Seed complete: ${data.imported} imported, ${data.skipped} skipped.` })
      await load()
    } catch {
      setMessage({ type: 'error', text: 'Network error while seeding static data.' })
    }
  }

  async function exportCSV() {
    setExportLoading(true)
    try {
      const res = await fetch('/api/admin/spiritual-icons/export', { credentials: 'include', cache: 'no-store' })
      if (!res.ok) throw new Error()
      const blob = await res.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement('a')
      anchor.href = url; anchor.download = `spiritual-icons-export-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url)
    } catch { setMessage({ type: 'error', text: 'Export failed.' }) } finally { setExportLoading(false) }
  }

  async function runImport(mode: 'dry-run' | 'execute') {
    if (!importFile) { setImportError('Choose a CSV file first.'); return }
    setImportLoading(true); setImportError('')
    try {
      const body = new FormData(); body.set('mode', mode); body.set('file', importFile)
      const res = await fetch('/api/admin/spiritual-icons/import', { method: 'POST', credentials: 'include', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) { setImportReport(null); setImportError(data?.error || data?.errors?.join(', ') || 'Import failed.'); return }
      setImportReport(data); if (mode === 'execute') { setImportOpen(false); await load() }
    } catch { setImportError('Network error while importing.') } finally { setImportLoading(false) }
  }

  async function updateIcon(row: SpiritualIconRecord, patch: Partial<SpiritualIconRecord>) {
    setSavingId(row._id || '')
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/spiritual-icons/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...row, ...patch }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Update failed.' })
        return
      }
      setRows((current) => current.map((item) => item._id === row._id ? data : item))
      setMessage({ type: 'success', text: 'Spiritual icon updated.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error while updating.' })
    } finally {
      setSavingId(null)
    }
  }

  async function disable(row: SpiritualIconRecord) {
    if (!confirm(`Disable "${row.name}"? This is a safe inactive status change, not a hard delete.`)) return
    setSavingId(row._id || '')
    try {
      const res = await fetch(`/api/admin/spiritual-icons/${row._id}`, { method: 'DELETE' })
      if (!res.ok) {
        setMessage({ type: 'error', text: 'Disable failed.' })
        return
      }
      setRows((current) => current.map((item) => item._id === row._id ? { ...item, status: 'inactive' } : item))
      setMessage({ type: 'success', text: 'Spiritual icon disabled.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error while disabling.' })
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-72 animate-pulse rounded-xl bg-gray-100" />
        <div className="grid gap-4 md:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}</div>
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Spiritual Icons</h1>
          <p className="admin-section-subtitle">Showing {filtered.length} of {total} matching records · Manage gurus, scholars, pandits, and dharmic leaders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCSV} disabled={exportLoading} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50">{exportLoading ? 'Exporting...' : 'Export CSV'}</button>
          <button type="button" onClick={() => { setImportFile(null); setImportReport(null); setImportError(''); setImportOpen(true) }} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Import CSV</button>
          <button type="button" onClick={seedStatic} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Import Static Icons</button>
          <Link href="/spiritual-icons" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">View Public</Link>
          <Link href="/admin/spiritual-icons/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">New Icon</Link>
        </div>
      </div>

      {message && <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}
      {seedResult && <p className="text-xs text-gray-400">Last seed/import result: {seedResult.imported} imported, {seedResult.skipped} skipped.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total" value={stats.total} />
        <Stat label="Active" value={stats.active} tone="green" />
        <Stat label="Featured" value={stats.featured} tone="orange" />
        <Stat label="Verified" value={stats.verified} tone="blue" />
        <Stat label="Draft / Inactive" value={stats.inactiveDraft} tone="gray" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat"><p className="stat-value">{stats.active}</p><p className="stat-label">Public profiles</p></div>
        <div className="admin-stat"><p className="stat-value">{stats.verified}</p><p className="stat-label">Verified profiles</p></div>
        <div className="admin-stat"><p className="stat-value">{stats.featured}</p><p className="stat-label">Featured profiles</p></div>
        <div className="admin-stat"><p className="stat-value">{rows.filter((row) => row.bookingAvailable).length}</p><p className="stat-label">Booking enabled</p></div>
      </div>

      <div className="admin-filter-bar space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${filter === item.key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{item.label}</button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_12rem_10rem]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, category, state, specialization..." className="admin-input" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-input">
            <option value="">All Categories</option>
            {SPIRITUAL_ICON_CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="admin-input">
            <option value="">All States</option>
            {states.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} className="admin-input">
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        {(search || categoryFilter || stateFilter || filter !== 'all') && <button onClick={() => { setSearch(''); setCategoryFilter(''); setStateFilter(''); setFilter('all') }} className="text-left text-xs font-semibold text-orange-600 hover:text-orange-700">Clear all filters</button>}
      </div>

      {selected.size > 0 && <div className="admin-card flex flex-wrap items-center gap-3 px-5 py-3" style={{ background: '#FFF7ED', borderColor: 'rgba(234,88,12,0.15)' }}>
        <span className="admin-badge-orange">{selected.size} selected</span>
        <button disabled={Boolean(bulkLoading)} onClick={() => bulkAction('approve')} className="admin-btn admin-btn-success disabled:opacity-50">Approve All</button>
        <button disabled={Boolean(bulkLoading)} onClick={() => bulkAction('draft')} className="admin-btn admin-btn-ghost disabled:opacity-50">Draft All</button>
        <button disabled={Boolean(bulkLoading)} onClick={() => bulkAction('disable')} className="admin-btn admin-btn-ghost disabled:opacity-50">Disable All</button>
        <button disabled={Boolean(bulkLoading)} onClick={() => bulkAction('delete')} className="admin-btn admin-btn-danger disabled:opacity-50">Delete All</button>
        <button disabled={Boolean(bulkLoading)} onClick={() => setSelected(new Set())} className="admin-btn admin-btn-ghost disabled:opacity-50">Clear</button>
      </div>}

      <div className="admin-card flex flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Admin records:</span> Showing {(page - 1) * pageSize + (filtered.length ? 1 : 0)}-{Math.min(page * pageSize, total)} of {total}</div>
        <div className="flex items-center gap-2"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">Prev</button><span className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">Page {page} / {Math.max(1, Math.ceil(total / pageSize))}</span><button onClick={() => setPage((current) => current + 1)} disabled={!hasMore} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">Next</button></div>
      </div>

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="w-10"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>Name{sortIndicator('name')}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('category')}>Category{sortIndicator('category')}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('state')}>Location{sortIndicator('state')}</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>Status{sortIndicator('status')}</th>
                <th>Flags</th>
                <th className="cursor-pointer select-none" onClick={() => handleSort('priority')}>Priority{sortIndicator('priority')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id || row.slug} className={row._id && selected.has(row._id) ? 'bg-orange-50/40' : ''}>
                  <td><input type="checkbox" checked={Boolean(row._id && selected.has(row._id))} disabled={!row._id || row.isStaticFallback} onChange={() => row._id && toggleSelect(row._id)} className="rounded" /></td>
                  <td>
                    <p className="font-semibold text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.title || row.nameHi}</p>
                    {row.isStaticFallback && <p className="text-[11px] font-semibold text-amber-600">Static fallback · import to edit</p>}
                  </td>
                  <td><span className="admin-badge-orange">{row.category}</span></td>
                  <td className="text-gray-500">{[row.city, row.state].filter(Boolean).join(', ') || row.location || '-'}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {row.verified && <span className="admin-badge-green">Verified</span>}
                      {row.featured && <span className="admin-badge-yellow">Featured</span>}
                      {row.bookingAvailable && <span className="admin-badge-orange">Booking</span>}
                    </div>
                  </td>
                  <td className="text-gray-500">{row.priority ?? 999}</td>
                  <td>
                    <div className="flex min-w-[17rem] flex-wrap gap-1.5">
                      {row.isStaticFallback ? <button onClick={seedStatic} className="admin-btn admin-btn-primary text-xs">Import to DB</button> : <>
                        <button onClick={() => setPreviewId(row._id || null)} className="admin-btn admin-btn-ghost text-xs">Preview</button>
                        <Link href={`/spiritual-icons/${row.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost text-xs">View</Link>
                        <Link href={`/admin/spiritual-icons/${row._id}/edit`} className="admin-btn admin-btn-ghost text-xs">Edit</Link>
                        <button disabled={savingId === row._id} onClick={() => updateIcon(row, { featured: !row.featured })} className="admin-btn admin-btn-ghost text-xs disabled:opacity-50">{row.featured ? 'Unfeature' : 'Feature'}</button>
                        <button disabled={savingId === row._id} onClick={() => updateIcon(row, { verified: !row.verified })} className="admin-btn admin-btn-success text-xs disabled:opacity-50">{row.verified ? 'Unverify' : 'Verify'}</button>
                        <button disabled={savingId === row._id} onClick={() => updateIcon(row, { status: row.status === 'active' ? 'draft' : 'active' })} className="admin-btn admin-btn-ghost text-xs disabled:opacity-50">{row.status === 'active' ? 'Draft' : 'Activate'}</button>
                        <button disabled={savingId === row._id} onClick={() => disable(row)} className="admin-btn admin-btn-danger text-xs disabled:opacity-50">Disable</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No spiritual icons match the current filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <AdminPagination
        page={page}
        limit={pageSize}
        total={total}
        hasMore={hasMore}
        loading={loading}
        onPageChange={setPage}
        onLimitChange={(nextLimit) => { setPageSize(nextLimit); setPage(1) }}
      />
      {importOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setImportOpen(false)}><div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold text-gray-900">Import Spiritual Icons</h2><p className="mt-1 text-sm text-gray-500">Existing records match by ID, slug, or name.</p></div><button onClick={() => setImportOpen(false)} className="text-xl text-gray-400" aria-label="Close">×</button></div><div className="mt-5 space-y-4"><input type="file" accept=".csv,text/csv" className="admin-input w-full" onChange={(event) => { setImportFile(event.target.files?.[0] || null); setImportReport(null) }} /><a href="/api/admin/spiritual-icons/import" className="text-sm font-semibold text-orange-700">Download blank template</a>{importError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{importError}</p>}{importReport && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><p className="font-bold">{importReport.mode === 'dry-run' ? 'Dry run complete' : 'Import complete'}</p><p className="mt-1">Rows: {importReport.total} · Created: {importReport.created} · Updated: {importReport.updated} · Errors: {importReport.errors?.length || 0}</p>{importReport.rows?.length > 0 && <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">{importReport.rows.map((row: { row: number; name: string; action: string }) => <div key={row.row} className="rounded-lg bg-white/80 px-3 py-2 text-xs"><span className="font-bold uppercase">{row.action}</span> · Row {row.row}: {row.name}</div>)}</div>}</div>}<div className="flex gap-2"><button onClick={() => runImport('dry-run')} disabled={importLoading} className="admin-btn admin-btn-ghost disabled:opacity-50">{importLoading ? 'Working...' : 'Preview changes'}</button><button onClick={() => runImport('execute')} disabled={importLoading || !importReport?.ok || importReport.mode !== 'dry-run'} className="admin-btn admin-btn-primary disabled:opacity-50">Import changes</button></div></div></div></div>}
      {previewItem && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewId(null)}><div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-gray-900">{previewItem.name}</h2><div className="mt-2 flex flex-wrap gap-2"><span className="admin-badge-orange">{previewItem.category}</span>{previewItem.verified && <span className="admin-badge-green">Verified</span>}{previewItem.featured && <span className="admin-badge-yellow">Featured</span>}</div></div><button onClick={() => setPreviewId(null)} className="text-xl text-gray-400" aria-label="Close">×</button></div>{previewItem.imageHero || previewItem.imageCard || previewItem.image ? <img src={previewItem.imageHero || previewItem.imageCard || previewItem.image} alt={previewItem.name} className="mt-5 h-48 w-full rounded-xl object-cover" /> : null}<p className="mt-4 text-sm leading-6 text-gray-600">{previewItem.fullBio || previewItem.shortBio || 'No profile bio added yet.'}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600"><div><span className="text-gray-400">Location:</span> {[previewItem.city, previewItem.state].filter(Boolean).join(', ') || previewItem.location || '-'}</div><div><span className="text-gray-400">Status:</span> {previewItem.status || '-'}</div><div><span className="text-gray-400">Languages:</span> {previewItem.languages?.join(', ') || '-'}</div><div><span className="text-gray-400">Specializations:</span> {previewItem.specializations?.join(', ') || '-'}</div></div><div className="mt-5 flex gap-2"><Link href={`/admin/spiritual-icons/${previewItem._id}/edit`} className="admin-btn admin-btn-primary text-sm">Edit profile</Link><Link href={`/spiritual-icons/${previewItem.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost text-sm">View public</Link></div></div></div>}
    </div>
  )
}

function Stat({ label, value, tone = 'orange' }: { label: string; value: number; tone?: 'orange' | 'green' | 'blue' | 'gray' }) {
  const tones = {
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
    green: 'border-green-100 bg-green-50 text-green-700',
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    gray: 'border-gray-100 bg-gray-50 text-gray-700',
  }
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status?: string }) {
  if (status === 'active') return <span className="admin-badge-green">active</span>
  if (status === 'draft') return <span className="admin-badge-yellow">draft</span>
  return <span className="admin-badge-red">{status || 'inactive'}</span>
}
