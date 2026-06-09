"use client"

import { useEffect, useMemo, useState } from 'react'
import ImageUpload from '../../../components/ImageUpload'
import AdminPagination from '@/components/admin/AdminPagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type EventRow = any
type ImportResult = {
  ok?: boolean
  error?: string
  sourceCount?: number
  imported?: number
  skipped?: number
  failed?: number
  errors?: { title?: string; slug?: string; reason: string }[]
}

const emptyForm = {
  title: '',
  titleHi: '',
  slug: '',
  category: 'festival',
  eventType: 'Festival',
  shortDescription: '',
  shortDescriptionHi: '',
  description: '',
  descriptionHi: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  timezone: 'Asia/Kolkata',
  isAllDay: true,
  recurrence: '',
  tithi: '',
  paksha: '',
  hinduMonth: '',
  locationName: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  mapsLink: '',
  isOnline: false,
  liveUrl: '',
  significance: '',
  significanceHi: '',
  rituals: '',
  ritualsHi: '',
  pujaVidhi: '',
  pujaVidhiHi: '',
  fastingInfo: '',
  fastingInfoHi: '',
  crowdLevel: '',
  bestTimeToVisit: '',
  templeSlug: '',
  templeName: '',
  deitySlug: '',
  deityName: '',
  relatedDevotionalSlugs: '',
  image: '',
  imageCard: '',
  imageHero: '',
  galleryImages: '',
  videoUrl: '',
  status: 'draft',
  featured: false,
  priority: 0,
  verified: false,
  source: 'admin',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
}

export default function AdminEventsPage() {
  const [rows, setRows] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [editing, setEditing] = useState<EventRow | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [toast, setToast] = useState('')

  const debouncedSearch = useDebouncedValue(search)
  const debouncedCity = useDebouncedValue(cityFilter)

  useEffect(() => { fetchEvents() }, [page, pageSize, debouncedSearch, statusFilter, categoryFilter, debouncedCity])
  useEffect(() => { setPage(1) }, [pageSize, debouncedSearch, statusFilter, categoryFilter, debouncedCity])

  async function fetchEvents() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (statusFilter) params.set('status', statusFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      if (debouncedCity) params.set('city', debouncedCity)
      const res = await fetch(`/api/admin/events?${params.toString()}`, { credentials: 'include', cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        setRows(items)
        setTotal(Number(data.total || items.length || 0))
        setHasMore(Boolean(data.hasMore))
      }
    } finally {
      setLoading(false)
    }
  }

  async function importExisting() {
    setImporting(true)
    setToast('Importing existing public events...')
    setImportResult(null)
    try {
      const res = await fetch('/api/admin/events/import-existing', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data: ImportResult = await res.json().catch(() => ({
        ok: false,
        error: `Import request failed with HTTP ${res.status}`,
        imported: 0,
        skipped: 0,
        failed: 0,
        errors: [],
      }))
      setImportResult(data)
      if (res.ok) {
        setToast(`Import complete: ${data.imported || 0} imported, ${data.skipped || 0} skipped, ${data.failed || 0} failed.`)
        await fetchEvents()
      } else {
        setToast(data.error || `Import failed with HTTP ${res.status}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import request failed'
      setImportResult({ ok: false, error: message, imported: 0, skipped: 0, failed: 0, errors: [{ reason: message }] })
      setToast(message)
    } finally {
      setImporting(false)
    }
  }

  function startEdit(row?: EventRow) {
    const next = row ? {
      ...emptyForm,
      ...row,
      rituals: Array.isArray(row.rituals) ? row.rituals.join('\n') : '',
      ritualsHi: Array.isArray(row.ritualsHi) ? row.ritualsHi.join('\n') : '',
      relatedDevotionalSlugs: Array.isArray(row.relatedDevotionalSlugs) ? row.relatedDevotionalSlugs.join('\n') : '',
      galleryImages: Array.isArray(row.galleryImages) ? row.galleryImages.join('\n') : '',
    } : { ...emptyForm }
    setEditing(row || null)
    setForm(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveEvent(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      priority: Number(form.priority || 0),
      rituals: String(form.rituals || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
      ritualsHi: String(form.ritualsHi || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
      relatedDevotionalSlugs: String(form.relatedDevotionalSlugs || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
      galleryImages: String(form.galleryImages || '').split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean),
      image: form.image || form.imageCard || form.imageHero,
    }
    const url = editing?._id ? `/api/admin/events/${editing._id}` : '/api/admin/events'
    const res = await fetch(url, {
      method: editing?._id ? 'PUT' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setToast(editing ? 'Event updated' : 'Event created')
      setEditing(null)
      setForm(emptyForm)
      await fetchEvents()
    } else {
      const error = await res.json().catch(() => ({}))
      setToast(error.error || 'Save failed')
    }
    setSaving(false)
  }

  async function updateRow(row: EventRow, update: Record<string, any>) {
    const res = await fetch(`/api/admin/events/${row._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...row, ...update }),
    })
    if (res.ok) fetchEvents()
  }

  async function archiveRow(row: EventRow) {
    if (!confirm('Archive this event? It will no longer be public.')) return
    const res = await fetch(`/api/admin/events/${row._id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) fetchEvents()
  }

  const filtered = rows

  const stats = {
    total: rows.length,
    published: rows.filter((r) => r.status === 'published').length,
    drafts: rows.filter((r) => r.status === 'draft').length,
    featured: rows.filter((r) => r.featured).length,
    upcoming: rows.filter((r) => (r.startDate || r.date) >= new Date().toISOString().slice(0, 10)).length,
    past: rows.filter((r) => (r.endDate || r.startDate || r.date) < new Date().toISOString().slice(0, 10)).length,
  }
  const categories = Array.from(new Set(rows.map((r) => r.category).filter(Boolean))).sort()

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-section-subtitle">Manage public festivals, temple events, yatras, vrats and live programs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={importExisting}
            disabled={importing}
            className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {importing ? 'Importing...' : 'Import Existing Public Events'}
          </button>
          <button onClick={() => startEdit()} className="admin-btn admin-btn-primary px-4 py-2 text-sm">Create Event</button>
        </div>
      </div>

      {toast && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{toast}</div>}

      {importResult && (
        <div className={`rounded-xl border p-4 text-sm ${importResult.error || (importResult.failed || 0) > 0 ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          <div className="flex flex-wrap gap-4 font-semibold">
            <span>Imported: {importResult.imported || 0}</span>
            <span>Skipped: {importResult.skipped || 0}</span>
            <span>Failed: {importResult.failed || 0}</span>
            {typeof importResult.sourceCount === 'number' && <span>Source: {importResult.sourceCount}</span>}
          </div>
          {importResult.error && <p className="mt-2">{importResult.error}</p>}
          {!!importResult.errors?.length && (
            <div className="mt-3 max-h-44 overflow-auto rounded-lg bg-white/70 p-3">
              {importResult.errors.slice(0, 20).map((item, index) => (
                <p key={`${item.slug || item.title || 'event'}-${index}`} className="mb-1 last:mb-0">
                  <span className="font-semibold">{item.title || item.slug || `Event ${index + 1}`}:</span> {item.reason}
                </p>
              ))}
              {importResult.errors.length > 20 && <p className="mt-2 font-semibold">Showing first 20 errors.</p>}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="admin-card p-4">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs capitalize text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {(editing || form !== emptyForm) && (
        <form onSubmit={saveEvent} className="admin-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="admin-section-title">{editing ? 'Edit Event' : 'Create Event'}</h2>
            <button type="button" onClick={() => { setEditing(null); setForm(emptyForm) }} className="admin-btn admin-btn-ghost">Close</button>
          </div>

          <Section title="Basic Information">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Input label="Hindi Title" value={form.titleHi} onChange={(v) => setForm({ ...form, titleHi: v })} />
            <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <Input label="Event Type" value={form.eventType} onChange={(v) => setForm({ ...form, eventType: v })} />
            <Textarea label="Short Description" value={form.shortDescription} onChange={(v) => setForm({ ...form, shortDescription: v })} />
            <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          </Section>

          <Section title="Date & Time">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
            <Input label="Start Time" value={form.startTime} onChange={(v) => setForm({ ...form, startTime: v })} />
            <Input label="End Time" value={form.endTime} onChange={(v) => setForm({ ...form, endTime: v })} />
            <Input label="Timezone" value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} />
            <Input label="Recurrence" value={form.recurrence} onChange={(v) => setForm({ ...form, recurrence: v })} />
            <Input label="Tithi" value={form.tithi} onChange={(v) => setForm({ ...form, tithi: v })} />
            <Input label="Paksha" value={form.paksha} onChange={(v) => setForm({ ...form, paksha: v })} />
            <Input label="Hindu Month" value={form.hinduMonth} onChange={(v) => setForm({ ...form, hinduMonth: v })} />
          </Section>

          <Section title="Location">
            <Input label="Location Name" value={form.locationName} onChange={(v) => setForm({ ...form, locationName: v })} />
            <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Input label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
            <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Input label="Maps Link" value={form.mapsLink} onChange={(v) => setForm({ ...form, mapsLink: v })} />
            <Input label="Live URL" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v, isOnline: Boolean(v) })} />
          </Section>

          <Section title="Spiritual Details">
            <Textarea label="Significance" value={form.significance} onChange={(v) => setForm({ ...form, significance: v })} />
            <Textarea label="Rituals" value={form.rituals} onChange={(v) => setForm({ ...form, rituals: v })} />
            <Textarea label="Puja Vidhi" value={form.pujaVidhi} onChange={(v) => setForm({ ...form, pujaVidhi: v })} />
            <Textarea label="Fasting Info" value={form.fastingInfo} onChange={(v) => setForm({ ...form, fastingInfo: v })} />
            <Input label="Crowd Level" value={form.crowdLevel} onChange={(v) => setForm({ ...form, crowdLevel: v })} />
            <Input label="Best Time To Visit" value={form.bestTimeToVisit} onChange={(v) => setForm({ ...form, bestTimeToVisit: v })} />
          </Section>

          <Section title="Associations">
            <Input label="Temple Slug" value={form.templeSlug} onChange={(v) => setForm({ ...form, templeSlug: v })} />
            <Input label="Temple Name" value={form.templeName} onChange={(v) => setForm({ ...form, templeName: v })} />
            <Input label="Deity Slug" value={form.deitySlug} onChange={(v) => setForm({ ...form, deitySlug: v })} />
            <Input label="Deity Name" value={form.deityName} onChange={(v) => setForm({ ...form, deityName: v })} />
            <Textarea label="Related Devotional Slugs" value={form.relatedDevotionalSlugs} onChange={(v) => setForm({ ...form, relatedDevotionalSlugs: v })} />
          </Section>

          <Section title="Media">
            <div className="md:col-span-2"><ImageUpload label="Event/Card Image" value={form.imageCard} onChange={(url) => setForm({ ...form, imageCard: url, image: form.image || url })} folder="sarvdev/events/cards" guidance="general" /></div>
            <div className="md:col-span-2"><ImageUpload label="Hero Image" value={form.imageHero} onChange={(url) => setForm({ ...form, imageHero: url, image: form.image || url })} folder="sarvdev/events/heroes" guidance="hero" /></div>
            <Textarea label="Gallery Images" value={form.galleryImages} onChange={(v) => setForm({ ...form, galleryImages: v })} />
            <Input label="Video URL" value={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} />
          </Section>

          <Section title="Display Control">
            <Input label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
            <Input label="Priority" type="number" value={String(form.priority)} onChange={(v) => setForm({ ...form, priority: Number(v) })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> Verified</label>
          </Section>

          <Section title="SEO">
            <Input label="Meta Title" value={form.metaTitle} onChange={(v) => setForm({ ...form, metaTitle: v })} />
            <Textarea label="Meta Description" value={form.metaDescription} onChange={(v) => setForm({ ...form, metaDescription: v })} />
            <Input label="Meta Keywords" value={form.metaKeywords} onChange={(v) => setForm({ ...form, metaKeywords: v })} />
            <Input label="OG Image" value={form.ogImage} onChange={(v) => setForm({ ...form, ogImage: v })} />
          </Section>

          <button disabled={saving} className="admin-btn admin-btn-primary px-6 py-2.5">{saving ? 'Saving...' : 'Save Event'}</button>
        </form>
      )}

      <div className="admin-filter-bar">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, temple, deity..." className="admin-input" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input"><option value="">All Status</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-input"><option value="">All Categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <input value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} placeholder="City/state..." className="admin-input" />
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead><tr><th>Title</th><th>Date</th><th>Category</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading...</td></tr> : filtered.map((row) => (
                <tr key={row._id}>
                  <td><p className="font-medium text-gray-900">{row.title}</p><p className="text-xs text-gray-400">{row.city || row.locationName || row.location}</p></td>
                  <td>{row.startDate || row.date || '-'}</td>
                  <td>{row.category}</td>
                  <td><span className={row.status === 'published' ? 'admin-badge-green' : row.status === 'draft' ? 'admin-badge-yellow' : 'admin-badge-red'}>{row.status}</span></td>
                  <td>{row.featured ? 'Yes' : 'No'}</td>
                  <td><div className="flex flex-wrap gap-1.5">
                    <button onClick={() => startEdit(row)} className="admin-btn admin-btn-ghost">Edit</button>
                    <button onClick={() => updateRow(row, { status: row.status === 'published' ? 'draft' : 'published' })} className="admin-btn admin-btn-success">{row.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={() => updateRow(row, { featured: !row.featured })} className="admin-btn admin-btn-primary">{row.featured ? 'Unfeature' : 'Feature'}</button>
                    <button onClick={() => archiveRow(row)} className="admin-btn admin-btn-danger">Archive</button>
                  </div></td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No events found.</td></tr>}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="admin-section-title mb-3">{title}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div></section>
}

function Input({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-gray-600">{label}<input required={required} type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="admin-input w-full mt-1" /></label>
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-medium text-gray-600 md:col-span-2">{label}<textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3} className="admin-input w-full mt-1" /></label>
}
