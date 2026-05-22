import { NextRequest } from 'next/server'
import { demoPanchangProvider } from '@/lib/panchang/providers/demo'
import { prokeralaPanchangProvider } from '@/lib/panchang/providers/prokerala'
import { createPanchangCacheKey, type PanchangProvider, type PanchangProviderName, type PanchangRequest } from '@/lib/panchang/providers/types'

export const revalidate = 3600

const responseCache = new Map<string, { expiresAt: number; body: string }>()
const CACHE_TTL_MS = revalidate * 1000

function getProvider(): PanchangProvider {
  const requested = (process.env.PANCHANG_PROVIDER || 'demo').toLowerCase() as PanchangProviderName
  if (requested === 'prokerala' && prokeralaPanchangProvider.isConfigured()) {
    return prokeralaPanchangProvider
  }

  return demoPanchangProvider
}

function createRequest(req: NextRequest): PanchangRequest {
  const { searchParams } = new URL(req.url)

  return {
    date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
    lat: Number(searchParams.get('lat') || 28.6139),
    lng: Number(searchParams.get('lon') || searchParams.get('lng') || 77.2090),
    timezone: searchParams.get('tz') || 'Asia/Kolkata',
    city: searchParams.get('city') || 'Delhi',
    lang: searchParams.get('lang') || undefined,
  }
}

export async function GET(req: NextRequest) {
  const panchangRequest = createRequest(req)
  const selectedProvider = getProvider()
  const cacheKey = `${selectedProvider.name}:${createPanchangCacheKey(panchangRequest)}`
  const cached = responseCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) {
    return new Response(cached.body, {
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, s-maxage=${revalidate}`,
        'x-panchang-cache': 'hit',
      },
    })
  }

  try {
    const result = await selectedProvider.getPanchang(panchangRequest)
    const body = JSON.stringify(result.data)
    responseCache.set(cacheKey, { body, expiresAt: Date.now() + CACHE_TTL_MS })

    return new Response(body, {
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, s-maxage=${revalidate}`,
        'x-panchang-cache': 'miss',
        'x-panchang-provider': result.provider,
      },
    })
  } catch (error) {
    console.error('Panchang provider error', error)
    const fallback = await demoPanchangProvider.getPanchang(panchangRequest)
    const body = JSON.stringify(fallback.data)

    return new Response(body, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        'x-panchang-provider': 'demo',
      },
    })
  }
}
