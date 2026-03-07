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

  const categoryBadgeColors: Record<string, string> = {
    Aarti: 'bg-red-50 text-red-700',
    Bhajan: 'bg-blue-50 text-blue-700',
    Chalisa: 'bg-amber-50 text-amber-700',
    Mantra: 'bg-green-50 text-green-700',
    Stotra: 'bg-purple-50 text-purple-700',
    Stuti: 'bg-pink-50 text-pink-700',
    Shloka: 'bg-teal-50 text-teal-700',
  }

  return (
    <section className="section-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-50/20 to-transparent pointer-events-none" />
      <div className="page-container relative z-10">
        <div className="text-center mb-10">
          <h2 className="section-title">
            {language === 'hi' ? 'भक्ति संगीत' : 'Devotional Music'}
          </h2>
          <p className="section-subtitle">
            {language === 'hi' ? 'आत्मा को शांति देने वाले भजन और आरती सुनें' : 'Listen to soul-soothing bhajans, aartis and mantras'}
          </p>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((d) => {
            const isActive = track?.id === d._id
            const badgeClass = categoryBadgeColors[d.category || ''] || 'bg-gray-50 text-gray-700'

            return (
              <div key={d._id} className={`group card-interactive p-5 flex flex-col${isActive ? ' ring-2 ring-primary-400 shadow-lg shadow-primary/10' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-body-sm font-semibold text-ink line-clamp-2 flex-1 mr-2 group-hover:text-primary-700 transition-colors">
                    {d.title}
                  </h3>
                  {d.category && (
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
                      {d.category}
                    </span>
                  )}
                </div>

                {d.deity && (
                  <p className="text-caption text-ink-muted mb-3 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    {d.deity}
                  </p>
                )}

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => handlePlay(d)}
                    className={`btn btn-sm flex items-center gap-1.5 w-full justify-center ${
                      isActive && playing
                        ? 'bg-secondary text-white hover:bg-secondary-600'
                        : 'btn-primary'
                    }`}
                  >
                    {isActive && playing ? (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                        {language === 'hi' ? 'रोकें' : 'Pause'}
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        {language === 'hi' ? 'सुनें' : 'Play'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/devotionals"
            className="btn btn-outline no-underline hover:no-underline group"
          >
            {language === 'hi' ? 'सभी भक्ति सामग्री देखें' : 'Explore All Devotionals'}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
