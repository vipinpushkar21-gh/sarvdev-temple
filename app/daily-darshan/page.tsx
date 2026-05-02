"use client"

import { useEffect, useState } from 'react'
import Hero from '../../components/Hero'
import BookmarkButton from '../../components/BookmarkButton'
import Link from 'next/link'

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

type Darshan = {
  _id: string
  title: string
  description?: string
  time?: string
  video?: string
  youtubeId?: string
  isLive?: boolean
  temple?: string
  status?: string
}

export default function DailyDarshanPage() {
  const [items, setItems] = useState<Darshan[]>([])
  const [loading, setLoading] = useState(true)

  const [liveItems, setLiveItems] = useState<Darshan[]>([])

  useEffect(() => {
    async function fetchDarshan() {
      try {
        const res = await fetch('/api/darshan')
        if (res.ok) {
          const data = await res.json()
          const approved = data.filter((d: Darshan) => d.status === 'approved')
          setItems(approved)
          setLiveItems(approved.filter((d: Darshan) => d.isLive && d.youtubeId))
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

      {/* Featured Videos */}
      <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 bg-surface-sunken">
        <div className="p-4 md:p-6">
          <h2 className="text-h4 text-secondary-700 font-serif mb-4">Featured Darshan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Link href="/temples/vitthal-temple-pandharpur" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">श्री विठ्ठल दर्शन पंढरपूर</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/OHF9DiR60G8?si=bMznBYMIPl2ah-z2"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/mahakaleshwar-jyotirlinga-temple-ujjain" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">Mahakaleshwar Jyotirlinga Temple</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/AWzzP7_ZsQY?si=NVBVTYVrlaU0IO0z"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/kashi-vishwanath-temple-varanasi" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">Kashi Vishwanath Temple</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/djAqGUJEvuc?si=IsFooLfp6JTG6eUC"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/shirdi-sai-baba-temple" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">Shirdi Sai Baba Darshan</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/SezNZqScc0Y?si=rcRVoA5KqDVIv12X"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/siddhivinayak-temple-mumbai" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">Siddhivinayak Live Darshan</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/q5zTnhvPBHQ?si=FzRvj2LqFIfRJwho"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/kasthbhanjan-hanuman-mandir-salangpur" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">Shree KasthBhanjandev Hanumanji Mandir Salangpur</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/SrDCZCWmz1U?si=UNuKd20tiU-pHdYq"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/salasar-balaji-temple" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">सालासर बालाजी लाइव दर्शन</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/wIScZcVMgYk?si=qpUcmkzBXo-aZbIP"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <Link href="/temples/banke-bihari-temple-vrindavan" className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mb-2 inline-block">ठाकुरजी श्री बॉंकेबिहारी जी मंदिर</Link>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/_TreAwpnfyI?si=b1QJ4yLFggEenZ2e"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <p className="text-body-sm font-medium text-ink-muted mb-2">Daily Darshan</p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/mhazhZtzzoI?si=MDME3LNDE5ns01tg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Now Banner */}
      {liveItems.length > 0 && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-600 to-red-500">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold text-sm">LIVE DARSHAN</span>
            <span className="ml-auto text-white/70 text-xs">{liveItems.length} live stream{liveItems.length > 1 ? 's' : ''}</span>
          </div>
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-secondary-700">{liveItems[0].title}</p>
              {liveItems[0].temple && <p className="text-body-sm text-ink-muted">{liveItems[0].temple}</p>}
            </div>
            <Link href="/live-darshan" className="btn btn-primary btn-sm no-underline hover:no-underline shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Live Darshan Dekhein
            </Link>
          </div>
        </div>
      )}

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

