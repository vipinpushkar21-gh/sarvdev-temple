"use client"

import React from 'react'
import SmartSearch from '../components/SmartSearch'
import TempleSlider from '../components/TempleSlider'
import TempleGalleryMosaic from '../components/TempleGalleryMosaic'
import { useTranslation } from '../lib/translation'
import Link from 'next/link'

const features = [
  {
    titleKey: 'features.templesNear',
    descKey: 'features.templesDesc',
    href: '/temples',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.liveDarshan',
    descKey: 'features.liveDarshanDesc',
    href: '/daily-darshan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.community',
    descKey: 'features.communityDesc',
    href: '/devotionals',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

export default function Page() {
  const { t } = useTranslation()

  return (
    <div suppressHydrationWarning>
      {/* Hero — typographic, no gradient overlays */}
      <section className="bg-surface-sunken border-b border-surface-border">
        <div className="page-container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">
              {t('home.title')}
            </h1>
            <p className="mt-4 text-body text-ink-muted max-w-xl">
              {t('home.subtitle')}
            </p>

            <div className="mt-8 max-w-xl">
              <SmartSearch />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className="btn btn-primary no-underline hover:no-underline">
                {t('home.upcomingEvents')}
              </Link>
              <Link href="/daily-darshan" className="btn btn-outline no-underline hover:no-underline">
                {t('home.virtualDarshan')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Temple Slider */}
      <TempleSlider />

      {/* Highlighted Temples — Arts & Culture–style mosaic */}
      <TempleGalleryMosaic />

      {/* Features section */}
      <section className="section-sm">
        <div className="page-container">
          <h2 className="text-h1 font-serif text-secondary-800 text-center mb-10">
            {t('home.exploreFeatures')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <Link
                key={idx}
                href={feat.href}
                className="card-interactive p-6 no-underline hover:no-underline group"
              >
                <div className="w-10 h-10 rounded-btn bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="text-h4 text-secondary-700 mb-2">{t(feat.titleKey)}</h3>
                <p className="text-body-sm text-ink-muted">{t(feat.descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
