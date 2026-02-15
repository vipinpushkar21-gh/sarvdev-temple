"use client"

import React from 'react'

type PanchangData = {
  date: string
  location: { city?: string; lat: number; lon: number; tz: string }
  sun: { sunrise: string; sunset: string }
  moon?: { moonrise?: string; moonset?: string }
  tithi?: string
  nakshatra?: string
  yoga?: string
  karana?: string
  rahuKaal?: string
  abhijitMuhurta?: string
  source?: string
}

export default function PanchangCard({ data, language }: { data: PanchangData, language: 'en' | 'hi' }) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 font-serif">
          {language === 'hi' ? 'परिणाम' : 'Results'}
        </h2>
        <span className="text-caption text-ink-muted">{data.date}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-btn bg-surface-sunken border border-surface-border">
          <p className="text-caption text-ink-muted mb-1">{language === 'hi' ? 'स्थान' : 'Location'}</p>
          <p className="text-body-sm font-medium">
            {(data.location.city || '')} ({data.location.lat.toFixed(2)}, {data.location.lon.toFixed(2)})
          </p>
          <p className="text-caption text-ink-faint">{data.location.tz}</p>
        </div>

        <div className="p-4 rounded-btn bg-surface-sunken border border-surface-border">
          <p className="text-caption text-ink-muted mb-1">{language === 'hi' ? 'सूर्य' : 'Sun'}</p>
          <p className="text-body-sm">{language === 'hi' ? 'सूर्योदय' : 'Sunrise'}: <span className="font-medium">{data.sun.sunrise}</span></p>
          <p className="text-body-sm">{language === 'hi' ? 'सूर्यास्त' : 'Sunset'}: <span className="font-medium">{data.sun.sunset}</span></p>
        </div>

        <div className="p-4 rounded-btn bg-surface-sunken border border-surface-border">
          <p className="text-caption text-ink-muted mb-1">{language === 'hi' ? 'चंद्र' : 'Moon'}</p>
          {data.moon?.moonrise && <p className="text-body-sm">{language === 'hi' ? 'चंद्रोदय' : 'Moonrise'}: <span className="font-medium">{data.moon.moonrise}</span></p>}
          {data.moon?.moonset && <p className="text-body-sm">{language === 'hi' ? 'चंद्रास्त' : 'Moonset'}: <span className="font-medium">{data.moon.moonset}</span></p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-btn bg-surface-sunken border border-surface-border space-y-1">
          <p className="text-body-sm">{language === 'hi' ? 'तिथि' : 'Tithi'}: <span className="font-medium">{data.tithi || '-'}</span></p>
          <p className="text-body-sm">{language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}: <span className="font-medium">{data.nakshatra || '-'}</span></p>
          <p className="text-body-sm">{language === 'hi' ? 'योग' : 'Yoga'}: <span className="font-medium">{data.yoga || '-'}</span></p>
          <p className="text-body-sm">{language === 'hi' ? 'करण' : 'Karana'}: <span className="font-medium">{data.karana || '-'}</span></p>
        </div>
        <div className="p-4 rounded-btn bg-surface-sunken border border-surface-border space-y-1">
          <p className="text-body-sm">{language === 'hi' ? 'राहु काल' : 'Rahu Kaal'}: <span className="font-medium">{data.rahuKaal || '-'}</span></p>
          <p className="text-body-sm">{language === 'hi' ? 'अभिजीत मुहूर्त' : 'Abhijit Muhurta'}: <span className="font-medium">{data.abhijitMuhurta || '-'}</span></p>
        </div>
      </div>

      {data.source && (
        <p className="text-caption text-ink-faint mt-4">
          {language === 'hi' ? 'स्रोत' : 'Source'}: {data.source}
        </p>
      )}
    </section>
  )
}
