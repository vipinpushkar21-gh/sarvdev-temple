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
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-overline uppercase tracking-[0.12em] text-gray-400 mb-1">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h2 className="text-h2 font-serif text-gray-900">
                  {language === 'hi' ? 'आज का पंचांग' : "Today's Panchang"}
                </h2>
              </div>
              <Link
                href="/panchang"
                className="hidden sm:inline-flex items-center gap-1.5 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors duration-200 no-underline hover:no-underline"
              >
                {language === 'hi' ? 'पूरा पंचांग' : 'Full Panchang'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {items.map((item, idx) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-200 text-center"
                >
                  <span className="text-xl mb-2 block">{icons[idx]}</span>
                  <p className="text-overline text-gray-400 mb-1 uppercase tracking-wider">{item.label}</p>
                  <p className="text-body-sm font-semibold text-gray-900 truncate">{item.value || '–'}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:hidden">
              <Link
                href="/panchang"
                className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors no-underline hover:no-underline"
              >
                {language === 'hi' ? 'पूरा पंचांग देखें' : 'View Full Panchang'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
