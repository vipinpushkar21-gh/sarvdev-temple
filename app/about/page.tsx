'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Hero from '../../components/Hero'

export default function AboutPage() {
  const [stats, setStats] = useState({ temples: 0, devotionals: 0, categories: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <>
      <Hero title="About Sarvdev" subtitle="Connecting devotees with temples and spiritual traditions worldwide" />
      <main className="content-container section-sm">

        <div className="space-y-12 max-w-4xl mx-auto">

          {/* Mission */}
          <section className="relative card overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="p-6 md:p-8">
              <h2 className="text-h2 font-serif text-secondary-800 mb-4">Our Mission</h2>
              <p className="text-body text-ink-muted leading-relaxed">
                Sarvdev is a temple directory and devotional hub dedicated to connecting worshippers with temples,
                events, and spiritual traditions across India and the world. Our mission is to preserve and promote
                Hindu spiritual heritage by making it accessible to everyone through technology.
              </p>
              <blockquote className="mt-6 text-body italic text-secondary-600 border-l-3 border-accent/60 pl-5 py-2">
                <span className="font-devanagari text-accent-700">&ldquo;सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः&rdquo;</span>
                <br />
                <span className="text-body-sm not-italic text-ink-muted mt-1 block">
                  May all be happy, may all be free from disease.
                </span>
              </blockquote>
            </div>
          </section>

          {/* Live Stats */}
          <section>
            <h2 className="text-h2 font-serif text-secondary-800 mb-6 text-center">Sarvdev at a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="card p-6 text-center">
                <div className="text-display-lg font-serif font-bold text-primary-600">
                  {stats.temples > 0 ? stats.temples.toLocaleString() : '—'}
                </div>
                <p className="text-body-sm text-ink-muted mt-1">Temples Listed</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-display-lg font-serif font-bold text-accent-600">
                  {stats.devotionals > 0 ? stats.devotionals.toLocaleString() : '—'}
                </div>
                <p className="text-body-sm text-ink-muted mt-1">Devotional Content</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-display-lg font-serif font-bold text-secondary-700">
                  {stats.categories > 0 ? stats.categories.toLocaleString() : '—'}
                </div>
                <p className="text-body-sm text-ink-muted mt-1">Sacred Categories</p>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-h2 font-serif text-secondary-800 mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: 'Temple Directory',
                  desc: 'Comprehensive listing of Hindu temples with details like timings, deity, location, and contact info.',
                  icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4',
                },
                {
                  title: 'Devotional Content',
                  desc: 'Aarti, Bhajan, Chalisa, Mantra, Stotra, and more in Hindi and English with audio playback.',
                  icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
                },
                {
                  title: 'Daily Panchang',
                  desc: 'Check Tithi, Nakshatra, Yoga, Karana, Sunrise, and Sunset for any Indian city.',
                  icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707',
                },
                {
                  title: 'Events & Festivals',
                  desc: 'Stay updated with Hindu festivals, yatras, cultural events, and katha schedules.',
                  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                },
              ].map((item) => (
                <div key={item.title} className="card-interactive p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-h4 text-secondary-700 mb-1">{item.title}</h3>
                    <p className="text-body-sm text-ink-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="card bg-gradient-to-br from-primary-50 to-accent-50/30 p-8 text-center">
            <h2 className="text-h2 font-serif text-secondary-800 mb-3">Join the Community</h2>
            <p className="text-body text-ink-muted mb-6 max-w-xl mx-auto">
              Whether you want to explore temples, listen to devotional content, or list your temple — Sarvdev is here for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/temples" className="btn btn-primary no-underline hover:no-underline group">
                Explore Temples
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/list-temple" className="btn btn-outline no-underline hover:no-underline group">
                List a Temple
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
