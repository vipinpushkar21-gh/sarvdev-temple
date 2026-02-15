"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TextToSpeech } from '../components/TextToSpeech'
import { renderBilingualTitle, isDevanagari } from '../utils/bilingual'

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

  useEffect(() => {
    async function fetchDevotional() {
      try {
        // Get all devotionals and find by slug
        const slug = params.id as string
        const res = await fetch(`/api/devotionals`)
        if (res.ok) {
          const devotionals = await res.json()
          
          // Transliteration map
          const translitMap: {[key: string]: string} = {
            'श्री': 'shri',
            'गणेश': 'ganesh',
            'आरती': 'aarti',
            'चालीसा': 'chalisa',
            'मंत्र': 'mantra',
            'स्तोत्र': 'stotra',
            'भजन': 'bhajan'
          };
          
          // Find devotional by matching slug
          const found = devotionals.find((d: any) => {
            // Extract English from parentheses if present
            const englishMatch = d.title.match(/\(([^)]+)\)/);
            let text = englishMatch ? englishMatch[1] : d.title;
            
            let devotionalSlug = text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            
            // If empty, transliterate
            if (!devotionalSlug || devotionalSlug === '-' || devotionalSlug === '') {
              let transliterated = d.title.toLowerCase();
              for (const [devanagari, english] of Object.entries(translitMap)) {
                transliterated = transliterated.replace(new RegExp(devanagari, 'g'), english);
              }
              
              devotionalSlug = transliterated
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            }
            
            return devotionalSlug === slug || devotionalSlug === 'devotional' && slug === 'devotional';
          })
          
          if (found) {
            setDevotional(found)
          }
        }
      } catch (error) {
        console.error('Failed to fetch devotional:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchDevotional()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-pulse">🕉️</div>
            <p className="text-lg text-text">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!devotional) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🕉️</div>
            <p className="text-lg text-text mb-6">Devotional not found</p>
            <Link 
              href="/devotionals"
            >
              <span className="btn btn-primary">Back to Devotionals</span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const bt = renderBilingualTitle(devotional.title || '')

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/devotionals"
            className="inline-flex items-center gap-2 font-medium"
          >
            <span>←</span> Back to Devotionals
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-background border border-accent rounded-2xl shadow p-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold mb-3 text-primary">
            <span>{bt.primary}</span>
            {showTransliteration && bt.secondary && (
              <span> ({bt.secondary})</span>
            )}
          </h1>

          {/* Category Badge */}
          {devotional.category && (
            <span className="px-3 py-1 bg-accent text-text text-sm font-bold rounded-full mb-2 inline-block border border-secondary">
              {devotional.category}
            </span>
          )}

          {/* Metadata */}
          <div className="mt-4 space-y-2">
            {devotional.deity && (
              <p className="text-lg text-text font-bold">🕉️ {devotional.deity}</p>
            )}
            {devotional.artist && (
              <p className="text-base text-text">🎤 {devotional.artist}</p>
            )}
            {devotional.duration && (
              <p className="text-base text-text">⏱️ {devotional.duration}</p>
            )}
            {devotional.language && (
              <p className="text-base text-text">🌐 {devotional.language}</p>
            )}
          </div>

          {/* Description */}
          {devotional.description && (
            <p className="mt-4 text-text">{devotional.description}</p>
          )}

          {/* Audio Player or TTS */}
          <div className="mt-6">
            {devotional.audio ? (
              <audio controls src={devotional.audio} className="w-full rounded-md" />
            ) : generatedAudioUrl ? (
              <audio controls src={generatedAudioUrl} className="w-full rounded-md" />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-text italic">Text-based devotional</p>
                <TextToSpeech
                  text={devotional.lyrics || devotional.description || devotional.title || ''}
                  lang={(function(){
                    const l = (devotional.language || '').toLowerCase()
                    if (l.includes('hi') || l.includes('hindi') || l.includes('हिं') || l.includes('हिन्द')) return 'hi-IN'
                    if (l.includes('sa') || l.includes('sanskrit') || l.includes('संस्क')) return 'hi-IN'
                    return 'en-IN'
                  })()}
                  autoPlay
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-full"
                  onClick={async () => {
                    if (!devotional) return
                    const payload = {
                      text: devotional.lyrics || devotional.description || devotional.title || '',
                      lang: (function(){
                        const l = (devotional.language || '').toLowerCase()
                        if (l.includes('hi') || l.includes('hindi') || l.includes('हिं') || l.includes('हिन्द')) return 'hi-IN'
                        if (l.includes('sa') || l.includes('sanskrit') || l.includes('संस्क')) return 'hi-IN'
                        return 'en-IN'
                      })()
                    }
                    try {
                      const resp = await fetch('/api/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      })
                      const ct = resp.headers.get('Content-Type') || ''
                      if (ct.includes('text/html')) {
                        const text = await resp.text()
                        window.alert('Unexpected HTML response from /api/tts. Please ensure the route exists at app/api/tts/route.ts and restart the dev server. Using browser TTS instead.')
                        console.error('Server TTS failed (HTML)', text)
                        return
                      }
                      if (!resp.ok) {
                        const text = await resp.text()
                        try {
                          const data = JSON.parse(text)
                          console.error('Server TTS error:', data)
                          window.alert(`Server TTS failed: ${data.error || 'Unknown error'}. Using browser TTS instead.`)
                        } catch {
                          console.error('Server TTS failed (non-JSON)', text)
                          window.alert('Server TTS failed. Using browser TTS instead.')
                        }
                        return
                      }
                      const blob = await resp.blob()
                      const url = URL.createObjectURL(blob)
                      setGeneratedAudioUrl(url)
                    } catch (error) {
                      console.error('Failed to generate audio:', error)
                      window.alert('Failed to connect to server TTS. Using browser TTS instead.')
                    }
                  }}
                >
                  Generate Server Audio
                </button>
              </div>
            )}
          </div>

          {/* Lyrics */}
          {devotional.lyrics && (
            <details className="mt-6" open>
              <summary className="text-lg text-primary cursor-pointer hover:underline font-bold mb-3 text-center">
                View Lyrics
              </summary>
              <div className="mt-3 p-6 bg-background rounded-lg text-lg text-text border border-accent/30 text-center max-w-4xl mx-auto">
                {(function(){
                  const lines = (devotional.lyrics || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
                  const devLines = lines.filter(l => isDevanagari(l))
                  const engLines = lines.filter(l => !isDevanagari(l))
                  const hasMixed = devLines.length > 0 && engLines.length > 0
                  if (!hasMixed) {
                    return <div className="whitespace-pre-line text-xl leading-relaxed">{devotional.lyrics}</div>
                  }
                  return (
                    <div className="space-y-6">
                      {devLines.length > 0 && (
                        <div>
                          <div className="font-semibold text-secondary mb-3 text-xl">हिंदी</div>
                          <div className="space-y-2">
                            {devLines.map((l, i) => (<p key={i} className="text-xl leading-relaxed">{l}</p>))}
                          </div>
                        </div>
                      )}
                      {engLines.length > 0 && (
                        <div>
                          <div className="font-bold text-primary mb-3 text-xl">English</div>
                          <div className="space-y-2">
                            {engLines.map((l, i) => (<p key={i} className="text-xl leading-relaxed">{l}</p>))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </details>
          )}

          {/* 108 Names */}
          {devotional.names && devotional.names.length > 0 && (
            <details className="mt-4" open>
              <summary className="text-base text-primary cursor-pointer hover:underline font-bold">
                View 108 Names ({devotional.names.length})
              </summary>
              <div className="mt-3 p-4 bg-background rounded-lg text-sm border border-accent/30">
                <ol className="list-decimal list-inside space-y-1 text-text">
                  {devotional.names.map((name, i) => (
                    <li key={i}>
                      {name.sanskrit && <span className="font-semibold">{name.sanskrit}</span>}
                      {name.english && <span className="text-text"> ({name.english})</span>}
                      {name.mantra && <span className="text-primary italic"> — {name.mantra}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          )}

          {/* Toggle Transliteration */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="text-sm text-primary hover:underline"
            >
              {showTransliteration ? 'Hide' : 'Show'} Transliteration
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
