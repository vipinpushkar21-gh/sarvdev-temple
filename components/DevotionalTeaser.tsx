"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import { useAudioPlayer, type AudioTrack } from '../lib/audio-player'

type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  deity?: string
  audio?: string
  language?: string
}

export default function DevotionalTeaser() {
  const { language } = useTranslation()
  const { play, track, playing, pause, resume } = useAudioPlayer()
  const [items, setItems] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/devotionals')
      .then((r) => r.json())
      .then((all: Devotional[]) => {
        const approved = all.filter((d) => (d as any).status === 'approved' && d.audio)
        // pick 4 random
        const shuffled = approved.sort(() => 0.5 - Math.random())
        setItems(shuffled.slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handlePlay = (d: Devotional) => {
    if (!d.audio) return
    const audioTrack: AudioTrack = {
      id: d._id,
      title: d.title,
      src: d.audio,
      deity: d.deity,
    }
    if (track?.id === d._id && playing) {
      pause()
    } else if (track?.id === d._id) {
      resume()
    } else {
      play(audioTrack)
    }
  }

  if (loading) {
    return (
      <section className="section-sm">
        <div className="page-container">
          <div className="h-6 bg-secondary-100 rounded w-56 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-surface-sunken rounded w-3/4 mb-3" />
                <div className="h-3 bg-surface-sunken rounded w-1/2 mb-2" />
                <div className="h-8 bg-surface-sunken rounded-btn w-20 mt-3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="section-sm bg-gray-50">
      <div className="page-container">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <div>
            <h2 className="section-title">
              {language === 'hi' ? 'भक्ति संगीत' : 'Devotional Music'}
            </h2>
            <p className="section-subtitle">
              {language === 'hi' ? 'आत्मा को शांति देने वाले भजन और आरती सुनें' : 'Listen to soul-soothing bhajans, aartis and mantras'}
            </p>
          </div>
          <Link
            href="/devotionals"
            className="shrink-0 inline-flex items-center gap-1.5 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors no-underline hover:no-underline whitespace-nowrap"
          >
            {language === 'hi' ? 'सभी देखें' : 'View all'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((d) => {
            const isActive = track?.id === d._id
            const initial = (d.deity || d.title || 'D').charAt(0).toUpperCase()

            return (
              <div
                key={d._id}
                className={`group bg-white border rounded-2xl p-5 flex flex-col transition-all duration-300 ${
                  isActive
                    ? 'border-primary shadow-md shadow-primary/10'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                {/* Large initial monogram */}
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors duration-300">
                  <span className="text-h3 font-serif text-gray-300 group-hover:text-primary transition-colors duration-300">{initial}</span>
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-body-sm font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                    {d.title}
                  </h3>
                  {d.category && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">
                      {d.category}
                    </span>
                  )}
                </div>

                {d.deity && (
                  <p className="text-caption text-gray-400 mb-4">{d.deity}</p>
                )}

                <div className="mt-auto">
                  <button
                    onClick={() => handlePlay(d)}
                    className={`inline-flex items-center gap-2 text-body-sm font-semibold transition-colors duration-200 ${
                      isActive && playing
                        ? 'text-primary'
                        : 'text-gray-900 hover:text-primary'
                    }`}
                  >
                    {isActive && playing ? (
                      <>
                        <span className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        </span>
                        {language === 'hi' ? 'रोकें' : 'Pause'}
                      </>
                    ) : (
                      <>
                        <span className="w-7 h-7 rounded-full border-2 border-gray-900 group-hover:border-primary flex items-center justify-center transition-colors">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        {language === 'hi' ? 'सुनें' : 'Play'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
