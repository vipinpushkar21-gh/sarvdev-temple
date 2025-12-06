"use client"

import React from 'react'
import SmartSearch from '../components/SmartSearch'
import TempleSlider from '../components/TempleSlider'
import { useTranslation } from '../lib/translation'

export default function Page() {
  const { t } = useTranslation()
  const templeImages = [
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1400&q=80',
  ]

  return (
    <div suppressHydrationWarning>
      {/* Hero Section with Search */}
      <section className="hero-bg relative overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-amber-500/10 to-orange-400/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 slide-in">
              <h1 className="font-playfair text-5xl md:text-7xl font-extrabold text-orange-600 drop-shadow-lg leading-tight">
                {t('home.title')}
              </h1>
              <p className="mt-6 text-lg text-slate-800 max-w-2xl drop-shadow-sm font-medium">
                {t('home.subtitle')}
              </p>

              <div className="mt-8 relative">
                <div className="absolute left-0 right-0 mx-auto w-full max-w-2xl search-float">
                  <SmartSearch />
                </div>
              </div>

              <div className="mt-32 flex gap-4">
                <a href="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700 hover:scale-105 transition-all">
                  📅 {t('home.upcomingEvents')}
                </a>
                <a href="/daily-darshan" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/95 text-orange-700 font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all">
                  ✨ {t('home.virtualDarshan')}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative zoom-in">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                {templeImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-64 md:h-96 bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.1)), url('${img}')`,
                      animation: `slideShow 15s infinite`,
                      animationDelay: `${idx * 5}s`,
                      opacity: idx === 0 ? 1 : 0
                    }}
                  />
                ))}
                <div className="relative w-full h-64 md:h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Temple Slider below hero */}
      <TempleSlider />

      <main className="container mx-auto px-4 py-16">
        <h2 className="font-playfair text-4xl mb-8 text-center fade-in">{t('home.exploreFeatures')}</h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: t('features.templesNear'), desc: t('features.templesDesc') },
            { title: t('features.liveDarshan'), desc: t('features.liveDarshanDesc') },
            { title: t('features.bookOnline'), desc: t('features.bookOnlineDesc') },
            { title: t('features.community'), desc: t('features.communityDesc') },
          ].map((card, idx) => (
            <article 
              key={idx} 
              className="p-6 bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-orange-100 zoom-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <h3 className="font-semibold text-xl text-orange-800">{card.title}</h3>
              <p className="mt-3 text-sm text-gray-600">{card.desc}</p>
              <a href="#" className="mt-4 inline-block text-orange-600 font-semibold hover:text-orange-700">{t('features.explore')} →</a>
            </article>
          ))}
        </section>
      </main>

      <footer className="bg-orange-900 text-orange-100 mt-12">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-semibold text-white">Sarvdev</h4>
            <p className="mt-3 text-gray-200">A temple directory and devotional hub connecting worshippers with temples, events, and online darshan experiences.</p>

            <div className="mt-4 flex space-x-3">
              <a href="#" aria-label="Instagram" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">📷</a>
              <a href="#" aria-label="YouTube" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">📺</a>
              <a href="#" aria-label="X" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">🐦</a>
            </div>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-white">{t('footer.quickLinks')}</h5>
            <ul className="mt-4 space-y-2 text-gray-200">
              <li><a href="/temples" className="hover:underline">🏛️ {t('footer.temples')}</a></li>
              <li><a href="/devotionals" className="hover:underline">🙏 {t('footer.devotionals')}</a></li>
              <li><a href="/events" className="hover:underline">🎉 {t('footer.events')}</a></li>
              <li><a href="/list-temple" className="hover:underline">➕ {t('footer.listTemple')}</a></li>
              <li><a href="/contact" className="hover:underline">📧 {t('footer.contact')}</a></li>
              <li><a href="/help" className="hover:underline">❓ {t('footer.help')}</a></li>
              <li><a href="/privacy" className="hover:underline">🔒 {t('footer.privacy')}</a></li>
              <li><a href="/terms" className="hover:underline">📜 {t('footer.terms')}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-white">{t('footer.about')}</h5>
            <p className="mt-3 text-gray-200">{t('footer.aboutText')}</p>

            <div className="mt-6 text-gray-200">
              <blockquote className="italic">"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</blockquote>
              <p className="mt-2">May all be happy, may all be free from disease — a traditional Sanskrit benediction for universal well-being.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-4 text-sm text-gray-300">© {new Date().getFullYear()} Sarvdev. {t('footer.rights')}</div>
        </div>
      </footer>
    </div>
  )
}
