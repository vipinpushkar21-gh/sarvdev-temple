"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import { CategoryGrid } from './components/CategoryGrid'
import { FULL_CATEGORIES, EXCLUDED_CATEGORY_IDS } from './components/categories'
import { SearchBar } from './components/SearchBar'
import { DevotionalCard } from './components/DevotionalCard'
import { renderBilingualTitle } from './utils/bilingual'
import BookmarkButton from '../../components/BookmarkButton'
// import DevotionalMosaic from './components/DevotionalMosaic'

/* ─── Helpers ─── */

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  let text = englishMatch ? englishMatch[1] : title
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  if (!slug || slug === '-' || slug === '') {
    const translitMap: { [key: string]: string } = {
      'श्री': 'shri', 'गणेश': 'ganesh', 'आरती': 'aarti',
      'चालीसा': 'chalisa', 'मंत्र': 'mantra', 'स्तोत्र': 'stotra', 'भजन': 'bhajan',
    }
    let transliterated = title.toLowerCase()
    for (const [dev, eng] of Object.entries(translitMap)) {
      transliterated = transliterated.replace(new RegExp(dev, 'g'), eng)
    }
    slug = transliterated.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }
  return slug || 'devotional'
}

function highlightText(text: string, term: string) {
  const t = term.trim()
  if (!t) return text
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((p, i) =>
    p.toLowerCase() === t.toLowerCase()
      ? <mark key={i} className="bg-primary-100 text-primary-900 rounded px-0.5">{p}</mark>
      : p
  )
}

const RECENT_STORAGE_KEY = 'sarvdev_recent_devotionals'

function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]')
  } catch { return [] }
}

/* ─── Types ─── */

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  duration?: string
  artist?: string
  status?: string
  type?: string
  createdAt?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
}

/* ─── Animation Variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.25, ease: [0.4, 0, 0.2, 1] } }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
}

/* ─── Section Header Component ─── */

function SectionHeader({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <div className="text-center mb-8">
      <h2 id={id} className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
      <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
    </div>
  )
}

/* ─── Main Page Component ─── */

export default function ClientPage() {
  const router = useRouter()
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [languageFilter, setLanguageFilter] = useState('all')
  const [deityFilter, setDeityFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'newest'>('az')
  const [visibleCount, setVisibleCount] = useState(12)
  const [activeQuickCategory, setActiveQuickCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const categorySectionRef = useRef<HTMLDivElement | null>(null)

  // Fetch devotionals
  useEffect(() => {
    async function fetchDevotionals() {
      try {
        const res = await fetch(`/api/devotionals`)
        if (res.ok) {
          const data = await res.json()
          setDevotionals(data.filter((d: Devotional) => d.status === 'approved'))
        }
      } catch (e) {
        console.error('Failed to fetch devotionals:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDevotionals()
  }, [])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200)
    return () => clearTimeout(t)
  }, [search])

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(12) }, [debouncedSearch, languageFilter, deityFilter, activeQuickCategory])

  /* ─── Derived Data ─── */

  const languages = useMemo(() => {
    const s = new Set<string>()
    devotionals.forEach((d) => { if (d.language) s.add(d.language) })
    return ['all', ...Array.from(s).sort()]
  }, [devotionals])

  const deities = useMemo(() => {
    const s = new Set<string>()
    devotionals.forEach((d) => { if (d.deity) s.add(d.deity) })
    return ['all', ...Array.from(s).sort()]
  }, [devotionals])

  const categoriesWithCounts = useMemo(() => {
    const base = FULL_CATEGORIES.filter((c) => !EXCLUDED_CATEGORY_IDS.has(c.id))
    return base.map((cat) => ({
      id: cat.id, label: cat.label, hindi: cat.hindi, emoji: cat.emoji,
      count: devotionals.filter((d) => {
        if (cat.id === 'Namavali') return d.category === 'Namavali' || d.category === '108 Namavali'
        return d.category === cat.id
      }).length,
    }))
  }, [devotionals])

  // Quick category pills (top 6 by count + "All")
  const quickCategories = useMemo(() => {
    const sorted = [...categoriesWithCounts].sort((a, b) => (b.count || 0) - (a.count || 0))
    return [{ id: 'all', label: 'All', emoji: '🕉️', count: devotionals.length }, ...sorted.slice(0, 7)]
  }, [categoriesWithCounts, devotionals.length])

  const filteredDevotionals = useMemo(() =>
    devotionals.filter((d) => {
      if (activeQuickCategory !== 'all') {
        if (activeQuickCategory === 'Namavali') {
          if (d.category !== 'Namavali' && d.category !== '108 Namavali') return false
        } else if (d.category !== activeQuickCategory) return false
      }
      if (languageFilter !== 'all' && d.language !== languageFilter) return false
      if (deityFilter !== 'all' && d.deity !== deityFilter) return false
      const term = debouncedSearch.trim().toLowerCase()
      if (term) {
        return d.title?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term) ||
          d.deity?.toLowerCase().includes(term) ||
          d.artist?.toLowerCase().includes(term) ||
          d.category?.toLowerCase().includes(term)
      }
      return true
    }),
    [devotionals, activeQuickCategory, languageFilter, deityFilter, debouncedSearch]
  )

  const sortedDevotionals = useMemo(() => {
    const arr = [...filteredDevotionals]
    if (sortOrder === 'newest') {
      arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    } else {
      arr.sort((a, b) => {
        const ta = (a.title || '').toLowerCase(), tb = (b.title || '').toLowerCase()
        return sortOrder === 'az' ? ta.localeCompare(tb) : tb.localeCompare(ta)
      })
    }
    return arr
  }, [filteredDevotionals, sortOrder])

  // Featured: top categories (Mantra, Chalisa, Aarti, Stotra) — shuffled each render
  const featured = useMemo(() => {
    const priority = new Set(['Mantra', 'Chalisa', 'Aarti', 'Namavali', '108 Namavali', 'Stotra'])
    const pool = devotionals.filter((d) => d.category && priority.has(d.category))
    return shuffleArray(pool).slice(0, 6)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devotionals, loading])

  // Recently added — shuffled each render
  const recentlyAdded = useMemo(() => {
    const sorted = [...devotionals].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    ).slice(0, 12)
    return shuffleArray(sorted).slice(0, 6)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devotionals, loading])

  // Personalized: based on recently viewed IDs from localStorage
  const [recommended, setRecommended] = useState<Devotional[]>([])
  useEffect(() => {
    if (devotionals.length === 0) return
    const recentIds = getRecentlyViewed()
    if (recentIds.length === 0) return
    // Find deities/categories from recently viewed
    const recentItems = devotionals.filter((d) => recentIds.includes(d._id))
    const favDeities = new Set(recentItems.map((d) => d.deity).filter(Boolean))
    const favCategories = new Set(recentItems.map((d) => d.category).filter(Boolean))
    // Recommend items matching those deities/categories, excluding already viewed
    const pool = devotionals
      .filter((d) => !recentIds.includes(d._id) && (favDeities.has(d.deity!) || favCategories.has(d.category!)))
    setRecommended(shuffleArray(pool).slice(0, 6))
  }, [devotionals])

  // Stats
  const totalCount = devotionals.length
  const categoryCount = categoriesWithCounts.filter((c) => (c.count || 0) > 0).length
  const deityCount = deities.length - 1 // exclude 'all'

  const isSearching = debouncedSearch.trim().length > 0
  const hasActiveFilters = languageFilter !== 'all' || deityFilter !== 'all' || activeQuickCategory !== 'all'

  const clearAllFilters = useCallback(() => {
    setSearch('')
    setLanguageFilter('all')
    setDeityFilter('all')
    setActiveQuickCategory('all')
    setSortOrder('az')
  }, [])

  /* ─── Loading State ─── */

  if (loading) {
    return (
      <>
        <LoadingHero />
        <main className="page-container section-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="devotional-card-2026 p-5">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-surface-sunken rounded-lg w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-surface-sunken rounded-full w-16" />
                    <div className="h-5 bg-surface-sunken rounded-full w-14" />
                    <div className="h-5 bg-surface-sunken rounded-full w-20" />
                  </div>
                  <div className="h-12 bg-surface-sunken rounded-lg w-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </>
    )
  }

  /* ─── Render Helpers ─── */

  function renderDevotionalCard(d: Devotional, opts?: { showFeatured?: boolean }) {
    const bt = renderBilingualTitle(d.title || '')
    const primary = highlightText(bt.primary, debouncedSearch)
    const secondary = showTransliteration && bt.secondary ? highlightText(bt.secondary, debouncedSearch) : null
    const titleNode = (
      <div className="flex flex-col">
        <span>{primary}</span>
        {secondary && <span className="text-ink-muted font-normal text-body-sm leading-tight mt-0.5">{secondary}</span>}
      </div>
    )
    const devSlug = createSlug(d.title || '')
    return (
      <div key={d._id} className="relative">
        <div className="absolute top-2 right-2 z-10">
          <BookmarkButton
            item={{
              id: d._id,
              type: 'devotional',
              title: bt.primary,
              slug: devSlug,
              subtitle: d.category || undefined,
            }}
            size="sm"
            className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
          />
        </div>
        <Link
          href={`/devotionals/${devSlug}`}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-2xl"
        >
          <DevotionalCard
            title={d.title || ''}
            titleNode={titleNode}
            category={d.category}
            language={d.language}
            type={d.type}
            deity={d.deity}
            description={d.description}
            descriptionNode={d.description ? highlightText(d.description, debouncedSearch) : undefined}
            hasAudio={!!d.audio}
            isFeatured={opts?.showFeatured}
          />
        </Link>
      </div>
    )
  }

  /* ─── Main Render ─── */

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          SECTION 1: Immersive Hero with Search & Stats
         ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/20 border-b border-surface-border">
        {/* Decorative mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[15%] w-72 h-72 bg-primary/[0.06] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-[5%] w-56 h-56 bg-accent/[0.05] rounded-full blur-[60px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/[0.02] rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-dots opacity-[0.02]" />
        </div>

        <div className="page-container py-14 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Title */}
            <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">
              Devotionals
            </h1>
            <p className="mt-3 text-body text-ink-muted max-w-2xl">
              Explore a sacred collection of mantras, bhajans, stotras, aartis, and more — curated for your daily spiritual practice.
            </p>
            <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />

            {/* Stats row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="stat-pill">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                {totalCount} Devotionals
              </span>
              <span className="stat-pill">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                {categoryCount} Categories
              </span>
              <span className="stat-pill">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                {deityCount} Deities
              </span>
            </div>

            {/* Hero search bar */}
            <div className="mt-8 max-w-2xl">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, deity, or category..."
                size="lg"
              />
            </div>

            {/* Quick scroll CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => categorySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary btn-sm"
              >
                Browse Categories
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
              </button>
              <button
                type="button"
                onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-outline btn-sm"
              >
                View All
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="min-h-screen">
        {/* ════════════════════════════════════════════════════════
            SECTION 2: Quick Category Pills (horizontal scroll)
           ════════════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-surface-border/50">
          <div className="page-container py-3">
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none" aria-label="Quick category filter">
              {quickCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="category-pill whitespace-nowrap flex-shrink-0"
                  data-active={activeQuickCategory === cat.id ? 'true' : 'false'}
                  onClick={() => setActiveQuickCategory(cat.id)}
                  aria-pressed={activeQuickCategory === cat.id}
                >
                  {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
                  {cat.label}
                  <span className="text-caption opacity-70 tabular-nums">{cat.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="page-container section-sm">

          {/* ════════════════════════════════════════════════════════
              SECTION 3: Search Results (when actively searching)
             ════════════════════════════════════════════════════════ */}
          {isSearching ? (
            <section className="mb-16 fade-up">
              <SectionHeader
                title={`Search Results`}
                subtitle={`${filteredDevotionals.length} result${filteredDevotionals.length !== 1 ? 's' : ''} for "${debouncedSearch}"`}
              />
              {filteredDevotionals.length === 0 ? (
                <EmptyState
                  message="No devotionals match your search."
                  action={<button type="button" onClick={() => setSearch('')} className="btn btn-outline btn-sm mt-4">Clear Search</button>}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sortedDevotionals.slice(0, visibleCount).map((d) => (
                      <div key={d._id} className="fade-up">
                        {renderDevotionalCard(d)}
                      </div>
                    ))}
                  </div>
                  <LoadMoreButton
                    visible={sortedDevotionals.length > visibleCount}
                    remaining={sortedDevotionals.length - visibleCount}
                    onClick={() => setVisibleCount((c) => c + 24)}
                  />
                </>
              )}
            </section>
          ) : (
            <>
              {/* ════════════════════════════════════════════════════════
                  SECTION 3: Browse by Category (full grid)
                 ════════════════════════════════════════════════════════ */}
              {activeQuickCategory === 'all' && (
                <section className="mb-16 section-mesh" id="categories" ref={categorySectionRef}>
                  <SectionHeader title="Browse by Category" subtitle="Explore devotionals organized by type" />
                  <div className="relative z-10 card p-6 sm:p-8">
                    <CategoryGrid categories={categoriesWithCounts} />
                  </div>
                </section>
              )}

              {/* ════════════════════════════════════════════════════════
                  SECTION 4a: Featured Devotionals (Mosaic)
                 ════════════════════════════════════════════════════════ */}
              {featured.length > 0 && activeQuickCategory === 'all' && (
                <section aria-labelledby="featured-heading" className="mb-16">
                  <SectionHeader id="featured-heading" title="Featured Devotionals" subtitle="Popular mantras, aartis, and chalisas for daily practice" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featured.map((d) => (
                      <div key={d._id} className="fade-up">
                        {renderDevotionalCard(d, { showFeatured: true })}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ════════════════════════════════════════════════════════
                  SECTION 4b: Recommended For You (personalization)
                 ════════════════════════════════════════════════════════ */}
              {recommended.length > 0 && activeQuickCategory === 'all' && (
                <section aria-labelledby="recommended-heading" className="mb-16">
                  <SectionHeader id="recommended-heading" title="Recommended For You" subtitle="Based on your recent devotional activity" />
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    variants={staggerContainer} initial="hidden" animate="visible"
                  >
                    {recommended.map((d, i) => (
                      <motion.div key={d._id} variants={fadeUp} custom={i}>
                        {renderDevotionalCard(d)}
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}

              {/* ════════════════════════════════════════════════════════
                  SECTION 5: Recently Added (Mosaic)
                 ════════════════════════════════════════════════════════ */}
              {recentlyAdded.length > 0 && activeQuickCategory === 'all' && (
                <section aria-labelledby="recent-heading" className="mb-16">
                  <SectionHeader id="recent-heading" title="Recently Added" subtitle="Fresh additions to the collection" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentlyAdded.map((d) => (
                      <div key={d._id} className="fade-up">
                        {renderDevotionalCard(d)}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="divider mb-10" />

              {/* ════════════════════════════════════════════════════════
                  SECTION 6: All Devotionals with Advanced Filters
                 ════════════════════════════════════════════════════════ */}
              <section ref={resultsRef}>
                <SectionHeader
                  title={activeQuickCategory !== 'all'
                    ? `${FULL_CATEGORIES.find(c => c.id === activeQuickCategory)?.label || activeQuickCategory} Devotionals`
                    : 'All Devotionals'
                  }
                  subtitle={`${filteredDevotionals.length} devotional${filteredDevotionals.length !== 1 ? 's' : ''} available`}
                />

                {/* Filter bar */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Toggle filters button */}
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                      Filters
                      {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white" />}
                    </button>

                    {/* Sort */}
                    <select
                      aria-label="Sort order"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'az' | 'za' | 'newest')}
                      className="input w-auto text-body-sm py-2 px-3 rounded-full"
                      suppressHydrationWarning
                    >
                      <option value="az">A – Z</option>
                      <option value="za">Z – A</option>
                      <option value="newest">Newest First</option>
                    </select>

                    {/* Transliteration toggle */}
                    <label className="flex items-center gap-2 text-body-sm text-ink-muted whitespace-nowrap cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="accent-primary-500 h-4 w-4 rounded"
                        checked={showTransliteration}
                        onChange={(e) => setShowTransliteration(e.target.checked)}
                      />
                      Transliteration
                    </label>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                      <button type="button" onClick={clearAllFilters} className="btn btn-ghost btn-sm text-primary-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Expandable filter panel */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 card flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="label">Language</label>
                            <select
                              aria-label="Filter by language"
                              value={languageFilter}
                              onChange={(e) => setLanguageFilter(e.target.value)}
                              className="input"
                              suppressHydrationWarning
                            >
                              {languages.map((l) => (
                                <option key={l} value={l}>{l === 'all' ? 'All Languages' : l}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="label">Deity</label>
                            <select
                              aria-label="Filter by deity"
                              value={deityFilter}
                              onChange={(e) => setDeityFilter(e.target.value)}
                              className="input"
                              suppressHydrationWarning
                            >
                              {deities.map((d) => (
                                <option key={d} value={d}>{d === 'all' ? 'All Deities' : d}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results grid */}
                {filteredDevotionals.length === 0 ? (
                  <EmptyState
                    message="No devotionals match your current filters."
                    action={<button type="button" onClick={clearAllFilters} className="btn btn-outline btn-sm mt-4">Reset Filters</button>}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {sortedDevotionals.slice(0, visibleCount).map((d) => (
                        <div key={d._id} className="fade-up">
                          {renderDevotionalCard(d)}
                        </div>
                      ))}
                    </div>
                    <LoadMoreButton
                      visible={sortedDevotionals.length > visibleCount}
                      remaining={sortedDevotionals.length - visibleCount}
                      onClick={() => setVisibleCount((c) => c + 24)}
                    />
                  </>
                )}
              </section>
            </>
          )}
        </div>

      </main>
    </>
  )
}

/* ─── Sub-Components ─── */

function LoadingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/20 border-b border-surface-border">
      <div className="page-container py-14 md:py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-surface-sunken rounded-lg w-64" />
          <div className="h-5 bg-surface-sunken rounded w-96 max-w-full" />
          <div className="h-1 bg-surface-sunken rounded-full w-16 mt-4" />
          <div className="flex gap-3 mt-6">
            <div className="h-8 bg-surface-sunken rounded-full w-32" />
            <div className="h-8 bg-surface-sunken rounded-full w-28" />
            <div className="h-8 bg-surface-sunken rounded-full w-24" />
          </div>
          <div className="h-14 bg-surface-sunken rounded-2xl w-full max-w-2xl mt-6" />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-sunken flex items-center justify-center">
        <svg className="w-8 h-8 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="text-body text-ink-muted font-medium">{message}</p>
      {action}
    </div>
  )
}

function LoadMoreButton({ visible, remaining, onClick }: { visible: boolean; remaining: number; onClick: () => void }) {
  if (!visible) return null
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="btn btn-outline group"
        suppressHydrationWarning
      >
        Load More
        <span className="text-ink-muted text-caption">({remaining} remaining)</span>
        <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
        </svg>
      </button>
    </div>
  )
}
