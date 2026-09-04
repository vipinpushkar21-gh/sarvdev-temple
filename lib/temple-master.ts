import { buildTempleUniqueKey, normalizeTempleDataQuality, slugifyTemple, uniqueStrings } from './temple-normalization'
import type { SarvdevMediaAsset } from './media-asset'

export type TempleFormMode = 'admin-create' | 'admin-edit' | 'public'

export type TempleMasterValues = {
  title: string
  titleHi: string
  slug: string
  uniqueKey: string
  deity: string
  deityHi: string
  templeType: string
  description: string
  descriptionHi: string
  establishedYear: string
  speciality: string
  sacredCategories: string[]
  streetAddress: string
  streetAddressHi: string
  city: string
  cityHi: string
  district: string
  districtHi: string
  state: string
  stateHi: string
  pincode: string
  country: string
  mapsLink: string
  timings: string
  phone: string
  website: string
  primaryImage: string
  primaryMedia: SarvdevMediaAsset | null
  imageCard: string
  cardMedia: SarvdevMediaAsset | null
  imageHero: string
  heroMedia: SarvdevMediaAsset | null
  nearestAirport: string
  nearestRailwayStation: string
  nearestBusStand: string
  parkingAvailable: string
  localTransport: string
  templeFestivals: string
  templeFestivalsHi: string
  tags: string
  dataQuality: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  ogMedia: SarvdevMediaAsset | null
  status: 'pending' | 'approved' | 'rejected'
}

export const TEMPLE_MASTER_CSV_COLUMNS = [
  'TempleName', 'TempleNameHi', 'Slug', 'UniqueKey', 'Deity', 'DeityHi', 'TempleType',
  'Description', 'DescriptionHi', 'EstablishedYear', 'Speciality', 'SacredCategories',
  'StreetAddress', 'StreetAddressHi', 'City', 'CityHi', 'District', 'DistrictHi',
  'State', 'StateHi', 'Pincode', 'Country', 'GoogleMapsUrl', 'Timings',
  'Phone', 'Website', 'PrimaryImage', 'CardImage', 'HeroImage',
  'NearestAirport', 'NearestRailwayStation', 'NearestBusStand', 'Parking', 'LocalTransport',
  'TempleFestivals', 'TempleFestivalsHi', 'Tags', 'DataQuality', 'MetaTitle',
  'MetaDescription', 'Keywords', 'OGImage', 'Status',
] as const

export function emptyTempleMasterValues(): TempleMasterValues {
  return {
    title: '', titleHi: '', slug: '', uniqueKey: '', deity: '', deityHi: '', templeType: '',
    description: '', descriptionHi: '', establishedYear: '', speciality: '', sacredCategories: [],
    streetAddress: '', streetAddressHi: '', city: '', cityHi: '', district: '', districtHi: '',
    state: '', stateHi: '', pincode: '', country: 'India', mapsLink: '', timings: '',
    phone: '', website: '', primaryImage: '', primaryMedia: null, imageCard: '', cardMedia: null, imageHero: '', heroMedia: null,
    nearestAirport: '', nearestRailwayStation: '', nearestBusStand: '', parkingAvailable: '',
    localTransport: '', templeFestivals: '', templeFestivalsHi: '', tags: '', dataQuality: 'B',
    metaTitle: '', metaDescription: '', metaKeywords: '', ogImage: '', ogMedia: null, status: 'pending',
  }
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function listText(value: unknown, separator = ', ') {
  return Array.isArray(value) ? value.filter(Boolean).join(separator) : text(value)
}

function festivalText(value: unknown, hindi = false) {
  if (!Array.isArray(value)) return ''
  return value
    .map((festival) => hindi ? festival?.nameHi || festival?.descriptionHi : festival?.name || festival?.description)
    .filter(Boolean)
    .join('; ')
}

export function templeMasterValuesFromRecord(record: Record<string, any> | null | undefined): TempleMasterValues {
  const empty = emptyTempleMasterValues()
  if (!record) return empty
  return {
    ...empty,
    title: text(record.title || record.name),
    titleHi: text(record.titleHi || record.nameHi),
    slug: text(record.slug),
    uniqueKey: text(record.uniqueKey),
    deity: text(record.deity),
    deityHi: text(record.deityHi),
    templeType: text(record.templeType || (Array.isArray(record.templeTypes) ? record.templeTypes[0] : '')),
    description: text(record.description),
    descriptionHi: text(record.descriptionHi),
    establishedYear: text(record.establishedYear),
    speciality: text(record.speciality),
    sacredCategories: Array.isArray(record.sacredCategories) ? record.sacredCategories : (Array.isArray(record.categories) ? record.categories : []),
    streetAddress: text(record.streetAddress || record.location),
    streetAddressHi: text(record.streetAddressHi || record.locationHi),
    city: text(record.city), cityHi: text(record.cityHi), district: text(record.district), districtHi: text(record.districtHi),
    state: text(record.state), stateHi: text(record.stateHi), pincode: text(record.pincode), country: text(record.country) || 'India',
    mapsLink: text(record.mapsLink || record.googleMapsUrl || record.googleMapUrl),
    timings: text(record.timings || listText(record.timingSlots)),
    phone: text(record.phone), website: text(record.website),
    primaryImage: text(record.primaryImage || record.image), primaryMedia: record.primaryMedia || null,
    imageCard: text(record.imageCard), cardMedia: record.cardMedia || null,
    imageHero: text(record.imageHero || record.heroImage), heroMedia: record.heroMedia || null,
    nearestAirport: text(record.nearestAirport), nearestRailwayStation: text(record.nearestRailwayStation),
    nearestBusStand: text(record.nearestBusStand), parkingAvailable: text(record.parkingAvailable), localTransport: text(record.localTransport),
    templeFestivals: text(record.templeFestivals) || festivalText(record.festivals),
    templeFestivalsHi: text(record.templeFestivalsHi || record.festivalsHi) || festivalText(record.festivals, true),
    tags: listText(record.tags), dataQuality: text(record.dataQuality) || 'B', metaTitle: text(record.metaTitle),
    metaDescription: text(record.metaDescription), metaKeywords: text(record.metaKeywords || listText(record.keywords)),
    ogImage: text(record.ogImage), ogMedia: record.ogMedia || null, status: ['approved', 'rejected'].includes(record.status) ? record.status : 'pending',
  }
}

export function splitTempleList(value: string) {
  return uniqueStrings(value.split(/[\r\n,;|]/).map((item) => item.trim()).filter(Boolean))
}

function isHttpUrl(value: string) {
  if (!value.trim()) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function normalizeGoogleMapsEmbedUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const srcMatch = trimmed.match(/\ssrc=["']([^"']+)["']/i)
  const candidate = (srcMatch?.[1] || trimmed).replace(/&amp;/g, '&').trim()
  try {
    const url = new URL(candidate)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

export function validateTempleMasterValues(values: TempleMasterValues) {
  const errors: Partial<Record<keyof TempleMasterValues, string>> = {}
  if (!values.title.trim()) errors.title = 'Temple name is required'
  if (!values.city.trim()) errors.city = 'City is required'
  if (!values.state.trim()) errors.state = 'State is required'
  if (!values.description.trim() || values.description.trim().length < 20) errors.description = 'Description must be at least 20 characters'
  if (!values.timings.trim()) errors.timings = 'Timings are required'
  if (values.phone.trim() && !/^\+?[0-9\-()\s]{6,}$/.test(values.phone)) errors.phone = 'Enter a valid phone number'
  if (values.mapsLink.trim() && !normalizeGoogleMapsEmbedUrl(values.mapsLink)) errors.mapsLink = 'Paste a valid Google Maps embed URL or iframe src'
  for (const field of ['website', 'primaryImage', 'imageCard', 'imageHero', 'ogImage'] as const) {
    if (values[field].trim() && !isHttpUrl(values[field])) errors[field] = 'Enter a valid URL'
  }
  return errors
}

export function templeMasterPayload(values: TempleMasterValues, mode: TempleFormMode) {
  const title = values.title.trim()
  const slug = slugifyTemple(values.slug || title)
  const uniqueKey = values.uniqueKey.trim() || buildTempleUniqueKey(title, values.district, values.state)
  const mapsLink = normalizeGoogleMapsEmbedUrl(values.mapsLink)
  const festivals = splitTempleList(values.templeFestivals).map((name, index) => ({
    name,
    nameHi: splitTempleList(values.templeFestivalsHi)[index] || '',
  }))
  return {
    masterTempleForm: true,
    title, titleHi: values.titleHi.trim(), slug, uniqueKey,
    deity: values.deity.trim(), deityHi: values.deityHi.trim(), templeType: values.templeType.trim(),
    templeTypes: values.templeType.trim() ? [values.templeType.trim()] : [],
    description: values.description.trim(), descriptionHi: values.descriptionHi.trim(),
    establishedYear: values.establishedYear.trim(), speciality: values.speciality.trim(),
    sacredCategories: values.sacredCategories, categories: values.sacredCategories,
    streetAddress: values.streetAddress.trim(), streetAddressHi: values.streetAddressHi.trim(),
    location: values.streetAddress.trim(), locationHi: values.streetAddressHi.trim(),
    city: values.city.trim(), cityHi: values.cityHi.trim(), district: values.district.trim(), districtHi: values.districtHi.trim(),
    state: values.state.trim(), stateHi: values.stateHi.trim(), pincode: values.pincode.trim(), country: values.country.trim() || 'India',
    mapsLink, googleMapsUrl: mapsLink, googleMapUrl: mapsLink,
    timings: values.timings.trim(), timingSlots: splitTempleList(values.timings),
    phone: values.phone.trim(), website: values.website.trim(),
    primaryImage: values.primaryImage.trim(), image: values.primaryImage.trim(), primaryMedia: values.primaryMedia,
    imageCard: values.imageCard.trim(), cardMedia: values.cardMedia,
    imageHero: values.imageHero.trim(), heroImage: values.imageHero.trim(), heroMedia: values.heroMedia,
    nearestAirport: values.nearestAirport.trim(), nearestRailwayStation: values.nearestRailwayStation.trim(),
    nearestBusStand: values.nearestBusStand.trim(), parkingAvailable: values.parkingAvailable.trim(), localTransport: values.localTransport.trim(),
    templeFestivals: values.templeFestivals.trim(), templeFestivalsHi: values.templeFestivalsHi.trim(), festivals, festivalsHi: values.templeFestivalsHi.trim(),
    tags: splitTempleList(values.tags), dataQuality: normalizeTempleDataQuality(values.dataQuality, 'B'),
    metaTitle: values.metaTitle.trim(), metaDescription: values.metaDescription.trim(), metaKeywords: values.metaKeywords.trim(),
    keywords: splitTempleList(values.metaKeywords), ogImage: values.ogImage.trim(), ogMedia: values.ogMedia,
    status: mode === 'public' ? 'pending' : values.status,
  }
}
