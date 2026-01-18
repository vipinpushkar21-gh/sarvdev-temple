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
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-text">Loading events...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Upcoming Events" subtitle="Calendar of festivals, cultural programs and temple events." />
      <main className="max-w-6xl mx-auto px-4 py-12">

      {events.length === 0 ? (
        <div className="p-6 bg-background rounded-lg border border-accent/30">
          <p className="text-text">No upcoming events at the moment. Check back later.</p>
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev: Event) => (
              <article key={ev._id} className="bg-background rounded-xl overflow-hidden shadow-sm border border-accent/20">
                {ev.image ? (
                  <div className="relative h-44 w-full">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-accent/20 flex items-center justify-center text-secondary">🎉</div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text">{ev.title}</h3>
                    {ev.date && (
                      <time className="text-sm text-text">
                        {new Date(ev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-text">{ev.description}</p>
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
