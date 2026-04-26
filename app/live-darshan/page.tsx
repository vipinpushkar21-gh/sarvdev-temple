"use client"

import { useEffect, useState } from 'react'
import Hero from '../../components/Hero'
import Link from 'next/link'

type DarshanItem = {
  _id: string
  title: string
  description?: string
  temple?: string
  time?: string
  youtubeId?: string
  isLive?: boolean
  status?: string
}

export default function LiveDarshanPage() {
  const [liveItems, setLiveItems] = useState<DarshanItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/darshan')
      .then(r => r.json())
      .then((data: DarshanItem[]) => {
        const live = data.filter(d => d.isLive && d.youtubeId && d.status === 'approved')
        setLiveItems(live)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero
        title="🔴 Live Darshan"
        subtitle="Temples se seedha live — watch sacred moments in real time"
      />
      <main className="page-container section-sm">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-video bg-surface-sunken" />
                <div className="p-5 space-y-2">
                  <div className="h-5 bg-surface-sunken rounded w-3/4" />
                  <div className="h-3 bg-surface-sunken rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : liveItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-h3 font-serif text-secondary-700 mb-3">Abhi koi Live Darshan nahi hai</h2>
            <p className="text-body text-ink-muted mb-8 max-w-md mx-auto">
              Koi temple currently live nahi hai. Recorded darshan dekhne ke liye Daily Darshan page visit karein.
            </p>
            <Link href="/daily-darshan" className="btn btn-primary no-underline hover:no-underline">
              Daily Darshan Dekhein
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {liveItems.map(item => (
              <article key={item._id} className="card overflow-hidden">
                {/* Live badge header */}
                <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-600 to-red-500">
                  <span className="flex items-center gap-2 text-white font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  {item.temple && (
                    <span className="text-white/80 text-sm">— {item.temple}</span>
                  )}
                  <span className="ml-auto text-white/60 text-xs">{item.time}</span>
                </div>

                {/* YouTube embed */}
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-h3 font-serif text-secondary-700">{item.title}</h2>
                  {item.description && (
                    <p className="mt-2 text-body text-ink-muted">{item.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm no-underline hover:no-underline"
                    >
                      YouTube par Kholo
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
