"use client"

import { useEffect, useState } from 'react'

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  lyrics?: string
  duration?: string
  artist?: string
  status?: string
}

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    async function fetchDevotionals() {
      try {
        const res = await fetch('/api/devotionals')
        if (res.ok) {
          const data = await res.json()
          // Only show approved devotionals
          const approved = data.filter((d: Devotional) => d.status === 'approved')
          setDevotionals(approved)
        }
      } catch (error) {
        console.error('Failed to fetch devotionals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDevotionals()
  }, [])

  const categories = ['all', ...Array.from(new Set(devotionals.map(d => d.category).filter(Boolean)))]
  
  const filtered = selectedCategory === 'all' 
    ? devotionals 
    : devotionals.filter(d => d.category === selectedCategory)

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">Loading devotionals...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-playfair text-orange-600 font-bold">Devotionals</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">Bhajans, stotras and devotional audio for daily practice.</p>
      </header>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/60 text-slate-700 hover:bg-orange-100'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <section>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No devotionals found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d: Devotional) => (
              <article key={d._id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{d.title}</h3>
                  {d.category && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                      {d.category}
                    </span>
                  )}
                </div>

                {d.deity && (
                  <p className="text-sm text-orange-600 font-medium mb-2">🕉️ {d.deity}</p>
                )}

                {d.description && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 flex-grow">
                    {d.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  {d.artist && <span>🎤 {d.artist}</span>}
                  {d.duration && <span>⏱️ {d.duration}</span>}
                  {d.language && <span>🌐 {d.language}</span>}
                </div>

                <div className="mt-4">
                  {d.audio ? (
                    <audio controls src={d.audio} className="w-full rounded-md" />
                  ) : (
                    <p className="text-sm text-slate-500">No audio available</p>
                  )}
                </div>

                {d.lyrics && (
                  <details className="mt-3">
                    <summary className="text-sm text-orange-600 cursor-pointer hover:underline">
                      View Lyrics
                    </summary>
                    <div className="mt-2 p-3 bg-orange-50 rounded-md text-sm text-slate-700 whitespace-pre-line">
                      {d.lyrics}
                    </div>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

