"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'

type PanchangData = {
  date: string
  sun: { sunrise: string; sunset: string }
  tithi?: string
  nakshatra?: string
  yoga?: string
  karana?: string
}

export default function PanchangToday() {
  const { language } = useTranslation()
  const [data, setData] = useState<PanchangData | null>(null)
  const [loading, setLoading] = useState(true)
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata', [])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const params = new URLSearchParams({
      date: today,
      lat: '28.6139',
      lon: '77.2090',
      tz,
      lang: language,
      city: 'Delhi',
    })
    fetch(`/api/panchang?${params.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [language, tz])

  if (loading) {
    return (
      <section className="section-sm">
        <div className="page-container">
          <div className="card p-6 animate-pulse">
            <div className="h-5 bg-secondary-100 rounded w-48 mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-surface-sunken rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!data) return null

  const icons = ['🌙', '⭐', '🕉️', '📿', '🌅', '🌇']
  const items = [
    { label: language === 'hi' ? 'तिथि' : 'Tithi', value: data.tithi },
    { label: language === 'hi' ? 'नक्षत्र' : 'Nakshatra', value: data.nakshatra },
    { label: language === 'hi' ? 'योग' : 'Yoga', value: data.yoga },
    { label: language === 'hi' ? 'करण' : 'Karana', value: data.karana },
    { label: language === 'hi' ? 'सूर्योदय' : 'Sunrise', value: data.sun?.sunrise },
    { label: language === 'hi' ? 'सूर्यास्त' : 'Sunset', value: data.sun?.sunset },
  ]

  return (
    <section className="section-sm">
      <div className="page-container">
        <div className="relative card overflow-hidden">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-h3 font-serif text-secondary-800">
                    {language === 'hi' ? 'आज का पंचांग' : "Today's Panchang"}
                  </h2>
                </div>
              </div>
              <span className="badge badge-primary">{data.date}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {items.map((item, idx) => (
                <div
                  key={item.label}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-surface-sunken to-surface border border-surface-border hover:border-primary-200 hover:shadow-md transition-all duration-300 text-center"
                >
                  <span className="text-lg mb-1.5 block opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{icons[idx]}</span>
                  <p className="text-caption text-ink-muted mb-1 font-medium">{item.label}</p>
                  <p className="text-body-sm font-semibold text-ink truncate">{item.value || '-'}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/panchang"
                className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary-600 hover:text-primary-700 no-underline hover:no-underline transition-colors group"
              >
                {language === 'hi' ? 'पूरा पंचांग देखें' : 'View Full Panchang'}
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
