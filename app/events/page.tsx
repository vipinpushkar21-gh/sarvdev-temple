"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { eventCategories, hinduEvents } from '../../data/events'
import { getTempleCardImage } from '../../lib/temple-image'
import SarvdevImage from '../../components/SarvdevImage'
import type { SarvdevMediaAsset } from '../../lib/media-asset'

type EventItem = {
  _id?: string
  slug: string
  title: string
  titleHi?: string
  shortDescription?: string
  description?: string
  category?: string
  eventType?: string
  startDate?: string
  endDate?: string
  date?: string
  startTime?: string
  endTime?: string
  city?: string
  state?: string
  location?: string
  locationName?: string
  isOnline?: boolean
  liveUrl?: string
  featured?: boolean
  image?: string
  imageCard?: string
  imageHero?: string
  cardMedia?: SarvdevMediaAsset
  heroMedia?: SarvdevMediaAsset
  deityName?: string
  templeName?: string
  status?: string
}

const filters = ['All', 'Today', 'This Week', 'This Month', 'Festivals', 'Temple Events', 'Online/Live', 'Vrat/Fasting', 'Featured']

function staticFallback(): EventItem[] {
  return hinduEvents.map((event) => ({
    ...event,
    startDate: event.date,
    endDate: event.endDate || event.date,
    shortDescription: event.description.slice(0, 180),
    locationName: event.location,
    eventType: event.category,
    status: 'published',
  }))
}

function dateLabel(event: EventItem) {
  const start = new Date(`${event.startDate || event.date}T12:00:00`)
  const endValue = event.endDate && event.endDate !== (event.startDate || event.date) ? new Date(`${event.endDate}T12:00:00`) : null
  if (endValue) return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${endValue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
  return start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(event: EventItem) {
  const start = new Date(`${event.startDate || event.date}T00:00:00`).getTime()
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime()
  return Math.ceil((start - today) / 86_400_000)
}

function calendarHref(event: EventItem) {
  const start = (event.startDate || event.date || '').replace(/-/g, '')
  const end = (event.endDate || event.startDate || event.date || '').replace(/-/g, '')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.shortDescription || event.description || '')}&location=${encodeURIComponent(event.locationName || event.location || '')}`
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [deity, setDeity] = useState('')

  useEffect(() => {
    fetch('/api/events?page=1&limit=50', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        setEvents(Array.isArray(items) && items.length > 0 ? items : staticFallback())
      })
      .catch(() => setEvents(staticFallback()))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const weekEnd = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
  const month = today.slice(0, 7)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((event) => {
      const start = event.startDate || event.date || ''
      if (filter === 'Today' && !(start <= today && (event.endDate || start) >= today)) return false
      if (filter === 'This Week' && !(start >= today && start <= weekEnd)) return false
      if (filter === 'This Month' && !start.startsWith(month)) return false
      if (filter === 'Festivals' && event.category !== 'festival') return false
      if (filter === 'Temple Events' && !event.templeName && !event.locationName?.toLowerCase().includes('temple')) return false
      if (filter === 'Online/Live' && !event.isOnline && !event.liveUrl) return false
      if (filter === 'Vrat/Fasting' && !`${event.title} ${event.description}`.toLowerCase().includes('fast')) return false
      if (filter === 'Featured' && !event.featured) return false
      if (city && !(event.city || event.locationName || event.location || '').toLowerCase().includes(city.toLowerCase())) return false
      if (state && !(event.state || '').toLowerCase().includes(state.toLowerCase())) return false
      if (deity && !(event.deityName || event.title || '').toLowerCase().includes(deity.toLowerCase())) return false
      if (q && !`${event.title} ${event.titleHi} ${event.description} ${event.city} ${event.state} ${event.templeName} ${event.deityName}`.toLowerCase().includes(q)) return false
      return true
    }).sort((a, b) => new Date(a.startDate || a.date || '').getTime() - new Date(b.startDate || b.date || '').getTime())
  }, [events, filter, search, city, state, deity, today, weekEnd, month])

  const featured = filtered.find((event) => event.featured) || filtered[0]
  const states = Array.from(new Set(events.map((event) => event.state).filter(Boolean))).sort()
  const cities = Array.from(new Set(events.map((event) => event.city || event.locationName || event.location).filter(Boolean))).sort()

  return (
    <>
      <section className="relative overflow-hidden bg-[#1b1010] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(251,191,36,0.25),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(248,113,113,0.2),transparent_24%),linear-gradient(135deg,rgba(76,29,149,0.35),rgba(24,24,27,0.96))]" />
        <div className="page-container relative py-16 md:py-20">
          <p className="text-overline uppercase tracking-[0.18em] text-amber-200 mb-3">Sacred Calendar</p>
          <h1 className="text-display-lg md:text-display-xl font-serif">Hindu Events & Festivals</h1>
          <p className="mt-2 text-h2 font-devanagari text-amber-100">उत्सव और पर्व</p>
          <p className="mt-5 max-w-2xl text-body-lg text-white/75">A premium festival calendar and temple events hub for sacred observances, yatras, vrats, live programs and devotional gatherings.</p>
        </div>
      </section>

      <main className="bg-[#f8f5ef]">
        <div className="page-container section-sm space-y-8">
          {featured && (
            <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="relative min-h-[280px]">
                <SarvdevImage image={getTempleCardImage({ cardMedia: featured.cardMedia, imageCard: featured.imageCard, image: featured.image })} alt={featured.title} className="absolute inset-0" imgClassName="object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-950">Featured</span>
                  <h2 className="mt-3 text-h1 font-serif text-white">{featured.title}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-overline uppercase tracking-[0.14em] text-amber-600">Upcoming Featured Event</p>
                <p className="mt-3 text-h3 font-serif text-gray-900">{dateLabel(featured)}</p>
                <p className="mt-2 text-body-sm text-gray-500">{featured.locationName || featured.location}{featured.state ? `, ${featured.state}` : ''}</p>
                <p className="mt-5 text-body text-gray-600 line-clamp-4">{featured.shortDescription || featured.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/events/${featured.slug}`} className="btn btn-primary no-underline hover:no-underline">View Details</Link>
                  <a href={calendarHref(featured)} target="_blank" rel="noopener noreferrer" className="btn btn-outline no-underline hover:no-underline">Add to Calendar</a>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="input" />
              <select value={state} onChange={(e) => setState(e.target.value)} className="input"><option value="">All States</option>{states.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input"><option value="">All Cities</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <input value={deity} onChange={(e) => setDeity(e.target.value)} placeholder="Deity filter..." className="input" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filter === item ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-100'}`}>{item}</button>
              ))}
            </div>
          </section>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-white" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <h2 className="text-h2 font-serif text-gray-900">No events found</h2>
              <p className="mt-2 text-gray-500">Try clearing filters or importing existing public events from admin.</p>
            </div>
          ) : (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-h2 font-serif text-gray-900">Festival Calendar</h2>
                <span className="rounded-full bg-white px-3 py-1 text-caption font-semibold text-gray-500">{filtered.length} events</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((event) => <EventCard key={event.slug || event._id} event={event} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

function EventCard({ event }: { event: EventItem }) {
  const days = daysUntil(event)
  const category = eventCategories.find((item) => item.id === event.category)
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
        <SarvdevImage image={getTempleCardImage({ cardMedia: event.cardMedia, imageCard: event.imageCard, image: event.image })} alt={event.title} className="absolute inset-0" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 text-center shadow-sm">
          <span className="block text-xl font-bold text-gray-900">{new Date(`${event.startDate || event.date}T12:00:00`).getDate()}</span>
          <span className="text-[10px] uppercase tracking-wide text-gray-500">{new Date(`${event.startDate || event.date}T12:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span>
        </div>
        {days >= 0 && <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">{days === 0 ? 'Today' : `${days} days`}</span>}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{category?.label || event.category}</span>
          {event.featured && <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">Featured</span>}
          {(event.isOnline || event.liveUrl) && <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Live/Online</span>}
        </div>
        <h3 className="text-h3 font-serif text-gray-900 group-hover:text-primary-700">{event.title}</h3>
        {event.titleHi && <p className="mt-1 text-body-sm text-gray-500">{event.titleHi}</p>}
        <p className="mt-3 text-body-sm text-gray-500">{dateLabel(event)} · {event.startTime || 'All day'}</p>
        <p className="mt-1 text-body-sm text-gray-500">{event.locationName || event.location || event.city}{event.state ? `, ${event.state}` : ''}</p>
        {(event.templeName || event.deityName) && <p className="mt-2 text-caption font-semibold text-primary-700">{event.templeName || event.deityName}</p>}
        <p className="mt-3 line-clamp-2 text-body-sm text-gray-600">{event.shortDescription || event.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <Link href={`/events/${event.slug}`} className="text-body-sm font-semibold text-primary-700 no-underline hover:no-underline">View Details</Link>
          <a href={calendarHref(event)} target="_blank" rel="noopener noreferrer" className="text-caption font-semibold text-gray-500 hover:text-gray-900">Calendar</a>
        </div>
      </div>
    </article>
  )
}
