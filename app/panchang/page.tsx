"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '../../lib/translation'
import PanchangCard from '../../components/PanchangCard'
import { PANCHANG_CITIES, QUICK_PANCHANG_CITIES, type PanchangCity } from '../../lib/panchang-cities'
import { getCalendarDateInTimeZone, type PanchangApiResponse } from '../../lib/panchang/providers/types'

const DELHI = PANCHANG_CITIES.find((city) => city.city === 'Delhi') || PANCHANG_CITIES[0]

function formatDateLabel(date: string, language: string) {
  const parsed = new Date(`${date}T12:00:00`)
  return parsed.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PanchangPage() {
  const { language } = useTranslation()
  const [city, setCity] = useState<PanchangCity>(DELHI)
  const [cityQuery, setCityQuery] = useState('')
  const [date, setDate] = useState<string>(() => getCalendarDateInTimeZone(DELHI.timezone))
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<PanchangApiResponse | null>(null)

  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLowerCase()
    if (!query) return PANCHANG_CITIES.slice(0, 12)
    return PANCHANG_CITIES.filter((item) =>
      `${item.city} ${item.state}`.toLowerCase().includes(query)
    ).slice(0, 12)
  }, [cityQuery])

  const quickCities = useMemo(
    () => QUICK_PANCHANG_CITIES
      .map((name) => PANCHANG_CITIES.find((item) => item.city === name))
      .filter((item): item is PanchangCity => Boolean(item)),
    []
  )

  const fetchPanchang = async (selectedCity = city) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        date,
        lat: String(selectedCity.lat),
        lon: String(selectedCity.lng),
        tz: selectedCity.timezone,
        lang: language,
        city: selectedCity.city,
      })
      const result = await fetch(`/api/panchang?${params.toString()}`, { cache: 'no-store' })
      setResponse(await result.json() as PanchangApiResponse)
    } catch {
      setResponse({ status: 'unavailable', message: 'Panchang calculations are temporarily unavailable.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPanchang(DELHI)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectCity = (next: PanchangCity) => {
    setCity(next)
    setCityQuery('')
    fetchPanchang(next)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#160f1f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.24),transparent_28%),radial-gradient(circle_at_78%_26%,rgba(147,197,253,0.22),transparent_26%),linear-gradient(135deg,rgba(88,28,135,0.55),rgba(15,23,42,0.96))]" />
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full border border-white/10 bg-white/[0.03] shadow-[0_0_80px_rgba(255,255,255,0.18)]" />
        <div className="absolute left-8 bottom-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="page-container relative py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-overline uppercase tracking-[0.18em] text-amber-200/90 mb-3">Hindu Calendar</p>
            <h1 className="text-display-lg md:text-display-xl font-serif leading-tight">
              Daily Panchang
            </h1>
            <p className="mt-2 text-h2 font-devanagari text-amber-100">आज का पंचांग</p>
            <p className="mt-5 max-w-2xl text-body-lg text-white/76">
              {language === 'hi'
                ? 'स्थान और तिथि के अनुसार सत्यापित पंचांग गणनाओं के लिए एक शांत संदर्भ।'
                : 'A calm reference for verified Panchang calculations by date and location.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-body-sm text-white/90 backdrop-blur-md">
                {formatDateLabel(date, language)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-body-sm text-white/90 backdrop-blur-md">
                {city.city}, {city.state}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#f8f5ef]">
        <div className="page-container section-sm space-y-8">
          <section className="rounded-2xl border border-amber-100 bg-white p-5 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_auto] gap-4 items-end">
              <div>
                <label className="label">{language === 'hi' ? 'तारीख' : 'Date'}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                />
              </div>

              <div className="relative">
                <label className="label">{language === 'hi' ? 'शहर खोजें' : 'Search City'}</label>
                <input
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder={language === 'hi' ? 'दिल्ली, वाराणसी, उज्जैन...' : 'Delhi, Varanasi, Ujjain...'}
                  className="input"
                />
                {cityQuery && (
                  <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                    {filteredCities.length > 0 ? filteredCities.map((item) => (
                      <button
                        key={`${item.city}-${item.state}`}
                        type="button"
                        onClick={() => selectCity(item)}
                        className="block w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors"
                      >
                        <span className="block text-sm font-semibold text-gray-900">{item.city}</span>
                        <span className="text-xs text-gray-500">{item.state} · {item.timezone}</span>
                      </button>
                    )) : (
                      <p className="px-4 py-3 text-sm text-gray-500">No city found. Delhi remains the fallback.</p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => fetchPanchang()}
                className="btn btn-primary min-h-[44px]"
                suppressHydrationWarning
              >
                {loading ? 'Loading...' : language === 'hi' ? 'पंचांग देखें' : 'Get Panchang'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickCities.map((item) => (
                <button
                  key={item.city}
                  type="button"
                  onClick={() => selectCity(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    city.city === item.city
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {item.city}
                </button>
              ))}
            </div>

            <p className="mt-4 text-caption text-ink-faint">
              {language === 'hi'
                ? 'गणना केवल सत्यापित प्रदाता उपलब्ध होने पर दिखाई जाती है।'
                : 'Calculations are shown only when a verified provider is available.'}
            </p>
          </section>

          {response?.status === 'success' && <PanchangCard data={response.data} />}
          {response && response.status !== 'success' && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-gray-800 shadow-sm">
              <p className="text-overline uppercase tracking-[0.16em] text-amber-800">Panchang</p>
              <h2 className="mt-2 text-h3 font-serif">{language === 'hi' ? 'पंचांग गणना अस्थायी रूप से उपलब्ध नहीं है।' : 'Panchang calculations are temporarily unavailable.'}</h2>
              <p className="mt-2 text-body-sm text-amber-900/80">{response.message}</p>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
