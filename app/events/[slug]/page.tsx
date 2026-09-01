"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ShareButtons from '../../../components/ShareButtons'
import { hinduEvents } from '../../../data/events'
import { getGalleryImage, getTempleHeroImage } from '../../../lib/temple-image'
import SarvdevImage from '../../../components/SarvdevImage'

type EventItem = any

function fallbackEvent(slug: string) {
  const event = hinduEvents.find((item) => item.slug === slug)
  if (!event) return null
  return {
    ...event,
    startDate: event.date,
    endDate: event.endDate || event.date,
    shortDescription: event.description.slice(0, 180),
    locationName: event.location,
    eventType: event.category,
    status: 'published',
  }
}

function dateLabel(event: EventItem) {
  const start = new Date(`${event.startDate || event.date}T12:00:00`)
  const end = event.endDate && event.endDate !== (event.startDate || event.date) ? new Date(`${event.endDate}T12:00:00`) : null
  if (end) return `${start.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} - ${end.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`
  return start.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function countdown(event: EventItem) {
  const start = new Date(`${event.startDate || event.date}T00:00:00`).getTime()
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime()
  const days = Math.ceil((start - today) / 86_400_000)
  if (days === 0) return 'Today'
  if (days > 0) return `${days} days to go`
  return 'Past event'
}

function calendarHref(event: EventItem) {
  const start = (event.startDate || event.date || '').replace(/-/g, '')
  const end = (event.endDate || event.startDate || event.date || '').replace(/-/g, '')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.locationName || event.location || '')}`
}

export default function EventDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/events/${slug}`, { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setEvent(data || fallbackEvent(slug)))
      .catch(() => setEvent(fallbackEvent(slug)))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page-container section-sm"><div className="h-96 rounded-2xl bg-gray-100 animate-pulse" /></div>

  if (!event) {
    return (
      <main className="page-container section-sm text-center">
        <h1 className="text-h1 font-serif text-gray-900">Event Not Found</h1>
        <p className="mt-2 text-gray-500">This event could not be found.</p>
        <Link href="/events" className="btn btn-primary mt-6 no-underline hover:no-underline">Back to Events</Link>
      </main>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate || event.date,
    endDate: event.endDate || event.startDate || event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isOnline ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    image: [event.imageHero || event.imageCard || event.image].filter(Boolean),
    location: event.isOnline ? undefined : {
      '@type': 'Place',
      name: event.locationName || event.location,
      address: [event.address, event.city, event.state, event.country].filter(Boolean).join(', '),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative min-h-[clamp(360px,100vw,420px)] overflow-hidden bg-gray-950 text-white sm:min-h-[520px]">
        <SarvdevImage image={getTempleHeroImage({ heroMedia: event.heroMedia, primaryMedia: event.primaryMedia, cardMedia: event.cardMedia, imageHero: event.imageHero, imageCard: event.imageCard, image: event.image })} alt={event.title} className="absolute inset-0" imgClassName="object-cover opacity-70" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/75 to-gray-950/35" />
        <div className="page-container relative flex min-h-[clamp(360px,100vw,420px)] items-end pb-8 pt-16 sm:min-h-[520px] sm:pb-12 sm:pt-0">
          <div className="max-w-4xl">
            <nav className="mb-3 flex items-center gap-2 text-body-sm text-white/85 sm:mb-5">
              <Link href="/" className="text-white/85 no-underline hover:text-white">Home</Link><span>/</span>
              <Link href="/events" className="text-white/85 no-underline hover:text-white">Events</Link><span>/</span>
              <span className="truncate">{event.title}</span>
            </nav>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-950">{event.category || 'event'}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">{countdown(event)}</span>
              {event.isOnline && <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-green-950">Online</span>}
            </div>
            <h1 className="text-[clamp(2.25rem,10vw,3rem)] font-serif leading-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] sm:text-display-lg">{event.title}</h1>
            {event.titleHi && <p className="mt-2 text-h2 font-devanagari text-amber-100">{event.titleHi}</p>}
            <p className="mt-3 line-clamp-3 max-w-2xl text-base leading-6 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:mt-5 sm:block sm:text-body-lg">{event.shortDescription || event.description}</p>
          </div>
        </div>
      </section>

      <main className="bg-[#f8f5ef]">
        <div className="page-container section-sm grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-8">
          <div className="space-y-6">
            <Info title="Significance" body={event.significance} />
            <ListInfo title="Rituals" items={event.rituals} />
            <Info title="Puja Vidhi" body={event.pujaVidhi} />
            <Info title="Fasting Info" body={event.fastingInfo} />
            <Info title="Best Time To Visit" body={event.bestTimeToVisit} />
            {(event.templeName || event.deityName || event.relatedDevotionalSlugs?.length > 0) && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-h2 font-serif text-gray-900">Related Sacred Links</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {event.templeSlug && <Link href={`/temples/${event.templeSlug}`} className="btn btn-outline btn-sm no-underline hover:no-underline">{event.templeName || 'Temple'}</Link>}
                  {event.deitySlug && <Link href={`/deities/${event.deitySlug}`} className="btn btn-outline btn-sm no-underline hover:no-underline">{event.deityName || 'Deity'}</Link>}
                  {event.relatedDevotionalSlugs?.map((item: string) => <Link key={item} href={`/devotionals/${item}`} className="btn btn-outline btn-sm no-underline hover:no-underline">Devotional</Link>)}
                </div>
              </section>
            )}
            {event.galleryImages?.length > 0 && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-h2 font-serif text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {event.galleryImages.map((image: string, index: number) => (
                    <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <SarvdevImage image={getGalleryImage(image)} alt={`${event.title} ${index + 1}`} className="absolute inset-0" imgClassName="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-h3 font-serif text-gray-900">Event Details</h2>
              <div className="mt-5 space-y-3 text-body-sm text-gray-600">
                <p><span className="font-semibold text-gray-900">Date:</span> {dateLabel(event)}</p>
                <p><span className="font-semibold text-gray-900">Time:</span> {event.isAllDay ? 'All day' : [event.startTime, event.endTime].filter(Boolean).join(' - ') || 'All day'}</p>
                <p><span className="font-semibold text-gray-900">Location:</span> {event.locationName || event.location || 'Online'}{event.state ? `, ${event.state}` : ''}</p>
                {event.tithi && <p><span className="font-semibold text-gray-900">Tithi:</span> {event.tithi}</p>}
                {event.hinduMonth && <p><span className="font-semibold text-gray-900">Hindu Month:</span> {event.hinduMonth}</p>}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <a href={calendarHref(event)} target="_blank" rel="noopener noreferrer" className="btn btn-primary no-underline hover:no-underline">Add to Calendar</a>
                {event.mapsLink && <a href={event.mapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline no-underline hover:no-underline">Open Map</a>}
                {event.liveUrl && <a href={event.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline no-underline hover:no-underline">Watch Live</a>}
              </div>
            </section>
            <ShareButtons title={event.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
          </aside>
        </div>
      </main>
    </>
  )
}

function Info({ title, body }: { title: string; body?: string }) {
  if (!body) return null
  return <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-h2 font-serif text-gray-900">{title}</h2><p className="mt-3 text-body text-gray-600 leading-relaxed">{body}</p></section>
}

function ListInfo({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-h2 font-serif text-gray-900">{title}</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, index) => <div key={item} className="rounded-xl bg-amber-50 p-3 text-body-sm text-gray-700"><span className="font-bold text-amber-700">{index + 1}.</span> {item}</div>)}
      </div>
    </section>
  )
}
