"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TextToSpeech } from '../components/TextToSpeech'
import { renderBilingualTitle, isDevanagari } from '../utils/bilingual'
import BookmarkButton from '../../../components/BookmarkButton'
import AdminEditBar from '../../../components/AdminEditBar'

const DEFAULT_DEVOTIONAL_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  image?: string
  audio?: string
  lyrics?: string
  duration?: string
  artist?: string
  status?: string
  type?: string
  names?: { sanskrit?: string; mantra?: string; english?: string }[]
}

export default function DevotionalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [lyricsOpen, setLyricsOpen] = useState(true)

  useEffect(() => {
    async function fetchDevotional() {
      try {
        const slug = params.id as string
        // Step 1: Fetch listing (without lyrics) to find matching devotional by slug
        const res = await fetch(`/api/devotionals`)
        if (res.ok) {
          const devotionals = await res.json()

          const translitMap: {[key: string]: string} = {
            'श्री': 'shri', 'गणेश': 'ganesh', 'आरती': 'aarti',
            'चालीसा': 'chalisa', 'मंत्र': 'mantra', 'स्तोत्र': 'stotra', 'भजन': 'bhajan'
          }

          const found = devotionals.find((d: any) => {
            const englishMatch = d.title.match(/\(([^)]+)\)/)
            let text = englishMatch ? englishMatch[1] : d.title
            let devotionalSlug = text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
            if (!devotionalSlug || devotionalSlug === '-' || devotionalSlug === '') {
              let transliterated = d.title.toLowerCase()
              for (const [devanagari, english] of Object.entries(translitMap)) {
                transliterated = transliterated.replace(new RegExp(devanagari, 'g'), english)
              }
              devotionalSlug = transliterated
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            }
            return devotionalSlug === slug
          })

          if (found) {
            // Step 2: Fetch the full devotional WITH lyrics using its _id
            const fullRes = await fetch(`/api/devotionals?id=${found._id}`)
            if (fullRes.ok) {
              const fullData = await fullRes.json()
              if (fullData) {
                setDevotional(fullData)
                return
              }
            }
            // Fallback: use listing data (without lyrics)
            setDevotional(found)
          }
        }
      } catch (error) {
        console.error('Failed to fetch devotional:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchDevotional()
  }, [params.id])

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <div className="relative w-full h-32 bg-gradient-to-br from-surface-sunken to-surface border-b border-surface-border" />
        <main className="page-container section-sm">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8 animate-pulse space-y-6">
              <div className="h-8 bg-surface-sunken rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 bg-surface-sunken rounded w-20" />
                <div className="h-5 bg-surface-sunken rounded w-16" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-surface-sunken rounded w-full" />
                <div className="h-4 bg-surface-sunken rounded w-5/6" />
                <div className="h-4 bg-surface-sunken rounded w-4/6" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* ── Not Found ── */
  if (!devotional) {
    return (
      <>
        <div className="relative w-full py-12 bg-gradient-to-br from-surface-sunken to-surface border-b border-surface-border">
          <div className="page-container">
            <h1 className="text-h1 font-serif text-secondary-800">Not Found</h1>
            <p className="mt-2 text-body text-ink-muted">This devotional could not be found.</p>
          </div>
        </div>
        <main className="page-container section-sm">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card p-12">
              <span className="text-5xl block mb-4">🕉️</span>
              <p className="text-body text-ink-muted mb-6">The devotional you're looking for doesn't exist or has been removed.</p>
              <Link href="/devotionals" className="btn btn-primary">Back to Devotionals</Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const bt = renderBilingualTitle(devotional.title || '')
  const detectedLang = (function () {
    const l = (devotional.language || '').toLowerCase()
    if (l.includes('hi') || l.includes('hindi') || l.includes('हिं') || l.includes('हिन्द')) return 'hi-IN'
    if (l.includes('sa') || l.includes('sanskrit') || l.includes('संस्क')) return 'hi-IN'
    return 'en-IN'
  })()

  const heroImage = devotional.image || DEFAULT_DEVOTIONAL_IMAGE
  const slug = params.id as string

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: devotional.title,
    description: devotional.description || undefined,
    inLanguage: detectedLang,
    url: `https://sarvdev.com/devotionals/${slug}`,
    image: heroImage,
    ...(devotional.duration ? { duration: devotional.duration } : {}),
    ...(devotional.artist ? { byArtist: { '@type': 'Person', name: devotional.artist } } : {}),
    ...(devotional.audio ? {
      associatedMedia: {
        '@type': 'AudioObject',
        contentUrl: devotional.audio,
        encodingFormat: 'audio/mpeg',
      },
    } : {}),
    genre: devotional.category || 'Devotional',
    publisher: {
      '@type': 'Organization',
      name: 'Sarvdev',
      url: 'https://sarvdev.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Image Hero Header ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
        <img
          src={heroImage}
          alt={bt.primary}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = DEFAULT_DEVOTIONAL_IMAGE }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-transparent" />
        {/* Saffron-gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-600 via-primary to-accent" />
        {/* Title content */}
        <div className="absolute bottom-0 left-0 right-0 page-container pb-8 pt-4">
          {devotional.category && (
            <span className="inline-block mb-2 px-3 py-1 rounded-full text-caption font-semibold bg-primary/90 text-white backdrop-blur-sm">
              {devotional.category}
            </span>
          )}
          <h1 className="text-h1 md:text-display font-serif text-white leading-tight drop-shadow-lg">
            {bt.primary}
          </h1>
          {showTransliteration && bt.secondary && (
            <p className="mt-1 text-body text-orange-100/80 font-devanagari">{bt.secondary}</p>
          )}
        </div>
      </div>
      <main className="page-container section-sm min-h-screen">
        <div className="max-w-3xl mx-auto">

          {/* ── Breadcrumb + Bookmark ── */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-body-sm text-ink-muted min-w-0">
              <Link href="/devotionals" className="hover:text-primary-600 transition-colors flex-shrink-0">Devotionals</Link>
              <span>/</span>
              {devotional.category && (
                <>
                  <Link href={`/devotionals/category/${devotional.category === '108 Namavali' ? 'namavali' : devotional.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-600 transition-colors flex-shrink-0">{devotional.category}</Link>
                  <span>/</span>
                </>
              )}
              <span className="text-ink font-medium truncate">{bt.primary}</span>
            </nav>
            <BookmarkButton
              item={{
                id: devotional._id,
                type: 'devotional',
                title: bt.primary,
                slug: params.id as string,
              }}
            />
          </div>

          {/* ── Meta Card ── */}
          <div className="relative card overflow-hidden p-6 sm:p-8 mb-6 fade-up">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {devotional.category && <span className="badge badge-primary">{devotional.category}</span>}
              {devotional.language && <span className="badge">{devotional.language}</span>}
              {devotional.type && <span className="badge">{devotional.type}</span>}
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
              {devotional.deity && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕉️</span>
                  <div>
                    <div className="text-ink-muted text-caption">Deity</div>
                    <div className="font-medium text-ink">{devotional.deity}</div>
                  </div>
                </div>
              )}
              {devotional.artist && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎤</span>
                  <div>
                    <div className="text-ink-muted text-caption">Artist</div>
                    <div className="font-medium text-ink">{devotional.artist}</div>
                  </div>
                </div>
              )}
              {devotional.duration && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <div className="text-ink-muted text-caption">Duration</div>
                    <div className="font-medium text-ink">{devotional.duration}</div>
                  </div>
                </div>
              )}
              {devotional.language && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <div>
                    <div className="text-ink-muted text-caption">Language</div>
                    <div className="font-medium text-ink">{devotional.language}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {devotional.description && (
              <>
                <div className="divider my-5" />
                <p className="text-body text-ink-muted leading-relaxed">{devotional.description}</p>
              </>
            )}
          </div>

          {/* ── Audio Player ── */}
          <div className="card p-5 sm:p-6 mb-6 fade-up">
            <h2 className="text-h4 font-serif text-secondary-700 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
              </div>
              Listen
            </h2>
            {devotional.audio ? (
              <audio controls src={devotional.audio} className="w-full rounded-btn" />
            ) : generatedAudioUrl ? (
              <audio controls src={generatedAudioUrl} className="w-full rounded-btn" />
            ) : (
              <div className="space-y-4">
                <TextToSpeech
                  text={devotional.lyrics || devotional.description || devotional.title || ''}
                  lang={detectedLang}
                  autoPlay
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  suppressHydrationWarning
                  onClick={async () => {
                    if (!devotional) return
                    try {
                      const resp = await fetch('/api/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          text: devotional.lyrics || devotional.description || devotional.title || '',
                          lang: detectedLang
                        })
                      })
                      if (!resp.ok) return
                      const ct = resp.headers.get('Content-Type') || ''
                      if (ct.includes('text/html')) return
                      const blob = await resp.blob()
                      setGeneratedAudioUrl(URL.createObjectURL(blob))
                    } catch (error) {
                      console.error('Failed to generate audio:', error)
                    }
                  }}
                >
                  Generate Server Audio
                </button>
              </div>
            )}
          </div>

          {/* ── Lyrics ── */}
          {devotional.lyrics && (
            <div className="card p-5 sm:p-6 mb-6 fade-up">
              <button
                onClick={() => setLyricsOpen(!lyricsOpen)}
                className="w-full flex items-center justify-between text-h4 font-serif text-secondary-700"
              >
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  Lyrics
                </span>
                <span className="text-ink-muted text-lg transition-transform duration-200" style={{ transform: lyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {lyricsOpen && (
                <div className="mt-5">
                  {(function () {
                    const lines = (devotional.lyrics || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
                    const devLines = lines.filter(l => isDevanagari(l))
                    const engLines = lines.filter(l => !isDevanagari(l))
                    const hasMixed = devLines.length > 0 && engLines.length > 0
                    // Determine language label from devotional.language field
                    const lang = (devotional.language || '').toLowerCase()
                    const devLabel = lang.includes('sanskrit') || lang.includes('संस्क') ? 'संस्कृत' : lang.includes('hindi') || lang.includes('हिं') || lang.includes('हिन्द') ? 'हिंदी' : 'हिंदी'
                    if (!hasMixed) {
                      return (
                        <div>
                          {devLines.length > 0 && (
                            <p className="text-body-sm font-semibold text-secondary-700 mb-3 text-center">{devLabel}</p>
                          )}
                          <div className="whitespace-pre-line text-body leading-loose text-ink text-center font-devanagari">
                            {devotional.lyrics}
                          </div>
                        </div>
                      )
                    }
                    return (
                      <div className="grid md:grid-cols-2 gap-6">
                        {devLines.length > 0 && (
                          <div className="bg-surface-sunken rounded-card p-5">
                            <h3 className="text-body-sm font-semibold text-secondary-700 mb-3">{devLabel}</h3>
                            <div className="space-y-2 font-devanagari">
                              {devLines.map((l, i) => (<p key={i} className="text-body leading-loose text-ink">{l}</p>))}
                            </div>
                          </div>
                        )}
                        {engLines.length > 0 && (
                          <div className="bg-surface-sunken rounded-card p-5">
                            <h3 className="text-body-sm font-semibold text-secondary-700 mb-3">English</h3>
                            <div className="space-y-2">
                              {engLines.map((l, i) => (<p key={i} className="text-body leading-relaxed text-ink">{l}</p>))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ── 108 Names ── */}
          {devotional.names && devotional.names.length > 0 && (
            <div className="card p-5 sm:p-6 mb-6 fade-up">
              <h2 className="text-h4 font-serif text-secondary-700 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                {devotional.names.length} Names
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                {devotional.names.map((name, i) => (
                  <div key={i} className="flex items-baseline gap-2 py-1.5 border-b border-surface-border last:border-0">
                    <span className="text-caption text-ink-faint w-7 shrink-0 text-right">{i + 1}.</span>
                    <div>
                      {name.sanskrit && <span className="font-semibold text-ink font-devanagari">{name.sanskrit}</span>}
                      {name.english && <span className="text-ink-muted text-body-sm"> ({name.english})</span>}
                      {name.mantra && <span className="text-primary-600 text-caption italic block">{name.mantra}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Actions Bar ── */}
          <div className="flex items-center justify-between mt-2 mb-8">
            <Link href="/devotionals" className="btn btn-outline btn-sm group no-underline hover:no-underline">
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back to Devotionals
            </Link>
            <button
              type="button"
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="btn btn-ghost btn-sm"
              suppressHydrationWarning
            >
              {showTransliteration ? 'Hide' : 'Show'} Transliteration
            </button>
          </div>

        </div>
      </main>
      <AdminEditBar editHref={`/admin/devotionals/${devotional._id}/edit`} label="Edit Devotional" />
    </>
  )
}
