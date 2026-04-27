"use client"

import { useEffect, useState } from 'react'
import { isDevanagari, renderBilingualTitle } from '../../utils/bilingual'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Helper function to create URL slug from title
function createSlug(title: string): string {
  // Extract English text from parentheses if present
  const englishMatch = title.match(/\(([^)]+)\)/);
  let text = englishMatch ? englishMatch[1] : title;
  
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // If slug is empty, transliterate
  if (!slug || slug === '-' || slug === '') {
    const translitMap: {[key: string]: string} = {
      'श्री': 'shri',
      'गणेश': 'ganesh',
      'आरती': 'aarti',
      'चालीसा': 'chalisa',
      'मंत्र': 'mantra',
      'स्तोत्र': 'stotra',
      'भजन': 'bhajan'
    };
    
    let transliterated = title.toLowerCase();
    for (const [devanagari, english] of Object.entries(translitMap)) {
      transliterated = transliterated.replace(new RegExp(devanagari, 'g'), english);
    }
    
    slug = transliterated
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  return slug || 'devotional';
}

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
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
  image?: string
}

// Category mapping with images
const CATEGORY_MAP: { [key: string]: { label: string; hindi: string; image?: string } } = {
  'mantra': { label: 'Mantra', hindi: 'मंत्र', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/mantra.jpg' },
  'bhajan': { label: 'Bhajan', hindi: 'भजन', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/bhajan.jpg' },
  'stotra': { label: 'Stotra/Suktam', hindi: 'स्तोत्र/सूक्त', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/stotra.jpg' },
  'aarti': { label: 'Aarti', hindi: 'आरती', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/aarti.jpg' },
  'chalisa': { label: 'Chalisa', hindi: 'चालीसा', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/chalisa.jpg' },
  'stuti': { label: 'Stuti', hindi: 'स्तुति', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/stuti.jpg' },
  'shloka': { label: 'Shloka', hindi: 'श्लोक', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/shloka.jpg' },
  'ek-shloki': { label: 'Ek Shloki', hindi: 'एक श्लोकी', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/shloka.jpg' },
  'ashtaka': { label: 'Ashtaka', hindi: 'अष्टक', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/ashtaka.jpg' },
  'path': { label: 'Path', hindi: 'पाठ', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/path.jpg' },
  'rashi': { label: 'Rashi', hindi: 'राशि', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/rashi.jpg' },
  'vastu': { label: 'Vastu', hindi: 'वास्तु', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/vastu.jpg' },
  'durga': { label: 'Durga', hindi: 'दुर्गा', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/durga.jpg' },
  'kuber': { label: 'Kuber', hindi: 'कुबेर', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/kuber.jpg' },
  'namavali': { label: 'Namavali', hindi: 'नामावली', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/namavali.jpg' },
  'kavacham': { label: 'Kavacham', hindi: 'कवचम्', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/kavacham.jpg' },
  'prarthana': { label: 'Prarthana', hindi: 'प्रार्थना', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/prarthana.jpg' },
  'vrat-katha': { label: 'Vrat Katha', hindi: 'व्रत कथा', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/vrat-katha.jpg' },
  'other': { label: 'Other', hindi: 'अन्य', image: 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg' }
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeity, setSelectedDeity] = useState<string>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all')

  const categorySlug = params.slug as string
  const categoryInfo = CATEGORY_MAP[categorySlug]

  useEffect(() => {
    async function fetchDevotionals() {
      try {
        const res = await fetch(`/api/devotionals`)
        if (res.ok) {
          const data = await res.json()
          // Filter by category and approved status
          const filtered = data.filter((d: Devotional) => {
            if (d.status !== 'approved') return false
            // Merge all namavali types under single 'namavali' slug
            if (categorySlug === 'namavali') {
              return d.category === 'Namavali' || d.category === '108 Namavali'
            }
            return d.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug
          })
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
      <main className="page-container section-sm text-center">
        <h1 className="text-h2 font-serif text-secondary-700 mb-4">Category Not Found</h1>
        <Link href="/devotionals" className="text-primary-600 hover:text-primary-700">
          Back to Devotionals
        </Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="page-container section-sm">
        <div className="text-center text-ink-muted">Loading {categoryInfo.label}...</div>
      </main>
    )
  }

  return (
    <main className="page-container section-sm">
      {/* Ganesh Ashtaka Ad Section */}
      {categorySlug === 'ashtaka' && devotionals.length === 1 && devotionals[0].deity && devotionals[0].deity.toLowerCase().includes('ganesh') && (selectedDeity === 'all' || selectedDeity.toLowerCase().includes('ganesh')) && (
        <div className="mb-10 p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-pink-50 border border-yellow-200 shadow-card text-center">
          <h2 className="text-h3 font-serif text-pink-700 mb-2">॥ atha shri ganeshashtakam ॥</h2>
          <p className="text-body font-medium text-amber-900 mb-2">shri ganeshaya namah</p>
          <p className="text-body-sm text-ink-muted mb-4">Deity: <span className="font-semibold text-primary-700">Ganesh</span></p>
          <div className="mb-4 text-body-sm text-ink">
            <p className="mb-2">sarve uchuh.</p>
            <p className="mb-2">yato'nantashakter anantashcha jivayato nirgunadaprameya gunaste.</p>
            <p className="mb-2">yato bhati sarvam tridha bhedabhinnam sada tam ganesham namamo bhajamah ॥1॥</p>
            <p className="mb-2">yatashchavirasij jagat sarvametat tatha'bjasano vishvago vishvagopta.</p>
            <p className="mb-2">tathendrādayo devasangha manushyah sada tam ganesham namamo bhajamah ॥2॥</p>
            <p className="mb-2">yato vahnibhanū bhavo bhurjalam chayatah sagarashchandrama vyoma vayuh.</p>
            <p className="mb-2">yatah sthavara jangama vrikshasangha sada tam ganesham namamo bhajamah ॥3॥</p>
            <p className="mb-2">yato danavah kinnarā yakshasangha yatashcharana varanah shvapadashcha.</p>
            <p className="mb-2">yatah pakshikita yato virudhah cha sada tam ganesham namamo bhajamah ॥4॥</p>
            <p className="mb-2">yato buddhir ajnananasho mumukshor yatah sampado bhaktasantoshikah syuh.</p>
            <p className="mb-2">yato vighnanasho yatah karyasiddhih sada tam ganesham namamo bhajamah ॥5॥</p>
            <p className="mb-2">yatah putrasampad yato vanchhitartho yato'bhaktavighnastatha'nekarupah.</p>
            <p className="mb-2">yatah shokamohau yatah kama eva sada tam ganesham namamo bhajamah ॥6॥</p>
            <p className="mb-2">yato'nantashaktih sa shesho babhuva dharadhārane'nekarupe cha shaktah.</p>
            <p className="mb-2">yato'nekadha svargalokā hi nana sada tam ganesham namamo bhajamah ॥7॥</p>
            <p className="mb-2">yato vedavacho vikuntha manobhih sada neti neti iti yatta grinanti.</p>
            <p className="mb-2">parabrahmarupam chidanandabhutam sada tam ganesham namamo bhajamah ॥8॥</p>
          </div>
          <a href="/devotionals/ganeshashtakam" className="inline-block mt-2 px-6 py-2 rounded-full bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition">Read Full Ganeshashtakam</a>
        </div>
      )}
      {/* Breadcrumb */}
      <nav className="mb-6 text-body-sm text-ink-muted">
        <Link href="/devotionals" className="hover:text-primary-600 transition-colors">
          Devotionals
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary-600 font-medium">{categoryInfo.hindi} ({categoryInfo.label})</span>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-h1 font-serif text-secondary-700 mb-3">
          {categoryInfo.hindi} ({categoryInfo.label})
        </h1>
        <p className="text-body text-ink-muted">
          {filteredByDeity.length} {categoryInfo.label}{filteredByDeity.length !== 1 ? 's' : ''} available
        </p>
      </header>

      {/* Deity Filter */}
      {deities.length > 1 && (
        <div className="mb-8">
          <h3 className="text-h4 font-serif text-secondary-700 mb-4 text-center">
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
                className={`px-5 py-2.5 rounded-full font-medium transition-shadow duration-200 border ${
                  selectedDeity === deity && selectedSubCategory === 'all'
                    ? 'bg-primary-100 text-primary-800 border-primary-400 font-semibold shadow-card-hover'
                    : 'bg-surface-raised text-ink border-surface-border hover:shadow-card'
                }`}
              >
                {deity === 'all' ? 'All Deities' : deity}
              </button>
            ))}
            
            {/* Rashi Filter - Show in Mantra category if Rashi mantras exist */}
            {hasRashiMantras && (
              <button
                onClick={() => {
                  setSelectedDeity('all')
                  setSelectedSubCategory('rashi')
                }}
                className={`px-5 py-2.5 rounded-full font-medium transition-shadow duration-200 border ${
                  selectedSubCategory === 'rashi'
                    ? 'bg-primary-100 text-primary-800 border-primary-400 font-semibold shadow-card-hover'
                    : 'bg-surface-raised text-ink border-surface-border hover:shadow-card'
                }`}
              >
                Rashi Mantras ({rashiMantras.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Devotionals Grid */}
      <section>
        {filteredByDeity.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-body text-ink-muted mb-6">
              {devotionals.length === 0 
                ? `No ${categoryInfo.label}s available yet.`
                : `No ${categoryInfo.label}s found for ${selectedDeity}.`
              }
            </p>
            {devotionals.length === 0 && (
              <Link 
                href="/devotionals" 
                className="btn btn-primary"
              >
                Browse All Categories
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredByDeity.map((d: Devotional) => {
              const categoryKey = d.category?.toLowerCase().replace(/\s+/g, '-') || 'other'
              const categoryImage = CATEGORY_MAP[categoryKey]?.image || CATEGORY_MAP['other']?.image
              const fallbackImage = categoryImage || 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'
              
              return (
                <Link 
                  key={d._id}
                  href={`/devotionals/${createSlug(d.title || '')}`}
                  className="card-interactive overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 bg-surface-sunken overflow-hidden">
                    <img
                      src={d.image || fallbackImage}
                      alt={d.title || ''}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-h4 font-serif text-secondary-700 leading-tight pr-2">
                        {(function(){
                          const bt = renderBilingualTitle(d.title || '');
                          return (
                            <span>
                              {bt.primary}
                              {bt.secondary && <span> ({bt.secondary})</span>}
                            </span>
                          );
                        })()}
                      </h3>
                      <span className="badge badge-primary shrink-0">
                        {d.category}
                      </span>
                    </div>

                    {d.deity && (
                      <p className="text-body-sm text-primary-600 font-medium mb-2">{d.deity}</p>
                    )}

                    {d.description && (
                      <p className="mt-2 text-body-sm text-ink-muted flex-grow line-clamp-3">
                        {d.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-3 text-caption text-ink-faint flex-wrap">
                      {d.artist && <span>{d.artist}</span>}
                      {d.duration && <span>{d.duration}</span>}
                      {d.language && <span>{d.language}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Back Button */}
      <div className="mt-12 text-center">
        <Link 
          href="/devotionals"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
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
