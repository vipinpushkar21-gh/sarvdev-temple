import { randomUUID } from 'crypto'
import { getCategoryByName, getCategoryBySlug } from './sacred-categories'
import { getSacredCategorySlugs, normalizeTempleText, normalizeTempleWrite, sacredCategoryName, slugifyTemple, uniqueStrings } from './temple-normalization'
import ActivityLog from '@/models/ActivityLog'
import Temple from '@/models/Temple'
import TempleImportSession from '@/models/TempleImportSession'

export const TEMPLE_IMPORT_COLUMNS = [
  'Title',
  'TempleNameHi',
  'Slug',
  'Location',
  'City',
  'District',
  'State',
  'Country',
  'Deity',
  'Type',
  'SacredCategories',
  'Tags',
  'MetaTitle',
  'MetaDescription',
  'Keywords',
  'Description',
  'DescriptionHi',
  'History',
  'HistoryHi',
  'Architecture',
  'ArchitectureHi',
  'ReligiousImportance',
  'ReligiousImportanceHi',
  'Festivals',
  'FestivalsHi',
  'BestTimeToVisit',
  'BestTimeToVisitHi',
  'NearbyTemples',
  'FAQs',
  'SourceUrls',
  'PrimaryImage',
  'GalleryImages',
  'Latitude',
  'Longitude',
  'Timings',
  'GoogleMapUrl',
  'Speciality',
  'SpecialityHi',
  'Status',
  'Verified',
] as const

const LEGACY_TEMPLE_IMPORT_SAMPLE_ROW = [
  'Sample Vishnu Temple',
  'श्री विष्णु मंदिर',
  '',
  'Vishnu',
  'विष्णु',
  'Ancient Temple',
  'Short English description.',
  'संक्षिप्त हिंदी विवरण।',
  'Known for peaceful darshan.',
  'शांत दर्शन के लिए प्रसिद्ध।',
  'Main Road',
  'Sample City',
  'Sample District',
  'Uttar Pradesh',
  'India',
  '221001',
  '25.3176',
  '82.9739',
  'https://maps.google.com/?q=25.3176,82.9739',
  '6:00 AM - 9:00 PM',
  '+91-0000000000',
  'info@example.com',
  'https://example.com',
  'Panch Badri;Char Dham',
  'Vaishnav',
  '',
  '',
  '',
  '',
  'Sample Vishnu Temple | Sarvdev',
  'Learn about Sample Vishnu Temple.',
  'vishnu, temple, darshan',
  'pending',
  'not-verified',
] as const

const TEMPLE_IMPORT_TEMPLATE_SAMPLE_ROW = [
  'Sample Vishnu Temple',
  'श्री विष्णु मंदिर',
  'sample-vishnu-temple',
  'Main Road',
  'Sample City',
  'Sample District',
  'Uttar Pradesh',
  'India',
  'Vishnu',
  'Ancient Temple',
  'Panch Badri;Char Dham',
  'vishnu, temple, darshan',
  'Sample Vishnu Temple | Sarvdev',
  'Learn about Sample Vishnu Temple.',
  'vishnu, temple, darshan',
  'Short English description.',
  'Hindi description with the same meaning.',
  'Historical background of the temple.',
  'Hindi history with the same meaning.',
  'Nagara-style temple architecture.',
  'Hindi architecture summary.',
  'Important for Vishnu worship and daily darshan.',
  'Hindi religious importance summary.',
  'Ekadashi;Janmashtami',
  'Ekadashi;Janmashtami Hindi',
  'October to March',
  'October to March Hindi',
  'Nearby Temple One, Nearby Temple Two',
  'What is the best time?|October to March; Is photography allowed?|Check temple rules',
  'https://example.com/source',
  '/images/temple-placeholder.jpg',
  '/images/temple-gallery-1.jpg,/images/temple-gallery-2.jpg',
  '25.3176',
  '82.9739',
  '6:00 AM - 9:00 PM',
  'https://maps.google.com/?q=25.3176,82.9739',
  'Known for peaceful darshan.',
  'Hindi speciality with the same meaning.',
  'pending',
  'not-verified',
] as const

export const TEMPLE_IMPORT_SAMPLE_ROW = TEMPLE_IMPORT_TEMPLATE_SAMPLE_ROW

type ImportMode = 'dry-run' | 'execute'

type AdminInfo = {
  id?: string
  email?: string
  name?: string
  role?: string
}

type ImportFile = Blob & {
  name?: string
  text?: () => Promise<string>
}

type ImportRow = {
  rowNumber: number
  payload: Record<string, any>
  warnings: string[]
  duplicateOf?: number
}

type ExistingTemple = Record<string, any>

export type TempleImportResult = {
  ok: boolean
  dryRun: boolean
  importId: string
  fileName: string
  totalRows: number
  validRows: number
  invalidRows: number
  duplicateRows: number
  existingDbMatches: number
  wouldCreate: number
  wouldUpdateMissingFields: number
  wouldMergeCategories: number
  wouldSkip: number
  created: number
  updatedMissingFields: number
  mergedCategories: number
  skippedExisting: number
  skippedDuplicate: number
  failedRows: number
  totalProcessed: number
  errors: Array<{ row: number; templeName?: string; reason: string }>
  warnings: Array<{ row: number; templeName?: string; reason: string }>
  duplicateReport: Array<{ row: number; templeName?: string; duplicateOf?: number; reason: string }>
}

const HEADER_MAP: Record<string, string> = {
  title: 'templeName',
  templetitle: 'templeName',
  name: 'templeName',
  templename: 'templeName',
  temple_name: 'templeName',
  templenamehi: 'templeNameHi',
  titlehi: 'templeNameHi',
  deity: 'deity',
  deityhi: 'deityHi',
  slug: 'slug',
  tags: 'tags',
  type: 'templeType',
  templetype: 'templeType',
  description: 'description',
  descriptionhi: 'descriptionHi',
  history: 'history',
  historyhi: 'historyHi',
  architecture: 'architecture',
  architecturehi: 'architectureHi',
  religiousimportance: 'religiousImportance',
  religiousimportancehi: 'religiousImportanceHi',
  sacredimportance: 'religiousImportance',
  sacredimportancehi: 'religiousImportanceHi',
  festivals: 'festivalsText',
  festivalshi: 'festivalsHi',
  besttimetovisit: 'bestTimeToVisit',
  besttimetovisithi: 'bestTimeToVisitHi',
  bestseason: 'bestTimeToVisit',
  bestseasonhi: 'bestTimeToVisitHi',
  nearbytemples: 'nearbyTemples',
  nearbysacredplaces: 'nearbyTemples',
  faqs: 'faqs',
  faq: 'faqs',
  sourceurls: 'sourceUrls',
  sources: 'sourceUrls',
  sourceurl: 'sourceUrls',
  speciality: 'speciality',
  specialty: 'speciality',
  specialityhi: 'specialityHi',
  specialtyhi: 'specialityHi',
  streetaddress: 'streetAddress',
  address: 'streetAddress',
  location: 'streetAddress',
  city: 'city',
  district: 'district',
  state: 'state',
  country: 'country',
  pincode: 'pincode',
  pin: 'pincode',
  latitude: 'latitude',
  lat: 'latitude',
  longitude: 'longitude',
  lng: 'longitude',
  lon: 'longitude',
  googlemapurl: 'googleMapUrl',
  googlemapsurl: 'googleMapsUrl',
  mapslink: 'googleMapsUrl',
  timings: 'timings',
  timing: 'timings',
  phone: 'phone',
  contact: 'phone',
  email: 'email',
  website: 'website',
  sacredcategories: 'sacredCategories',
  sacredcategory: 'sacredCategories',
  categories: 'categories',
  category: 'categories',
  image: 'image',
  primaryimage: 'primaryImage',
  primaryimageurl: 'primaryImage',
  imagecard: 'imageCard',
  imagehero: 'imageHero',
  heroimage: 'imageHero',
  galleryimages: 'galleryImages',
  images: 'galleryImages',
  metatitle: 'metaTitle',
  metadescription: 'metaDescription',
  metakeywords: 'metaKeywords',
  keywords: 'keywords',
  status: 'status',
  verified: 'verified',
}

function normalizeHeader(value: string) {
  return value.trim().replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function csvEscape(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export function buildTempleImportTemplateCsv() {
  return [
    TEMPLE_IMPORT_COLUMNS.join(','),
    TEMPLE_IMPORT_TEMPLATE_SAMPLE_ROW.map(csvEscape).join(','),
  ].join('\n')
}

function splitMulti(value: unknown) {
  return uniqueStrings(
    String(value || '')
      .split(/[;|]/)
      .map((item) => item.trim())
  )
}

function splitCommaList(value: unknown) {
  return uniqueStrings(
    String(value || '')
      .split(/\r?\n|,/)
      .map((item) => item.trim())
  )
}

function splitLooseList(value: unknown) {
  return uniqueStrings(
    String(value || '')
      .split(/\r?\n|;|,/)
      .map((item) => item.trim())
  )
}

function parseFaqText(value: unknown) {
  return splitMulti(value)
    .map((item) => {
      const [question, ...answerParts] = item.split('|')
      return {
        question: (question || '').trim(),
        answer: answerParts.join('|').trim(),
      }
    })
    .filter((faq) => faq.question || faq.answer)
}

function parseFestivalText(festivalsText: unknown, festivalsHiText: unknown) {
  const names = splitMulti(festivalsText)
  const namesHi = splitMulti(festivalsHiText)
  const length = Math.max(names.length, namesHi.length)
  return Array.from({ length }, (_, index) => ({
    name: names[index] || namesHi[index] || '',
    nameHi: namesHi[index] || '',
  })).filter((festival) => festival.name || festival.nameHi)
}

function parseCsvText(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1
      row.push(field)
      if (row.some((cell) => cell.trim())) rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  if (row.some((cell) => cell.trim())) rows.push(row)
  return rows
}

async function* parseCsvRowsFromFile(file: ImportFile): AsyncGenerator<string[]> {
  if (typeof file.stream !== 'function') {
    const text = typeof file.text === 'function' ? await file.text() : ''
    for (const row of parseCsvText(text)) yield row
    return
  }

  const reader = file.stream().getReader()
  const decoder = new TextDecoder()
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let lastWasCr = false

  while (true) {
    const { value, done } = await reader.read()
    const chunk = value ? decoder.decode(value, { stream: !done }) : ''
    for (let index = 0; index < chunk.length; index += 1) {
      const char = chunk[index]
      const next = chunk[index + 1]

      if (lastWasCr) {
        lastWasCr = false
        if (char === '\n') continue
      }

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"'
          index += 1
        } else {
          inQuotes = !inQuotes
        }
        continue
      }

      if (char === ',' && !inQuotes) {
        row.push(field)
        field = ''
        continue
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        row.push(field)
        if (row.some((cell) => cell.trim())) yield row
        row = []
        field = ''
        lastWasCr = char === '\r'
        continue
      }

      field += char
    }

    if (done) break
  }

  field += decoder.decode()
  row.push(field)
  if (row.some((cell) => cell.trim())) yield row
}

function normalizeStatus(value: unknown) {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return 'pending'
  if (['approved', 'pending', 'rejected'].includes(normalized)) return normalized
  return null
}

function normalizeVerified(value: unknown) {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return 'not-verified'
  if (['verified', 'yes', 'true', '1', 'y'].includes(normalized)) return 'verified'
  if (['not-verified', 'not verified', 'unverified', 'no', 'false', '0', 'n'].includes(normalized)) return 'not-verified'
  return null
}

function parseCoordinate(value: unknown, field: string, errors: string[]) {
  const raw = String(value || '').trim()
  if (!raw) return undefined
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) {
    errors.push(`${field} must be a number`)
    return undefined
  }
  return parsed
}

function isValidUrlOrLocal(value: string) {
  if (!value) return true
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function isCloudinaryUrl(value: string) {
  return /(^https?:\/\/res\.cloudinary\.com\/|^\/)/i.test(value)
}

function validateImageUrl(field: string, value: string, errors: string[], warnings: string[]) {
  if (!value) return
  if (!isValidUrlOrLocal(value)) {
    errors.push(`${field} has an invalid URL`)
    return
  }
  if (!isCloudinaryUrl(value)) warnings.push(`${field} is not a Cloudinary/local URL; it will be stored as provided`)
}

function validateRegularUrl(field: string, value: string, errors: string[]) {
  if (!value) return
  if (!isValidUrlOrLocal(value)) errors.push(`${field} has an invalid URL`)
}

function validateRegularUrlWarning(field: string, value: string, warnings: string[]) {
  if (!value) return
  if (!isValidUrlOrLocal(value)) warnings.push(`${field} has an invalid URL; it will be stored as provided`)
}

function normalizeCategories(value: unknown, warnings: string[]) {
  const categories = splitMulti(value).map((category) => {
    const known = getCategoryByName(category) || getCategoryBySlug(slugifyTemple(category))
    if (!known) warnings.push(`Unknown sacred category: ${category}`)
    return sacredCategoryName(category)
  })
  return uniqueStrings(categories)
}

function hasEnglishLetters(value: unknown) {
  return /[A-Za-z]/.test(String(value || '').trim())
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null
}

function normalizeInputRow(row: Record<string, string>, rowNumber: number): { row?: ImportRow; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  const title = String(row.templeName || '').trim()
  if (!title) errors.push('templeName is required')

  if (row.templeNameHi?.trim() && hasEnglishLetters(row.templeNameHi)) {
    warnings.push('TempleNameHi should contain only Hindi/Devanagari text. Leave it blank if the Hindi temple name is not available.')
  }

  const status = normalizeStatus(row.status)
  if (status === null) errors.push('status must be approved, pending, or rejected')

  const verified = normalizeVerified(row.verified)
  if (verified === null) errors.push('verified must be verified/not-verified or yes/no')

  const latitude = parseCoordinate(row.latitude, 'latitude', errors)
  const longitude = parseCoordinate(row.longitude, 'longitude', errors)
  if ((latitude === undefined) !== (longitude === undefined)) {
    warnings.push('Only one coordinate was provided; coordinate duplicate matching needs both latitude and longitude')
  }

  const sacredCategories = normalizeCategories(row.sacredCategories, warnings)
  const categories = normalizeCategories(row.categories, warnings)
  const galleryImages = splitLooseList(row.galleryImages)
  const primaryImage = String(row.primaryImage || row.image || '').trim()
  const googleMapUrl = String(row.googleMapUrl || row.googleMapsUrl || '').trim()
  const tags = splitCommaList(row.tags)
  const rawKeywords = row.keywords || row.metaKeywords
  const keywords = splitCommaList(rawKeywords)
  const nearbyTemples = splitCommaList(row.nearbyTemples)
  const sourceUrls = splitLooseList(row.sourceUrls)
  const faqs = parseFaqText(row.faqs)
  const festivals = parseFestivalText(row.festivalsText, row.festivalsHi)
  for (const field of ['primaryImage', 'image', 'imageCard', 'imageHero'] as const) {
    validateImageUrl(field, String(row[field] || '').trim(), errors, warnings)
  }
  validateRegularUrlWarning('GoogleMapUrl', googleMapUrl, warnings)
  validateRegularUrl('website', String(row.website || '').trim(), errors)
  for (const sourceUrl of sourceUrls) validateRegularUrl('sourceUrls', sourceUrl, errors)
  for (const imageUrl of galleryImages) validateImageUrl('galleryImages', imageUrl, errors, warnings)

  const slugBase = row.slug || [title, row.city, row.state].filter(Boolean).join(' ')
  const payload: Record<string, any> = {
    title,
    titleHi: row.templeNameHi?.trim(),
    slug: slugifyTemple(slugBase),
    deity: row.deity?.trim(),
    deityHi: row.deityHi?.trim(),
    templeType: row.templeType?.trim(),
    tags,
    keywords,
    description: row.description?.trim(),
    descriptionHi: row.descriptionHi?.trim(),
    history: row.history?.trim(),
    historyHi: row.historyHi?.trim(),
    architecture: row.architecture?.trim(),
    architectureHi: row.architectureHi?.trim(),
    architectureHighlights: row.architecture?.trim(),
    religiousImportance: row.religiousImportance?.trim(),
    religiousImportanceHi: row.religiousImportanceHi?.trim(),
    sacredImportance: row.religiousImportance?.trim(),
    sacredImportanceHi: row.religiousImportanceHi?.trim(),
    festivals,
    festivalsHi: row.festivalsHi?.trim(),
    bestTimeToVisit: row.bestTimeToVisit?.trim(),
    bestTimeToVisitHi: row.bestTimeToVisitHi?.trim(),
    bestSeason: row.bestTimeToVisit?.trim(),
    nearbyTemples,
    nearbySacredPlaces: nearbyTemples,
    faqs,
    sourceUrls,
    speciality: row.speciality?.trim(),
    specialityHi: row.specialityHi?.trim(),
    streetAddress: row.streetAddress?.trim(),
    location: row.streetAddress?.trim(),
    city: row.city?.trim(),
    district: row.district?.trim(),
    state: row.state?.trim(),
    country: row.country?.trim() || 'India',
    pincode: row.pincode?.trim(),
    latitude,
    longitude,
    googleMapUrl,
    googleMapsUrl: googleMapUrl,
    mapsLink: googleMapUrl,
    timings: row.timings?.trim(),
    phone: row.phone?.trim(),
    contact: row.phone?.trim(),
    email: row.email?.trim(),
    website: row.website?.trim(),
    sacredCategories,
    categories: uniqueStrings([...sacredCategories, ...categories]),
    primaryImage,
    image: primaryImage,
    imageCard: row.imageCard?.trim(),
    imageHero: row.imageHero?.trim(),
    galleryImages,
    images: galleryImages,
    metaTitle: row.metaTitle?.trim(),
    metaDescription: row.metaDescription?.trim(),
    metaKeywords: String(rawKeywords || '').trim(),
    status: status || 'pending',
    verified: verified || 'not-verified',
  }

  if (payload.templeType) payload.templeTypes = [payload.templeType]
  for (const [key, value] of Object.entries(payload)) {
    if (!hasValue(value)) delete payload[key]
  }

  if (!payload.slug && title) payload.slug = slugifyTemple(title)

  if (errors.length > 0) return { errors, warnings }
  return {
    row: {
      rowNumber,
      payload: normalizeTempleWrite(payload),
      warnings,
    },
    errors,
    warnings,
  }
}

function getRowKeys(payload: Record<string, any>) {
  const titleNormalized = normalizeTempleText(payload.title)
  const cityNormalized = normalizeTempleText(payload.city)
  const stateNormalized = normalizeTempleText(payload.state)
  const keys: string[] = []
  if (payload.slug) keys.push(`slug:${slugifyTemple(payload.slug)}`)
  if (titleNormalized && cityNormalized && stateNormalized) keys.push(`norm:${titleNormalized}|${cityNormalized}|${stateNormalized}`)
  if (payload.googleMapsUrl) keys.push(`maps:${String(payload.googleMapsUrl).trim().toLowerCase()}`)
  if (payload.latitude !== undefined && payload.longitude !== undefined) {
    keys.push(`coords:${Number(payload.latitude).toFixed(6)}|${Number(payload.longitude).toFixed(6)}`)
  }
  return keys
}

function makeEmptyResult(mode: ImportMode, importId: string, fileName: string): TempleImportResult {
  return {
    ok: true,
    dryRun: mode === 'dry-run',
    importId,
    fileName,
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    duplicateRows: 0,
    existingDbMatches: 0,
    wouldCreate: 0,
    wouldUpdateMissingFields: 0,
    wouldMergeCategories: 0,
    wouldSkip: 0,
    created: 0,
    updatedMissingFields: 0,
    mergedCategories: 0,
    skippedExisting: 0,
    skippedDuplicate: 0,
    failedRows: 0,
    totalProcessed: 0,
    errors: [],
    warnings: [],
    duplicateReport: [],
  }
}

function buildDuplicateQuery(rows: ImportRow[]) {
  const or: Record<string, any>[] = []
  const slugs = uniqueStrings(rows.map((row) => slugifyTemple(row.payload.slug)))
  const mapsUrls = uniqueStrings(rows.map((row) => String(row.payload.googleMapsUrl || '').trim()).filter(Boolean))
  if (slugs.length > 0) or.push({ slug: { $in: slugs } })
  if (mapsUrls.length > 0) or.push({ googleMapsUrl: { $in: mapsUrls } })

  for (const row of rows) {
    const titleNormalized = normalizeTempleText(row.payload.title)
    const cityNormalized = normalizeTempleText(row.payload.city)
    const stateNormalized = normalizeTempleText(row.payload.state)
    if (titleNormalized && cityNormalized && stateNormalized) {
      or.push({ titleNormalized, cityNormalized, stateNormalized })
    }
    if (row.payload.latitude !== undefined && row.payload.longitude !== undefined) {
      or.push({ latitude: row.payload.latitude, longitude: row.payload.longitude })
    }
  }

  return or.length > 0 ? { $or: or } : null
}

function buildExistingMaps(existingRows: ExistingTemple[]) {
  const bySlug = new Map<string, ExistingTemple>()
  const byNormalized = new Map<string, ExistingTemple>()
  const byMaps = new Map<string, ExistingTemple>()
  const byCoords = new Map<string, ExistingTemple>()

  for (const temple of existingRows) {
    if (temple.slug) bySlug.set(slugifyTemple(temple.slug), temple)
    const titleNormalized = temple.titleNormalized || normalizeTempleText(temple.title)
    const cityNormalized = temple.cityNormalized || normalizeTempleText(temple.city)
    const stateNormalized = temple.stateNormalized || normalizeTempleText(temple.state)
    if (titleNormalized && cityNormalized && stateNormalized) {
      byNormalized.set(`${titleNormalized}|${cityNormalized}|${stateNormalized}`, temple)
    }
    if (temple.googleMapsUrl) byMaps.set(String(temple.googleMapsUrl).trim().toLowerCase(), temple)
    if (temple.latitude !== undefined && temple.longitude !== undefined) {
      byCoords.set(`${Number(temple.latitude).toFixed(6)}|${Number(temple.longitude).toFixed(6)}`, temple)
    }
  }

  return { bySlug, byNormalized, byMaps, byCoords }
}

function findExistingTemple(payload: Record<string, any>, maps: ReturnType<typeof buildExistingMaps>) {
  const slug = slugifyTemple(payload.slug)
  if (slug && maps.bySlug.has(slug)) return maps.bySlug.get(slug)
  const titleNormalized = normalizeTempleText(payload.title)
  const cityNormalized = normalizeTempleText(payload.city)
  const stateNormalized = normalizeTempleText(payload.state)
  const normalizedKey = `${titleNormalized}|${cityNormalized}|${stateNormalized}`
  if (titleNormalized && cityNormalized && stateNormalized && maps.byNormalized.has(normalizedKey)) return maps.byNormalized.get(normalizedKey)
  const mapsUrl = String(payload.googleMapsUrl || '').trim().toLowerCase()
  if (mapsUrl && maps.byMaps.has(mapsUrl)) return maps.byMaps.get(mapsUrl)
  if (payload.latitude !== undefined && payload.longitude !== undefined) {
    const coordKey = `${Number(payload.latitude).toFixed(6)}|${Number(payload.longitude).toFixed(6)}`
    if (maps.byCoords.has(coordKey)) return maps.byCoords.get(coordKey)
  }
  return null
}

function buildSafeExistingUpdate(existing: ExistingTemple, incoming: Record<string, any>) {
  const update: Record<string, any> = {}
  let missingFieldCount = 0
  let categoryChanged = false

  const normalizedPatch: Record<string, any> = {}
  if (!hasValue(existing.titleNormalized) && hasValue(existing.title || incoming.title)) normalizedPatch.titleNormalized = normalizeTempleText(existing.title || incoming.title)
  if (!hasValue(existing.cityNormalized) && hasValue(existing.city || incoming.city)) normalizedPatch.cityNormalized = normalizeTempleText(existing.city || incoming.city)
  if (!hasValue(existing.stateNormalized) && hasValue(existing.state || incoming.state)) normalizedPatch.stateNormalized = normalizeTempleText(existing.state || incoming.state)
  if (!hasValue(existing.deitySlug) && hasValue(existing.deity || incoming.deity)) normalizedPatch.deitySlug = slugifyTemple(existing.deity || incoming.deity)
  for (const [field, value] of Object.entries(normalizedPatch)) {
    if (hasValue(value)) {
      update[field] = value
      missingFieldCount += 1
    }
  }

  const incomingCategories = uniqueStrings([
    ...(Array.isArray(incoming.sacredCategories) ? incoming.sacredCategories : []),
    ...(Array.isArray(incoming.categories) ? incoming.categories : []),
  ])
  if (incomingCategories.length > 0) {
    const currentSacred = Array.isArray(existing.sacredCategories) ? existing.sacredCategories.map(String) : []
    const currentCategories = Array.isArray(existing.categories) ? existing.categories.map(String) : []
    const nextSacred = uniqueStrings([...currentSacred, ...incomingCategories])
    const nextCategories = uniqueStrings([...currentCategories, ...incomingCategories])
    const nextSlugs = getSacredCategorySlugs(uniqueStrings([...nextSacred, ...nextCategories]))
    if (nextSacred.length !== currentSacred.length) {
      update.sacredCategories = nextSacred
      categoryChanged = true
    }
    if (nextCategories.length !== currentCategories.length) {
      update.categories = nextCategories
      categoryChanged = true
    }
    const currentSlugs = Array.isArray(existing.sacredCategorySlugs) ? existing.sacredCategorySlugs.map(String) : []
    if (nextSlugs.some((slug) => !currentSlugs.includes(slug))) {
      update.sacredCategorySlugs = uniqueStrings([...currentSlugs, ...nextSlugs])
      categoryChanged = true
    }
  }

  if (Object.keys(update).length > 0) update.updatedAt = new Date()
  return { update, missingFieldCount, categoryChanged }
}

function makeUniqueSlug(baseSlug: string, usedSlugs: Set<string>) {
  let slug = slugifyTemple(baseSlug)
  if (!slug) slug = `temple-${Date.now()}`
  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug)
    return { slug, changed: false }
  }

  let index = 2
  while (usedSlugs.has(`${slug}-${index}`)) index += 1
  const nextSlug = `${slug}-${index}`
  usedSlugs.add(nextSlug)
  return { slug: nextSlug, changed: true }
}

async function processChunk(rows: ImportRow[], mode: ImportMode, result: TempleImportResult, usedNewSlugs: Set<string>) {
  if (rows.length === 0) return
  const query = buildDuplicateQuery(rows)
  const existingRows = query
    ? await Temple.find(
      query,
      'title slug titleNormalized city cityNormalized state stateNormalized deity deitySlug googleMapsUrl latitude longitude sacredCategories categories sacredCategorySlugs'
    ).lean()
    : []
  const maps = buildExistingMaps(existingRows as ExistingTemple[])
  const ops: any[] = []
  const rowActions: Array<'insert' | 'update' | 'skip'> = []

  for (const row of rows) {
    const existing = findExistingTemple(row.payload, maps)
    if (existing) {
      result.existingDbMatches += 1
      const safe = buildSafeExistingUpdate(existing, row.payload)
      if (Object.keys(safe.update).length === 0) {
        result.wouldSkip += mode === 'dry-run' ? 1 : 0
        result.skippedExisting += mode === 'execute' ? 1 : 0
        rowActions.push('skip')
        continue
      }

      if (safe.missingFieldCount > 0) {
        if (mode === 'dry-run') result.wouldUpdateMissingFields += 1
        else result.updatedMissingFields += 1
      }
      if (safe.categoryChanged) {
        if (mode === 'dry-run') result.wouldMergeCategories += 1
        else result.mergedCategories += 1
      }
      if (mode === 'execute') {
        ops.push({ updateOne: { filter: { _id: existing._id }, update: { $set: safe.update } } })
      }
      Object.assign(existing, safe.update)
      rowActions.push('update')
      continue
    }

    const uniqueSlug = makeUniqueSlug(row.payload.slug || row.payload.title, usedNewSlugs)
    if (uniqueSlug.changed) {
      result.warnings.push({
        row: row.rowNumber,
        templeName: row.payload.title,
        reason: `Slug collision inside import; new record will use ${uniqueSlug.slug}`,
      })
      row.payload.slug = uniqueSlug.slug
    }

    if (mode === 'dry-run') {
      result.wouldCreate += 1
    } else {
      ops.push({ insertOne: { document: normalizeTempleWrite(row.payload) } })
      result.created += 1
    }
    rowActions.push('insert')
  }

  if (mode === 'execute' && ops.length > 0) {
    try {
      await Temple.bulkWrite(ops, { ordered: false })
    } catch (error: any) {
      const writeErrors = Array.isArray(error?.writeErrors) ? error.writeErrors : []
      const failedCount = writeErrors.length || 1
      result.failedRows += failedCount
      result.ok = false
      result.errors.push({
        row: 0,
        reason: error?.message || 'Some rows failed during bulk write',
      })
      for (const writeError of writeErrors.slice(0, 25)) {
        result.errors.push({
          row: 0,
          reason: writeError?.errmsg || writeError?.message || 'Bulk write row failed',
        })
      }
    }
  }

  result.totalProcessed += rows.length
}

function buildSessionSnapshot(result: TempleImportResult) {
  return {
    ok: result.ok,
    dryRun: result.dryRun,
    importId: result.importId,
    fileName: result.fileName,
    totalRows: result.totalRows,
    validRows: result.validRows,
    invalidRows: result.invalidRows,
    duplicateRows: result.duplicateRows,
    existingDbMatches: result.existingDbMatches,
    wouldCreate: result.wouldCreate,
    wouldUpdateMissingFields: result.wouldUpdateMissingFields,
    wouldMergeCategories: result.wouldMergeCategories,
    wouldSkip: result.wouldSkip,
    created: result.created,
    updatedMissingFields: result.updatedMissingFields,
    mergedCategories: result.mergedCategories,
    skippedExisting: result.skippedExisting,
    skippedDuplicate: result.skippedDuplicate,
    failedRows: result.failedRows,
    totalProcessed: result.totalProcessed,
    errors: result.errors.slice(0, 100),
    warnings: result.warnings.slice(0, 100),
    duplicateReport: result.duplicateReport.slice(0, 100),
  }
}

export async function runTempleImport({
  file,
  mode,
  admin,
  chunkSize = 500,
}: {
  file: ImportFile
  mode: ImportMode
  admin: AdminInfo
  chunkSize?: number
}) {
  const importId = randomUUID()
  const fileName = file.name || 'temple-import.csv'
  const result = makeEmptyResult(mode, importId, fileName)
  const session = await TempleImportSession.create({
    importId,
    fileName,
    status: mode === 'dry-run' ? 'dry-run' : 'running',
    adminUser: { id: admin.id, email: admin.email, name: admin.name },
    startedAt: new Date(),
  })

  const seenCsvKeys = new Map<string, number>()
  const usedNewSlugs = new Set<string>()
  let headers: string[] | null = null
  let chunk: ImportRow[] = []

  try {
    let physicalRow = 0
    for await (const cells of parseCsvRowsFromFile(file)) {
      physicalRow += 1
      if (!headers) {
        headers = cells.map((header) => HEADER_MAP[normalizeHeader(header)] || '')
        if (!headers.includes('templeName')) {
          throw new Error('CSV header must include templeName')
        }
        continue
      }

      result.totalRows += 1
      const rawRow: Record<string, string> = {}
      headers.forEach((field, columnIndex) => {
        if (field) rawRow[field] = String(cells[columnIndex] || '').trim()
      })

      const parsed = normalizeInputRow(rawRow, physicalRow)
      parsed.warnings.forEach((warning) => result.warnings.push({ row: physicalRow, templeName: rawRow.templeName, reason: warning }))

      if (parsed.errors.length > 0 || !parsed.row) {
        result.invalidRows += 1
        result.errors.push({ row: physicalRow, templeName: rawRow.templeName, reason: parsed.errors.join('; ') })
        continue
      }

      const duplicateKey = getRowKeys(parsed.row.payload).find((key) => seenCsvKeys.has(key))
      if (duplicateKey) {
        result.duplicateRows += 1
        result.skippedDuplicate += mode === 'execute' ? 1 : 0
        result.wouldSkip += mode === 'dry-run' ? 1 : 0
        const duplicateOf = seenCsvKeys.get(duplicateKey)
        result.duplicateReport.push({
          row: physicalRow,
          templeName: parsed.row.payload.title,
          duplicateOf,
          reason: `Duplicate row inside CSV by ${duplicateKey.split(':')[0]}`,
        })
        continue
      }
      for (const key of getRowKeys(parsed.row.payload)) seenCsvKeys.set(key, physicalRow)

      result.validRows += 1
      chunk.push(parsed.row)
      if (chunk.length >= chunkSize) {
        await processChunk(chunk, mode, result, usedNewSlugs)
        chunk = []
      }
    }

    if (!headers) throw new Error('CSV file is empty')
    if (chunk.length > 0) await processChunk(chunk, mode, result, usedNewSlugs)

    const finalStatus = mode === 'dry-run'
      ? 'dry-run'
      : (result.failedRows > 0 || result.invalidRows > 0 ? 'completed-with-errors' : 'completed')
    await TempleImportSession.updateOne(
      { _id: session._id },
      {
        $set: {
          totalRows: result.totalRows,
          validRows: result.validRows,
          invalidRows: result.invalidRows,
          duplicateRows: result.duplicateRows,
          created: result.created,
          updated: result.updatedMissingFields + result.mergedCategories,
          skipped: result.skippedExisting + result.skippedDuplicate + result.wouldSkip,
          failed: result.failedRows + result.invalidRows,
          status: finalStatus,
          completedAt: new Date(),
          dryRunReport: buildSessionSnapshot(result),
          errorRows: result.errors.slice(0, 100),
          warningRows: result.warnings.slice(0, 100),
        },
      }
    )

    if (mode === 'execute') {
      try {
        await ActivityLog.create({
          action: 'large-temple-import',
          entity: 'temple',
          adminId: admin.id,
          adminName: admin.name || admin.email,
          details: JSON.stringify(buildSessionSnapshot(result)),
        })
      } catch {
        // Activity logging must not block the import result.
      }
    }

    return result
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Temple import failed'
    result.ok = false
    result.errors.push({ row: 0, reason })
    await TempleImportSession.updateOne(
      { _id: session._id },
      {
        $set: {
          totalRows: result.totalRows,
          validRows: result.validRows,
          invalidRows: result.invalidRows,
          duplicateRows: result.duplicateRows,
          failed: result.failedRows + result.invalidRows + 1,
          status: 'failed',
          completedAt: new Date(),
          dryRunReport: buildSessionSnapshot(result),
          errorRows: result.errors.slice(0, 100),
          warningRows: result.warnings.slice(0, 100),
        },
      }
    )
    return result
  }
}
