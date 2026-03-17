"use client"

import { useEffect, useState } from 'react'
import Hero from '../../components/Hero'
import BookmarkButton from '../../components/BookmarkButton'

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1773744527/sarvdev/temples/avno1ltpdyzpzsby1mll.jpg'

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
      <>
        <Hero title="Daily Darshan" subtitle="Live and recorded darshan from our temple network" />
        <main className="page-container section-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-surface-sunken" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-surface-sunken rounded w-3/4" />
                  <div className="h-3 bg-surface-sunken rounded w-full" />
                  <div className="h-3 bg-surface-sunken rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Daily Darshan" subtitle="Live and recorded darshan from our temple network" />
      <main className="page-container section-sm">

      <section>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
            </div>
            <p className="text-body text-ink-muted">No daily darshan items available right now. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d: Darshan) => (
              <article key={d._id} className="group card-interactive overflow-hidden relative">
                <div className="absolute top-2 right-2 z-10">
                  <BookmarkButton
                    item={{
                      id: d._id,
                      type: 'darshan',
                      title: d.title,
                      slug: d._id,
                      subtitle: d.temple || undefined,
                    }}
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                  />
                </div>
                <div className="relative w-full h-48 bg-surface-sunken overflow-hidden">
                  {d.video ? (
                    <video controls src={d.video} className="w-full h-48 object-cover" />
                  ) : (
                    <img
                      src={DEFAULT_IMAGE}
                      alt={d.title}
                      className="w-full h-48 object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                    />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-h4 text-secondary-700 font-serif group-hover:text-primary-600 transition-colors">{d.title}</h3>
                  <p className="mt-2 text-body-sm text-ink-muted line-clamp-2">{d.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {d.time && (
                      <span className="inline-flex items-center gap-1 text-caption text-ink-muted bg-surface-sunken px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {d.time}
                      </span>
                    )}
                    {d.temple && (
                      <span className="inline-flex items-center gap-1 text-caption text-ink-muted bg-surface-sunken px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        {d.temple}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </main>
    </>
  )
}

