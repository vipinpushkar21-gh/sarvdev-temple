'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '../../../lib/translation'

type Props = {
  params: Promise<{ slug: string }>
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function TemplePage({ params }: Props) {
  const { t, language } = useTranslation()
  const [temple, setTemple] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    
    async function fetchTemple() {
      try {
        const res = await fetch('/api/temples', { cache: 'no-store' })
        if (!res.ok) {
          setTemple(null)
          setLoading(false)
          return
        }
        const temples = await res.json()
        const found = temples.find((t: any) => slugify(t.title) === slug)
        setTemple(found || null)
      } catch (error) {
        console.error('Error fetching temple:', error)
        setTemple(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTemple()
  }, [slug])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-slate-600 dark:text-slate-300">{t('temples.loading')}</div>
      </main>
    )
  }

  if (!temple) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('temple.notFound')}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{t('temple.notFoundDesc')}</p>
        <Link href="/temples" className="inline-block mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">{t('temple.backToTemples')}</Link>
      </main>
    )
  }

  // Extract Google Maps link from location field if present
  const mapsLinkMatch = temple.location?.match(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/)
  const mapsLink = mapsLinkMatch ? mapsLinkMatch[1] : null
  const displayLocation = temple.location?.replace(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/g, '').trim()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Verification Badge - Top Right Corner */}
      <div className="flex justify-end mb-4">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-md ${
          temple.verified === 'verified' 
            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
            : 'bg-orange-100 text-orange-800 border-2 border-orange-300'
        }`}>
          {temple.verified === 'verified' ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Temple</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Not Verified</span>
            </>
          )}
        </div>
      </div>

      <Link href="/temples" className="text-sm text-orange-600 hover:underline mb-4 inline-block">← {t('temple.backToTemples')}</Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-orange-800">{temple.title}</h1>
        {displayLocation && <p className="mt-2 text-slate-600">📍 {displayLocation}</p>}
      </header>

      {temple.image && (
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 sm:h-96 w-full">
            <Image src={temple.image} alt={temple.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-orange-700 mb-3">{t('temple.about')}</h2>
          <p className="text-slate-700 leading-relaxed">
            {language === 'hi' && temple.descriptionHi 
              ? temple.descriptionHi 
              : temple.description || t('temple.noDescription')
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {temple.deity && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">🕉️ {t('temple.deity')}</h3>
              <p className="mt-1 text-slate-700">{temple.deity}</p>
            </div>
          )}

          {temple.city && temple.state && !temple.city.includes('http') && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">📍 {t('temple.location')}</h3>
              <p className="mt-1 text-slate-700">{temple.city}, {temple.state}</p>
              {temple.pincode && <p className="text-sm text-slate-600">{temple.pincode}</p>}
              {mapsLink && (
                <a 
                  href={mapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-orange-600 hover:text-orange-700 hover:underline"
                >
                  🗺️ {t('temple.viewOnMaps')}
                </a>
              )}
            </div>
          )}

          {temple.templeType && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">🏛️ {t('temple.templeType')}</h3>
              <p className="mt-1 text-slate-700">{temple.templeType}</p>
            </div>
          )}

          {temple.establishedYear && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">📅 {t('temple.established')}</h3>
              <p className="mt-1 text-slate-700">{temple.establishedYear}</p>
            </div>
          )}

          {temple.timings && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">⏰ {t('temple.timings')}</h3>
              <p className="mt-1 text-slate-700">{temple.timings}</p>
            </div>
          )}

          {temple.speciality && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100 md:col-span-2">
              <h3 className="font-medium text-slate-800">🌟 {t('temple.speciality')}</h3>
              <p className="mt-1 text-slate-700">{temple.speciality}</p>
            </div>
          )}
        </div>

        {temple.categories && temple.categories.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border-2 border-orange-200">
            <h2 className="text-xl font-semibold text-orange-700 mb-3">🕉️ Sacred Categories</h2>
            <div className="flex flex-wrap gap-2">
              {temple.categories.map((cat: string, idx: number) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full shadow-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {mapsLink && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">📍 {t('temple.locationMap')}</h2>
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              {displayLocation && <p className="text-sm text-slate-600 mb-3">{displayLocation}</p>}
              <a 
                href={mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
              >
                🗺️ {t('temple.openInMaps')}
              </a>
            </div>
          </div>
        )}

        {(temple.phone || temple.email || temple.website) && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">{t('temple.contactInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temple.phone && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">📞 {t('temple.phone')}</h3>
                  <a href={`tel:${temple.phone}`} className="mt-1 text-orange-600 hover:underline">{temple.phone}</a>
                </div>
              )}

              {temple.email && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">📧 {t('temple.email')}</h3>
                  <a href={`mailto:${temple.email}`} className="mt-1 text-orange-600 hover:underline">{temple.email}</a>
                </div>
              )}

              {temple.website && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">🌐 {t('temple.website')}</h3>
                  <a href={temple.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-orange-600 hover:underline">{t('temple.visitWebsite')}</a>
                </div>
              )}

              {temple.contact && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">👤 {t('temple.contactPerson')}</h3>
                  <p className="mt-1 text-slate-700">{temple.contact}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(temple.facebook || temple.instagram) && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">{t('temple.socialMedia')}</h2>
            <div className="flex gap-4">
              {temple.facebook && (
                <a href={temple.facebook} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Facebook
                </a>
              )}
              {temple.instagram && (
                <a href={temple.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer for Not Verified Temples */}
        {temple.verified === 'not-verified' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This temple information has not been verified yet. Details may be incomplete or inaccurate. 
                  We are working on verification. Please verify timings and other details before visiting.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
