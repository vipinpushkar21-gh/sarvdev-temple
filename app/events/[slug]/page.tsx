"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Hero from '../../../components/Hero'
import { getEventBySlug, getRelatedEvents, eventCategories } from '../../../data/events'
import type { HinduEvent } from '../../../data/events'

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

export default function EventDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const event = getEventBySlug(slug)

  if (!event) {
    return (
      <>
        <Hero title="Event Not Found" subtitle="This event could not be found." />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-body text-ink-muted mb-6">The event you are looking for does not exist.</p>
          <Link href="/events" className="btn btn-primary no-underline hover:no-underline">
            Back to Events
          </Link>
        </main>
      </>
    )
  }

  const category = eventCategories.find(c => c.id === event.category)
  const relatedEvents = getRelatedEvents(event, 3)
  const badgeClass = categoryBadge[event.category] || 'badge'

  function formatDateRange(e: HinduEvent): string {
    const start = new Date(e.date)
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    if (e.endDate && e.endDate !== e.date) {
      const end = new Date(e.endDate)
      return `${start.toLocaleDateString('en-IN', opts)} — ${end.toLocaleDateString('en-IN', opts)}`
    }
    return start.toLocaleDateString('en-IN', opts)
  }

  function formatShortDate(e: HinduEvent): string {
    const start = new Date(e.date)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    if (e.endDate && e.endDate !== e.date) {
      const end = new Date(e.endDate)
      return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', opts)}`
    }
    return start.toLocaleDateString('en-IN', opts)
  }

  function isOngoing(e: HinduEvent): boolean {
    const today = new Date().toISOString().slice(0, 10)
    return e.date <= today && (e.endDate ? e.endDate >= today : e.date >= today)
  }

  const ongoing = isOngoing(event)

  return (
    <>
      {/* ─── Page Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/15 border-b border-surface-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-36 h-36 bg-accent/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="page-container py-10 md:py-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-4">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline hover:no-underline">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-primary-600 transition-colors no-underline hover:no-underline">Events</Link>
            <span>/</span>
            <span className="text-ink font-medium truncate max-w-[200px]">{event.title}</span>
          </nav>

          {/* Category + Status badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`badge text-xs ${badgeClass}`}>{category?.label}</span>
            <span className="badge text-xs">{event.year}</span>
            {ongoing && (
              <span className="badge bg-semantic-success text-white text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full" /> Live Now
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">{event.title}</h1>
          <p className="text-h4 text-ink-muted font-medium mt-1">{event.titleHi}</p>

          {/* Date & Location */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 text-ink-muted">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-body-sm">{formatDateRange(event)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-body-sm">{event.location} · {event.state}</span>
            </div>
          </div>
          <div className="mt-5 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column — Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About / Description */}
            <section className="card p-6 md:p-8">
              <h2 className="text-h3 font-serif text-secondary-800 mb-4">About This Event</h2>
              <p className="text-body text-ink-muted leading-relaxed">{event.description}</p>
            </section>

            {/* Spiritual Significance */}
            <section className="card p-6 md:p-8">
              <h2 className="text-h3 font-serif text-secondary-800 mb-4">Spiritual Significance</h2>
              <p className="text-body text-ink-muted leading-relaxed">{event.significance}</p>
            </section>

            {/* Key Rituals */}
            <section className="card p-6 md:p-8">
              <h2 className="text-h3 font-serif text-secondary-800 mb-4">Key Rituals & Traditions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.rituals.map((ritual, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-sunken">
                    <span className="text-primary-500 mt-0.5 font-bold">{i + 1}.</span>
                    <span className="text-body-sm text-secondary-700">{ritual}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section className="card p-6 md:p-8">
              <h2 className="text-h3 font-serif text-secondary-800 mb-4">Highlights & What to Expect</h2>
              <div className="space-y-3">
                {event.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 border border-primary-100">
                    <span className="text-primary-500 mt-0.5 font-bold">{i + 1}.</span>
                    <span className="text-body-sm text-secondary-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column — Sidebar */}
          <div className="space-y-6">

            {/* Quick Info Card */}
            <div className="relative card overflow-hidden p-6 sticky top-28">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <h3 className="text-h4 font-serif text-secondary-800 mb-4">Quick Info</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                  <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <span className="text-caption text-ink-muted block">Date</span>
                    <span className="text-body-sm font-medium text-secondary-700">{formatShortDate(event)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                  <svg className="w-5 h-5 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="text-caption text-ink-muted block">Location</span>
                    <span className="text-body-sm font-medium text-secondary-700">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                  <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <div>
                    <span className="text-caption text-ink-muted block">State</span>
                    <span className="text-body-sm font-medium text-secondary-700">{event.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                  <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  <div>
                    <span className="text-caption text-ink-muted block">Category</span>
                    <span className="text-body-sm font-medium text-secondary-700">{category?.label} ({category?.labelHi})</span>
                  </div>
                </div>

                {event.month !== 'All Year' && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                    <svg className="w-5 h-5 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div>
                      <span className="text-caption text-ink-muted block">Month</span>
                      <span className="text-body-sm font-medium text-secondary-700">{event.month} {event.year}</span>
                    </div>
                  </div>
                )}

                {ongoing && (
                  <div className="p-3 rounded-lg bg-semantic-success/10 border border-semantic-success/20 text-center">
                    <span className="text-semantic-success font-semibold text-body-sm flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-semantic-success rounded-full" />
                      This event is happening now!
                    </span>
                  </div>
                )}
              </div>

              {/* Back button */}
              <Link
                href="/events"
                className="mt-6 btn btn-primary w-full text-center no-underline hover:no-underline flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                All Events
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Related Events ─── */}
        {relatedEvents.length > 0 && (
          <section className="mt-12 pt-10 border-t border-surface-border">
            <div className="mb-8">
              <h2 className="text-h2 font-serif text-secondary-800">Related Events</h2>
              <div className="mt-3 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map(rel => (
                <RelatedEventCard key={rel.id} event={rel} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

/* ─── Related Event Card ─── */
function RelatedEventCard({ event }: { event: HinduEvent }) {
  const badgeClass = categoryBadge[event.category] || 'badge'
  const accentClass = categoryAccent[event.category] || 'bg-primary-500'
  const startDate = new Date(event.date)

  return (
    <Link href={`/events/${event.slug}`} className="block group no-underline hover:no-underline">
      <article className="card-interactive overflow-hidden">
        {/* Accent bar */}
        <div className={`h-1.5 ${accentClass}`} />
        <div className="p-5">
          <span className={`badge text-xs ${badgeClass} mb-2 inline-block`}>
            {eventCategories.find(c => c.id === event.category)?.label}
          </span>
          <h3 className="text-h4 font-serif text-secondary-800 leading-snug mb-2 group-hover:text-primary-700 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-caption text-ink-muted mb-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-1 text-caption text-ink-muted">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-caption text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
            View Details
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </span>
        </div>
      </article>
    </Link>
  )
}
