"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Hero from '../../components/Hero'

type Event = {
  _id: string
  title: string
  description?: string
  date?: string
  image?: string
  status?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          // Only show approved events
          const approved = data.filter((e: Event) => e.status === 'approved')
          setEvents(approved)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <>
        <Hero title="Upcoming Events" subtitle="Calendar of festivals, cultural programs and temple events." />
        <main className="page-container section-sm">
          <div className="text-center text-ink-muted">Loading events...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Upcoming Events" subtitle="Calendar of festivals, cultural programs and temple events." />
      <main className="page-container section-sm">

      {events.length === 0 ? (
        <div className="card p-6">
          <p className="text-ink-muted">No upcoming events at the moment. Check back later.</p>
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev: Event) => (
              <article key={ev._id} className="card-interactive overflow-hidden">
                {ev.image ? (
                  <div className="relative h-48 w-full bg-surface-sunken">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h4 text-secondary-700 font-serif">{ev.title}</h3>
                    {ev.date && (
                      <time className="text-caption text-ink-muted">
                        {new Date(ev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    )}
                  </div>

                  <p className="mt-2 text-body-sm text-ink-muted">{ev.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        )}
        </main>
      </>
  )
}
