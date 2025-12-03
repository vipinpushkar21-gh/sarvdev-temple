"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-slate-600">Loading events...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">Upcoming Events</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">Calendar of festivals, cultural programs and temple events.</p>
      </header>

      {events.length === 0 ? (
        <div className="p-6 bg-white/60 dark:bg-slate-900/60 rounded-lg">
          <p className="text-slate-700 dark:text-slate-300">No upcoming events at the moment. Check back later.</p>
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev: Event) => (
              <article key={ev._id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm">
                {ev.image ? (
                  <div className="relative h-44 w-full">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-gradient-to-r from-emerald-200 to-emerald-400 flex items-center justify-center text-white">🎉</div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{ev.title}</h3>
                    {ev.date && (
                      <time className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(ev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{ev.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
