"use client"

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TempleGridSkeleton } from '../../components/Skeleton'
import { getTemplesForSacredCategory, SHAKTI_PEETH_CATEGORY } from '../../data/shakti-peethas'
import { SACRED_CATEGORIES, getAllCategoryNames } from '../../lib/sacred-categories'
import { getTempleCardImage } from '../../lib/temple-image'
import SarvdevImage from '../../components/SarvdevImage'

type Temple = {
  _id: string
  slug?: string
  title: string
  name?: string
  location?: string
  description?: string
  image?: string
  timings?: string
  contact?: string
  deity?: string
  state?: string
  district?: string
  country?: string
  type?: string
  status?: string
  categories?: string[]
  sacredCategories?: string[]
  sacredCategory?: string
  templeType?: string
  templeTypes?: string[]
  verified?: string
  city?: string
  speciality?: string
  createdAt?: string
}

const ITEMS_PER_PAGE = 20

const allCategoryNames = getAllCategoryNames()

// Quick filter chips
const QUICK_CHIPS = [
  { label: 'All', value: 'all' },
  { label: 'Shiva', value: 'Shiva' },
  { label: 'Shakti', value: 'Shakti' },
  { label: 'Vishnu', value: 'Vishnu' },
  { label: 'Krishna', value: 'Krishna' },
  { label: 'Ganesha', value: 'Ganesha' },
  { label: 'Hanuman', value: 'Hanuman' },
  { label: 'Jain', value: 'Jain' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Pushkar', value: 'Pushkar' },
  { label: 'Jyotirlinga', value: 'Jyotirlinga' },
  { label: 'Shakti Peeth', value: 'Shakti Peeth' },
  { label: 'Char Dham', value: 'Char Dham' },
  { label: 'Divya Desam', value: 'Divya Desam' },
]

// Popular sacred circuits for section 6A
const POPULAR_CIRCUITS: { name: string; slug: string; icon: string; count: string }[] = [
  { name: '12 Jyotirlinga', slug: 'jyotirlinga', icon: '🕉️', count: '12' },
  { name: '52 Shakti Peethas', slug: 'shakti-peeth', icon: '🔱', count: '52' },
  { name: 'Char Dham', slug: 'char-dham', icon: '🏔️', count: '4' },
  { name: 'Chota Char Dham', slug: 'chota-char-dham', icon: '⛰️', count: '4' },
  { name: 'Panch Kedar', slug: 'panch-kedar', icon: '🏔️', count: '5' },
  { name: 'Divya Desam', slug: 'divya-desam', icon: '🪷', count: '108' },
  { name: 'Ashta Vinayak', slug: 'ashta-vinayak', icon: '🐘', count: '8' },
  { name: 'Navagraha', slug: 'navagraha', icon: '🌟', count: '9' },
  { name: 'Pancha Bhoota Stalam', slug: 'pancha-bhoota-stalam', icon: '🔥', count: '5' },
]

// State directory for section 6D
const STATES_DIRECTORY = [
  'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'Maharashtra',
  'Uttarakhand', 'Gujarat', 'Karnataka', 'Kerala',
  'Odisha', 'Assam', 'West Bengal', 'Madhya Pradesh',
]

// Normalize categories: support old sacredCategory string + new sacredCategories array + categories array
function getTempleCategories(t: Temple): string[] {
  const cats: string[] = []
  if (t.categories) cats.push(...t.categories)
  if (t.sacredCategories) cats.push(...t.sacredCategories)
  if (t.sacredCategory && typeof t.sacredCategory === 'string') cats.push(t.sacredCategory)
  return [...new Set(cats)]
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function TemplesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templeGridRef = useRef<HTMLDivElement>(null)
  const [temples, setTemples] = useState<Temple[]>([])
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeChip, setActiveChip] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTemples, setTotalTemples] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterState, setFilterState] = useState('')
  const [filterDeity, setFilterDeity] = useState('')
  const [filterVerified, setFilterVerified] = useState(false)
  const [filterHasImage, setFilterHasImage] = useState(false)
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
    const ctrl = new AbortController()
    async function fetchTemples() {
      try {
        setLoading(true)
        setError('')
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
        })
        const searchParts = [searchQuery.trim(), activeChip !== 'all' ? activeChip : ''].filter(Boolean)
        if (searchParts.length > 0) params.set('search', searchParts.join(' '))
        if (selectedCategory !== 'all') params.set('category', selectedCategory)
        if (filterState) params.set('state', filterState)
        if (filterDeity) params.set('deity', filterDeity)

        const res = await fetch(`/api/temples?${params.toString()}`, { signal: ctrl.signal })
        if (!res.ok) {
          setError('Failed to fetch temples')
          return
        }
        const payload = await res.json()
        const data = Array.isArray(payload) ? payload : (payload.data || payload.items || [])
        setTemples(data)
        setFilteredTemples(data)
        setTotalTemples(Number(payload.total || data.length || 0))
        setHasMore(Boolean(payload.hasMore))
      } catch (err: any) {
        if (err?.name === 'AbortError') return
        console.error('Failed to fetch temples:', err)
        setError('Network error. Please try again.')
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }
    fetchTemples()
    return () => ctrl.abort()
  }, [selectedCategory, activeChip, searchQuery, filterState, filterDeity, currentPage])

  useEffect(() => {
    let result = temples
    if (filterVerified) result = result.filter(tp => tp.verified === 'verified')
    if (filterHasImage) result = result.filter(tp => tp.image && tp.image.trim() !== '')
    setFilteredTemples(result)
  }, [temples, filterVerified, filterHasImage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, activeChip, searchQuery, filterState, filterDeity, filterVerified, filterHasImage])

  // Compute derived data
  const uniqueStates = useMemo(() => {
    const s = new Set(temples.map(t => t.state).filter(Boolean) as string[])
    return Array.from(s).sort()
  }, [temples])

  const uniqueDeities = useMemo(() => {
    const d = new Set(temples.map(t => t.deity).filter(Boolean) as string[])
    return Array.from(d).sort()
  }, [temples])

  const recentTemples = useMemo(() => {
    return [...temples]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8)
  }, [temples])

  const rajasthanTemples = useMemo(() => {
    return temples.filter(t => t.state?.toLowerCase() === 'rajasthan').slice(0, 8)
  }, [temples])

  // Category counts
  const categoryTempleCount = useMemo(() => {
    const map: Record<string, number> = {}
    for (const cat of SACRED_CATEGORIES) {
      if (cat.name === SHAKTI_PEETH_CATEGORY) {
        map[cat.slug] = getTemplesForSacredCategory(temples, cat.name).length
      } else {
        map[cat.slug] = temples.filter(t => getTempleCategories(t).includes(cat.name)).length
      }
    }
    return map
  }, [temples])

  const totalCategories = SACRED_CATEGORIES.filter(c => c.isActive).length

  function handleChipClick(value: string) {
    if (value === 'all') {
      setActiveChip('all')
      setSelectedCategory('all')
    } else {
      setActiveChip(value)
      setSelectedCategory('all')
    }
  }

  // ─── Loading State ───
  if (loading) {
    return (
      <>
        <section className="sacred-hero relative">
          <div className="sacred-hero-content page-container py-16 md:py-24">
            <div className="h-8 bg-white/10 rounded w-80 mb-4 animate-pulse" />
            <div className="h-5 bg-white/10 rounded w-96 mb-8 animate-pulse" />
            <div className="h-12 bg-white/10 rounded-xl w-full max-w-2xl animate-pulse" />
          </div>
        </section>
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

  const totalPages = Math.max(1, Math.ceil(totalTemples / ITEMS_PER_PAGE))
  const visiblePages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return (
    <>
      {/* ═══════════════════════════ 1. HERO SECTION ═══════════════════════════ */}
      <section className="sacred-hero relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-primary/[0.06] rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] left-[15%] w-48 h-48 bg-accent/[0.05] rounded-full blur-[60px]" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </div>
        <div className="sacred-hero-content page-container py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-cinzel text-overline uppercase tracking-[0.2em] text-temple-gold-light">
              Sacred Directory
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-temple-gold-DEFAULT/40 to-transparent max-w-[80px]" />
          </div>
          <h1 className="text-display-lg font-display text-white leading-tight text-shadow-divine">
            Explore Sacred Temples
          </h1>
          <p className="mt-3 text-body text-sandstone-300 max-w-2xl">
            Discover Hindu, Jain, Buddhist and spiritual temples across India and the world.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{totalTemples}</span>
              <span className="text-sm text-sandstone-400">Temples</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{totalCategories}</span>
              <span className="text-sm text-sandstone-400">Sacred Categories</span>
            </div>
          </div>

          {/* Hero Search */}
          <div className="mt-8 max-w-2xl relative" ref={searchRef}>
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-1 focus-within:border-primary/50 transition-colors">
              <svg className="w-5 h-5 text-sandstone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true) }}
                onFocus={() => { if (searchQuery.trim()) setShowDropdown(true) }}
                placeholder="Search by name, city, state, deity, sacred category..."
                className="flex-1 bg-transparent border-none outline-none text-body text-white px-3 py-3 placeholder:text-sandstone-500"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowDropdown(false) }}
                  className="p-1.5 rounded-full text-sandstone-400 hover:text-white transition-colors"
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
              <div className="absolute z-50 mt-3 w-full bg-white rounded-2xl shadow-xl max-h-96 overflow-y-auto border border-gray-100">
                {filteredTemples.length > 0 ? (
                  <div className="py-2">
                    <div className="px-5 py-2 text-overline text-primary-600 uppercase tracking-wider">
                      Temples ({filteredTemples.length})
                    </div>
                    {filteredTemples.slice(0, 8).map((temple) => {
                      const slug = temple.slug || generateSlug(temple.title)
                      return (
                        <button
                          key={temple._id}
                          onClick={() => { setShowDropdown(false); setSearchQuery(''); router.push(`/temples/${slug}`) }}
                          className="w-full text-left px-5 py-3 hover:bg-primary-50/50 transition-all duration-200 flex items-center gap-3 group"
                        >
                          <SarvdevImage
                            image={getTempleCardImage(temple)}
                            alt=""
                            className="w-11 h-11 rounded-xl flex-shrink-0 shadow-sm"
                            imgClassName="object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-body-sm font-medium text-ink truncate group-hover:text-primary-700 transition-colors">{temple.title}</div>
                            <div className="text-caption text-ink-muted truncate">
                              {[temple.city || temple.location, temple.state, temple.deity].filter(Boolean).join(' · ')}
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

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#sacred-categories" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-600 transition-colors no-underline">
              Explore Sacred Categories
            </Link>
            <Link href="/list-temple" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20 no-underline">
              List a Temple
            </Link>
            <Link href="/temples/pilgrimage" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20 no-underline">
              View Pilgrimage Circuits
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 3. QUICK FILTER CHIPS ═══════════════════════════ */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="page-container py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip.value}
                onClick={() => handleChipClick(chip.value)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeChip === chip.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ 4. SACRED CATEGORIES ═══════════════════════════ */}
      <section id="sacred-categories" className="section-sm bg-gray-50">
        <div className="page-container">
          <h2 className="section-title">Sacred Categories</h2>
          <p className="section-subtitle mb-8">Explore all sacred temple groupings — {totalCategories} categories across India</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SACRED_CATEGORIES.filter(c => c.isActive).slice(0, 16).map((cat) => {
              const count = categoryTempleCount[cat.slug] || 0
              return (
                <div key={cat.slug} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                      {cat.deity}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink leading-snug">{cat.name}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{cat.nameHi}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{cat.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-ink-muted">
                      {count > 0 ? `${count} temple${count !== 1 ? 's' : ''}` : 'Coming soon'}
                    </span>
                    {count > 0 ? (
                      <Link
                        href={`/temples?category=${encodeURIComponent(cat.name)}`}
                        className="text-xs font-semibold text-primary hover:text-primary-700 no-underline"
                      >
                        View &rarr;
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">0 temples</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/sacred-categories"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors no-underline hover:no-underline"
            >
              Explore all sacred categories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 5. HIGHLIGHTED TEMPLES ═══════════════════════════ */}
      <section className="section-sm bg-white">
        <div className="page-container">
          <h2 className="section-title">Highlighted Temples</h2>
          <p className="section-subtitle mb-8">Discover the most revered sacred destinations</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {temples.slice(0, 8).map((temple) => {
              const slug = temple.slug || generateSlug(temple.title)
              const cats = getTempleCategories(temple)
              return (
                <article key={temple._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group flex flex-col">
                  <div className="relative h-44 overflow-hidden">
                    <SarvdevImage
                      image={getTempleCardImage(temple)}
                      alt={temple.title}
                      className="absolute inset-0"
                      imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors leading-snug">{temple.title}</h3>
                    <p className="text-xs text-ink-muted mt-1">
                      {[temple.city, temple.state].filter(Boolean).join(', ') || temple.location}
                    </p>
                    {temple.deity && (
                      <p className="text-xs text-primary-600 font-medium mt-1">{temple.deity}</p>
                    )}
                    {cats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cats.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100 truncate max-w-[140px]">{c}</span>
                        ))}
                      </div>
                    )}
                    {temple.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{temple.description}</p>
                    )}
                    <Link
                      href={`/temples/${slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-700 no-underline"
                    >
                      View Details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 6A. POPULAR SACRED CIRCUITS ═══════════════════════════ */}
      <section className="section-sm bg-gray-50">
        <div className="page-container">
          <h2 className="section-title">Popular Sacred Circuits</h2>
          <p className="section-subtitle mb-8">Explore India&apos;s most revered pilgrimage circuits</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {POPULAR_CIRCUITS.map(circuit => (
              <Link
                key={circuit.slug}
                href={`/temples/pilgrimage/${circuit.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md hover:border-primary/20 transition-all duration-200 no-underline"
              >
                <span className="text-3xl block mb-2">{circuit.icon}</span>
                <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors">{circuit.name}</h3>
                <p className="text-xs text-ink-muted mt-1">{circuit.count} sacred sites</p>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/temples/pilgrimage"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors no-underline hover:no-underline"
            >
              View all pilgrimage circuits
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 6B. RECENTLY ADDED ═══════════════════════════ */}
      {recentTemples.length > 0 && (
        <section className="section-sm bg-white">
          <div className="page-container">
            <h2 className="section-title">Recently Added Temples</h2>
            <p className="section-subtitle mb-8">The latest temples added to our directory</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentTemples.map((temple) => {
                const slug = temple.slug || generateSlug(temple.title)
                return (
                  <Link key={temple._id} href={`/temples/${slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 no-underline">
                    <div className="relative h-36 overflow-hidden">
                      <SarvdevImage
                        image={getTempleCardImage(temple)}
                        alt={temple.title}
                        className="absolute inset-0"
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors leading-snug truncate">{temple.title}</h3>
                      <p className="text-xs text-ink-muted mt-1 truncate">{[temple.city, temple.state].filter(Boolean).join(', ')}</p>
                      {temple.deity && <p className="text-xs text-primary-600 font-medium mt-1">{temple.deity}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════ 6C. RAJASTHAN TEMPLES ═══════════════════════════ */}
      {rajasthanTemples.length > 0 && (
        <section className="section-sm bg-gray-50">
          <div className="page-container">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <div>
                <h2 className="section-title">Temples of Rajasthan</h2>
                <p className="section-subtitle">Sacred temples from the land of kings</p>
              </div>
              <Link
                href="/temples/state/rajasthan"
                className="shrink-0 text-sm font-semibold text-primary hover:text-primary-700 no-underline"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {rajasthanTemples.map((temple) => {
                const slug = temple.slug || generateSlug(temple.title)
                return (
                  <Link key={temple._id} href={`/temples/${slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 no-underline">
                    <div className="relative h-36 overflow-hidden">
                      <SarvdevImage
                        image={getTempleCardImage(temple)}
                        alt={temple.title}
                        className="absolute inset-0"
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors leading-snug truncate">{temple.title}</h3>
                      <p className="text-xs text-ink-muted mt-1 truncate">{[temple.city, 'Rajasthan'].filter(Boolean).join(', ')}</p>
                      {temple.deity && <p className="text-xs text-primary-600 font-medium mt-1">{temple.deity}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════ 6D. TEMPLE DIRECTORY BY STATE ═══════════════════════════ */}
      <section className="section-sm bg-white">
        <div className="page-container">
          <h2 className="section-title">Temple Directory by State</h2>
          <p className="section-subtitle mb-8">Browse temples across major Indian states</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STATES_DIRECTORY.map(state => {
              const stateSlug = state.toLowerCase().replace(/\s+/g, '-')
              const count = temples.filter(t => t.state?.toLowerCase() === state.toLowerCase()).length
              return (
                <Link
                  key={state}
                  href={`/temples/state/${stateSlug}`}
                  className="group bg-gray-50 hover:bg-primary-50 rounded-xl p-4 text-center transition-colors duration-200 border border-gray-100 hover:border-primary/20 no-underline"
                >
                  <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors">{state}</h3>
                  <p className="text-xs text-ink-muted mt-1">{count} temple{count !== 1 ? 's' : ''}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 7. ADVANCED FILTERS + TEMPLE LISTING ═══════════════════════════ */}
      <main className="page-container py-12" ref={templeGridRef}>

        {/* Advanced Filters Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            Advanced Filters
          </button>

          {showAdvancedFilters && (
            <div className="mt-4 bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sacred Category */}
                <div>
                  <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 block">Sacred Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  >
                    <option value="all">All Categories</option>
                    {allCategoryNames.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 block">State</label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  >
                    <option value="">All States</option>
                    {uniqueStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Deity */}
                <div>
                  <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 block">Deity</label>
                  <select
                    value={filterDeity}
                    onChange={(e) => setFilterDeity(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  >
                    <option value="">All Deities</option>
                    {uniqueDeities.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-ink">Verified only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filterHasImage} onChange={(e) => setFilterHasImage(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-ink">Has image</span>
                  </label>
                </div>
              </div>

              {/* Clear all filters */}
              {(selectedCategory !== 'all' || filterState || filterDeity || filterVerified || filterHasImage) && (
                <button
                  onClick={() => { setSelectedCategory('all'); setFilterState(''); setFilterDeity(''); setFilterVerified(false); setFilterHasImage(false); setActiveChip('all') }}
                  className="mt-4 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active filter indicator */}
        {(selectedCategory !== 'all' || activeChip !== 'all' || filterState || filterDeity || filterVerified || filterHasImage) && (
          <div className="mb-6 flex items-center justify-between gap-4 p-3 rounded-xl bg-primary-50/50 border border-primary/10">
            <p className="text-sm text-ink">
              Showing <span className="font-bold text-primary-600">{filteredTemples.length}</span> of <span className="font-bold text-primary-600">{totalTemples}</span> temple{totalTemples !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && <> in <span className="font-semibold">{selectedCategory}</span></>}
              {activeChip !== 'all' && <> matching <span className="font-semibold">{activeChip}</span></>}
              {filterState && <> in <span className="font-semibold">{filterState}</span></>}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setActiveChip('all'); setFilterState(''); setFilterDeity(''); setFilterVerified(false); setFilterHasImage(false); setSearchQuery('') }}
              className="text-sm font-medium text-primary hover:text-primary-700 shrink-0"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ═══════════════════════════ 8. TEMPLE LISTING CARDS ═══════════════════════════ */}
        <section>
          {filteredTemples.length === 0 ? (
            /* ═══════════════════════════ 9. EMPTY STATE ═══════════════════════════ */
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🕉️</div>
              <h3 className="text-xl font-semibold text-ink mb-2">No temples found</h3>
              <p className="text-sm text-ink-muted mb-6">Try another search or category</p>
              <Link
                href="/list-temple"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-600 transition-colors no-underline"
              >
                List a Temple
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredTemples
                  .map((temple) => {
                    const slug = temple.slug || generateSlug(temple.title)
                    const cats = getTempleCategories(temple)
                    return (
                      <article key={temple._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group flex flex-col">
                        <div className="relative h-40 overflow-hidden">
                          <SarvdevImage
                            image={getTempleCardImage(temple)}
                            alt={temple.title}
                            className="absolute inset-0"
                            imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {temple.verified === 'verified' && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Verified</span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors leading-snug">{temple.title}</h3>
                          <p className="text-xs text-ink-muted mt-1">
                            {[temple.city, temple.state].filter(Boolean).join(', ') || temple.location}
                          </p>
                          {/* Badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {temple.deity && (
                              <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{temple.deity}</span>
                            )}
                            {temple.state && (
                              <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">{temple.state}</span>
                            )}
                            {cats.slice(0, 1).map(c => (
                              <span key={c} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100 truncate max-w-[120px]">{c}</span>
                            ))}
                          </div>
                          {temple.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{temple.description}</p>
                          )}
                          <Link
                            href={`/temples/${slug}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-700 no-underline"
                          >
                            View Details
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                          </Link>
                        </div>
                      </article>
                    )
                  })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl px-2 py-1.5 shadow-sm">
                    <button
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 text-ink transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    {visiblePages.map((page) => {
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                              page === currentPage
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-ink hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      }
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gray-400 px-1">···</span>
                      }
                      return null
                    })}

                    <button
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      disabled={!hasMore && currentPage >= totalPages}
                      className="px-3 py-2 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 text-ink transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs text-ink-muted">
                    Showing <span className="font-semibold text-ink">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTemples)}-{Math.min((currentPage - 1) * ITEMS_PER_PAGE + filteredTemples.length, totalTemples)}</span> of <span className="font-semibold text-ink">{totalTemples}</span> temples
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* ═══════════════════════════ 12. SEO INTERNAL LINKS ═══════════════════════════ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="page-container py-10">
          <h2 className="text-sm font-semibold text-ink mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/temples/pilgrimage" className="text-xs text-ink-muted hover:text-primary transition-colors no-underline">Pilgrimage Circuits</Link>
            <Link href="/sacred-categories" className="text-xs text-ink-muted hover:text-primary transition-colors no-underline">Sacred Categories</Link>
            <Link href="/list-temple" className="text-xs text-ink-muted hover:text-primary transition-colors no-underline">List a Temple</Link>
            <Link href="/deities" className="text-xs text-ink-muted hover:text-primary transition-colors no-underline">Deities</Link>
            <Link href="/panchang" className="text-xs text-ink-muted hover:text-primary transition-colors no-underline">Panchang</Link>
          </div>
        </div>
      </section>
    </>
  )
}
