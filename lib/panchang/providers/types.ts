export type PanchangProviderName = 'prokerala'
export type PanchangLanguage = 'en' | 'hi'

export type PanchangRequest = {
  date: string
  city: string
  lat: number
  lng: number
  timezone: string
  lang: PanchangLanguage
}

export type PanchangLocation = {
  label?: string
  latitude: number
  longitude: number
  timezone: string
}

export type PanchangData = {
  date: string
  location: PanchangLocation
  provider: PanchangProviderName
  source: string
  calculationMethod?: string
  calculationVersion?: string
  vara?: string
  hinduMonth?: string
  paksha?: string
  tithi?: string
  nakshatra?: string
  yoga?: string
  karana?: string
  sunrise?: string
  sunset?: string
  moonrise?: string
  moonset?: string
  rahuKaal?: string
  yamaganda?: string
  gulika?: string
  abhijitMuhurta?: string
  brahmaMuhurta?: string
  choghadiya?: string[]
  hora?: string[]
  observances?: string[]
}

export type PanchangProviderResult = {
  data: PanchangData
  provider: PanchangProviderName
  cacheKey: string
}

export type PanchangProvider = {
  name: PanchangProviderName
  isConfigured: () => boolean
  getPanchang: (request: PanchangRequest, signal?: AbortSignal) => Promise<PanchangProviderResult>
}

export class PanchangProviderUnavailableError extends Error {
  constructor(message = 'Panchang calculations are temporarily unavailable.') {
    super(message)
    this.name = 'PanchangProviderUnavailableError'
  }
}

export function createPanchangCacheKey(request: PanchangRequest, provider: PanchangProviderName) {
  return [
    provider,
    request.date,
    request.city.trim().toLowerCase(),
    request.lat.toFixed(4),
    request.lng.toFixed(4),
    request.timezone,
    request.lang,
  ].join(':')
}

export type PanchangApiResponse =
  | { status: 'success'; data: PanchangData }
  | { status: 'unavailable'; message: string }
  | { status: 'provider_error'; message: string }
  | { status: 'invalid_request'; message: string }

export function getCalendarDateInTimeZone(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value
  return `${value('year')}-${value('month')}-${value('day')}`
}
