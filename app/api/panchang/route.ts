import { NextRequest, NextResponse } from 'next/server'
import { BoundedTtlCache } from '@/lib/panchang/cache'
import { prokeralaPanchangProvider } from '@/lib/panchang/providers/prokerala'
import {
  PanchangProviderUnavailableError,
  createPanchangCacheKey,
  getCalendarDateInTimeZone,
  type PanchangApiResponse,
  type PanchangLanguage,
  type PanchangProvider,
  type PanchangRequest,
} from '@/lib/panchang/providers/types'

export const revalidate = 3600

const CACHE_TTL_MS = revalidate * 1000
const responseCache = new BoundedTtlCache<PanchangApiResponse>(128, CACHE_TTL_MS)
const DEFAULT_LOCATION = { city: 'Delhi', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata' }

function invalid(message: string) {
  return NextResponse.json<PanchangApiResponse>({ status: 'invalid_request', message }, { status: 400 })
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
}

function isTimeZone(value: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value })
    return true
  } catch {
    return false
  }
}

function configuredProvider(): PanchangProvider | null {
  return (process.env.PANCHANG_PROVIDER || 'prokerala').toLowerCase() === 'prokerala'
    ? prokeralaPanchangProvider
    : null
}

function createRequest(req: NextRequest): { request: PanchangRequest; provider: PanchangProvider } | { error: string } {
  const { searchParams } = new URL(req.url)
  const providerParam = searchParams.get('provider')
  if (providerParam && providerParam !== 'prokerala') return { error: 'Unsupported Panchang provider.' }

  const provider = configuredProvider()
  if (!provider) return { error: 'The configured Panchang provider is unsupported.' }

  const timezone = searchParams.get('tz') || DEFAULT_LOCATION.timezone
  if (!isTimeZone(timezone)) return { error: 'Invalid timezone.' }

  const date = searchParams.get('date') || getCalendarDateInTimeZone(timezone)
  if (!isCalendarDate(date)) return { error: 'Invalid date. Use YYYY-MM-DD.' }

  const lat = Number(searchParams.get('lat') || DEFAULT_LOCATION.lat)
  const lng = Number(searchParams.get('lon') || searchParams.get('lng') || DEFAULT_LOCATION.lng)
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return { error: 'Latitude must be between -90 and 90.' }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return { error: 'Longitude must be between -180 and 180.' }

  const lang = searchParams.get('lang') || 'en'
  if (lang !== 'en' && lang !== 'hi') return { error: 'Unsupported language.' }

  const city = (searchParams.get('city') || DEFAULT_LOCATION.city).trim()
  if (!city || city.length > 120) return { error: 'Invalid location label.' }

  return { request: { date, lat, lng, timezone, city, lang: lang as PanchangLanguage }, provider }
}

export async function GET(req: NextRequest) {
  const parsed = createRequest(req)
  if ('error' in parsed) return invalid(parsed.error)

  const { request, provider } = parsed
  if (!provider.isConfigured()) {
    return NextResponse.json<PanchangApiResponse>(
      { status: 'unavailable', message: 'Panchang calculations are temporarily unavailable.' },
      { status: 503, headers: { 'cache-control': 'no-store', 'x-panchang-provider': provider.name } }
    )
  }

  const cacheKey = createPanchangCacheKey(request, provider.name)
  const cached = responseCache.get(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'cache-control': `public, s-maxage=${revalidate}`, 'x-panchang-cache': 'hit', 'x-panchang-provider': provider.name },
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  try {
    const result = await provider.getPanchang(request, controller.signal)
    const body: PanchangApiResponse = { status: 'success', data: result.data }
    responseCache.set(cacheKey, body)
    return NextResponse.json(body, {
      headers: { 'cache-control': `public, s-maxage=${revalidate}`, 'x-panchang-cache': 'miss', 'x-panchang-provider': result.provider },
    })
  } catch (error) {
    const message = error instanceof PanchangProviderUnavailableError
      ? error.message
      : 'Panchang calculations are temporarily unavailable.'
    const status = error instanceof PanchangProviderUnavailableError ? 'unavailable' : 'provider_error'
    console.error('Panchang provider error', error)
    return NextResponse.json<PanchangApiResponse>({ status, message }, {
      status: 503,
      headers: { 'cache-control': 'no-store', 'x-panchang-provider': provider.name },
    })
  } finally {
    clearTimeout(timeout)
  }
}
