"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { SPIRITUAL_ICON_CATEGORIES } from '../../../data/spiritual-icon-categories'
import type { SpiritualIconRecord } from '../../../lib/spiritual-icons'
import AdminPagination from '@/components/admin/AdminPagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type FilterKey = 'all' | 'active' | 'draft' | 'inactive' | 'featured' | 'verified'

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
    total: rows.length,
    active: rows.filter((row) => row.status === 'active').length,
    featured: rows.filter((row) => row.featured).length,
    verified: rows.filter((row) => row.verified).length,
    inactiveDraft: rows.filter((row) => row.status !== 'active').length,
  }), [rows])

  const states = useMemo(() => Array.from(new Set(rows.map((row) => row.state).filter(Boolean) as string[])).sort(), [rows])

  const filtered = rows

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
          <p className="admin-section-subtitle">Manage Katha Vachaks, Bhajan Gayaks, Pandits, gurus, scholars, and dharmic leaders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      <div className="admin-filter-bar space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${filter === item.key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{item.label}</button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_12rem]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, category, state, specialization..." className="admin-input" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-input">
            <option value="">All Categories</option>
            {SPIRITUAL_ICON_CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="admin-input">
            <option value="">All States</option>
            {states.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id || row.slug}>
                  <td>
                    <p className="font-semibold text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.title || row.nameHi}</p>
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
                      <Link href={`/admin/spiritual-icons/${row._id}/edit`} className="admin-btn admin-btn-ghost text-xs">Edit</Link>
                      <button disabled={savingId === row._id} onClick={() => updateIcon(row, { featured: !row.featured })} className="admin-btn admin-btn-ghost text-xs disabled:opacity-50">{row.featured ? 'Unfeature' : 'Feature'}</button>
                      <button disabled={savingId === row._id} onClick={() => updateIcon(row, { verified: !row.verified })} className="admin-btn admin-btn-success text-xs disabled:opacity-50">{row.verified ? 'Unverify' : 'Verify'}</button>
                      <button disabled={savingId === row._id} onClick={() => updateIcon(row, { status: row.status === 'active' ? 'draft' : 'active' })} className="admin-btn admin-btn-ghost text-xs disabled:opacity-50">{row.status === 'active' ? 'Draft' : 'Activate'}</button>
                      <button disabled={savingId === row._id} onClick={() => disable(row)} className="admin-btn admin-btn-danger text-xs disabled:opacity-50">Disable</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No spiritual icons match the current filters.</td></tr>}
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
