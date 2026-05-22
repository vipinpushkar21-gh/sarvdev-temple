export type PanchangProviderName = 'demo' | 'prokerala'

export type PanchangRequest = {
  date: string
  city: string
  lat: number
  lng: number
  timezone: string
  lang?: string
}

export type PanchangData = {
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
  isDemo?: boolean
  cacheKey?: string
}

export type PanchangProviderResult = {
  data: PanchangData
  provider: PanchangProviderName
  cacheKey: string
}

export type PanchangProvider = {
  name: PanchangProviderName
  isConfigured: () => boolean
  getPanchang: (request: PanchangRequest) => Promise<PanchangProviderResult>
}

export function createPanchangCacheKey(request: PanchangRequest) {
  return [
    request.date,
    request.city.trim().toLowerCase(),
    request.lat.toFixed(4),
    request.lng.toFixed(4),
  ].join(':')
}
