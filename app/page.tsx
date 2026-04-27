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
import TempleOfTheDay from '../components/TempleOfTheDay'
import CountUp from '../components/CountUp'

const features = [
  {
    titleKey: 'features.templesNear',
    descKey: 'features.templesDesc',
    href: '/temples',
    gradient: 'from-primary/10 to-accent/10',
    iconBg: 'bg-gradient-to-br from-primary to-primary-600',
    icon: (
      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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

  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Explore Sarvdev',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Temples', url: 'https://sarvdev.com/temples' },
          { '@type': 'ListItem', position: 2, name: 'Devotionals', url: 'https://sarvdev.com/devotionals' },
          { '@type': 'ListItem', position: 3, name: 'Events & Festivals', url: 'https://sarvdev.com/events' },
          { '@type': 'ListItem', position: 4, name: 'Daily Panchang', url: 'https://sarvdev.com/panchang' },
          { '@type': 'ListItem', position: 5, name: 'Daily Darshan', url: 'https://sarvdev.com/daily-darshan' },
        ],
      },
    ],
  }

  return (
    <div className="page-enter" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden" style={{ height: 'calc(100vh - 64px)', minHeight: 500, maxHeight: 900 }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg')` }}
        />
        {/* Gradient overlay — bottom-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        <div className="page-container h-full flex flex-col justify-end pb-16 md:pb-24 relative z-10">
          <div className="max-w-3xl fade-up">
            <p className="text-overline uppercase tracking-[0.15em] text-white/60 mb-4">
              Temple Directory &amp; Devotional Hub
            </p>
            <h1 className="text-display-lg font-serif text-white leading-tight mb-5">
              {t('home.title')}
            </h1>
            <p className="text-body text-white/75 max-w-xl leading-relaxed mb-8">
              {t('home.subtitle')}
            </p>

            <div className="max-w-xl mb-8">
              <SmartSearch />
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/events" className="btn btn-primary btn-lg no-underline hover:no-underline group">
                {t('home.upcomingEvents')}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/daily-darshan" className="btn border border-white/40 text-white bg-white/10 hover:bg-white/20 btn-lg no-underline hover:no-underline backdrop-blur-sm">
                {t('home.virtualDarshan')}
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8">
              {stats.temples > 0 ? (
                <>
                  <div>
                    <CountUp target={stats.temples} suffix="+" className="text-h2 font-serif font-bold text-white" />
                    <p className="text-caption text-white/50 uppercase tracking-wider mt-0.5">Temples</p>
                  </div>
                  <div className="w-px bg-white/20 self-stretch" />
                  <div>
                    <CountUp target={stats.devotionals} suffix="+" className="text-h2 font-serif font-bold text-white" />
                    <p className="text-caption text-white/50 uppercase tracking-wider mt-0.5">Devotionals</p>
                  </div>
                  <div className="w-px bg-white/20 self-stretch" />
                  <div>
                    <CountUp target={stats.categories} suffix="+" className="text-h2 font-serif font-bold text-white" />
                    <p className="text-caption text-white/50 uppercase tracking-wider mt-0.5">Categories</p>
                  </div>
                </>
              ) : null}
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

      {/* ─── Temple of the Day ─── */}
      <TempleOfTheDay />

      {/* ─── Highlighted Temples Mosaic ─── */}
      <TempleGalleryMosaic />

      {/* ─── Devotional Music Teaser ─── */}
      <DevotionalTeaser />

      {/* ─── Nearby Temples — Geolocation ─── */}
      <NearbyTemples />

      {/* ─── Features Section ─── */}
      <section className="section-sm bg-white">
        <div className="page-container">
          <div className="mb-12 flex items-baseline justify-between gap-4">
            <h2 className="section-title">
              {t('home.exploreFeatures')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => (
              <Link
                key={idx}
                href={feat.href}
                className="group bg-white border border-gray-100 rounded-2xl p-7 no-underline hover:no-underline hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-h4 font-serif text-gray-900 mb-2">{t(feat.titleKey)}</h3>
                <p className="text-body-sm text-gray-500 leading-relaxed mb-5">{t(feat.descKey)}</p>
                <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 group-hover:border-primary group-hover:text-primary transition-colors duration-200">
                  {t('nav.explore') || 'Explore'}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
