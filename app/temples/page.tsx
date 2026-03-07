"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TempleCard from '../../components/TempleCard'
import HomeCategoryShowcase from '../../components/HomeCategoryShowcase'
import TempleGalleryMosaic from '../../components/TempleGalleryMosaic'
import { useTranslation } from '../../lib/translation'
import Hero from '../../components/Hero'
import { TempleGridSkeleton } from '../../components/Skeleton'

type Temple = {
  _id: string
  title: string
  location?: string
  description?: string
  image?: string
  timings?: string
  contact?: string
  deity?: string
  state?: string
  type?: string
  status?: string
  categories?: string[]

  city?: string
  speciality?: string
}

const ITEMS_PER_PAGE = 20

const sacredCategories = [
  "Dwadash Jyotirlinga (12 Jyotirlingas)",
  "Shakti Peeth (51 Shakti Peethas)",
  "Char Dham",
  "Chota Char Dham (Uttarakhand)",
  "Panch Kedar",
  "Panch Prayag",
  "Arupadai Veedu (6 Abodes of Murugan)",
  "Navagraha Temples",
  "Divya Desam (108 Vishnu Temples)",
  "Pancha Bhoota Stalam",
  "Ashta Vinayak",
  "Sapta Puri (7 Sacred Cities)",
  "108 Shiva Temples",
  "Other Sacred Group"
]

export default function TemplesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [temples, setTemples] = useState<Temple[]>([])
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    async function fetchTemples() {
      try {
        const res = await fetch('/api/temples')
        if (res.ok) {
          const data = await res.json()
          console.log('Fetched temples:', data) // Debug log
          // Only show approved temples
          const approved = data.filter((t: Temple) => t.status === 'approved')
          setTemples(approved)
          setFilteredTemples(approved)
        } else {
          setError('Failed to fetch temples')
        }
      } catch (error) {
        console.error('Failed to fetch temples:', error)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTemples()
  }, [])

  useEffect(() => {
    let result = temples

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(t => 
        t.categories && t.categories.includes(selectedCategory)
      )
    }

    // Filter by search query — split into words, every word must match somewhere
    if (searchQuery.trim()) {
      const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
      result = result.filter(t => {
        const text = [
          t.title, t.location, t.deity, t.state, t.description,
          t.city, t.speciality, ...(t.categories || [])
        ].filter(Boolean).join(' ').toLowerCase()
        return words.every(w => text.includes(w))
      })
    }

    setFilteredTemples(result)
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, temples])

  if (loading) {
    return (
      <>
        <Hero title={t('temples.title')} subtitle={t('temples.subtitle')} />
        <main className="page-container section-sm">
          <TempleGridSkeleton count={8} />
        </main>
      </>
    )
  }

  if (error) {
    return (
      <main className="page-container section-sm">
        <div className="text-center text-semantic-error">{error}</div>
      </main>
    )
  }

  return (
    <>
      <Hero title={t('temples.title')} subtitle={t('temples.subtitle')} />

      {/* Search Bar */}
      <div className="bg-surface-sunken border-b border-surface-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative" ref={searchRef}>
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true) }}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true) }}
              placeholder="Search temples by name, location, deity..."
              className="input pl-12 pr-10 py-3 w-full text-body rounded-full shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowDropdown(false) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute z-50 mt-2 w-full card shadow-dropdown max-h-96 overflow-y-auto">
                {filteredTemples.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1.5 text-overline text-primary-600 uppercase tracking-wider">
                      Temples ({filteredTemples.length})
                    </div>
                    {filteredTemples.slice(0, 8).map((temple) => {
                      const slug = temple.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      return (
                        <button
                          key={temple._id}
                          onClick={() => { setShowDropdown(false); setSearchQuery(''); router.push(`/temples/${slug}`) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-surface-sunken transition-colors flex items-center gap-3"
                        >
                          {temple.image && (
                            <img src={temple.image} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-body-sm font-medium text-ink truncate">{temple.title}</div>
                            <div className="text-caption text-ink-muted truncate">
                              {[temple.location || temple.deity, temple.state].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                    {filteredTemples.length > 8 && (
                      <div className="px-4 py-2 text-caption text-ink-muted border-t border-surface-border">
                        +{filteredTemples.length - 8} more results below
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-ink-muted text-body-sm">
                    No temples found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sacred Category Showcase — 3 random categories per refresh */}
      <HomeCategoryShowcase />

      {/* Highlighted Temples Mosaic */}
      <TempleGalleryMosaic />

      <main className="page-container py-12">

      {/* Category Filter */}
      <div className="mb-8 bg-background rounded-lg p-4 shadow-md border border-accent">
        <label className="block text-sm font-semibold text-text mb-3">
          🔍 Filter by Sacred Category:
        </label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input"
        >
          <option value="all">All Temples ({temples.length})</option>
          {sacredCategories.map(category => {
            const count = temples.filter(t => t.categories?.includes(category)).length
            if (count > 0) {
              return (
                <option key={category} value={category}>
                  {category} ({count})
                </option>
              )
            }
            return null
          })}
        </select>
        
        {selectedCategory !== 'all' && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-body-sm text-ink-muted">
              Showing {filteredTemples.length} temple{filteredTemples.length !== 1 ? 's' : ''} in <span className="font-medium text-primary-600">{selectedCategory}</span>
            </p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="btn btn-ghost btn-sm"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      <section>
        {filteredTemples.length === 0 ? (
          <div className="text-center py-12 text-ink-muted">
            {selectedCategory === 'all' 
              ? t('temples.noTemples')
              : `No temples found in ${selectedCategory}`
            }
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemples
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((t: Temple) => {
                  const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  return (
                    <TempleCard key={t._id} temple={{ id: t._id, title: t.title, location: t.location || '', description: t.description || '', image: t.image, slug: slug }} />
                  )
                })}
            </div>

            {/* Pagination */}
            {filteredTemples.length > ITEMS_PER_PAGE && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.ceil(filteredTemples.length / ITEMS_PER_PAGE) }).map((_, i) => {
                  const page = i + 1
                  const totalPages = Math.ceil(filteredTemples.length / ITEMS_PER_PAGE)
                  // Show first, last, current, and neighbors
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className={`w-9 h-9 rounded-btn text-body-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-primary text-white'
                            : 'bg-surface-sunken text-ink hover:bg-surface-border'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-ink-muted px-1">...</span>
                  }
                  return null
                })}

                <button
                  onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredTemples.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage >= Math.ceil(filteredTemples.length / ITEMS_PER_PAGE)}
                  className="btn btn-outline btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            <p className="text-center text-caption text-ink-muted mt-4">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTemples.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTemples.length)} of {filteredTemples.length} temples
            </p>
          </>
        )}
      </section>
      </main>
    </>
  )
}
