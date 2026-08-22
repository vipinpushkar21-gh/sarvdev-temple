"use client"

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import SarvdevImage from '../../../components/SarvdevImage'
import { getDevotionalCardImage } from '../../../lib/devotional-image'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { DEVOTIONAL_CATEGORIES } from '@/lib/devotional-categories'
import { FULL_CATEGORIES } from '@/app/devotionals/components/categories'

type Devotional = {
  _id: string
  slug?: string
  title: string
  description?: string
  category?: string
  subcategory?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  artist?: string
  duration?: string
  image?: string
  imageCard?: string
  imageHero?: string
  ogImage?: string
  thumbnail?: string
  coverImage?: string
  status?: 'approved' | 'pending' | 'rejected'
  createdAt?: string
}

type CleanupReport = {
  ok: boolean
  dryRun: boolean
  totalScanned: number
  affectedCount: number
  imagesFound: number
  fields: string[]
  sampleAffectedRecords: { id: string; title?: string; slug?: string; fields: string[] }[]
  clearedRecords?: number
  clearedFields?: number
  logCreated?: boolean
  error?: string
}

type ImportRowResult = {
  row: number
  title: string
  action: 'create' | 'update' | 'skip'
  matchedBy?: 'id' | 'slug' | 'title'
  id?: string
  changedFields?: string[]
  reason?: string
}

type ImportReport = {
  ok: boolean
  mode: 'dry-run' | 'execute'
  category: string
  totalRows: number
  created: number
  updated: number
  skipped: number
  errors: string[]
  rows: ImportRowResult[]
}

type AdminDevotionalFacets = {
  totalAll: number
  withAudio?: number
  withLyrics?: number
  categories: Record<string, number>
  statuses: Record<string, number>
  languages: Record<string, number>
  deities: Record<string, number>
}

type SortKey = 'title' | 'category' | 'deity' | 'language' | 'artist' | 'createdAt'
type SortDir = 'asc' | 'desc'

function normalizeAdminCategoryName(value?: string) {
  const category = String(value || '').trim()
  if (category.toLowerCase() === '108 namavali') return 'Namavali'
  return category
}

const SUBCATEGORY_LABELS = new Map(
  FULL_CATEGORIES.flatMap(category => (category.subcategories || []).map(subcategory => [subcategory.id, subcategory.label] as const))
)

function getSubcategoryLabel(value?: string) {
  return value ? SUBCATEGORY_LABELS.get(value) || value : '-'
}

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
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [facets, setFacets] = useState<AdminDevotionalFacets | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [cleanupReport, setCleanupReport] = useState<CleanupReport | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importCategory, setImportCategory] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importReport, setImportReport] = useState<ImportReport | null>(null)
  const [importError, setImportError] = useState('')

  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => { fetchDevotionals() }, [page, pageSize, debouncedSearch, categoryFilter, statusFilter, languageFilter, deityFilter])
  useEffect(() => { setPage(1) }, [pageSize, debouncedSearch, categoryFilter, statusFilter, languageFilter, deityFilter])

  async function fetchDevotionals() {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize), includeFacets: '1' })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (categoryFilter) params.set('category', categoryFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (languageFilter) params.set('language', languageFilter)
      if (deityFilter) params.set('deity', deityFilter)
      const res = await fetch(`/api/devotionals?${params.toString()}`, { credentials: 'include', cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        setDevotionals(Array.isArray(items) ? items : [])
        setTotal(Number(data.total || items.length || 0))
        setFacets(data.facets || null)
      }
    } catch (error) { console.error('Failed to fetch devotionals:', error) }
    finally { setLoading(false) }
  }

  async function runImageCleanup(apply: boolean) {
    if (apply && !confirm('Clear old devotional image fields now? Devotional text, audio, SEO text and deity images will not be touched.')) return
    setCleanupLoading(true)
    try {
      const res = await fetch('/api/admin/devotionals/clear-images', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apply }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCleanupReport({
          ok: false,
          dryRun: !apply,
          totalScanned: 0,
          affectedCount: 0,
          imagesFound: 0,
          fields: [],
          sampleAffectedRecords: [],
          error: data?.error || 'Failed to clear devotional images',
        })
        return
      }
      setCleanupReport(data)
      if (apply) await fetchDevotionals()
    } catch {
      setCleanupReport({
        ok: false,
        dryRun: !apply,
        totalScanned: 0,
        affectedCount: 0,
        imagesFound: 0,
        fields: [],
        sampleAffectedRecords: [],
        error: 'Network error while clearing devotional images',
      })
    } finally {
      setCleanupLoading(false)
    }
  }

  // Derived data
  const categories = useMemo(() => {
    const configured = DEVOTIONAL_CATEGORIES.map((category) => category.id)
    const fromFacets = Object.keys(facets?.categories || {}).map(normalizeAdminCategoryName)
    const fromPage = (devotionals.map(d => normalizeAdminCategoryName(d.category)).filter(Boolean) as string[])
    return Array.from(new Set([...configured, ...fromFacets, ...fromPage])).filter(Boolean)
  }, [devotionals, facets])
  const languages = useMemo(() => {
    const fromFacets = Object.keys(facets?.languages || {})
    const fromPage = devotionals.map(d => d.language).filter(Boolean) as string[]
    return Array.from(new Set([...fromFacets, ...fromPage])).filter(Boolean).sort()
  }, [devotionals, facets])
  const deities = useMemo(() => {
    const fromFacets = Object.keys(facets?.deities || {})
    const fromPage = devotionals.map(d => d.deity).filter(Boolean) as string[]
    return Array.from(new Set([...fromFacets, ...fromPage])).filter(Boolean).sort()
  }, [devotionals, facets])
  const catCounts = useMemo(() => {
    if (facets?.categories) {
      const normalized: Record<string, number> = {}
      for (const [name, count] of Object.entries(facets.categories)) {
        const key = normalizeAdminCategoryName(name)
        if (key) normalized[key] = (normalized[key] || 0) + count
      }
      return normalized
    }
    const m: Record<string, number> = {}
    devotionals.forEach(d => {
      const key = normalizeAdminCategoryName(d.category)
      if (key) m[key] = (m[key] || 0) + 1
    })
    return m
  }, [devotionals, facets])

  // Stats
  const stats = useMemo(() => {
    if (facets) {
      const approved = (facets.statuses.approved || 0) + (facets.statuses[''] || 0)
      const pending = facets.statuses.pending || 0
      const rejected = facets.statuses.rejected || 0
      const withAudio = facets.withAudio || 0
      const withLyrics = facets.withLyrics || 0
      return { total: facets.totalAll || total, approved, pending, rejected, withAudio, withLyrics }
    }
    const approved = devotionals.filter(d => d.status === 'approved' || !d.status).length
    const pending = devotionals.filter(d => d.status === 'pending').length
    const rejected = devotionals.filter(d => d.status === 'rejected').length
    const withAudio = devotionals.filter(d => d.audio).length
    const withLyrics = devotionals.filter(d => d.lyrics).length
    return { total: devotionals.length, approved, pending, rejected, withAudio, withLyrics }
  }, [devotionals, facets, total])

  // Sort the current server-returned page. Search and filters are applied by the API.
  const filtered = useMemo(() => {
    const result = [...devotionals]
    result.sort((a, b) => {
      const av = (a[sortKey] || '').toString().toLowerCase()
      const bv = (b[sortKey] || '').toString().toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return result
  }, [devotionals, sortKey, sortDir])

  const paginated = filtered
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

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

  // Export all matching records from the server, not just the current page.
  const exportCSV = async () => {
    setExportLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (categoryFilter) params.set('category', categoryFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (languageFilter) params.set('language', languageFilter)
      if (deityFilter) params.set('deity', deityFilter)
      const res = await fetch(`/api/admin/devotionals/export?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) {
        alert('Failed to export devotionals')
        return
      }
      const blob = await res.blob()
      const disposition = res.headers.get('content-disposition') || ''
      const match = disposition.match(/filename="([^"]+)"/)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = match?.[1] || `devotionals-export-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to export devotionals')
    } finally {
      setExportLoading(false)
    }
  }

  const openImport = () => {
    setImportCategory(categoryFilter)
    setImportFile(null)
    setImportReport(null)
    setImportError('')
    setImportOpen(true)
  }

  const downloadImportTemplate = () => {
    const params = new URLSearchParams()
    if (importCategory) params.set('category', importCategory)
    window.open(`/api/admin/devotionals/import?${params.toString()}`, '_blank')
  }

  // Same category-scoped contract as the export: pick a category, then upload its rows.
  const runImport = async (mode: 'dry-run' | 'execute') => {
    if (!importCategory) { setImportError('Select a category first'); return }
    if (!importFile) { setImportError('Choose a CSV file first'); return }
    setImportLoading(true)
    setImportError('')
    try {
      const body = new FormData()
      body.set('category', importCategory)
      body.set('mode', mode)
      body.set('file', importFile)
      const res = await fetch('/api/admin/devotionals/import', { method: 'POST', credentials: 'include', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        setImportReport(null)
        setImportError(data?.error || (data?.errors || []).join(', ') || 'Import failed')
        return
      }
      setImportReport(data)
      if (mode === 'execute') await fetchDevotionals()
    } catch {
      setImportError('Network error while importing')
    } finally {
      setImportLoading(false)
    }
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
          <p className="admin-section-subtitle">
            Showing {filtered.length} of {total} matching records · {stats.total} total in admin
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={exportLoading} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-60">
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={openImport} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">Import CSV</button>
          <Link href="/admin/devotionals/data-integrity" className="admin-btn admin-btn-ghost px-4 py-2 text-sm border-orange-200 text-orange-700 hover:bg-orange-50">Data Integrity</Link>
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
          { label: 'With Lyrics', value: stats.withLyrics, icon: 'Text' },
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

      <div className="admin-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="admin-section-title">Optimized devotional public image mode</h2>
            <p className="admin-section-subtitle mt-1">
              Devotional public pages currently use one optimized fallback image for speed. Old devotional-specific image fields can be cleared safely after dry-run review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => runImageCleanup(false)}
              disabled={cleanupLoading}
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-60"
            >
              {cleanupLoading ? 'Checking...' : 'Dry run image cleanup'}
            </button>
            <button
              type="button"
              onClick={() => runImageCleanup(true)}
              disabled={cleanupLoading || !cleanupReport?.ok}
              className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              Clear old devotional images
            </button>
          </div>
        </div>

        {cleanupReport && (
          <div className={`mt-4 rounded-2xl border p-4 text-sm ${cleanupReport.ok ? 'border-amber-200 bg-amber-50/70 text-stone-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {cleanupReport.ok ? (
              <>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div><span className="block text-xs font-bold uppercase text-stone-500">Mode</span>{cleanupReport.dryRun ? 'Dry run' : 'Applied'}</div>
                  <div><span className="block text-xs font-bold uppercase text-stone-500">Scanned</span>{cleanupReport.totalScanned}</div>
                  <div><span className="block text-xs font-bold uppercase text-stone-500">Affected</span>{cleanupReport.affectedCount}</div>
                  <div><span className="block text-xs font-bold uppercase text-stone-500">Fields found</span>{cleanupReport.imagesFound}</div>
                </div>
                {cleanupReport.sampleAffectedRecords.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase text-stone-500">Sample affected records</p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {cleanupReport.sampleAffectedRecords.map((record) => (
                        <div key={record.id} className="rounded-xl bg-white/80 px-3 py-2">
                          <span className="block truncate font-semibold">{record.title || record.id}</span>
                          <span className="text-xs text-stone-500">{record.fields.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!cleanupReport.dryRun && (
                  <p className="mt-3 text-xs font-semibold text-emerald-700">
                    Cleared {cleanupReport.clearedRecords || 0} record(s). Activity log: {cleanupReport.logCreated ? 'created' : 'not created'}.
                  </p>
                )}
              </>
            ) : (
              cleanupReport.error || 'Cleanup failed'
            )}
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} className="admin-input">
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
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

      <div className="admin-card flex flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Admin records:</span>{' '}
          Showing {(page - 1) * pageSize + (paginated.length ? 1 : 0)}-{Math.min(page * pageSize, total)} of {total}
          {stats.total !== total && <> matching · {stats.total} total devotionals</>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">Prev</button>
          <span className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40 text-xs">Next</button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" /></th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('title')}>Title<SortIcon col="title" /></th>
                <th>Public Image</th>
                <th className="cursor-pointer group select-none" onClick={() => handleSort('category')}>Category<SortIcon col="category" /></th>
                <th>Subcategory</th>
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
                  <td>
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                        <SarvdevImage
                          image={getDevotionalCardImage()}
                          alt={d.title}
                          className="absolute inset-0"
                          imgClassName="object-cover"
                          renderMode="auto"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-gray-800">Fallback image</p>
                        <p className="truncate text-[10px] text-gray-400">Public pages ignore devotional/deity images</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge-purple text-[10px]">{d.category || '-'}</span></td>
                  <td><span className="admin-badge-orange text-[10px]">{getSubcategoryLabel(d.subcategory)}</span></td>
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
                      <Link href={`/devotionals/${encodeURIComponent(d.slug || d._id)}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost text-[10px]" title="View live devotional">View</Link>
                      <Link href={`/admin/devotionals/${d._id}/edit`} className="admin-btn admin-btn-ghost text-[10px]" title="Edit">Edit</Link>
                      <button onClick={() => approve(d._id)} className="admin-btn admin-btn-success text-[10px]">✓</button>
                      <button onClick={() => reject(d._id)} className="admin-btn admin-btn-danger text-[10px]">✗</button>
                      <button onClick={() => remove(d._id)} className="admin-btn text-[10px]" style={{ background: '#1F2937', color: 'white' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={11} className="px-5 py-10 text-center text-gray-400">No devotionals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="text-sm text-gray-400">Page {page} of {totalPages} · {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</span>
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

      {/* Import Modal */}
      {importOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImportOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Import Devotionals</h2>
                  <p className="admin-section-subtitle mt-1">Pick a category and upload a CSV. Rows are matched by ID, then Slug, then Title.</p>
                </div>
                <button onClick={() => setImportOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                <select value={importCategory} onChange={e => { setImportCategory(e.target.value); setImportReport(null) }} className="admin-input w-full">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">CSV file *</label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={e => { setImportFile(e.target.files?.[0] || null); setImportReport(null) }}
                  className="admin-input w-full text-sm"
                />
                <button type="button" onClick={downloadImportTemplate} className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-semibold">
                  Download blank template
                </button>
              </div>

              {importError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{importError}</div>
              )}

              {importReport && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-stone-800">
                  <div className="grid gap-3 sm:grid-cols-5">
                    <div><span className="block text-xs font-bold uppercase text-stone-500">Mode</span>{importReport.mode === 'dry-run' ? 'Preview' : 'Imported'}</div>
                    <div><span className="block text-xs font-bold uppercase text-stone-500">Rows</span>{importReport.totalRows}</div>
                    <div><span className="block text-xs font-bold uppercase text-stone-500">New</span>{importReport.created}</div>
                    <div><span className="block text-xs font-bold uppercase text-stone-500">Updated</span>{importReport.updated}</div>
                    <div><span className="block text-xs font-bold uppercase text-stone-500">Skipped</span>{importReport.skipped}</div>
                  </div>
                  {importReport.rows.length > 0 && (
                    <div className="mt-3 max-h-56 overflow-y-auto space-y-1.5">
                      {importReport.rows.map(row => (
                        <div key={row.row} className="rounded-xl bg-white/80 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className={`${row.action === 'create' ? 'admin-badge-green' : row.action === 'update' ? 'admin-badge-blue' : 'admin-badge-yellow'} text-[10px]`}>{row.action}</span>
                            <span className="truncate font-semibold">Row {row.row}: {row.title || '(no title)'}</span>
                          </div>
                          {(row.reason || row.changedFields?.length) && (
                            <span className="text-xs text-stone-500">{row.reason || `Changes: ${row.changedFields?.join(', ')}`}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => runImport('dry-run')}
                  disabled={importLoading}
                  className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-60"
                >
                  {importLoading ? 'Working...' : 'Preview changes'}
                </button>
                <button
                  type="button"
                  onClick={() => runImport('execute')}
                  disabled={importLoading || !importReport?.ok || importReport.mode === 'execute'}
                  className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-60"
                >
                  Import {importReport && importReport.mode === 'dry-run' ? `${importReport.created + importReport.updated} row(s)` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    {previewItem.subcategory && <span className="admin-badge-purple">{getSubcategoryLabel(previewItem.subcategory)}</span>}
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
