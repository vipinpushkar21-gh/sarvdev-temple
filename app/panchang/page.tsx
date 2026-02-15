"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../../lib/translation'
import PanchangCard from '../../components/PanchangCard'

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

      <section aria-label={language === 'hi' ? 'चयन' : 'Selection'} className="card p-5 mb-6">
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
            >
              {indianCities.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchPanchang}
              className="btn btn-primary"
            >
              {loading ? (language === 'hi' ? 'लोड हो रहा है...' : 'Loading...') : (language === 'hi' ? 'पंचांग देखें' : 'Get Panchang')}
            </button>
          </div>
        </div>
        <p className="text-caption text-ink-faint mt-3">
          {language === 'hi'
            ? 'डेमो डाटा: सटीक परिणाम के लिए API/कैल्कुलेशन सक्षम करें।'
            : 'Demo data: enable API/calculations for accurate results.'}
        </p>
      </section>

      {data && <PanchangCard data={data} language={language} />}
    </main>
    </>
  )
}
