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
        <div className="text-center text-slate-600">Loading darshan...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">Daily Darshan</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Live and recorded darshan times from our temple network.</p>
      </header>

      <section>
        {items.length === 0 ? (
          <div className="p-6 bg-white/60 dark:bg-slate-900/60 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">No daily darshan items available right now. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d: Darshan) => (
              <article key={d._id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm">
                <div className="w-full h-44 bg-gray-100 dark:bg-slate-800">
                  {d.video ? (
                    <video controls src={d.video} className="w-full h-44 object-cover" />
                  ) : d.time ? (
                    <div className="flex items-center justify-center h-44">
                      <span className="text-xl font-medium text-slate-700 dark:text-slate-300">{d.time}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-44">
                      <span className="text-slate-500">No media</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{d.title}</h3>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{d.description}</p>

                  {d.time && (
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">Time: {d.time}</div>
                  )}
                  {d.temple && (
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Temple: {d.temple}</div>
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

