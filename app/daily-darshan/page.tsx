"use client"

import { useEffect, useState } from 'react'

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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-text">Loading darshan...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Daily Darshan</h1>
        <p className="mt-2 text-text text-base">Live and recorded darshan times from our temple network.</p>
      </header>

      <section>
        {items.length === 0 ? (
          <div className="p-6 bg-background rounded-lg border border-accent/30">
            <p className="text-text">No daily darshan items available right now. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d: Darshan) => (
              <article key={d._id} className="bg-background rounded-xl overflow-hidden shadow-sm border border-accent/20">
                <div className="w-full h-44 bg-accent/20">
                  {d.video ? (
                    <video controls src={d.video} className="w-full h-44 object-cover" />
                  ) : d.time ? (
                    <div className="flex items-center justify-center h-44">
                      <span className="text-xl font-medium text-text">{d.time}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-44">
                      <span className="text-text">No media</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-primary">{d.title}</h3>
                  <p className="mt-2 text-sm text-text">{d.description}</p>

                  {d.time && (
                    <div className="mt-3 text-xs text-text">Time: {d.time}</div>
                  )}
                  {d.temple && (
                    <div className="mt-1 text-xs text-text">Temple: {d.temple}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

