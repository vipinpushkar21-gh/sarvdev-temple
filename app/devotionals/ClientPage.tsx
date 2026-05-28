"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { CalendarClock, Headphones, Library, Moon, Shield, Sparkles, SunMedium } from 'lucide-react'
import { CategoryGrid } from './components/CategoryGrid'
import { EXCLUDED_CATEGORY_IDS, FULL_CATEGORIES } from './components/categories'
import DevotionalCardPremium from './components/DevotionalCardPremium'
import DevotionalFilterChips from './components/DevotionalFilterChips'
import DevotionalHero from './components/DevotionalHero'
import { SearchBar } from './components/SearchBar'
import type { Devotional } from './types'
import { attachMatchedDeities } from '../../lib/devotional-deity-match'
import {
  getDailyPracticeGroups,
  getDevotionalHref,
  getFeaturedDevotionals,
} from './components/devotional-utils'

type SortKey = 'featured' | 'newest' | 'az'

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Sarvdev Devotionals</p>
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
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDeity, setActiveDeity] = useState('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [visibleCount, setVisibleCount] = useState(18)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('search') || params.get('q') || ''
    const deity = params.get('deity') || ''
    if (query) setSearch(query)
    if (deity) setActiveDeity(deity)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchDevotionals() {
      try {
        const [res, deityRes] = await Promise.all([
          fetch('/api/devotionals'),
          fetch('/api/deities', { cache: 'no-store' }).catch(() => null),
        ])
        if (!res.ok) return
        const [data, deityData] = await Promise.all([
          res.json(),
          deityRes?.ok ? deityRes.json() : Promise.resolve([]),
        ])
        if (!cancelled) {
          const approved = (Array.isArray(data) ? data : []).filter((item: Devotional) => item.status === 'approved' || !item.status)
          setDevotionals(attachMatchedDeities(approved, Array.isArray(deityData) ? deityData : []))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDevotionals()
    return () => { cancelled = true }
  }, [])

  useEffect(() => setVisibleCount(18), [search, activeCategory, activeDeity, sort])

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

  const deityChips = useMemo(() => {
    const counts = new Map<string, number>()
    devotionals.forEach((devotional) => {
      if (!devotional.deity) return
      counts.set(devotional.deity, (counts.get(devotional.deity) || 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [devotionals])

  const categoryChips = useMemo(() => [
    { id: 'all', label: 'All', meta: devotionals.length },
    ...categoriesWithCounts.filter((category) => category.count > 0).map((category) => ({
      id: category.id,
      label: category.label,
      meta: category.count,
    })),
  ], [categoriesWithCounts, devotionals.length])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return devotionals.filter((devotional) => {
      if (activeCategory !== 'all') {
        if (activeCategory === 'Namavali') {
          if (devotional.category !== 'Namavali' && devotional.category !== '108 Namavali') return false
        } else if (devotional.category !== activeCategory) return false
      }
      if (activeDeity !== 'all' && devotional.deity !== activeDeity) return false
      if (!term) return true
      return [
        devotional.title,
        devotional.description,
        devotional.category,
        devotional.deity,
        devotional.language,
        devotional.artist,
      ].filter(Boolean).some((value) => value!.toLowerCase().includes(term))
    })
  }, [activeCategory, activeDeity, devotionals, search])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }
    if (sort === 'az') {
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    return list.sort((a, b) =>
      Number(Boolean(b.audio)) - Number(Boolean(a.audio)) ||
      Number(Boolean(b.matchedDeity?.imageCard || b.matchedDeity?.image)) - Number(Boolean(a.matchedDeity?.imageCard || a.matchedDeity?.image)) ||
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  }, [filtered, sort])

  const featured = useMemo(() => getFeaturedDevotionals(devotionals), [devotionals])
  const recent = useMemo(() => [...devotionals].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6), [devotionals])
  const dailyGroups = useMemo(() => getDailyPracticeGroups(devotionals), [devotionals])
  const audioCount = devotionals.filter((item) => item.audio).length

  function clearFilters() {
    setSearch('')
    setActiveCategory('all')
    setActiveDeity('all')
    setSort('featured')
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
        title="Devotionals"
        eyebrow="Chanting, Lyrics and Audio"
        subtitle="A premium collection for mantras, bhajans, aartis, chalisas, stotras and daily spiritual practice."
        image={featured[0] || devotionals[0] || null}
        stats={[
          { label: 'Devotionals', value: devotionals.length },
          { label: 'Categories', value: categoriesWithCounts.filter((c) => c.count > 0).length },
          { label: 'Deities', value: deityChips.length },
          { label: 'Audio', value: audioCount },
        ]}
      >
        <SearchBar value={search} onChange={setSearch} placeholder="Search mantra, aarti, deity or lyrics..." size="lg" />
      </DevotionalHero>

      <main className="min-h-screen bg-surface pb-16">
        <div className="sticky top-0 z-30 border-b border-amber-200/60 bg-surface/90 backdrop-blur-xl">
          <div className="page-container py-3">
            <DevotionalFilterChips chips={categoryChips} activeId={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        <div className="page-container space-y-16 py-12">
          <section>
            <SectionHeader title="Browse by Category" subtitle="Jump into the kind of chanting or reading practice you need today." />
            <CategoryGrid categories={categoriesWithCounts} />
          </section>

          {featured.length > 0 && (
            <section>
              <SectionHeader title="Featured Devotionals" subtitle="Audio-ready, image-rich and popular entries from the Sarvdev collection." />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((devotional) => <DevotionalCardPremium key={devotional._id} devotional={devotional} featured />)}
              </div>
            </section>
          )}

          <section>
            <SectionHeader title="Discover by Deity" subtitle="Quickly move into Shiva, Rama, Ganesha, Durga, Vishnu, Hanuman and other devotional streams." />
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

          <section>
            <SectionHeader title="Daily Practice" subtitle="A guided way to pick content for morning, evening, protection and peaceful recitation." />
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
                        <Link key={item._id} href={getDevotionalHref(item)} className="block truncate rounded-lg bg-orange-50/70 px-3 py-2 text-sm font-semibold text-stone-700 no-underline hover:bg-orange-100 hover:text-orange-800">
                          {item.title}
                        </Link>
                      )) : (
                        <p className="text-sm text-stone-500">More entries will appear here as the collection grows.</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {recent.length > 0 && (
            <section>
              <SectionHeader title="Recently Added" subtitle="Freshly added devotional lyrics, chants and audio resources." />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {recent.map((devotional) => <DevotionalCardPremium key={devotional._id} devotional={devotional} />)}
              </div>
            </section>
          )}

          <section>
            <SectionHeader
              title="All Devotionals"
              subtitle={`${sorted.length} result${sorted.length === 1 ? '' : 's'} available across chanting, lyrics and audio.`}
              action={
                <div className="flex flex-wrap gap-2">
                  <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="input w-auto bg-white">
                    <option value="featured">Featured first</option>
                    <option value="newest">Newest first</option>
                    <option value="az">A to Z</option>
                  </select>
                  {(search || activeCategory !== 'all' || activeDeity !== 'all') && (
                    <button type="button" onClick={clearFilters} className="btn btn-outline bg-white">Clear</button>
                  )}
                </div>
              }
            />

            {sorted.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center">
                <Library className="mx-auto h-10 w-10 text-stone-400" />
                <h3 className="mt-3 text-xl font-black text-stone-900">No devotionals found</h3>
                <p className="mt-2 text-stone-600">Try another category, deity or search term.</p>
                <button type="button" onClick={clearFilters} className="btn btn-primary mt-5">Reset filters</button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sorted.slice(0, visibleCount).map((devotional) => (
                    <DevotionalCardPremium key={devotional._id} devotional={devotional} />
                  ))}
                </div>
                {sorted.length > visibleCount && (
                  <div className="mt-10 text-center">
                    <button type="button" onClick={() => setVisibleCount((count) => count + 18)} className="btn btn-outline bg-white">
                      Load more
                      <span className="text-stone-500">({sorted.length - visibleCount} left)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-stone-950 via-stone-900 to-orange-950 p-6 text-white shadow-2xl md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  <CalendarClock className="h-4 w-4" />
                  Build a daily rhythm
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">Start with one chant, then continue by deity or category.</h2>
                <p className="mt-3 max-w-2xl text-stone-200">Use audio where available, TTS for lyrics, and bookmark the devotionals you return to every day.</p>
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
