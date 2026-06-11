"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { CalendarClock, Headphones, Library, Moon, Shield, Sparkles, SunMedium } from 'lucide-react'
import { CategoryGrid } from './components/CategoryGrid'
import { EXCLUDED_CATEGORY_IDS, FULL_CATEGORIES } from './components/categories'
import DevotionalCardPremium from './components/DevotionalCardPremium'
import DevotionalFilterChips from './components/DevotionalFilterChips'
import DevotionalHero from './components/DevotionalHero'
import FeaturedDevotionalSlider from './components/FeaturedDevotionalSlider'
import { SearchBar } from './components/SearchBar'
import type { Devotional } from './types'
import {
  getDailyPracticeGroups,
  getDevotionalHref,
  getFeaturedDevotionals,
} from './components/devotional-utils'

type SortKey = 'featured' | 'newest' | 'az'

const DEVOTIONAL_PAGE_LIMIT = 48

const DEITY_EMOJI: Record<string, string> = {
  shiva: '🕉️', mahadev: '🕉️', shiv: '🕉️', bholenath: '🕉️',
  hanuman: '🙏', bajrangbali: '🙏',
  krishna: '🪷', kanha: '🪷', gopal: '🪷', govind: '🪷',
  durga: '🌸', devi: '🌸', mata: '🌸',
  lakshmi: '🌺', laxmi: '🌺', mahalakshmi: '🌺',
  vishnu: '🔱', narayan: '🔱', hari: '🔱',
  ganesha: '🐘', ganesh: '🐘', ganpati: '🐘', vinayak: '🐘',
  saraswati: '🎵', sharada: '🎵',
  rama: '🏹', ram: '🏹',
  surya: '☀️',
  kali: '⚡',
  parvati: '🌙', gauri: '🌙',
  sai: '✨',
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  ram:      ['ram', 'rama', 'ramachandra', 'raama'],
  rama:     ['ram', 'rama', 'ramachandra', 'raama'],
  'राम':    ['ram', 'rama', 'राम', 'रामचंद्र'],
  hanuman:  ['hanuman', 'bajrangbali', 'maruti', 'anjaneya', 'pawanputra'],
  'हनुमान': ['hanuman', 'bajrangbali', 'हनुमान', 'maruti'],
  shiva:    ['shiva', 'shiv', 'mahadev', 'shankar', 'bholenath', 'neelkanth'],
  shiv:     ['shiva', 'shiv', 'mahadev', 'shankar', 'bholenath'],
  'शिव':    ['shiva', 'shiv', 'शिव', 'महादेव', 'mahadev'],
  krishna:  ['krishna', 'kanha', 'gopal', 'govind', 'hari', 'murari', 'kanhaiya'],
  'कृष्ण':   ['krishna', 'kanha', 'कृष्ण', 'gopal'],
  aarti:    ['aarti', 'arti', 'आरती'],
  'आरती':   ['aarti', 'arti', 'आरती'],
  chalisa:  ['chalisa', 'chalisha', 'चालीसा'],
  'चालीसा': ['chalisa', 'chalisha', 'चालीसा'],
  mantra:   ['mantra', 'मंत्र', 'stotra', 'chant'],
  'मंत्र':   ['mantra', 'मंत्र'],
  stotra:   ['stotra', 'stotram', 'स्तोत्र'],
  ganesh:   ['ganesh', 'ganesha', 'ganpati', 'vinayak', 'ganapati'],
  durga:    ['durga', 'devi', 'mata', 'sheranwali', 'ambika'],
  lakshmi:  ['lakshmi', 'laxmi', 'mahalakshmi', 'shri'],
  vishnu:   ['vishnu', 'narayan', 'narayana', 'hari', 'venkateswara'],
}

function devotionalMatchesTerm(d: Devotional, term: string): boolean {
  const synonyms = SEARCH_SYNONYMS[term] ?? [term]
  const fields = [
    d.title,
    d.titleHi,
    d.category,
    d.categoryHi,
    d.categorySlug,
    d.deity,
    d.deityHi,
    d.deitySlug,
    d.description,
    d.language,
    d.artist,
    ...(Array.isArray(d.tags) ? d.tags : typeof d.tags === 'string' ? [d.tags] : []),
    ...(Array.isArray((d as any).aliases) ? (d as any).aliases : []),
  ].filter(Boolean).map((v) => (v as string).toLowerCase())
  return synonyms.some((syn) => fields.some((f) => f.includes(syn.toLowerCase())))
}

const DEITY_BG = [
  'from-orange-50 to-amber-50',
  'from-purple-50 to-violet-50',
  'from-blue-50 to-sky-50',
  'from-emerald-50 to-teal-50',
  'from-rose-50 to-pink-50',
  'from-yellow-50 to-orange-50',
  'from-indigo-50 to-blue-50',
  'from-cyan-50 to-emerald-50',
]

const HERO_CTA_CHIPS = [
  { label: 'Aarti', href: '/devotionals/category/aarti', emoji: '🪔' },
  { label: 'Mantra', href: '/devotionals/category/mantra', emoji: '📿' },
  { label: 'Chalisa', href: '/devotionals/category/chalisa', emoji: '📖' },
  { label: 'Stotra', href: '/devotionals/category/stotra', emoji: '🎵' },
  { label: 'Vrat Katha', href: '/devotionals/category/vrat-katha', emoji: '🌿' },
]

function getDeityEmoji(name: string): string {
  const key = name.toLowerCase()
  for (const [k, v] of Object.entries(DEITY_EMOJI)) {
    if (key.includes(k)) return v
  }
  return '🕉️'
}

function deityToSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function SectionHeader({ title, subtitle, action, eyebrow }: {
  title: string
  subtitle?: string
  action?: ReactNode
  eyebrow?: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-3xl font-black tracking-normal text-stone-950">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default function ClientPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDeity, setActiveDeity] = useState('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const resultsSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('search') || params.get('q') || ''
    const deity = params.get('deity') || ''
    if (query) setSearch(query)
    if (deity) setActiveDeity(deity)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, activeCategory, activeDeity, sort])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDevotionals() {
      setSearchLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(DEVOTIONAL_PAGE_LIMIT),
          sort,
        })
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (activeCategory !== 'all') params.set('category', activeCategory)
        if (activeDeity !== 'all') params.set('deity', activeDeity)

        const res = await fetch(`/api/devotionals?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        const approved = items.filter((item: Devotional) => item.status === 'approved' || !item.status)
        setDevotionals((current) => {
          if (page === 1) return approved
          const seen = new Set(current.map((item) => item._id))
          return [...current, ...approved.filter((item: Devotional) => !seen.has(item._id))]
        })
        setTotal(Number(data.total || approved.length || 0))
        setHasMore(Boolean(data.hasMore))
      } catch (error: any) {
        if (error?.name !== 'AbortError') console.error('Failed to load devotionals:', error)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          setSearchLoading(false)
        }
      }
    }

    fetchDevotionals()
    return () => controller.abort()
  }, [activeCategory, activeDeity, debouncedSearch, page, sort])

  useEffect(() => {
    if (!debouncedSearch) return
    resultsSummaryRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [debouncedSearch])

  const categoriesWithCounts = useMemo(() => {
    return FULL_CATEGORIES
      .filter((category) => !EXCLUDED_CATEGORY_IDS.has(category.id))
      .map((category) => ({
        ...category,
        count: devotionals.filter((devotional) => {
          if (category.id === 'Namavali') return devotional.category === 'Namavali' || devotional.category === '108 Namavali'
          return devotional.category === category.id
        }).length,
      }))
  }, [devotionals])

  const deityGrid = useMemo(() => {
    const counts = new Map<string, number>()
    devotionals.forEach((devotional) => {
      if (devotional.deity) counts.set(devotional.deity, (counts.get(devotional.deity) || 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 24)
  }, [devotionals])

  const deityChips = useMemo(() => deityGrid.slice(0, 12), [deityGrid])

  const categoryChips = useMemo(() => [
    { id: 'all', label: 'All', meta: total || devotionals.length },
    ...categoriesWithCounts.filter((category) => category.count > 0).map((category) => ({
      id: category.id,
      label: category.label,
      meta: category.count,
    })),
  ], [categoriesWithCounts, devotionals.length, total])

  const sorted = useMemo(() => {
    const list = [...devotionals]
    if (sort === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }
    if (sort === 'az') {
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    return list.sort((a, b) =>
      Number(Boolean(b.audio)) - Number(Boolean(a.audio)) ||
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  }, [devotionals, sort])

  const featured = useMemo(() => getFeaturedDevotionals(devotionals), [devotionals])
  const dailyGroups = useMemo(() => getDailyPracticeGroups(devotionals), [devotionals])
  const audioCount = devotionals.filter((item) => item.audio).length
  const isFiltered = !!(debouncedSearch || activeCategory !== 'all' || activeDeity !== 'all')
  const showDiscovery = !isFiltered

  function clearFilters() {
    setSearch('')
    setActiveCategory('all')
    setActiveDeity('all')
    setSort('featured')
    setPage(1)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="h-[520px] animate-pulse bg-stone-900" />
        <div className="page-container py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 rounded-2xl bg-stone-100" />)}
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <DevotionalHero
        title="Sarvdev Devotionals"
        eyebrow="Bhakti · Lyrics · Audio"
        subtitle="भजन, आरती, मंत्र, चालीसा और स्तोत्र — एक शांत, तेज devotional library."
        image={null}
        stats={[
          { label: 'Sacred Texts', value: `${total || devotionals.length}+` },
          { label: 'Devotional Types', value: categoriesWithCounts.filter((c) => c.count > 0).length },
          { label: 'Deity Streams', value: `${deityGrid.length}+` },
          { label: 'With Audio', value: audioCount },
        ]}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search aarti, mantra, chalisa, deity or lyrics..." size="lg" />
        <p className="mt-2 px-1 text-sm font-semibold text-amber-100" aria-live="polite">
          {searchLoading && debouncedSearch
            ? `Searching for "${debouncedSearch}"...`
            : debouncedSearch
              ? `${total} devotionals found for "${debouncedSearch}"`
              : 'Search the complete devotional library, not just the first page.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {HERO_CTA_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-xs font-bold text-white no-underline backdrop-blur transition hover:border-amber-300/50 hover:bg-amber-400/20 hover:text-amber-100"
            >
              <span aria-hidden="true">{chip.emoji}</span>
              {chip.label}
            </Link>
          ))}
        </div>
      </DevotionalHero>

      <main className="min-h-screen bg-surface pb-16">
        <div className="sticky top-0 z-30 border-b border-amber-200/60 bg-surface/90 backdrop-blur-xl">
          <div className="page-container py-3">
            <DevotionalFilterChips chips={categoryChips} activeId={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        <div className="page-container space-y-16 py-12">
          <div
            ref={resultsSummaryRef}
            className="rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-sm"
            aria-live="polite"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                  Search Results
                </p>
                <h2 className="mt-1 text-xl font-black text-stone-950">
                  {searchLoading && debouncedSearch
                    ? `Searching for "${debouncedSearch}"...`
                    : debouncedSearch
                      ? total > 0
                        ? `${total} devotionals found for "${debouncedSearch}"`
                        : `No devotionals found for "${debouncedSearch}"`
                      : `${total || devotionals.length} devotionals available`}
                </h2>
                {(activeCategory !== 'all' || activeDeity !== 'all') && (
                  <p className="mt-1 text-sm text-stone-500">
                    Filters: {activeCategory !== 'all' ? activeCategory : 'All categories'}
                    {activeDeity !== 'all' ? ` · ${activeDeity}` : ''}
                  </p>
                )}
              </div>
              {isFiltered && (
                <button type="button" onClick={clearFilters} className="btn btn-outline bg-white">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ── Featured Today Slider ── */}
          {showDiscovery && featured.length > 0 && (
            <section>
              <SectionHeader
                eyebrow="Handpicked Collection"
                title="Featured Today"
                subtitle="Top mantras, chalisas, aartis and stotras from the Sarvdev devotional library."
              />
              <FeaturedDevotionalSlider items={featured} />
            </section>
          )}

          {/* ── Browse by Devotional Type ── */}
          {showDiscovery && (
            <section>
              <SectionHeader
                eyebrow="Devotional Types"
                title="Browse by Type"
                subtitle="Choose the kind of practice you need — chanting, reading, listening, or contemplation."
              />
              <CategoryGrid categories={categoriesWithCounts} />
            </section>
          )}

          {/* ── Explore by Deity ── */}
          {showDiscovery && deityGrid.length > 0 && (
            <section>
              <SectionHeader
                eyebrow="Deity Streams"
                title="Explore by Deity"
                subtitle="Find all mantras, aartis, stotras, chalisas and more for a specific deity."
                action={
                  <Link href="/devotionals/deity/other" className="btn btn-outline shrink-0 bg-white text-sm no-underline">
                    Other Devotionals →
                  </Link>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {deityGrid.slice(0, 18).map(([name, count], i) => (
                  <Link
                    key={name}
                    href={`/devotionals/deity/${deityToSlug(name)}`}
                    className={`group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br ${DEITY_BG[i % DEITY_BG.length]} p-5 no-underline shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="text-2xl" aria-hidden="true">{getDeityEmoji(name)}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">Stream</span>
                    </div>
                    <h3 className="text-base font-black leading-snug text-stone-900 group-hover:text-orange-800">{name}</h3>
                    <p className="text-[11px] text-stone-400">Devotional Stream</p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-xl font-black text-stone-300">{count}</span>
                      <span className="translate-x-2 text-xs font-bold text-orange-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {deityGrid.length > 18 && (
                <p className="mt-4 text-center text-sm text-stone-400">
                  Showing 18 of {deityGrid.length} deity streams
                </p>
              )}
            </section>
          )}

          {/* ── Daily Sadhana ── */}
          {showDiscovery && (
            <section>
              <SectionHeader
                eyebrow="Daily Practice"
                title="Daily Sadhana"
                subtitle="Build a meaningful rhythm — morning mantras, evening aarti, protection paths and peaceful stotras."
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dailyGroups.map((group, index) => {
                  const icons = [SunMedium, Moon, Shield, Sparkles]
                  const Icon = icons[index] || Sparkles
                  return (
                    <div key={group.label} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="text-lg font-black text-stone-900">{group.label}</h3>
                      </div>
                      <div className="space-y-2">
                        {group.items.length > 0 ? group.items.map((item) => (
                          <Link
                            key={item._id}
                            href={getDevotionalHref(item)}
                            className="block truncate rounded-lg bg-orange-50/70 px-3 py-2 text-sm font-semibold text-stone-700 no-underline hover:bg-orange-100 hover:text-orange-800"
                          >
                            {item.title}
                          </Link>
                        )) : (
                          <p className="text-sm text-stone-500">More entries coming as the collection grows.</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Most Recited This Week ── */}
          {showDiscovery && featured.length > 0 && (
            <section>
              <SectionHeader
                eyebrow="Popular"
                title="Most Recited This Week"
                subtitle="Frequently visited chants, aartis and mantras from the Sarvdev collection."
              />
              <div className="grid gap-3 md:grid-cols-2">
                {featured.slice(0, 8).map((devotional, i) => (
                  <Link
                    key={devotional._id}
                    href={getDevotionalHref(devotional)}
                    className="group flex items-center gap-4 rounded-xl border border-amber-100 bg-white p-4 no-underline shadow-sm transition hover:border-orange-200 hover:shadow-md"
                  >
                    <span className="w-9 shrink-0 text-xl font-black text-stone-200 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      {devotional.category && (
                        <span className="mb-1 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                          {devotional.category}
                        </span>
                      )}
                      <p className="truncate text-sm font-bold text-stone-900 group-hover:text-orange-800">
                        {devotional.title}
                      </p>
                      {devotional.deity && (
                        <p className="text-xs text-orange-600">{devotional.deity}</p>
                      )}
                    </div>
                    {devotional.audio && <Headphones className="h-4 w-4 shrink-0 text-emerald-500" />}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Discover by Deity filter chips ── */}
          <section>
            <SectionHeader
              eyebrow="Filter by Deity"
              title="Discover by Deity"
              subtitle="Quickly switch into Shiva, Rama, Ganesha, Durga, Vishnu, Hanuman and other devotional streams."
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveDeity('all')}
                className="category-pill"
                data-active={activeDeity === 'all' ? 'true' : 'false'}
              >
                All Deities
              </button>
              {deityChips.map(([deity, count]) => (
                <button
                  key={deity}
                  type="button"
                  onClick={() => setActiveDeity(deity)}
                  className="category-pill"
                  data-active={activeDeity === deity ? 'true' : 'false'}
                >
                  {deity}
                  <span className="text-caption opacity-70">{count}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── All Devotionals ── */}
          <section>
            <SectionHeader
              title="All Devotionals"
              subtitle={debouncedSearch
                ? `${total} devotional${total === 1 ? '' : 's'} found for "${debouncedSearch}".`
                : `${total || sorted.length} result${(total || sorted.length) === 1 ? '' : 's'} across chanting, lyrics and audio.`}
              action={
                <div className="flex flex-wrap gap-2">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="input w-auto bg-white"
                  >
                    <option value="featured">Featured first</option>
                    <option value="newest">Newest first</option>
                    <option value="az">A to Z</option>
                  </select>
                  {isFiltered && (
                    <button type="button" onClick={clearFilters} className="btn btn-outline bg-white">
                      Clear filters
                    </button>
                  )}
                </div>
              }
            />

            {sorted.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center">
                <Library className="mx-auto h-10 w-10 text-stone-400" />
                <h3 className="mt-3 text-xl font-black text-stone-900">
                  {debouncedSearch ? `No devotionals found for "${debouncedSearch}"` : 'No devotionals found'}
                </h3>
                <p className="mt-2 text-stone-600">Try another category, deity or search term.</p>
                <button type="button" onClick={clearFilters} className="btn btn-primary mt-5">Reset filters</button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sorted.map((devotional) => (
                    <DevotionalCardPremium key={devotional._id} devotional={devotional} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-10 space-y-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${Math.min(Math.round((sorted.length / Math.max(total, sorted.length)) * 100), 100)}%` }}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-stone-500">
                        Showing {sorted.length} of {total || sorted.length} devotionals
                      </p>
                      <button
                        type="button"
                        onClick={() => setPage((current) => current + 1)}
                        disabled={searchLoading}
                        className="btn btn-outline bg-white"
                      >
                        {searchLoading ? 'Loading...' : 'Show Next 48'}
                        <span className="ml-2 text-xs text-stone-400">
                          {Math.max((total || sorted.length) - sorted.length, 0)} more chants &amp; texts
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* ── Bottom CTA ── */}
          <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-stone-950 via-stone-900 to-orange-950 p-6 text-white shadow-2xl md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  <CalendarClock className="h-4 w-4" />
                  Build a daily rhythm
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  Start with one chant. Continue by deity or category.
                </h2>
                <p className="mt-3 max-w-2xl text-stone-200">
                  Use audio where available, TTS for lyrics, and bookmark the devotionals you return to every day.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <Headphones className="h-8 w-8 text-amber-200" />
                <div>
                  <div className="text-2xl font-black">{audioCount}</div>
                  <div className="text-xs font-bold uppercase tracking-wide text-stone-300">audio entries</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
