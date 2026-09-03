import { normalizeGoogleMapsEmbedUrl } from './temple-master'

export type PublicTempleSubmission = {
  title: string; titleHi?: string; deity?: string; deityHi?: string; templeType?: string
  description: string; descriptionHi?: string; sacredCategories?: string[]
  streetAddress?: string; city: string; district?: string; state: string; pincode?: string; country?: string
  mapsLink?: string; timings?: string; phone?: string; email?: string; website?: string
  primaryImage?: string; templeFestivals?: string; templeFestivalsHi?: string
  nearestAirport?: string; nearestRailwayStation?: string; nearestBusStand?: string; parkingAvailable?: string; localTransport?: string
}

const TEXT_FIELDS: Array<keyof PublicTempleSubmission> = ['title', 'titleHi', 'deity', 'deityHi', 'templeType', 'description', 'descriptionHi', 'streetAddress', 'city', 'district', 'state', 'pincode', 'country', 'mapsLink', 'timings', 'phone', 'email', 'website', 'primaryImage', 'templeFestivals', 'templeFestivalsHi', 'nearestAirport', 'nearestRailwayStation', 'nearestBusStand', 'parkingAvailable', 'localTransport']

function text(value: unknown, max = 4000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function url(value: string) {
  if (!value) return true
  try { const parsed = new URL(value); return parsed.protocol === 'https:' || parsed.protocol === 'http:' } catch { return false }
}

export function normalizePublicTempleSubmission(input: Record<string, unknown>): PublicTempleSubmission {
  const output = {} as PublicTempleSubmission
  for (const field of TEXT_FIELDS) {
    const limit = field === 'description' || field === 'descriptionHi' ? 8000 : 500
    const value = text(input[field], limit)
    if (value) (output as unknown as Record<string, string>)[field] = value
  }
  output.title ||= ''
  output.description ||= ''
  output.city ||= ''
  output.state ||= ''
  output.country ||= 'India'
  output.sacredCategories = Array.isArray(input.sacredCategories)
    ? input.sacredCategories.filter((value): value is string => typeof value === 'string').map((value) => value.trim().slice(0, 120)).filter(Boolean).slice(0, 12)
    : []
  output.mapsLink = normalizeGoogleMapsEmbedUrl(output.mapsLink || '')
  return output
}

export function validatePublicTempleSubmission(value: PublicTempleSubmission) {
  const errors: Record<string, string> = {}
  if (!value.title) errors.title = 'Temple name is required'
  if (!value.city) errors.city = 'City, town or village is required'
  if (!value.state) errors.state = 'State is required'
  if (!value.description || value.description.length < 20) errors.description = 'Please add a meaningful description of at least 20 characters'
  if (value.phone && !/^\+?[0-9\-()\s]{6,}$/.test(value.phone)) errors.phone = 'Enter a valid temple phone number'
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = 'Enter a valid temple email address'
  for (const field of ['website', 'primaryImage'] as const) if (value[field] && !url(value[field]!)) errors[field] = 'Enter a valid HTTP(S) URL'
  if (value.mapsLink && !url(value.mapsLink)) errors.mapsLink = 'Enter a valid Google Maps URL'
  return errors
}
