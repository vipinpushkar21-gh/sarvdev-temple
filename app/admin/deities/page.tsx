"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DEITY_CATEGORIES } from "@/app/deities/page"
import SarvdevImage from "@/components/SarvdevImage"
import { getDeityCardImage } from "@/lib/temple-image"

export default function AdminDeitiesPage() {
  const router = useRouter()
  const [deities, setDeities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchDeities()
  }, [])

  async function fetchDeities() {
    try {
      const response = await fetch('/api/deities')
      const dbDeities = await response.json()
      
      // Create map of database deities by name
      const dbDeityMap = new Map<string, any>()
      dbDeities.forEach((deity: any) => {
        dbDeityMap.set(deity.name.toLowerCase(), deity)
      })
      
      // Combine static deities with database deities
      const allDeities: any[] = []
      const orderMap = new Map<string, number>()
      const addedIds = new Set<string>() // Track added IDs to prevent duplicates
      let orderIndex = 0
      
      DEITY_CATEGORIES.forEach((category: any) => {
        category.deities.forEach((deity: any) => {
          orderMap.set(deity.name.toLowerCase(), orderIndex)
          
          // If deity exists in database, use database version, otherwise use static
          const dbDeity = dbDeityMap.get(deity.name.toLowerCase())
          const deityToAdd = dbDeity || {
            ...deity,
            _id: deity.slug, // Use slug as ID for static deities
            status: 'static', // Mark as static
            category: category.title,
            createdAt: null,
          }
          
          // Use slug if available, otherwise use _id as unique identifier
          const uniqueId = deityToAdd.slug || deityToAdd._id
          
          // Only add if not already added (prevent duplicates)
          if (!addedIds.has(uniqueId)) {
            allDeities.push(deityToAdd)
            addedIds.add(uniqueId)
          }
          orderIndex++
        })
      })
      
      // Sort deities according to static data order
      const sortedDeities = allDeities.sort((a, b) => {
        const orderA = orderMap.get(a.name.toLowerCase()) ?? Infinity
        const orderB = orderMap.get(b.name.toLowerCase()) ?? Infinity
        return orderA - orderB
      })
      
      setDeities(sortedDeities)
    } catch (error) {
      console.error('Failed to fetch deities:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this deity?')) return

    try {
      await fetch('/api/deities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchDeities()
    } catch (error) {
      console.error('Failed to delete deity:', error)
    }
  }

  async function handleSeedDeities() {
    if (!confirm('This will add/update all static deities to the database. Continue?')) return

    try {
      setLoading(true)
      
      // Flatten all deities from categories
      const allDeities = DEITY_CATEGORIES.flatMap((category: any) =>
        category.deities.map((deity: any) => ({
          ...deity,
          category: category.title,
        }))
      )

      const response = await fetch('/api/admin/seed-deities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deities: allDeities }),
      })
      const result = await response.json()
      
      if (result.success) {
        alert(`Successfully processed ${result.results.length} deities`)
        fetchDeities()
      } else {
        alert('Failed to seed deities')
      }
    } catch (error) {
      console.error('Failed to seed deities:', error)
      alert('Failed to seed deities')
    } finally {
      setLoading(false)
    }
  }

  const filteredDeities = useMemo(() => {
    const filtered = deities.filter(deity => {
      const matchesSearch = 
        deity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deity.nameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deity.category && deity.category.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === "all" || deity.status === statusFilter
      const matchesCategory = categoryFilter === "all" || deity.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
    
    // Deduplicate by both slug and name to ensure uniqueness
    const seenSlugs = new Set<string>()
    const seenNames = new Set<string>()
    return filtered.filter(deity => {
      const slugKey = deity.slug || deity._id || ''
      const nameKey = deity.name.toLowerCase()
      
      if (seenSlugs.has(slugKey) || seenNames.has(nameKey)) return false
      seenSlugs.add(slugKey)
      seenNames.add(nameKey)
      return true
    })
  }, [deities, searchTerm, statusFilter, categoryFilter])

  const categoryOptions = useMemo(() => Array.from(new Set(deities.map((deity) => deity.category).filter(Boolean))).sort(), [deities])
  const dbCount = deities.filter((deity) => deity.status !== 'static').length
  const imageReadyCount = deities.filter((deity) => deity.imageCard || deity.imageHero || deity.image).length

  if (loading) {
    return (
      <div className="admin-container section-sm">
        <div className="text-center py-20">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container section-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-sm font-serif text-secondary-800">Deities</h1>
          <p className="text-body text-ink-muted mt-1">Manage deity profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDeities}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-medium border border-primary-200 text-primary-700 hover:bg-primary-50 disabled:opacity-50"
          >
            Seed All Deities
          </button>
          <Link
            href="/admin/deities/new"
            className="btn-primary px-6 py-2.5 rounded-lg font-medium"
          >
            Add New Deity
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStat label="Total profiles" value={deities.length} />
        <AdminStat label="DB records" value={dbCount} />
        <AdminStat label="Image ready" value={imageReadyCount} />
        <AdminStat label="Categories" value={categoryOptions.length} />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search deities..."
            className="admin-input flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="admin-input md:w-56"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="admin-input md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Deities Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-sunken border-b border-surface-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Image</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Category</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Created</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-12 text-ink-muted">
                    No deities found
                  </td>
                </tr>
              ) : (
                filteredDeities.map((deity, index) => (
                  <tr key={`deity-row-${index}`} className="border-b border-surface-border hover:bg-surface-sunken/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                        <SarvdevImage
                          image={getDeityCardImage(deity)}
                          alt={deity.name}
                          className="absolute inset-0"
                          imgClassName="object-cover"
                          renderMode="auto"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-ink">{deity.name}</p>
                        <p className="text-sm text-ink-muted font-devanagari">{deity.nameHi}</p>
                        <p className="mt-1 text-[11px] font-semibold text-gray-400">
                          {deity.imageHero ? 'Hero image set' : deity.imageCard ? 'Card image set' : deity.image ? 'Legacy image set' : 'Fallback image'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-muted">{deity.category || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                        deity.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        deity.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {deity.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-muted">
                        {deity.createdAt ? new Date(deity.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/deities/${deity.slug}`}
                          target="_blank"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View
                        </Link>
                        {deity.status === 'static' ? (
                          <Link
                            href={`/admin/deities/new?slug=${deity.slug}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Add to DB
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/admin/deities/edit/${deity._id}`}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(deity._id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-950 tabular-nums">{value.toLocaleString('en-IN')}</p>
    </div>
  )
}
