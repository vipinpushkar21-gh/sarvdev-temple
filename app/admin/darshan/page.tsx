"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type DarshanRow = {
  _id: string
  title: string
  titleHi?: string
  temple?: string
  templeName?: string
  deity?: string
  city?: string
  state?: string
  location?: string
  thumbnail?: string
  imageCard?: string
  imageHero?: string
  videoUrl?: string
  youtubeUrl?: string
  youtubeId?: string
  darshanType?: 'live' | 'recorded' | 'upcoming'
  type?: 'live' | 'recorded' | 'upcoming'
  isLive?: boolean
  isFeatured?: boolean
  featured?: boolean
  priority?: number
  status?: 'active' | 'inactive' | 'draft' | 'approved' | 'pending' | 'rejected'
  darshanDate?: string
  startTime?: string
  endTime?: string
  time?: string
  date?: string
}

type FilterKey = 'all' | 'live' | 'recorded' | 'upcoming' | 'featured' | 'active' | 'draft'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'recorded', label: 'Recorded' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'featured', label: 'Featured' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
]

export default function AdminDarshanPage() {
  const [rows, setRows] = useState<DarshanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [deityFilter, setDeityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => { fetchDarshans() }, [])

  async function fetchDarshans() {
    setLoading(true)
    try {
      const res = await fetch('/api/darshan?admin=1', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setRows(Array.isArray(data) ? data : data.items || [])
      } else {
        setMessage({ type: 'error', text: 'Unable to load darshan records.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error while loading darshan records.' })
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = rows.length
    const live = rows.filter((row) => getKind(row) === 'live').length
    const recorded = rows.filter((row) => getKind(row) === 'recorded').length
    const featured = rows.filter((row) => isFeatured(row)).length
    const inactiveDraft = rows.filter((row) => !isActive(row)).length
    return { total, live, recorded, featured, inactiveDraft }
  }, [rows])

  const deities = useMemo(() => unique(rows.map((row) => row.deity).filter(Boolean) as string[]), [rows])
  const states = useMemo(() => unique(rows.map((row) => row.state).filter(Boolean) as string[]), [rows])

  const filtered = useMemo(() => {
    const q = normalize(search)
    return rows.filter((row) => {
      if (filter === 'live' && getKind(row) !== 'live') return false
      if (filter === 'recorded' && getKind(row) !== 'recorded') return false
      if (filter === 'upcoming' && getKind(row) !== 'upcoming') return false
      if (filter === 'featured' && !isFeatured(row)) return false
      if (filter === 'active' && !isActive(row)) return false
      if (filter === 'draft' && row.status !== 'draft') return false
      if (deityFilter && row.deity !== deityFilter) return false
      if (stateFilter && row.state !== stateFilter) return false
      if (q && !normalize([row.title, row.titleHi, getTempleName(row), row.deity, row.city, row.state, row.location].filter(Boolean).join(' ')).includes(q)) return false
      return true
    })
  }, [deityFilter, filter, rows, search, stateFilter])

  async function updateDarshan(row: DarshanRow, patch: Partial<DarshanRow>) {
    setSavingId(row._id)
    setMessage(null)
    try {
      const res = await fetch('/api/darshan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row._id, ...row, ...patch }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Update failed.' })
        return
      }
      setRows((current) => current.map((item) => item._id === row._id ? data : item))
      setMessage({ type: 'success', text: 'Darshan updated.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error while updating darshan.' })
    } finally {
      setSavingId(null)
    }
  }

  async function remove(row: DarshanRow) {
    if (!confirm(`Delete "${row.title}"? This removes the darshan record but does not delete any external video.`)) return
    setSavingId(row._id)
    try {
      const res = await fetch('/api/darshan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row._id }),
      })
      if (!res.ok) {
        setMessage({ type: 'error', text: 'Delete failed.' })
        return
      }
      setRows((current) => current.filter((item) => item._id !== row._id))
      setMessage({ type: 'success', text: 'Darshan deleted.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error while deleting darshan.' })
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-100" />
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Daily Darshan</h1>
          <p className="admin-section-subtitle">Manage every stream, image, schedule, and status used on /daily-darshan.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/daily-darshan" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">View Public Page</Link>
          <Link href="/admin/darshan/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">New Darshan</Link>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Darshan" value={stats.total} />
        <StatCard label="Live" value={stats.live} tone="red" />
        <StatCard label="Recorded" value={stats.recorded} tone="blue" />
        <StatCard label="Featured" value={stats.featured} tone="orange" />
        <StatCard label="Inactive / Draft" value={stats.inactiveDraft} tone="gray" />
      </div>

      <div className="admin-filter-bar space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${filter === item.key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, temple, deity, city or state..."
            className="admin-input"
          />
          <select value={deityFilter} onChange={(e) => setDeityFilter(e.target.value)} className="admin-input">
            <option value="">All Deities</option>
            {deities.map((deity) => <option key={deity} value={deity}>{deity}</option>)}
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
                <th>Darshan</th>
                <th>Temple / Place</th>
                <th>Type</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id}>
                  <td>
                    <div className="min-w-[15rem]">
                      <p className="font-semibold text-gray-900">{row.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {isFeatured(row) && <span className="admin-badge-orange">Featured</span>}
                        {row.isLive && <span className="admin-badge-red">Live Now</span>}
                        {row.deity && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{row.deity}</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium text-gray-700">{getTempleName(row) || '-'}</p>
                    <p className="text-xs text-gray-400">{[row.city, row.state].filter(Boolean).join(', ') || row.location || '-'}</p>
                  </td>
                  <td><span className={getKind(row) === 'live' ? 'admin-badge-red' : getKind(row) === 'upcoming' ? 'admin-badge-yellow' : 'admin-badge-green'}>{getKind(row)}</span></td>
                  <td className="text-gray-500">
                    <p>{row.darshanDate || row.date || '-'}</p>
                    <p className="text-xs">{[row.startTime || row.time, row.endTime].filter(Boolean).join(' - ')}</p>
                  </td>
                  <td><StatusBadge status={row.status} /></td>
                  <td className="text-gray-500">{row.priority ?? 999}</td>
                  <td className="text-xs text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span>{row.youtubeId || row.youtubeUrl ? 'YouTube ready' : row.videoUrl ? 'Video URL' : 'No video'}</span>
                      <span>{row.imageHero || row.imageCard || row.thumbnail ? 'Image ready' : 'No image'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex min-w-[16rem] flex-wrap gap-1.5">
                      <Link href={`/admin/darshan/${row._id}/edit`} className="admin-btn admin-btn-ghost text-xs">Edit</Link>
                      <button
                        type="button"
                        disabled={savingId === row._id}
                        onClick={() => updateDarshan(row, { isFeatured: !isFeatured(row), featured: !isFeatured(row) })}
                        className="admin-btn admin-btn-ghost text-xs disabled:opacity-50"
                      >
                        {isFeatured(row) ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        type="button"
                        disabled={savingId === row._id}
                        onClick={() => updateDarshan(row, { status: isActive(row) ? 'draft' : 'active' })}
                        className="admin-btn admin-btn-success text-xs disabled:opacity-50"
                      >
                        {isActive(row) ? 'Draft' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        disabled={savingId === row._id}
                        onClick={() => remove(row)}
                        className="admin-btn admin-btn-danger text-xs disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    No darshan records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone = 'orange' }: { label: string; value: number; tone?: 'orange' | 'red' | 'blue' | 'gray' }) {
  const tones = {
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
    red: 'border-red-100 bg-red-50 text-red-700',
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

function StatusBadge({ status }: { status?: DarshanRow['status'] }) {
  if (status === 'active' || status === 'approved') return <span className="admin-badge-green">{status}</span>
  if (status === 'draft' || status === 'pending') return <span className="admin-badge-yellow">{status}</span>
  return <span className="admin-badge-red">{status || 'inactive'}</span>
}

function getKind(row: DarshanRow) {
  if (row.darshanType) return row.darshanType
  if (row.type) return row.type
  if (row.isLive) return 'live'
  if (row.darshanDate && new Date(row.darshanDate).getTime() > Date.now()) return 'upcoming'
  return 'recorded'
}

function getTempleName(row: DarshanRow) {
  return row.templeName || row.temple || ''
}

function isFeatured(row: DarshanRow) {
  return Boolean(row.isFeatured ?? row.featured)
}

function isActive(row: DarshanRow) {
  return row.status === 'active' || row.status === 'approved'
}

function normalize(value: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}
