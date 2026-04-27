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
      <section className="section-sm bg-white">
        <div className="page-container">
          <h2 className="section-title mb-2">
            {language === 'hi' ? 'आपके पास के मंदिर' : 'Temples Near You'}
          </h2>
          <p className="section-subtitle mb-8">
            {language === 'hi'
              ? 'अपने नज़़दीकी मंदिर खोजने के लिए स्थान की अनुमति दें।'
              : 'Allow location access to discover temples close to you.'}
          </p>
          <button onClick={locate} className="btn btn-outline" suppressHydrationWarning>
            {language === 'hi' ? 'स्थान खोजें' : 'Find My Location'}
          </button>
        </div>
      </section>
    )
  }

  if (status === 'loading') {
    return (
      <section className="section-sm">
        <div className="page-container text-center">
          <p className="text-body text-ink-muted">{language === 'hi' ? 'स्थान प्राप्त हो रहा है...' : 'Getting your location...'}</p>
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
    <section className="section-sm bg-white">
      <div className="page-container">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <div>
            <h2 className="section-title">
              {language === 'hi' ? 'आपके पास के मंदिर' : 'Temples Near You'}
            </h2>
            <p className="section-subtitle">
              {language === 'hi' ? 'आपके स्थान के नज़़दीक मंदिर' : 'Sacred places near your current location'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {temples.map((temple) => (
            <Link
              key={temple._id}
              href={`/temples/${slugify(temple.title)}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-300 no-underline hover:no-underline"
            >
              <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
                <TempleImage image={temple.image} alt={temple.title} />
              </div>
              <div className="p-4">
                <h3 className="text-h4 font-serif text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {temple.title}
                </h3>
                {temple.city && temple.state && (
                  <p className="text-body-sm text-gray-400">{temple.city}, {temple.state}</p>
                )}
                {temple.distance != null && (
                  <p className="text-caption text-primary font-semibold mt-2">
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
