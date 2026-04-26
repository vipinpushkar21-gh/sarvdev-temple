"use client"

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { spiritualIcons, categories } from '../../data/spiritual-icons'
import type { SpiritualIcon } from '../../data/spiritual-icons'

/* ─── Helpers ─── */

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const typeEmojis: Record<string, string> = {
  'katha-vachak': '🎙️',
  'bhajan-gayak': '🎵',
  'pandit': '📿',
}

const typeBgs: Record<string, string> = {
  'katha-vachak': 'bg-primary-100',
  'bhajan-gayak': 'bg-secondary-100',
  'pandit': 'bg-accent-100',
}

const typeLabels: Record<string, string> = {
  'katha-vachak': 'Katha Vachak',
  'bhajan-gayak': 'Bhajan Gayak',
  'pandit': 'Pandit / Purohit',
}

export default function SpiritualIconsPage() {
  const [activeTab, setActiveTab] = useState<string>('katha-vachak')
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')

  const activeCategory = categories.find(c => c.id === activeTab)!

  // Stats
  const totalIcons = spiritualIcons.length
  const allStates = useMemo(() => {
    const s = new Set(spiritualIcons.map(i => i.state))
    return Array.from(s).sort()
  }, [])

  // States for current tab
  const tabStates = useMemo(() => {
    const s = new Set(spiritualIcons.filter(i => i.type === activeTab).map(i => i.state))
    return ['all', ...Array.from(s).sort()]
  }, [activeTab])

  // Featured spotlight — client-only to avoid hydration mismatch
  const [spotlight, setSpotlight] = useState(spiritualIcons[0])
  useEffect(() => {
    setSpotlight(shuffleArray(spiritualIcons)[0])
  }, [])

  // Filtered icons (deterministic)
  const filteredBase = useMemo(() => {
    let icons = spiritualIcons.filter(icon => icon.type === activeTab)

    if (stateFilter !== 'all') {
      icons = icons.filter(icon => icon.state === stateFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      icons = icons.filter(icon =>
        icon.name.toLowerCase().includes(q) ||
        icon.nameHi.includes(q) ||
        icon.speciality.toLowerCase().includes(q) ||
        icon.state.toLowerCase().includes(q) ||
        icon.famousFor.some(f => f.toLowerCase().includes(q))
      )
    }

    return icons
  }, [activeTab, stateFilter, searchQuery])

  // Shuffle client-side only to avoid hydration mismatch
  const [filteredIcons, setFilteredIcons] = useState<SpiritualIcon[]>([])
  useEffect(() => {
    setFilteredIcons(shuffleArray(filteredBase))
  }, [filteredBase])

  return (
    <>
      {/* ═══ Hero Section with Stats ═══ */}
      <section className="relative overflow-hidden border-b border-surface-border">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-transparent to-primary/20" />

        <div className="page-container py-14 md:py-20 relative z-10">
          <h1 className="text-display-lg font-serif text-white leading-tight">
            Spiritual Icons
          </h1>
          <p className="mt-3 text-body text-white/75 max-w-2xl">
            Discover revered Katha Vachaks, Bhajan Gayaks, and Pandits who keep our spiritual traditions alive worldwide.
          </p>
          <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="stat-pill">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              {totalIcons} Icons
            </span>
            <span className="stat-pill">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" /></svg>
              {categories.length} Categories
            </span>
            <span className="stat-pill">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>
              {allStates.length} States
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Featured Spotlight ═══ */}
      <section className="page-container py-8">
        <div className="card-gradient">
          <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${typeBgs[spotlight.type]} flex items-center justify-center shrink-0 shadow-md`}>
              <span className="text-4xl sm:text-5xl font-serif font-bold text-secondary-700">{spotlight.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-trending">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  Spotlight
                </span>
                <span className="badge badge-primary text-xs">{typeLabels[spotlight.type]}</span>
              </div>
              <h3 className="text-h2 font-serif text-secondary-800">{spotlight.name}</h3>
              <p className="text-body-sm text-primary-600 font-medium">{spotlight.nameHi}</p>
              <p className="text-body-sm text-ink-muted mt-2 line-clamp-2">{spotlight.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {spotlight.famousFor.map(tag => (
                  <span key={tag} className="badge bg-surface-sunken text-secondary-600 text-xs">{tag}</span>
                ))}
              </div>
              <Link
                href={`/spiritual-icons/${spotlight.slug}`}
                className="inline-flex items-center gap-1.5 mt-4 text-body-sm font-semibold text-primary-600 hover:text-primary-700 no-underline hover:no-underline transition-colors"
              >
                View Profile
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Category Tabs (Sticky) ═══ */}
      <section className="bg-surface/80 backdrop-blur-xl border-b border-surface-border/50 sticky top-0 z-30">
        <div className="page-container">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {categories.map((cat) => {
              const count = spiritualIcons.filter(i => i.type === cat.id).length
              const isActive = activeTab === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveTab(cat.id); setSearchQuery(''); setStateFilter('all') }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md shadow-primary/25'
                      : 'bg-surface-raised text-secondary-600 hover:bg-secondary-50 border border-surface-border hover:shadow-sm'
                  }`}
                >
                  <span aria-hidden="true">{typeEmojis[cat.id]}</span>
                  <span>{cat.label}</span>
                  <span className={`text-caption px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                    isActive ? 'bg-white/20 text-white' : 'bg-secondary-100 text-secondary-500'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ Main Content ═══ */}
      <main className="page-container py-10">

        {/* Category Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-h2 font-serif text-secondary-800">
              {activeCategory.labelHi} ({activeCategory.label})
            </h2>
            <p className="text-body-sm text-ink-muted mt-1">{activeCategory.desc}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* State Filter */}
            <select
              aria-label="Filter by state"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-xl border border-surface-border bg-surface-raised text-ink text-body-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-400 shadow-sm transition-all duration-200"
            >
              {tabStates.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All States' : s}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-64 group">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeCategory.label}...`}
                className="w-full rounded-xl border border-surface-border bg-surface-raised text-ink text-body-sm pl-10 pr-10 py-2.5 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-400 shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-faint hover:text-ink-muted hover:bg-surface-sunken transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-caption text-ink-muted mb-4">
          Showing {filteredIcons.length} {activeCategory.label}{filteredIcons.length !== 1 ? 's' : ''}
          {stateFilter !== 'all' && <> from <strong>{stateFilter}</strong></>}
          {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
        </p>

        {/* Icons Grid */}
        {filteredIcons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <p className="text-body text-ink-muted mb-4">
              No {activeCategory.label} found
              {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
              {stateFilter !== 'all' && <> in {stateFilter}</>}
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setStateFilter('all') }}
              className="btn btn-outline btn-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filteredIcons.map((icon) => (
              <SpiritualIconCard key={icon.id} icon={icon} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

/* ─── Card Component ─── */
function SpiritualIconCard({ icon }: { icon: SpiritualIcon }) {
  return (
    <Link href={`/spiritual-icons/${icon.slug}`} className="block no-underline hover:no-underline">
      <article className="card-interactive overflow-hidden group">
        {/* Image / Placeholder */}
        <div className={`relative h-48 w-full ${typeBgs[icon.type]} flex items-center justify-center overflow-hidden`}>
          {icon.image ? (
            <img src={icon.image} alt={icon.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary-200/80 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-serif font-bold text-secondary-700">{icon.name.charAt(0)}</span>
              </div>
            </div>
          )}
          {/* Type badge */}
          <span className="absolute top-3 left-3 badge badge-primary text-xs font-medium">
            {typeLabels[icon.type]}
          </span>
          {/* State badge */}
          <span className="absolute top-3 right-3 badge bg-secondary-700 text-white text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {icon.state}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-h4 font-serif text-secondary-800 group-hover:text-primary-700 transition-colors">{icon.name}</h3>
          <p className="text-caption text-primary-600 font-medium mt-0.5">{icon.nameHi}</p>
          <p className="text-body-sm text-ink-muted mt-2 line-clamp-2">{icon.description}</p>

          {/* Speciality */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-caption text-ink-muted">Speciality:</span>
            <span className="badge bg-primary-50 text-primary-700 text-xs">{icon.speciality}</span>
          </div>

          {/* Famous For */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {icon.famousFor.map((tag) => (
              <span key={tag} className="badge bg-surface-sunken text-secondary-600 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
