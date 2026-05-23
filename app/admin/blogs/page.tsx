"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SarvdevImage from '../../../components/SarvdevImage'
import { getBlogCardImage } from '../../../lib/temple-image'
import { formatBlogDate, getBlogExcerpt, getBlogPath, listToCsv, normalizeStringList } from '../../../lib/blog-utils'

type BlogRow = {
  _id: string
  title: string
  titleHi?: string
  slug?: string
  excerpt?: string
  category?: string
  tags?: string[] | string
  author?: string
  authorRole?: string
  image?: string
  imageCard?: string
  imageHero?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived' | 'approved' | 'pending' | 'rejected'
  date?: string
  publishedAt?: string
  createdAt?: string
  readingTime?: number
}

type SeedResponse = {
  ok?: boolean
  imported?: number
  skipped?: number
  failed?: number
  errors?: { title?: string; slug?: string; reason: string }[]
  error?: string
}

const PER_PAGE = 25

function canonicalStatus(status?: string) {
  if (status === 'approved') return 'published'
  if (status === 'pending') return 'draft'
  if (status === 'rejected') return 'archived'
  return status || 'draft'
}

export default function AdminBlogsPage() {
  const [rows, setRows] = useState<BlogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [seedResult, setSeedResult] = useState<string>('')
  const [seeding, setSeeding] = useState(false)

  useEffect(() => { fetchBlogs() }, [])

  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blogs?admin=1', { cache: 'no-store' })
      if (res.ok) setRows(await res.json())
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => Array.from(new Set(rows.map((row) => row.category).filter(Boolean))) as string[], [rows])
  const authors = useMemo(() => Array.from(new Set(rows.map((row) => row.author).filter(Boolean))) as string[], [rows])
  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((row) => canonicalStatus(row.status) === 'published').length,
    drafts: rows.filter((row) => canonicalStatus(row.status) === 'draft').length,
    featured: rows.filter((row) => row.featured).length,
    archived: rows.filter((row) => canonicalStatus(row.status) === 'archived').length,
  }), [rows])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter((row) => {
      const haystack = [row.title, row.titleHi, row.excerpt, row.category, listToCsv(row.tags), row.author].filter(Boolean).join(' ').toLowerCase()
      if (q && !haystack.includes(q)) return false
      if (statusFilter && canonicalStatus(row.status) !== statusFilter) return false
      if (categoryFilter && row.category !== categoryFilter) return false
      if (featuredFilter === 'featured' && !row.featured) return false
      if (featuredFilter === 'not-featured' && row.featured) return false
      if (authorFilter && row.author !== authorFilter) return false
      return true
    })
  }, [rows, search, statusFilter, categoryFilter, featuredFilter, authorFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(() => { setPage(1) }, [search, statusFilter, categoryFilter, featuredFilter, authorFilter])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    selected.size === paginated.length ? setSelected(new Set()) : setSelected(new Set(paginated.map((row) => row._id)))
  }

  async function updateBlog(id: string, update: Partial<BlogRow>) {
    const current = rows.find((row) => row._id === id)
    if (!current) return
    const res = await fetch('/api/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...current, ...update }),
    })
    if (res.ok) {
      const saved = await res.json()
      setRows((items) => items.map((item) => item._id === id ? saved : item))
    }
  }

  async function bulkUpdate(update: Partial<BlogRow>, label: string) {
    if (selected.size === 0) return
    if (!confirm(`${label} ${selected.size} selected blog posts?`)) return
    for (const id of selected) await updateBlog(id, update)
    setSelected(new Set())
  }

  async function seedSamples() {
    if (!confirm('Import 20 safe sample blog drafts? Existing slugs will be skipped.')) return
    setSeeding(true)
    setSeedResult('')
    try {
      const res = await fetch('/api/admin/blogs/seed-samples', {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      const data = await res.json().catch(() => ({} as SeedResponse)) as SeedResponse
      if (!res.ok) {
        const firstError = data.errors?.[0]?.reason
        setSeedResult(data.error || firstError || `Seed failed with HTTP ${res.status}`)
        return
      }
      const errorPreview = data.errors?.length ? ` First error: ${data.errors[0].slug || data.errors[0].title || 'sample'} - ${data.errors[0].reason}` : ''
      setSeedResult(`Imported ${data.imported || 0}, skipped ${data.skipped || 0}, failed ${data.failed || 0}.${errorPreview}`)
      await fetchBlogs()
    } catch (error) {
      setSeedResult(error instanceof Error ? error.message : 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="admin-page-title">Blogs</h1>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p className="admin-section-subtitle">Manage the public Sarvdev Blog editorial experience.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={seedSamples} disabled={seeding} className="admin-btn admin-btn-ghost px-4 py-2 text-sm disabled:opacity-60">{seeding ? 'Importing...' : 'Seed Sample Drafts'}</button>
          <Link href="/blog" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">View Public Blog</Link>
          <Link href="/admin/blogs/new" className="admin-btn admin-btn-primary px-4 py-2 text-sm">New Blog</Link>
        </div>
      </div>

      {seedResult && <div className="admin-card px-5 py-3 text-sm font-semibold text-orange-800">{seedResult}</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <AdminStat label="Total" value={stats.total} />
        <AdminStat label="Published" value={stats.published} />
        <AdminStat label="Drafts" value={stats.drafts} />
        <AdminStat label="Featured" value={stats.featured} />
        <AdminStat label="Archived" value={stats.archived} />
      </div>

      <div className="admin-filter-bar space-y-3">
        <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, excerpt, category, author..." className="admin-input w-full" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-input">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="admin-input">
            <option value="">All Categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value)} className="admin-input">
            <option value="">All Featured States</option>
            <option value="featured">Featured</option>
            <option value="not-featured">Not Featured</option>
          </select>
          <select value={authorFilter} onChange={(event) => setAuthorFilter(event.target.value)} className="admin-input">
            <option value="">All Authors</option>
            {authors.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-card flex flex-wrap items-center gap-3 px-5 py-3" style={{ background: '#FFF7ED', borderColor: 'rgba(234,88,12,0.15)' }}>
          <span className="admin-badge-orange">{selected.size} selected</span>
          <button onClick={() => bulkUpdate({ status: 'published' }, 'Publish')} className="admin-btn admin-btn-success">Publish</button>
          <button onClick={() => bulkUpdate({ status: 'draft' }, 'Move to draft')} className="admin-btn admin-btn-ghost">Draft</button>
          <button onClick={() => bulkUpdate({ status: 'archived' }, 'Archive')} className="admin-btn admin-btn-danger">Archive</button>
          <button onClick={() => setSelected(new Set())} className="admin-btn admin-btn-ghost">Clear</button>
        </div>
      )}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} /></th>
              <th>Article</th>
              <th>Category</th>
              <th>Status</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row._id} className={selected.has(row._id) ? 'bg-orange-50/40' : ''}>
                <td><input type="checkbox" checked={selected.has(row._id)} onChange={() => toggleSelect(row._id)} /></td>
                <td>
                  <div className="flex min-w-[280px] gap-3">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <SarvdevImage image={getBlogCardImage(row)} alt={row.title} className="absolute inset-0" imgClassName="object-cover" renderMode="auto" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">{row.title}</p>
                      {row.titleHi && <p className="font-devanagari text-xs font-semibold text-orange-700 line-clamp-1">{row.titleHi}</p>}
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">{getBlogExcerpt(row)}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{row.readingTime || 3} min read / {row.author || 'Sarvdev Editorial'} / {normalizeStringList(row.tags).slice(0, 3).join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="text-gray-600">{row.category || 'Editorial'}</td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span className={canonicalStatus(row.status) === 'published' ? 'admin-badge-green' : canonicalStatus(row.status) === 'draft' ? 'admin-badge-yellow' : 'admin-badge-red'}>{canonicalStatus(row.status)}</span>
                    {row.featured && <span className="admin-badge-orange">Featured</span>}
                  </div>
                </td>
                <td className="text-gray-500">{formatBlogDate(row) || 'Not set'}</td>
                <td>
                  <div className="flex flex-wrap gap-1.5">
                    <Link href={`/admin/blogs/${row._id}/edit`} className="admin-btn admin-btn-ghost text-xs">Edit</Link>
                    <Link href={getBlogPath(row)} target="_blank" className="admin-btn admin-btn-ghost text-xs">View</Link>
                    <button onClick={() => updateBlog(row._id, { status: canonicalStatus(row.status) === 'published' ? 'draft' : 'published' })} className="admin-btn admin-btn-success text-xs">
                      {canonicalStatus(row.status) === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => updateBlog(row._id, { featured: !row.featured })} className="admin-btn admin-btn-ghost text-xs">
                      {row.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    {canonicalStatus(row.status) !== 'archived' && (
                      <button onClick={() => updateBlog(row._id, { status: 'archived' })} className="admin-btn admin-btn-danger text-xs">Archive</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No blog posts found.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="admin-btn admin-btn-ghost disabled:opacity-40">Prev</button>
            <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="admin-btn admin-btn-ghost disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
    </div>
  )
}
