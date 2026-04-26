"use client"

import React, { useState, useEffect } from 'react'
import SmartSearch from '../components/SmartSearch'
import TempleSlider from '../components/TempleSlider'
import HomeCategoryShowcase from '../components/HomeCategoryShowcase'
import TempleGalleryMosaic from '../components/TempleGalleryMosaic'
import FestivalCountdown from '../components/FestivalCountdown'
import NearbyTemples from '../components/NearbyTemples'
import PanchangToday from '../components/PanchangToday'
import DevotionalTeaser from '../components/DevotionalTeaser'
import { useTranslation } from '../lib/translation'
import Link from 'next/link'
import FloatingOm from '../components/FloatingOm'
import CountUp from '../components/CountUp'

const features = [
  {
    titleKey: 'features.templesNear',
    descKey: 'features.templesDesc',
    href: '/temples',
    gradient: 'from-primary/10 to-accent/10',
    iconBg: 'bg-gradient-to-br from-primary to-primary-600',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.liveDarshan',
    descKey: 'features.liveDarshanDesc',
    href: '/daily-darshan',
    gradient: 'from-accent/10 to-primary/10',
    iconBg: 'bg-gradient-to-br from-accent to-primary',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.community',
    descKey: 'features.communityDesc',
    href: '/devotionals',
    gradient: 'from-secondary/5 to-primary/10',
    iconBg: 'bg-gradient-to-br from-secondary to-secondary-600',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({ temples: 0, devotionals: 0, categories: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="page-enter" suppressHydrationWarning>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden border-b border-surface-border">
        <FloatingOm count={7} />
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg')` }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Warm saffron tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-transparent to-primary/20" />

        <div className="page-container py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-primary-100/80 text-primary-800 text-caption font-semibold mb-6 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Temple Directory & Devotional Hub
            </div>

            <h1 className="text-display-lg font-serif text-white leading-tight fade-up delay-1">
              {t('home.title')}
            </h1>
            <p className="mt-5 text-body text-white/80 max-w-xl leading-relaxed fade-up delay-2">
              {t('home.subtitle')}
            </p>

            <div className="mt-8 max-w-xl fade-up delay-3">
              <SmartSearch />
            </div>

            <div className="mt-8 flex flex-wrap gap-3 fade-up delay-4">
              <Link href="/events" className="btn btn-primary btn-lg no-underline hover:no-underline group">
                {t('home.upcomingEvents')}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/daily-darshan" className="btn btn-outline btn-lg no-underline hover:no-underline">
                {t('home.virtualDarshan')}
              </Link>
            </div>

            {/* Quick stats — CountUp */}
            <div className="mt-12 flex flex-wrap gap-8 fade-up delay-5">
              {stats.temples > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <CountUp target={stats.temples} suffix="+" className="text-h2 font-serif font-bold text-primary-300" />
                    <span className="text-caption text-white/60 uppercase tracking-wider">Temples</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CountUp target={stats.devotionals} suffix="+" className="text-h2 font-serif font-bold text-primary-300" />
                    <span className="text-caption text-white/60 uppercase tracking-wider">Devotionals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CountUp target={stats.categories} suffix="+" className="text-h2 font-serif font-bold text-primary-300" />
                    <span className="text-caption text-white/60 uppercase tracking-wider">Categories</span>
                  </div>
                </>
              ) : (
                <div className="flex gap-8">
                  {['Temples', 'Devotionals', 'Categories'].map(l => (
                    <div key={l} className="flex items-center gap-3">
                      <span className="text-h2 font-serif font-bold text-primary-300">—</span>
                      <span className="text-caption text-white/60 uppercase tracking-wider">{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Festival Countdown ─── */}
      <FestivalCountdown />

      {/* ─── Today's Panchang ─── */}
      <PanchangToday />

      {/* ─── Temple Slider ─── */}
      <TempleSlider />

      {/* ─── Sacred Category Showcase ─── */}
      <HomeCategoryShowcase />

      {/* ─── Highlighted Temples Mosaic ─── */}
      <TempleGalleryMosaic />

      {/* ─── Devotional Music Teaser ─── */}
      <DevotionalTeaser />

      {/* ─── Nearby Temples — Geolocation ─── */}
      <NearbyTemples />

      {/* ─── Features Section ─── */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/20 to-transparent pointer-events-none" />
        <div className="page-container relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {t('home.exploreFeatures')}
            </h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <Link
                key={idx}
                href={feat.href}
                className={`group relative card-interactive p-7 no-underline hover:no-underline overflow-hidden`}
              >
                {/* Subtle gradient bg on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl ${feat.iconBg} flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-h4 text-secondary-700 mb-2 group-hover:text-secondary-800 transition-colors">{t(feat.titleKey)}</h3>
                  <p className="text-body-sm text-ink-muted leading-relaxed">{t(feat.descKey)}</p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-caption font-semibold text-primary-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
