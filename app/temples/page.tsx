"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const templeGridRef = useRef<HTMLDivElement>(null)
  const [temples, setTemples] = useState<Temple[]>([])
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedDeity, setSelectedDeity] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const searchRef = useRef<HTMLDivElement>(null)

  // Read ?category= param from URL and apply filter
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setSelectedCategory(cat)
      setTimeout(() => {
        templeGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 600)
    }
  }, [searchParams])

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

  // Derive unique states and deities from loaded temples
  const allStates = Array.from(new Set(temples.map(t => t.state).filter(Boolean))).sort() as string[]
  const allDeities = Array.from(new Set(temples.map(t => t.deity).filter(Boolean))).sort() as string[]

  const activeFilters = [selectedCategory !== 'all', selectedState !== 'all', selectedDeity !== 'all'].filter(Boolean).length

  const clearAllFilters = () => { setSelectedCategory('all'); setSelectedState('all'); setSelectedDeity('all') }

  useEffect(() => {
    let result = temples

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.categories && t.categories.includes(selectedCategory))
    }
    if (selectedState !== 'all') {
      result = result.filter(t => t.state === selectedState)
    }
    if (selectedDeity !== 'all') {
      result = result.filter(t => t.deity === selectedDeity)
    }
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
  }, [selectedCategory, selectedState, selectedDeity, searchQuery, temples])

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

      {/* Search Bar — Glassmorphic */}
      <div className="relative bg-mesh-warm border-b border-surface-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative" ref={searchRef}>
            <div className="search-glass flex items-center px-5 py-1">
              <svg className="w-5 h-5 text-ink-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true) }}
                onFocus={() => { if (searchQuery.trim()) setShowDropdown(true) }}
                placeholder="Search temples by name, location, deity..."
                className="flex-1 bg-transparent border-none outline-none text-body text-ink px-3 py-3 placeholder:text-ink-faint"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowDropdown(false) }}
                  className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute z-50 mt-3 w-full glass-card-2030 shadow-dropdown max-h-96 overflow-y-auto">
                {filteredTemples.length > 0 ? (
                  <div className="py-2">
                    <div className="px-5 py-2 text-overline text-primary-600 uppercase tracking-wider">
                      Temples ({filteredTemples.length})
                    </div>
                    {filteredTemples.slice(0, 8).map((temple) => {
                      const slug = temple.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      return (
                        <button
                          key={temple._id}
                          onClick={() => { setShowDropdown(false); setSearchQuery(''); router.push(`/temples/${slug}`) }}
                          className="w-full text-left px-5 py-3 hover:bg-primary-50/50 transition-all duration-200 flex items-center gap-3 group"
                        >
                          {temple.image && (
                            <img src={temple.image} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-body-sm font-medium text-ink truncate group-hover:text-primary-700 transition-colors">{temple.title}</div>
                            <div className="text-caption text-ink-muted truncate">
                              {[temple.location || temple.deity, temple.state].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-ink-faint group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      )
                    })}
                    {filteredTemples.length > 8 && (
                      <div className="px-5 py-2.5 text-caption text-ink-muted border-t border-surface-border">
                        +{filteredTemples.length - 8} more results below
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-ink-muted text-body-sm">
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

      {/* Filters — Bento Style */}
      <div ref={templeGridRef} className="bento-card mb-10 p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="bento-icon w-10 h-10 text-base">🔍</div>
            <div>
              <p className="text-body-sm font-semibold text-ink">Filter Temples</p>
              <p className="text-caption text-ink-muted">Category, State, Deity se filter karo</p>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={clearAllFilters} className="btn btn-ghost btn-sm gap-1.5 text-red-500 hover:text-red-700">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All ({activeFilters})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label className="block text-caption font-medium text-ink-muted mb-1.5">Sacred Category</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="input rounded-xl w-full">
              <option value="all">All Categories ({temples.length})</option>
              {sacredCategories.map(category => {
                const count = temples.filter(t => t.categories?.includes(category)).length
                return count > 0 ? <option key={category} value={category}>{category} ({count})</option> : null
              })}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-caption font-medium text-ink-muted mb-1.5">State</label>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="input rounded-xl w-full">
              <option value="all">All States</option>
              {allStates.map(s => (
                <option key={s} value={s}>{s} ({temples.filter(t => t.state === s).length})</option>
              ))}
            </select>
          </div>

          {/* Deity */}
          <div>
            <label className="block text-caption font-medium text-ink-muted mb-1.5">Deity</label>
            <select value={selectedDeity} onChange={e => setSelectedDeity(e.target.value)} className="input rounded-xl w-full">
              <option value="all">All Deities</option>
              {allDeities.map(d => (
                <option key={d} value={d}>{d} ({temples.filter(t => t.deity === d).length})</option>
              ))}
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(255,153,51,0.06), rgba(255,215,0,0.04))' }}>
            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            <p className="text-body-sm text-ink">
              <span className="font-bold text-primary-600">{filteredTemples.length}</span> temple{filteredTemples.length !== 1 ? 's' : ''} found
              {selectedCategory !== 'all' && <span className="text-ink-muted"> in <span className="font-medium text-secondary-600">{selectedCategory}</span></span>}
              {selectedState !== 'all' && <span className="text-ink-muted">, <span className="font-medium text-secondary-600">{selectedState}</span></span>}
              {selectedDeity !== 'all' && <span className="text-ink-muted">, deity: <span className="font-medium text-secondary-600">{selectedDeity}</span></span>}
            </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger-children">
              {filteredTemples
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((t: Temple) => {
                  const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  return (
                    <TempleCard key={t._id} temple={{ id: t._id, title: t.title, location: t.location || '', description: t.description || '', image: t.image, slug: slug }} />
                  )
                })}
            </div>

            {/* Pagination — Modern 2030 */}
            {filteredTemples.length > ITEMS_PER_PAGE && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="floating-bar-2030 flex items-center gap-1 px-2 py-1.5">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-sunken text-ink"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.ceil(filteredTemples.length / ITEMS_PER_PAGE) }).map((_, i) => {
                    const page = i + 1
                    const totalPages = Math.ceil(filteredTemples.length / ITEMS_PER_PAGE)
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className={`w-10 h-10 rounded-xl text-body-sm font-semibold transition-all duration-300 ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md shadow-primary/25'
                              : 'text-ink hover:bg-surface-sunken'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-ink-faint px-1">···</span>
                    }
                    return null
                  })}

                  <button
                    onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredTemples.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={currentPage >= Math.ceil(filteredTemples.length / ITEMS_PER_PAGE)}
                    className="px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-sunken text-ink"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                <p className="text-caption text-ink-muted">
                  Showing <span className="font-semibold text-ink">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTemples.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTemples.length)}</span> of <span className="font-semibold text-ink">{filteredTemples.length}</span> temples
                </p>
              </div>
            )}
          </>
        )}
      </section>
      </main>
    </>
  )
}
