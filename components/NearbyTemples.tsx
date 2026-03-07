"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '../lib/translation'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'
import { useTempleData } from '../lib/temple-data'

type Temple = {
  _id: string
  title: string
  image?: string
  city?: string
  state?: string
  deity?: string
  latitude?: number
  longitude?: number
  distance?: number
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Haversine distance in km */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NearbyTemples() {
  const { language } = useTranslation()
  const { temples: allTemples } = useTempleData()
  const [temples, setTemples] = useState<Temple[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied' | 'unavailable' | 'done'>('idle')

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          const withDist = allTemples
            .filter((t: any) => t.latitude && t.longitude)
            .map((t: any) => ({
              ...t,
              distance: haversine(pos.coords.latitude, pos.coords.longitude, t.latitude!, t.longitude!),
            }))
            .sort((a: any, b: any) => a.distance! - b.distance!)
            .slice(0, 6)

          setTemples(withDist)
          setStatus('done')
        } catch {
          setStatus('unavailable')
        }
      },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [allTemples])

  if (status === 'idle') {
    return (
      <section className="section-sm">
        <div className="page-container">
          <div className="relative card overflow-hidden text-center py-12 px-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-accent-50/30 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h2 className="text-h2 font-serif text-secondary-800 mb-2">
                {language === 'hi' ? 'आपके पास के मंदिर' : 'Temples Near You'}
              </h2>
              <p className="text-body-sm text-ink-muted mb-6 max-w-md mx-auto">
                {language === 'hi'
                  ? 'अपने नज़दीकी मंदिर खोजने के लिए स्थान की अनुमति दें।'
                  : 'Allow location access to discover temples close to you.'}
              </p>
              <button onClick={locate} className="btn btn-primary" suppressHydrationWarning>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                {language === 'hi' ? 'स्थान खोजें' : 'Find My Location'}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'loading') {
    return (
      <section className="section-sm">
        <div className="page-container text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-body text-ink-muted">{language === 'hi' ? 'स्थान प्राप्त हो रहा है...' : 'Getting your location...'}</p>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'denied') {
    return (
      <section className="section-sm">
        <div className="page-container text-center">
          <p className="text-body-sm text-ink-muted">
            {language === 'hi'
              ? 'स्थान की अनुमति अस्वीकृत। कृपया अपनी ब्राउज़र सेटिंग्स से अनुमति दें।'
              : 'Location permission denied. Please allow location in your browser settings.'}
          </p>
        </div>
      </section>
    )
  }

  if (status === 'done' && temples.length === 0) {
    return (
      <section className="section-sm">
        <div className="page-container text-center">
          <p className="text-body-sm text-ink-muted">
            {language === 'hi' ? 'आपके पास कोई मंदिर नहीं मिला।' : 'No nearby temples found with location data.'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-sm">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="section-title">
            {language === 'hi' ? 'आपके पास के मंदिर' : 'Temples Near You'}
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => (
            <Link
              key={temple._id}
              href={`/temples/${slugify(temple.title)}`}
              className="card-interactive no-underline hover:no-underline group overflow-hidden"
            >
              <div className="relative h-44 w-full bg-surface-sunken overflow-hidden img-zoom">
                <TempleImage image={temple.image} alt={temple.title} />
              </div>
              <div className="p-5">
                <h3 className="text-h4 text-secondary-700 group-hover:text-primary-600 transition-colors">
                  {temple.title}
                </h3>
                {temple.city && temple.state && (
                  <p className="text-body-sm text-ink-muted mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {temple.city}, {temple.state}
                  </p>
                )}
                {temple.distance != null && (
                  <p className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary-600 mt-2 bg-primary-50 px-2.5 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    {temple.distance < 1
                      ? `${(temple.distance * 1000).toFixed(0)} m ${language === 'hi' ? 'दूर' : 'away'}`
                      : `${temple.distance.toFixed(1)} km ${language === 'hi' ? 'दूर' : 'away'}`}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function TempleImage({ image, alt }: { image?: string; alt: string }) {
  const [src, setSrc] = useState(getTempleImage({ image }))
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setSrc(TEMPLE_PLACEHOLDER)}
    />
  )
}
