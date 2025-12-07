"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

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

// All devotional categories with bilingual labels
const ALL_CATEGORIES = [
  { id: 'all', label: 'All', hindi: 'सभी' },
  { id: 'Mantra', label: 'Mantra', hindi: 'मंत्र' },
  { id: 'Bhajan', label: 'Bhajan', hindi: 'भजन' },
  { id: 'Stotra', label: 'Stotra', hindi: 'स्तोत्र' },
  { id: 'Aarti', label: 'Aarti', hindi: 'आरती' },
  { id: 'Chalisa', label: 'Chalisa', hindi: 'चालीसा' },
  { id: 'Stuti', label: 'Stuti', hindi: 'स्तुति' },
  { id: 'Shloka', label: 'Shloka', hindi: 'श्लोक' },
  { id: 'Ek Shloki', label: 'Ek Shloki', hindi: 'एक श्लोकी' },
  { id: 'Ashtaka', label: 'Ashtaka', hindi: 'अष्टक' },
  { id: 'Sahasranama', label: 'Sahasranama', hindi: 'सहस्रनाम' },
  { id: 'Path', label: 'Path', hindi: 'पाठ' },
  { id: 'Rashi', label: 'Rashi', hindi: 'राशि' },
  { id: 'Vastu', label: 'Vastu', hindi: 'वास्तु' },
  { id: 'Durga', label: 'Durga', hindi: 'दुर्गा' },
  { id: 'Kuber', label: 'Kuber', hindi: 'कुबेर' },
  { id: 'Other', label: 'Other', hindi: 'अन्य' },
]

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)

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

  // Get categories that have devotionals
  const categoriesWithContent = ALL_CATEGORIES.filter(cat => 
    cat.id === 'all' || devotionals.some(d => d.category === cat.id)
  )

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">Loading devotionals...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-playfair text-orange-600 font-bold">Devotionals</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-200 text-lg">Explore sacred mantras, bhajans, stotras and more</p>
      </header>

      {/* Category Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categoriesWithContent.map(cat => {
            const count = cat.id === 'all' 
              ? devotionals.length 
              : devotionals.filter(d => d.category === cat.id).length
            
            return (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/devotionals' : `/devotionals/${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-800/30 dark:hover:to-amber-800/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-orange-600/70 dark:text-orange-500/70 mb-3 font-medium">
                    {cat.hindi}
                  </p>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white text-sm font-bold">
                    {count}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl ring-2 ring-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent Devotionals */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Recently Added</h2>
        {devotionals.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No devotionals available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devotionals.slice(0, 6).map((d: Devotional) => (
              <article key={d._id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">{d.title}</h3>
                  {d.category && (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full shrink-0 ml-2">
                      {d.category}
                    </span>
                  )}
                </div>

                {d.deity && (
                  <p className="text-sm text-orange-600 font-medium mb-2">🕉️ {d.deity}</p>
                )}

                {d.description && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 flex-grow line-clamp-3">
                    {d.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  {d.artist && <span>🎤 {d.artist}</span>}
                  {d.duration && <span>⏱️ {d.duration}</span>}
                  {d.language && <span>🌐 {d.language}</span>}
                </div>

                <div className="mt-4">
                  {d.audio ? (
                    <audio controls src={d.audio} className="w-full rounded-md" />
                  ) : (
                    <p className="text-sm text-slate-400 italic">Text-based devotional</p>
                  )}
                </div>

                {d.lyrics && (
                  <details className="mt-4">
                    <summary className="text-sm text-orange-600 cursor-pointer hover:underline font-medium">
                      View Lyrics
                    </summary>
                    <div className="mt-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line border border-orange-200/50 dark:border-orange-700/50">
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

