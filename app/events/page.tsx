"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Hero from '../../components/Hero'
import { hinduEvents, eventCategories } from '../../data/events'
import type { HinduEvent } from '../../data/events'

/* Token-based category badge colours */
const categoryBadge: Record<string, string> = {
  festival: 'bg-primary-100 text-primary-800',
  yatra:    'bg-secondary-100 text-secondary-700',
  cultural: 'bg-accent-100 text-accent-800',
  katha:    'bg-primary-50 text-secondary-700',
  special:  'bg-accent-50 text-accent-800',
}

/* Token-based card accent bar colours */
const categoryAccent: Record<string, string> = {
  festival: 'bg-primary-500',
  yatra:    'bg-secondary-500',
  cultural: 'bg-accent-500',
  katha:    'bg-primary-400',
  special:  'bg-accent-600',
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeYear, setActiveYear] = useState<number>(2026)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = useMemo(() => {
    let events = hinduEvents.filter(e => e.year === activeYear)
    if (activeCategory !== 'all') {
      events = events.filter(e => e.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.titleHi.includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.state.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
    }
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [activeCategory, activeYear, searchQuery])

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return hinduEvents.filter(e => e.year === activeYear).length
    return hinduEvents.filter(e => e.category === catId && e.year === activeYear).length
  }

  function formatDateRange(event: HinduEvent): string {
    const start = new Date(event.date)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    if (event.endDate && event.endDate !== event.date) {
      const end = new Date(event.endDate)
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} – ${end.toLocaleDateString('en-IN', opts)}`
      }
      return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', opts)}`
    }
    return start.toLocaleDateString('en-IN', opts)
  }

  function isOngoing(event: HinduEvent): boolean {
    const today = new Date().toISOString().slice(0, 10)
    return event.date <= today && (event.endDate ? event.endDate >= today : event.date >= today)
  }

  function isUpcoming(event: HinduEvent): boolean {
    const today = new Date().toISOString().slice(0, 10)
    return event.date > today
  }

  return (
    <>
      <Hero
        title="Hindu Events & Festivals"
        subtitle="Discover sacred festivals, pilgrimages, cultural programs, and spiritual gatherings worldwide — 2026 &amp; 2027"
      />

      {/* Year Selector + Category Tabs */}
      <section className="bg-surface-sunken/80 backdrop-blur-md border-b border-surface-border sticky top-16 z-30">
        <div className="page-container">
          {/* Year Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-surface-border/50">
            <div className="flex items-center gap-2">
              <span className="text-caption text-ink-muted font-medium">Year:</span>
              {[2026, 2027].map(year => (
                <button
                  key={year}
                  onClick={() => { setActiveYear(year); setSearchQuery('') }}
                  className={`px-4 py-1.5 rounded-lg text-body-sm font-semibold transition-all duration-200 ${
                    activeYear === year
                      ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md shadow-primary/25'
                      : 'bg-surface-raised text-secondary-600 hover:bg-secondary-50 border border-surface-border hover:shadow-sm'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <span className="text-caption text-ink-muted bg-surface-raised px-3 py-1 rounded-full border border-surface-border">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {eventCategories.map(cat => {
              const count = getCategoryCount(cat.id)
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-800 shadow-sm'
                      : 'bg-surface-raised text-secondary-600 hover:bg-secondary-50 border border-surface-border hover:shadow-sm'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive ? 'bg-primary-200 text-primary-800' : 'bg-secondary-100 text-secondary-500'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="page-container py-10">
        {/* Category Description + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-h2 font-serif text-secondary-800">
              {eventCategories.find(c => c.id === activeCategory)?.label || 'All Events'} — {activeYear}
            </h2>
            <p className="text-body-sm text-ink-muted mt-1">
              {eventCategories.find(c => c.id === activeCategory)?.desc}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 group">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            </div>
            <p className="text-body text-ink-muted">No events found{searchQuery ? ` for "${searchQuery}"` : ''}</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all') }} className="mt-5 btn btn-primary text-body-sm">
              View All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} formatDateRange={formatDateRange} isOngoing={isOngoing} isUpcoming={isUpcoming} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

/* ─── Event Card Component ─── */
function EventCard({ event, formatDateRange, isOngoing, isUpcoming }: {
  event: HinduEvent
  formatDateRange: (e: HinduEvent) => string
  isOngoing: (e: HinduEvent) => boolean
  isUpcoming: (e: HinduEvent) => boolean
}) {
  const badgeClass = categoryBadge[event.category] || 'badge'
  const accentClass = categoryAccent[event.category] || 'bg-primary-500'
  const ongoing = isOngoing(event)
  const upcoming = isUpcoming(event)

  return (
    <Link href={`/events/${event.slug}`} className="block group no-underline hover:no-underline">
      <article className="card-interactive overflow-hidden h-full flex flex-col">
        {/* Accent bar */}
        <div className={`h-1.5 ${accentClass}`} />

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Top row: badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`badge text-xs ${badgeClass}`}>
              {eventCategories.find(c => c.id === event.category)?.label}
            </span>
            {ongoing && (
              <span className="badge bg-semantic-success text-white text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full" /> Live
              </span>
            )}
            {upcoming && !ongoing && (
              <span className="badge text-xs">Upcoming</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-h4 font-serif text-secondary-800 leading-snug mb-1 group-hover:text-primary-700 transition-colors">
            {event.title}
          </h3>
          <p className="text-caption text-ink-muted font-medium mb-3">{event.titleHi}</p>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-caption text-ink-muted mb-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatDateRange(event)}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-caption text-ink-muted mb-3">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-body-sm text-ink-muted line-clamp-2 flex-1">{event.description}</p>

          {/* Highlights preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.highlights.slice(0, 2).map(h => (
              <span key={h} className="badge text-xs truncate max-w-[180px]">{h}</span>
            ))}
            {event.highlights.length > 2 && (
              <span className="badge badge-primary text-xs">+{event.highlights.length - 2} more</span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-caption text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
              View Full Details
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </span>
            <span className="badge text-xs">{event.state}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
