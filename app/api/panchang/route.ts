import { NextRequest } from 'next/server'

export const revalidate = 3600 // 1 hour cache for SSR fetches

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

function demoFor(date: string, city?: string): PanchangData {
  // Note: Demo placeholder data. Replace with actual calculations/API.
  return {
    date,
    location: { city, lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
    sun: { sunrise: '07:05', sunset: '18:04' },
    moon: { moonrise: '09:41', moonset: '22:31' },
    tithi: 'Shukla Dwitiya',
    nakshatra: 'Shatabhisha',
    yoga: 'Shubha',
    karana: 'Bava',
    rahuKaal: '10:30–12:00',
    abhijitMuhurta: '12:14–12:58',
    source: 'Demo (configure provider for accurate results)'
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const lat = Number(searchParams.get('lat') || 28.6139)
  const lon = Number(searchParams.get('lon') || 77.2090)
  const tz = searchParams.get('tz') || 'Asia/Kolkata'
  const city = searchParams.get('city') || 'Delhi'

  const provider = process.env.PANCHANG_PROVIDER // e.g., 'vedic', 'astro'
  const apiUrl = process.env.PANCHANG_API_URL
  const apiKey = process.env.PANCHANG_API_KEY

  // If provider/env configured, proxy to external API (example structure)
  if (provider && apiUrl) {
    try {
      const url = new URL(apiUrl)
      url.searchParams.set('date', date)
      url.searchParams.set('lat', String(lat))
      url.searchParams.set('lon', String(lon))
      url.searchParams.set('tz', tz)
      url.searchParams.set('city', city)
      if (apiKey) url.searchParams.set('key', apiKey)

      const res = await fetch(url.toString(), { next: { revalidate } })
      const json = await res.json()

      // Normalize external result into our schema if needed
      const normalized: PanchangData = {
        date: json.date || date,
        location: { city, lat, lon, tz },
        sun: { sunrise: json.sunrise || json.sun?.sunrise || '-', sunset: json.sunset || json.sun?.sunset || '-' },
        moon: { moonrise: json.moonrise || json.moon?.moonrise, moonset: json.moonset || json.moon?.moonset },
        tithi: json.tithi?.name || json.tithi || undefined,
        nakshatra: json.nakshatra?.name || json.nakshatra || undefined,
        yoga: json.yoga?.name || json.yoga || undefined,
        karana: json.karana?.name || json.karana || undefined,
        rahuKaal: json.rahuKaal || undefined,
        abhijitMuhurta: json.abhijitMuhurta || undefined,
        source: provider,
      }

      return new Response(JSON.stringify(normalized), {
        headers: { 'content-type': 'application/json', 'cache-control': `public, s-maxage=${revalidate}` },
      })
    } catch (e) {
      console.error('Panchang provider error', e)
      // Fall back to demo
      const fallback = demoFor(date, city)
      fallback.location = { city, lat, lon, tz }
      return new Response(JSON.stringify(fallback), { headers: { 'content-type': 'application/json' } })
    }
  }

  // Demo data fallback
  const demo = demoFor(date, city)
  demo.location = { city, lat, lon, tz }
  return new Response(JSON.stringify(demo), { headers: { 'content-type': 'application/json' } })
}
