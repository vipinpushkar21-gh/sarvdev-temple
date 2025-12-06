"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

// Category mapping
const CATEGORY_MAP: { [key: string]: { label: string; hindi: string } } = {
  'mantra': { label: 'Mantra', hindi: 'मंत्र' },
  'bhajan': { label: 'Bhajan', hindi: 'भजन' },
  'stotra': { label: 'Stotra', hindi: 'स्तोत्र' },
  'aarti': { label: 'Aarti', hindi: 'आरती' },
  'chalisa': { label: 'Chalisa', hindi: 'चालीसा' },
  'stuti': { label: 'Stuti', hindi: 'स्तुति' },
  'shloka': { label: 'Shloka', hindi: 'श्लोक' },
  'ek-shloki': { label: 'Ek Shloki', hindi: 'एक श्लोकी' },
  'ashtaka': { label: 'Ashtaka', hindi: 'अष्टक' },
  'sahasranama': { label: 'Sahasranama', hindi: 'सहस्रनाम' },
  'path': { label: 'Path', hindi: 'पाठ' },
  'rashi': { label: 'Rashi', hindi: 'राशि' },
  'other': { label: 'Other', hindi: 'अन्य' },
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeity, setSelectedDeity] = useState<string>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all')

  const categorySlug = params.category as string
  const categoryInfo = CATEGORY_MAP[categorySlug]

  useEffect(() => {
    async function fetchDevotionals() {
      try {
        const res = await fetch('/api/devotionals')
        if (res.ok) {
          const data = await res.json()
          // Filter by category and approved status
          const filtered = data.filter((d: Devotional) => 
            d.status === 'approved' && 
            d.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug
          )
          setDevotionals(filtered)
        }
      } catch (error) {
        console.error('Failed to fetch devotionals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDevotionals()
  }, [categorySlug])

  // Get unique deities from devotionals
  const deities = ['all', ...Array.from(new Set(devotionals.map(d => d.deity).filter(Boolean)))]
  
  // Check if this is Mantra category and has Rashi mantras
  const rashiMantras = devotionals.filter(d => 
    d.title?.toLowerCase().includes('rashi') || 
    d.title?.toLowerCase().includes('aries') ||
    d.title?.toLowerCase().includes('taurus') ||
    d.title?.toLowerCase().includes('gemini') ||
    d.title?.toLowerCase().includes('cancer') ||
    d.title?.toLowerCase().includes('leo') ||
    d.title?.toLowerCase().includes('virgo') ||
    d.title?.toLowerCase().includes('libra') ||
    d.title?.toLowerCase().includes('scorpio') ||
    d.title?.toLowerCase().includes('sagittarius') ||
    d.title?.toLowerCase().includes('capricorn') ||
    d.title?.toLowerCase().includes('aquarius') ||
    d.title?.toLowerCase().includes('pisces')
  )
  const hasRashiMantras = rashiMantras.length > 0
  
  // Filter by deity
  let filteredByDeity = selectedDeity === 'all'
    ? devotionals
    : devotionals.filter(d => d.deity === selectedDeity)
  
  // Further filter by subcategory (Rashi)
  if (selectedSubCategory === 'rashi') {
    filteredByDeity = filteredByDeity.filter(d => 
      d.title?.toLowerCase().includes('rashi') || 
      d.title?.toLowerCase().includes('aries') ||
      d.title?.toLowerCase().includes('taurus') ||
      d.title?.toLowerCase().includes('gemini') ||
      d.title?.toLowerCase().includes('cancer') ||
      d.title?.toLowerCase().includes('leo') ||
      d.title?.toLowerCase().includes('virgo') ||
      d.title?.toLowerCase().includes('libra') ||
      d.title?.toLowerCase().includes('scorpio') ||
      d.title?.toLowerCase().includes('sagittarius') ||
      d.title?.toLowerCase().includes('capricorn') ||
      d.title?.toLowerCase().includes('aquarius') ||
      d.title?.toLowerCase().includes('pisces')
    )
  } else if (selectedSubCategory === 'other') {
    filteredByDeity = filteredByDeity.filter(d => 
      !d.title?.toLowerCase().includes('rashi') && 
      !d.title?.toLowerCase().includes('aries') &&
      !d.title?.toLowerCase().includes('taurus') &&
      !d.title?.toLowerCase().includes('gemini') &&
      !d.title?.toLowerCase().includes('cancer') &&
      !d.title?.toLowerCase().includes('leo') &&
      !d.title?.toLowerCase().includes('virgo') &&
      !d.title?.toLowerCase().includes('libra') &&
      !d.title?.toLowerCase().includes('scorpio') &&
      !d.title?.toLowerCase().includes('sagittarius') &&
      !d.title?.toLowerCase().includes('capricorn') &&
      !d.title?.toLowerCase().includes('aquarius') &&
      !d.title?.toLowerCase().includes('pisces')
    )
  }

  if (!categoryInfo) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Category Not Found</h1>
        <Link href="/devotionals" className="text-orange-600 hover:underline">
          ← Back to Devotionals
        </Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">Loading {categoryInfo.label}...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        <Link href="/devotionals" className="hover:text-orange-600 transition-colors">
          Devotionals
        </Link>
        <span className="mx-2">/</span>
        <span className="text-orange-600 font-medium">{categoryInfo.label}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-playfair text-orange-600 font-bold mb-2">
          {categoryInfo.label}
        </h1>
        <p className="text-2xl text-orange-500 font-medium mb-4">{categoryInfo.hindi}</p>
        <p className="text-slate-600 dark:text-slate-300">
          {filteredByDeity.length} {categoryInfo.label}{filteredByDeity.length !== 1 ? 's' : ''} available
        </p>
      </header>

      {/* Deity Filter */}
      {deities.length > 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">
            Filter by Deity
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {deities.map(deity => (
              <button
                key={deity}
                onClick={() => {
                  setSelectedDeity(deity || 'all')
                  setSelectedSubCategory('all')
                }}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedDeity === deity && selectedSubCategory === 'all'
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700'
                }`}
              >
                {deity === 'all' ? '🕉️ All Deities' : `🙏 ${deity}`}
              </button>
            ))}
            
            {/* Rashi Filter - Show in Mantra category if Rashi mantras exist */}
            {hasRashiMantras && (
              <button
                onClick={() => {
                  setSelectedDeity('all')
                  setSelectedSubCategory('rashi')
                }}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedSubCategory === 'rashi'
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700'
                }`}
              >
                ♈ Rashi Mantras ({rashiMantras.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Devotionals Grid */}
      <section>
        {filteredByDeity.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🕉️</div>
            <p className="text-lg text-slate-500 mb-6">
              {devotionals.length === 0 
                ? `No ${categoryInfo.label}s available yet.`
                : `No ${categoryInfo.label}s found for ${selectedDeity}.`
              }
            </p>
            {devotionals.length === 0 && (
              <Link 
                href="/devotionals" 
                className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Browse All Categories
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredByDeity.map((d: Devotional) => (
              <article 
                key={d._id} 
                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight pr-2">
                    {d.title}
                  </h3>
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full shrink-0">
                    {d.category}
                  </span>
                </div>

                {d.deity && (
                  <p className="text-sm text-orange-600 font-medium mb-2">🕉️ {d.deity}</p>
                )}

                {d.description && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 flex-grow">
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

      {/* Back Button */}
      <div className="mt-12 text-center">
        <Link 
          href="/devotionals"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Browse All Categories
        </Link>
      </div>
    </main>
  )
}
