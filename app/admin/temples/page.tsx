"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import AdminPagination from '@/components/admin/AdminPagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type TempleRow = {
  _id: string
  title: string
  slug?: string
  uniqueKey?: string
  dataQuality?: 'A+' | 'A' | 'B' | 'C'
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
  primaryImage?: string
  image?: string
  galleryImages?: string[]
  imageGallery?: string[]
  latitude?: number | string
  longitude?: number | string
  timings?: string
  googleMapUrl?: string
  googleMapsUrl?: string
  mapsLink?: string
  description?: string
  descriptionHi?: string
  history?: string
  historyHi?: string
  architecture?: string
  architectureHi?: string
  religiousImportance?: string
  religiousImportanceHi?: string
  sacredImportance?: string
  sacredImportanceHi?: string
  festivals?: { name?: string; nameHi?: string }[]
  festivalsHi?: string
  bestTimeToVisit?: string
  bestTimeToVisitHi?: string
  bestSeason?: string
  nearbyTemples?: string[]
  nearbySacredPlaces?: string[]
  faqs?: { question?: string; answer?: string }[]
  sourceUrls?: string[]
  tags?: string[]
  keywords?: string[]
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  speciality?: string
  specialityHi?: string
  deityHi?: string
  pincode?: string
  phone?: string
  email?: string
  website?: string
  streetAddress?: string
  imageCard?: string
  imageHero?: string
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

type TempleIntegrityResult = {
  ok?: boolean
  mode?: string
  scanned?: number
  recordsNeedingUpdates?: number
  updated?: number
  skipped?: number
  errors?: { id?: string; title?: string; reason: string }[]
  migration?: { fields?: Record<string, number> }
  slugs?: { duplicateCount?: number; emptyCount?: number; invalidCount?: number; malformedCount?: number }
  categories?: { orphanCount?: number; duplicateCategoryRecords?: number; missingSacredCategorySlugs?: number; slugMismatchCount?: number }
  images?: { missingImageCount?: number; invalidUrlCount?: number; duplicateImageFieldCount?: number }
  locations?: { missingStateCount?: number; missingCityCount?: number; invalidCountryCount?: number; stateAliasCount?: number }
  deities?: { missingDeitySlugCount?: number; deitySlugMismatchCount?: number; unknownDeityCount?: number }
  indexes?: { missing?: { name: string }[] }
  error?: string
}

export default function AdminTemplesPage() {
  const [rows, setRows] = useState<TempleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deityFilter, setDeityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dataQualityFilter, setDataQualityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortCol, setSortCol] = useState<'title' | 'status'>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [exportLoading, setExportLoading] = useState(false)
  const [csvImportLoading, setCsvImportLoading] = useState(false)
  const [csvImportResult, setCsvImportResult] = useState<CsvImportResult | null>(null)
  const [integrityLoading, setIntegrityLoading] = useState<'dry-run' | 'execute' | null>(null)
  const [integrityResult, setIntegrityResult] = useState<TempleIntegrityResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => { fetchTemples(page) }, [page, pageSize, debouncedSearch, deityFilter, stateFilter, typeFilter, statusFilter, dataQualityFilter, categoryFilter, sortCol, sortDir])
  useEffect(() => { setPage(1) }, [pageSize, debouncedSearch, deityFilter, stateFilter, typeFilter, statusFilter, dataQualityFilter, categoryFilter, sortCol, sortDir])
  
  async function fetchTemples(targetPage = page) {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        admin: '1',
        page: String(targetPage),
        limit: String(pageSize),
        sort: sortCol === 'title' ? (sortDir === 'asc' ? 'title' : '-title') : (sortDir === 'asc' ? 'status' : '-status'),
        t: String(Date.now()),
      })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (deityFilter) params.set('deity', deityFilter)
      if (stateFilter) params.set('state', stateFilter)
      if (typeFilter) params.set('templeType', typeFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (dataQualityFilter) params.set('dataQuality', dataQualityFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      const res = await fetch(`/api/temples?${params.toString()}`, { credentials: 'include', cache: 'no-store' })
      if (res.ok) {
        const payload = await res.json()
        const data = Array.isArray(payload) ? payload : (payload.data || payload.items || [])
        setRows(data)
        setTotal(Number(payload.total || data.length || 0))
        setHasMore(Boolean(payload.hasMore))
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    } finally { setLoading(false) }
  }

  const deities = useMemo(() => Array.from(new Set(rows.map(r => r.deity).filter(Boolean))).sort(), [rows])
  const states = useMemo(() => Array.from(new Set(rows.map(r => r.state).filter(Boolean))).sort(), [rows])
  const types = useMemo(() => Array.from(new Set(rows.map(r => r.templeType || r.type).filter(Boolean))).sort(), [rows])

  const filtered = useMemo(() => rows, [rows])

  const paginated = filtered

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
  const csvList = (value: unknown, separator = ', ') =>
    Array.isArray(value) ? value.filter(Boolean).join(separator) : String(value || '')
  const csvFestivals = (value: TempleRow['festivals'], hi = false) =>
    Array.isArray(value) ? value.map(item => hi ? item?.nameHi : item?.name).filter(Boolean).join(';') : ''
  const csvFaqs = (value: TempleRow['faqs']) =>
    Array.isArray(value)
      ? value.map(item => [item?.question, item?.answer].filter(Boolean).join('|')).filter(Boolean).join('; ')
      : ''
  const hasEnglishLetters = (value: unknown) => /[A-Za-z]/.test(String(value || ''))

  const downloadCSVTemplate = () => {
    window.location.href = '/api/admin/temples/import/template'
    return
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

  const importCSV = async (dryRun = false) => {
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
      if (dryRun) form.append('dryRun', '1')
      const res = await fetch('/api/admin/temples/import-csv', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      setCsvImportResult(data)
      if (!res.ok) throw new Error(data.error || 'CSV import failed')
      if (!dryRun) {
        await fetchTemples()
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setCsvImportResult((prev) => prev || { error: err?.message || 'CSV import failed' })
    } finally {
      setCsvImportLoading(false)
    }
  }

  const runIntegrityCheck = async (apply = false) => {
    if (apply && !confirm('Run safe migration now? Only missing normalized fields will be filled. No temple content, images, SEO, descriptions, or duplicate slugs will be overwritten.')) {
      return
    }
    setIntegrityLoading(apply ? 'execute' : 'dry-run')
    setIntegrityResult(null)
    try {
      const res = await fetch('/api/admin/migrate-temples' + (apply ? '' : '?dryRun=1'), {
        method: apply ? 'POST' : 'GET',
        credentials: 'include',
        headers: apply ? { 'Content-Type': 'application/json' } : undefined,
        body: apply ? JSON.stringify({ batchSize: 500 }) : undefined,
      })
      const data = await res.json().catch(() => ({}))
      setIntegrityResult(data)
      if (!res.ok) throw new Error(data.error || 'Temple integrity check failed')
      if (apply) await fetchTemples()
    } catch (err: any) {
      setIntegrityResult((prev) => prev || { error: err?.message || 'Temple integrity check failed' })
    } finally {
      setIntegrityLoading(null)
    }
  }

  const exportCSV = async () => {
    setExportLoading(true)
    try {
      const allRows: TempleRow[] = []
      let pg = 1
      let more = true
      while (more) {
        const params = new URLSearchParams({
          admin: '1',
          limit: '100',
          page: String(pg),
          sort: 'title',
          t: String(Date.now()),
        })
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (deityFilter) params.set('deity', deityFilter)
        if (stateFilter) params.set('state', stateFilter)
        if (typeFilter) params.set('templeType', typeFilter)
        if (statusFilter) params.set('status', statusFilter)
        if (dataQualityFilter) params.set('dataQuality', dataQualityFilter)
        if (categoryFilter) params.set('category', categoryFilter)
        const res = await fetch(`/api/temples?${params}`, { credentials: 'include', cache: 'no-store' })
        if (!res.ok) break
        const payload = await res.json().catch(() => ({}))
        const data: TempleRow[] = Array.isArray(payload) ? payload : (payload.data || payload.items || [])
        allRows.push(...data)
        more = Boolean(payload.hasMore) && data.length > 0
        pg++
      }
      const englishHiCount = allRows.filter(r => hasEnglishLetters(r.titleHi)).length
      if (englishHiCount > 0) {
        alert(`${englishHiCount} rows have English letters in TempleNameHi. TempleNameHi should be Hindi/Devanagari or blank.`)
      }
      const header = [
        'Title', 'TempleNameHi', 'UniqueKey', 'Slug', 'Location', 'City', 'District', 'State', 'Country',
        'Deity', 'Type', 'SacredCategories', 'Tags', 'MetaTitle', 'MetaDescription', 'Keywords',
        'Description', 'DescriptionHi', 'History', 'HistoryHi', 'Architecture', 'ArchitectureHi',
        'ReligiousImportance', 'ReligiousImportanceHi', 'Festivals', 'FestivalsHi',
        'BestTimeToVisit', 'BestTimeToVisitHi', 'NearbyTemples', 'FAQs', 'SourceUrls',
        'PrimaryImage', 'GalleryImages', 'Latitude', 'Longitude', 'Timings', 'GoogleMapUrl',
        'Speciality', 'SpecialityHi', 'DataQuality', 'Status', 'Verified',
      ]
      const csvRows = [
        header.join(','),
        ...allRows.map(r =>
          [
            r.title || '',
            r.titleHi || '',
            r.uniqueKey || '',
            r.slug || '',
            r.streetAddress || r.location || '',
            r.city || '',
            r.district || '',
            r.state || '',
            r.country || '',
            r.deity || '',
            r.templeType || r.type || '',
            (r.sacredCategories || []).join(';'),
            csvList(r.tags),
            r.metaTitle || '',
            r.metaDescription || '',
            csvList(r.keywords && r.keywords.length > 0 ? r.keywords : r.metaKeywords),
            r.description || '',
            r.descriptionHi || '',
            r.history || '',
            r.historyHi || '',
            r.architecture || '',
            r.architectureHi || '',
            r.religiousImportance || r.sacredImportance || '',
            r.religiousImportanceHi || r.sacredImportanceHi || '',
            csvFestivals(r.festivals),
            r.festivalsHi || csvFestivals(r.festivals, true),
            r.bestTimeToVisit || r.bestSeason || '',
            r.bestTimeToVisitHi || '',
            csvList(r.nearbyTemples && r.nearbyTemples.length > 0 ? r.nearbyTemples : r.nearbySacredPlaces),
            csvFaqs(r.faqs),
            csvList(r.sourceUrls),
            r.primaryImage || r.image || '',
            csvList(r.galleryImages && r.galleryImages.length > 0 ? r.galleryImages : r.imageGallery),
            r.latitude ?? '',
            r.longitude ?? '',
            r.timings || '',
            r.googleMapsUrl || r.googleMapUrl || r.mapsLink || '',
            r.speciality || '',
            r.specialityHi || '',
            r.dataQuality || 'B',
            r.status || 'approved',
            r.verified || 'not-verified',
          ]
            .map(csvEscape)
            .join(',')
        ),
      ]
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `sarvdev-temples-export-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExportLoading(false)
    }
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
          <button onClick={exportCSV} disabled={exportLoading} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50">{exportLoading ? 'Exporting...' : '⬇ Export CSV'}</button>
          <Link href="/admin/temples/import" className="admin-btn admin-btn-primary px-4 py-2 text-sm">Large Import</Link>
          <button onClick={downloadCSVTemplate} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">CSV Template</button>
          <label className="admin-btn admin-btn-ghost cursor-pointer px-4 py-2 text-sm">
            Choose CSV
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" />
          </label>
          <button
            onClick={() => importCSV(true)}
            disabled={csvImportLoading}
            className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50"
          >
            Dry Run
          </button>
          <button
            onClick={() => importCSV(false)}
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

      <div className="admin-card p-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="font-semibold text-sm text-gray-900">Temple Integrity Check</p>
            <p className="text-xs text-gray-500 mt-1">
              Dry-run audits temple slugs, categories, images, locations, deities, and indexes. Migration only fills missing normalized fields.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runIntegrityCheck(false)}
              disabled={Boolean(integrityLoading)}
              className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-50"
            >
              {integrityLoading === 'dry-run' ? 'Checking...' : 'Dry Run'}
            </button>
            <button
              onClick={() => runIntegrityCheck(true)}
              disabled={Boolean(integrityLoading)}
              className="admin-btn admin-btn-primary px-4 py-2 text-sm disabled:opacity-50"
            >
              {integrityLoading === 'execute' ? 'Running...' : 'Run Migration'}
            </button>
          </div>
        </div>

        {integrityResult && (
          <div className={`mt-4 rounded-xl border p-4 ${integrityResult.error ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
            {integrityResult.error ? (
              <p className="text-sm text-red-700">{integrityResult.error}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="admin-badge-blue">{integrityResult.mode || 'dry-run'}</span>
                  <span className="admin-badge-blue">{integrityResult.scanned || 0} scanned</span>
                  <span className="admin-badge-yellow">{integrityResult.recordsNeedingUpdates || 0} need normalized fields</span>
                  <span className="admin-badge-green">{integrityResult.updated || 0} updated</span>
                  {(integrityResult.errors || []).length > 0 && <span className="admin-badge-red">{integrityResult.errors!.length} errors</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-900">Slugs</p>
                    <p>Duplicates: {integrityResult.slugs?.duplicateCount || 0}</p>
                    <p>Empty: {integrityResult.slugs?.emptyCount || 0}</p>
                    <p>Invalid/malformed: {(integrityResult.slugs?.invalidCount || 0) + (integrityResult.slugs?.malformedCount || 0)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Categories</p>
                    <p>Orphans: {integrityResult.categories?.orphanCount || 0}</p>
                    <p>Missing slugs: {integrityResult.categories?.missingSacredCategorySlugs || 0}</p>
                    <p>Slug mismatches: {integrityResult.categories?.slugMismatchCount || 0}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Media & location</p>
                    <p>Missing images: {integrityResult.images?.missingImageCount || 0}</p>
                    <p>Invalid image URLs: {integrityResult.images?.invalidUrlCount || 0}</p>
                    <p>Missing city/state: {(integrityResult.locations?.missingCityCount || 0) + (integrityResult.locations?.missingStateCount || 0)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Deities</p>
                    <p>Missing deitySlug: {integrityResult.deities?.missingDeitySlugCount || 0}</p>
                    <p>Slug mismatches: {integrityResult.deities?.deitySlugMismatchCount || 0}</p>
                    <p>Unknown names: {integrityResult.deities?.unknownDeityCount || 0}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Indexes</p>
                    <p>Missing expected indexes: {integrityResult.indexes?.missing?.length || 0}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fields to fill</p>
                    {Object.entries(integrityResult.migration?.fields || {}).map(([field, count]) => (
                      <p key={field}>{field}: {count}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, location, deity..." className="admin-input" />
          <input type="text" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} placeholder="Category" className="admin-input" />
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
          <select value={dataQualityFilter} onChange={e => setDataQualityFilter(e.target.value)} className="admin-input">
            <option value="">All Quality</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
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
                <th>Quality</th>
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
                  <td><span className="admin-badge-blue">{r.dataQuality || 'B'}</span></td>
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
                <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">No temples match filters.</td></tr>
              )}
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
    </div>
  )
}
