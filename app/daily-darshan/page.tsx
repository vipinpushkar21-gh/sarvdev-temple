"use client"

import { useEffect, useState } from 'react'
import Hero from '../../components/Hero'

type Darshan = {
  _id: string
  title: string
  description?: string
  time?: string
  video?: string
  temple?: string
  status?: string
}

export default function DailyDarshanPage() {
  const [items, setItems] = useState<Darshan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDarshan() {
      try {
        const res = await fetch('/api/darshan')
        if (res.ok) {
          const data = await res.json()
          // Only show approved darshan
          const approved = data.filter((d: Darshan) => d.status === 'approved')
          setItems(approved)
        }
      } catch (error) {
        console.error('Failed to fetch darshan:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDarshan()
  }, [])

  if (loading) {
    return (
      <>
        <Hero title="Daily Darshan" subtitle="Live and recorded darshan from our temple network" />
        <main className="page-container section-sm">
          <div className="text-center text-ink-muted">Loading darshan...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Daily Darshan" subtitle="Live and recorded darshan from our temple network" />
      <main className="page-container section-sm">

      <section>
        {items.length === 0 ? (
          <div className="card p-6">
            <p className="text-ink-muted">No daily darshan items available right now. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d: Darshan) => (
              <article key={d._id} className="card-interactive overflow-hidden">
                <div className="w-full h-48 bg-surface-sunken">
                  {d.video ? (
                    <video controls src={d.video} className="w-full h-48 object-cover" />
                  ) : d.time ? (
                    <div className="flex items-center justify-center h-48">
                      <span className="text-h3 font-medium text-ink-muted">{d.time}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <span className="text-ink-faint">No media</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-h4 text-secondary-700 font-serif">{d.title}</h3>
                  <p className="mt-2 text-body-sm text-ink-muted">{d.description}</p>

                  {d.time && (
                    <div className="mt-3 text-caption text-ink-muted">Time: {d.time}</div>
                  )}
                  {d.temple && (
                    <div className="mt-1 text-caption text-ink-muted">Temple: {d.temple}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </main>
    </>
  )
}

