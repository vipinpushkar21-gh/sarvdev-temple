"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'
import { useTempleData } from '../lib/temple-data'
import { useTranslation } from '../lib/translation'

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export default function TempleOfTheDay() {
  const { temples, loading } = useTempleData()
  const { language } = useTranslation()

  const temple = useMemo(() => {
    if (temples.length === 0) return null
    const dayIndex = Math.floor(Date.now() / 86_400_000) % temples.length
    return temples[dayIndex]
  }, [temples])

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="page-container py-16">
          <div className="h-5 w-32 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[480px]">
            <div className="md:w-3/5 bg-gray-100 animate-pulse" />
            <div className="md:w-2/5 bg-white p-10 space-y-4">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!temple) return null

  const slug = (temple as any).slug || generateSlug(temple.title)
  const locationLabel = (temple as any).city && (temple as any).state
    ? `${(temple as any).city}, ${(temple as any).state}`
    : (temple as any).location || ''
  const description = (temple as any).description || ''
  const deity = (temple as any).deity || ''

  return (
    <section className="w-full bg-white py-16">
      <div className="page-container">
        {/* Section label */}
        <p className="text-overline uppercase tracking-[0.15em] text-gray-400 mb-6">
          {language === 'hi' ? 'आज का मंदिर' : 'Temple of the Day'}
        </p>

        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ minHeight: 480 }}>
          {/* Left — full-bleed image with Ken Burns */}
          <div className="relative md:w-3/5 overflow-hidden" style={{ minHeight: 320 }}>
            <img
              src={getTempleImage(temple as any)}
              alt={temple.title}
              className="absolute inset-0 w-full h-full object-cover ken-burns"
              onError={(e) => { (e.target as HTMLImageElement).src = TEMPLE_PLACEHOLDER }}
            />
            {/* Subtle scrim for mobile text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
            {/* Location tag on image */}
            {locationLabel && (
              <div className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-caption font-medium px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {locationLabel}
              </div>
            )}
          </div>

          {/* Right — white editorial text panel */}
          <div className="md:w-2/5 bg-white flex flex-col justify-center p-8 md:p-12">
            {deity && (
              <p className="text-overline uppercase tracking-[0.12em] text-primary mb-3">
                {deity}
              </p>
            )}

            <h2 className="text-display font-serif text-gray-900 leading-tight mb-4">
              {temple.title}
            </h2>

            {description && (
              <p className="text-body text-gray-500 leading-relaxed mb-8 line-clamp-4">
                {description}
              </p>
            )}

            <Link
              href={`/temples/${slug}`}
              className="inline-flex items-center gap-2 group self-start"
            >
              <span className="text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 group-hover:border-primary group-hover:text-primary transition-colors duration-200">
                {language === 'hi' ? 'मंदिर देखें' : 'Explore this temple'}
              </span>
              <svg className="w-4 h-4 text-gray-900 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
