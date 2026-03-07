"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../../lib/translation'
import PanchangCard from '../../components/PanchangCard'
import Hero from '../../components/Hero'

type CityOption = {
  label: string
  lat: number
  lon: number
}

const indianCities: CityOption[] = [
  { label: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { label: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { label: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { label: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { label: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { label: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { label: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { label: 'Pune', lat: 18.5204, lon: 73.8567 },
  { label: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { label: 'Lucknow', lat: 26.8467, lon: 80.9462 },
]

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

export default function PanchangPage() {
  const { t, language } = useTranslation()
  const [city, setCity] = useState<CityOption>(indianCities[0])
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PanchangData | null>(null)
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata', [])

  const fetchPanchang = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        date,
        lat: String(city.lat),
        lon: String(city.lon),
        tz,
        lang: language,
        city: city.label,
      })
      const res = await fetch(`/api/panchang?${params.toString()}`, { cache: 'no-store' })
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPanchang()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <Hero title={language === 'hi' ? 'दैनिक पंचांग' : 'Daily Panchang'} subtitle={language === 'hi'
          ? 'अपने शहर के लिए तिथि, नक्षत्र, योग, करन और सूर्योदय/सूर्यास्त देखें।'
          : 'View Tithi, Nakshatra, Yoga, Karana and Sunrise/Sunset for your city.'} />
    <main className="page-container section-sm">

      <section aria-label={language === 'hi' ? 'चयन' : 'Selection'} className="relative card overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h2 className="text-h4 font-serif text-secondary-700">
              {language === 'hi' ? 'तारीख और शहर चुनें' : 'Select Date & City'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">{language === 'hi' ? 'तारीख' : 'Date'}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">{language === 'hi' ? 'शहर' : 'City'}</label>
              <select
                value={city.label}
                onChange={(e) => {
                  const next = indianCities.find(c => c.label === e.target.value) || indianCities[0]
                  setCity(next)
                }}
                className="input"
                suppressHydrationWarning
              >
                {indianCities.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchPanchang}
                className="btn btn-primary group"
                suppressHydrationWarning
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                  </span>
                ) : (
                  <>
                    {language === 'hi' ? 'पंचांग देखें' : 'Get Panchang'}
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-caption text-ink-faint mt-4">
            {language === 'hi'
              ? 'डेमो डाटा: सटीक परिणाम के लिए API/कैल्कुलेशन सक्षम करें।'
              : 'Demo data: enable API/calculations for accurate results.'}
          </p>
        </div>
      </section>

      {data && <PanchangCard data={data} language={language} />}
    </main>
    </>
  )
}
