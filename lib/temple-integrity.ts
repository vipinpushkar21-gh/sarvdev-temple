import Temple from '../models/Temple'
import Deity from '../models/Deity'
import { getAllCategoryNames, getCategoryByName, getCategoryBySlug } from './sacred-categories'
import {
  buildTempleUniqueKey,
  getSacredCategorySlugs,
  normalizeTempleDataQuality,
  normalizeTempleText,
  normalizeTempleUniqueKey,
  normalizeTempleUniqueKeyForCompare,
  slugifyTemple,
  uniqueStrings,
} from './temple-normalization'

const SAMPLE_LIMIT = 25

const EXPECTED_INDEXES = [
  { name: 'slug_lookup', keys: ['slug'] },
  { name: 'status_created', keys: ['status', 'createdAt'] },
  { name: 'status_state_city_normalized', keys: ['status', 'stateNormalized', 'cityNormalized'] },
  { name: 'status_deity_slug', keys: ['status', 'deitySlug'] },
  { name: 'status_sacred_category_slugs', keys: ['status', 'sacredCategorySlugs'] },
  { name: 'temple_normalized_identity', keys: ['titleNormalized', 'cityNormalized', 'stateNormalized'] },
  { name: 'temple_unique_key_lookup', keys: ['uniqueKeyNormalized'] },
  { name: 'categories', keys: ['categories'] },
  { name: 'sacred_categories', keys: ['sacredCategories'] },
]

const STATE_ALIASES: Record<string, string> = {
  up: 'Uttar Pradesh',
  'u p': 'Uttar Pradesh',
  'u.p': 'Uttar Pradesh',
  'u.p.': 'Uttar Pradesh',
  uk: 'Uttarakhand',
  'u k': 'Uttarakhand',
  tn: 'Tamil Nadu',
  't n': 'Tamil Nadu',
  mp: 'Madhya Pradesh',
  'm p': 'Madhya Pradesh',
  mh: 'Maharashtra',
  wb: 'West Bengal',
  'w b': 'West Bengal',
  jk: 'Jammu and Kashmir',
  'j&k': 'Jammu and Kashmir',
  'j k': 'Jammu and Kashmir',
}

const VALID_COUNTRIES = new Set([
  'india',
  'nepal',
  'bangladesh',
  'pakistan',
  'sri lanka',
  'tibet',
  'china',
  'indonesia',
  'cambodia',
  'thailand',
  'myanmar',
  'malaysia',
  'singapore',
  'mauritius',
  'united states',
  'usa',
  'united kingdom',
  'uk',
])

type TempleDoc = Record<string, any>

type IssueSample = {
  id?: string
  title?: string
  slug?: string
  field?: string
  value?: unknown
  expected?: unknown
  reason?: string
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null
}

function pushSample(samples: IssueSample[], sample: IssueSample) {
  if (samples.length < SAMPLE_LIMIT) samples.push(sample)
}

function normalizeCategoryValues(temple: TempleDoc) {
  return uniqueStrings([
    ...(Array.isArray(temple.categories) ? temple.categories : []),
    ...(Array.isArray(temple.sacredCategories) ? temple.sacredCategories : []),
  ])
}

function rawCategoryValues(temple: TempleDoc) {
  return [
    ...(Array.isArray(temple.categories) ? temple.categories : []),
    ...(Array.isArray(temple.sacredCategories) ? temple.sacredCategories : []),
  ].map((value) => String(value || '').trim()).filter(Boolean)
}

function validSlug(value: unknown) {
  const slug = String(value || '').trim()
  return Boolean(slug) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function invalidImageUrl(value: unknown) {
  const url = String(value || '').trim()
  if (!url) return false
  if (url.startsWith('/')) return false
  if (url.startsWith('data:image/')) return false
  try {
    const parsed = new URL(url)
    return !['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return true
  }
}

function countMapIncrement(map: Record<string, number>, key: string) {
  if (!key) return
  map[key] = (map[key] || 0) + 1
}

async function getKnownDeitySlugs() {
  try {
    const rows = await Deity.find({}, 'name nameHi slug aliases').lean() as any[]
    const values: string[] = []
    for (const deity of rows) {
      values.push(deity.slug, deity.name, deity.nameHi)
      if (Array.isArray(deity.aliases)) values.push(...deity.aliases)
    }
    return new Set(values.map(slugifyTemple).filter(Boolean))
  } catch {
    return new Set<string>()
  }
}

async function getDuplicateSlugReport() {
  const rows = await Temple.aggregate([
    { $match: { slug: { $exists: true, $nin: ['', null] } } },
    { $group: { _id: '$slug', count: { $sum: 1 }, temples: { $push: { id: '$_id', title: '$title' } } } },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 50 },
  ])

  const duplicateRecords = rows.reduce((sum, item) => sum + item.count, 0)
  return {
    groups: rows.length,
    records: duplicateRecords,
    samples: rows.slice(0, SAMPLE_LIMIT).map((item) => ({
      slug: item._id,
      count: item.count,
      temples: (item.temples || []).slice(0, 5).map((temple: any) => ({
        id: String(temple.id),
        title: temple.title,
      })),
    })),
  }
}

async function validateTempleIndexes() {
  const indexes = await Temple.collection.indexes()
  const available = indexes.map((index) => ({
    name: index.name,
    keys: Object.keys(index.key || {}),
    unique: Boolean(index.unique),
  }))

  const missing = EXPECTED_INDEXES.filter((expected) => {
    return !available.some((index) => {
      if (index.name === expected.name) return true
      return expected.keys.every((key, position) => index.keys[position] === key)
    })
  })

  return { available, missing }
}

export async function runTempleIntegrity(options: { apply?: boolean; batchSize?: number } = {}) {
  const apply = Boolean(options.apply)
  const batchSize = Math.max(50, Math.min(options.batchSize || 500, 2000))
  const knownCategoryNames = new Set(getAllCategoryNames().map((name) => name.toLowerCase()))
  const knownDeitySlugs = await getKnownDeitySlugs()
  const duplicateSlugs = await getDuplicateSlugReport()
  const indexes = await validateTempleIndexes()

  const report = {
    ok: true,
    mode: apply ? 'execute' : 'dry-run',
    scanned: 0,
    recordsNeedingUpdates: 0,
    updated: 0,
    skipped: 0,
    errors: [] as { id?: string; title?: string; reason: string }[],
    migration: {
      fields: {
        titleNormalized: 0,
        cityNormalized: 0,
        stateNormalized: 0,
        deitySlug: 0,
        sacredCategorySlugs: 0,
        uniqueKey: 0,
        uniqueKeyNormalized: 0,
        dataQuality: 0,
      },
      samples: [] as IssueSample[],
    },
    slugs: {
      duplicateCount: duplicateSlugs.groups,
      duplicateRecordCount: duplicateSlugs.records,
      emptyCount: 0,
      invalidCount: 0,
      malformedCount: 0,
      duplicateSamples: duplicateSlugs.samples,
      samples: [] as IssueSample[],
    },
    categories: {
      orphanCount: 0,
      duplicateCategoryRecords: 0,
      missingSacredCategorySlugs: 0,
      slugMismatchCount: 0,
      orphanValues: {} as Record<string, number>,
      samples: [] as IssueSample[],
    },
    images: {
      missingImageCount: 0,
      invalidUrlCount: 0,
      emptyGalleryArrays: 0,
      duplicateImageFieldCount: 0,
      samples: [] as IssueSample[],
    },
    locations: {
      missingStateCount: 0,
      missingCityCount: 0,
      invalidCountryCount: 0,
      stateAliasCount: 0,
      stateAliasValues: {} as Record<string, number>,
      countryValues: {} as Record<string, number>,
      samples: [] as IssueSample[],
    },
    deities: {
      missingDeitySlugCount: 0,
      deitySlugMismatchCount: 0,
      unknownDeityCount: 0,
      unknownValues: {} as Record<string, number>,
      samples: [] as IssueSample[],
    },
    indexes,
  }

  const projection = [
    'title',
    'slug',
    'uniqueKey',
    'uniqueKeyNormalized',
    'dataQuality',
    'titleNormalized',
    'city',
    'cityNormalized',
    'state',
    'stateNormalized',
    'district',
    'country',
    'deity',
    'deitySlug',
    'categories',
    'sacredCategories',
    'sacredCategorySlugs',
    'image',
    'imageCard',
    'imageHero',
    'galleryImages',
  ].join(' ')

  const bulkOps: any[] = []
  const flush = async () => {
    if (!apply || bulkOps.length === 0) return
    try {
      const count = bulkOps.length
      await Temple.bulkWrite(bulkOps.splice(0, bulkOps.length), { ordered: false })
      report.updated += count
    } catch (error: any) {
      const failedWrites = Array.isArray(error?.writeErrors) ? error.writeErrors.length : 1
      report.errors.push({ reason: error?.message || 'Bulk write failed' })
      report.updated += Math.max(0, bulkOps.length - failedWrites)
      bulkOps.splice(0, bulkOps.length)
    }
  }

  const cursor = Temple.find({}, projection).lean().cursor()
  for await (const temple of cursor as AsyncIterable<TempleDoc>) {
    report.scanned += 1
    const id = String(temple._id || '')
    const title = String(temple.title || '')
    const update: Record<string, any> = {}

    if (!hasValue(temple.titleNormalized) && hasValue(title)) {
      update.titleNormalized = normalizeTempleText(title)
      report.migration.fields.titleNormalized += 1
    }
    if (!hasValue(temple.cityNormalized) && hasValue(temple.city)) {
      update.cityNormalized = normalizeTempleText(temple.city)
      report.migration.fields.cityNormalized += 1
    }
    if (!hasValue(temple.stateNormalized) && hasValue(temple.state)) {
      update.stateNormalized = normalizeTempleText(temple.state)
      report.migration.fields.stateNormalized += 1
    }
    if (!hasValue(temple.deitySlug) && hasValue(temple.deity)) {
      update.deitySlug = slugifyTemple(temple.deity)
      report.migration.fields.deitySlug += 1
    }
    const expectedUniqueKey = normalizeTempleUniqueKey(temple.uniqueKey || buildTempleUniqueKey(title, temple.district, temple.state))
    if (!hasValue(temple.uniqueKey) && hasValue(expectedUniqueKey)) {
      update.uniqueKey = expectedUniqueKey
      report.migration.fields.uniqueKey += 1
    }
    if (!hasValue(temple.uniqueKeyNormalized) && hasValue(expectedUniqueKey)) {
      update.uniqueKeyNormalized = normalizeTempleUniqueKeyForCompare(expectedUniqueKey)
      report.migration.fields.uniqueKeyNormalized += 1
    }
    if (!hasValue(temple.dataQuality)) {
      update.dataQuality = normalizeTempleDataQuality(temple.dataQuality, 'B')
      report.migration.fields.dataQuality += 1
    }

    const categoryValuesRaw = rawCategoryValues(temple)
    const categoryValues = uniqueStrings(categoryValuesRaw)
    const expectedCategorySlugs = getSacredCategorySlugs(categoryValues)
    if (!hasValue(temple.sacredCategorySlugs) && expectedCategorySlugs.length > 0) {
      update.sacredCategorySlugs = expectedCategorySlugs
      report.migration.fields.sacredCategorySlugs += 1
    }

    if (Object.keys(update).length > 0) {
      report.recordsNeedingUpdates += 1
      pushSample(report.migration.samples, { id, title, slug: temple.slug, field: Object.keys(update).join(', ') })
      if (apply) {
        bulkOps.push({ updateOne: { filter: { _id: temple._id }, update: { $set: update } } })
        if (bulkOps.length >= batchSize) await flush()
      }
    } else {
      report.skipped += 1
    }

    if (!hasValue(temple.slug)) {
      report.slugs.emptyCount += 1
      pushSample(report.slugs.samples, { id, title, reason: 'empty slug' })
    } else {
      const actualSlug = String(temple.slug)
      const normalizedSlug = slugifyTemple(actualSlug)
      if (!validSlug(actualSlug)) {
        report.slugs.invalidCount += 1
        pushSample(report.slugs.samples, { id, title, slug: actualSlug, reason: 'invalid slug characters' })
      }
      if (normalizedSlug && normalizedSlug !== actualSlug) {
        report.slugs.malformedCount += 1
        pushSample(report.slugs.samples, { id, title, slug: actualSlug, expected: normalizedSlug, reason: 'slug normalization mismatch' })
      }
    }

    const seenCategories = new Set<string>()
    for (const category of categoryValuesRaw) {
      const categoryKey = category.toLowerCase()
      if (seenCategories.has(categoryKey)) {
        report.categories.duplicateCategoryRecords += 1
        pushSample(report.categories.samples, { id, title, field: 'categories', value: category, reason: 'duplicate category on record' })
        continue
      }
      seenCategories.add(categoryKey)

      const byName = getCategoryByName(category)
      const bySlug = getCategoryBySlug(slugifyTemple(category))
      if (!byName && !bySlug && !knownCategoryNames.has(categoryKey)) {
        report.categories.orphanCount += 1
        countMapIncrement(report.categories.orphanValues, category)
        pushSample(report.categories.samples, { id, title, field: 'categories', value: category, reason: 'category not in source of truth' })
      }
    }

    if (expectedCategorySlugs.length > 0 && !hasValue(temple.sacredCategorySlugs)) {
      report.categories.missingSacredCategorySlugs += 1
    } else if (expectedCategorySlugs.length > 0 && Array.isArray(temple.sacredCategorySlugs)) {
      const currentSlugs = uniqueStrings(temple.sacredCategorySlugs.map(slugifyTemple))
      const missing = expectedCategorySlugs.filter((slug) => !currentSlugs.includes(slug))
      if (missing.length > 0) {
        report.categories.slugMismatchCount += 1
        pushSample(report.categories.samples, { id, title, field: 'sacredCategorySlugs', value: currentSlugs, expected: expectedCategorySlugs, reason: 'category slug mismatch' })
      }
    }

    const imageValues = [temple.image, temple.imageCard, temple.imageHero].map((value) => String(value || '').trim()).filter(Boolean)
    const galleryImages = Array.isArray(temple.galleryImages) ? temple.galleryImages.map((value: unknown) => String(value || '').trim()).filter(Boolean) : []
    if (imageValues.length === 0 && galleryImages.length === 0) {
      report.images.missingImageCount += 1
      pushSample(report.images.samples, { id, title, reason: 'no image fields populated' })
    }
    if (Array.isArray(temple.galleryImages) && temple.galleryImages.length === 0) {
      report.images.emptyGalleryArrays += 1
    }
    const duplicateImages = imageValues.filter((value, index) => imageValues.indexOf(value) !== index)
    if (duplicateImages.length > 0) {
      report.images.duplicateImageFieldCount += 1
      pushSample(report.images.samples, { id, title, value: duplicateImages[0], reason: 'duplicate image value across fields' })
    }
    for (const url of [...imageValues, ...galleryImages]) {
      if (invalidImageUrl(url)) {
        report.images.invalidUrlCount += 1
        pushSample(report.images.samples, { id, title, value: url, reason: 'invalid image URL format' })
      }
    }

    if (!hasValue(temple.state)) {
      report.locations.missingStateCount += 1
      pushSample(report.locations.samples, { id, title, field: 'state', reason: 'missing state' })
    } else {
      const stateKey = normalizeTempleText(temple.state).replace(/\./g, '')
      const aliasTarget = STATE_ALIASES[stateKey] || STATE_ALIASES[String(temple.state).trim().toLowerCase()]
      if (aliasTarget && aliasTarget.toLowerCase() !== String(temple.state).trim().toLowerCase()) {
        report.locations.stateAliasCount += 1
        countMapIncrement(report.locations.stateAliasValues, `${temple.state} -> ${aliasTarget}`)
        pushSample(report.locations.samples, { id, title, field: 'state', value: temple.state, expected: aliasTarget, reason: 'state alias/spelling variation' })
      }
    }
    if (!hasValue(temple.city)) {
      report.locations.missingCityCount += 1
      pushSample(report.locations.samples, { id, title, field: 'city', reason: 'missing city' })
    }
    const country = String(temple.country || '').trim()
    if (country) {
      countMapIncrement(report.locations.countryValues, country)
      if (!VALID_COUNTRIES.has(country.toLowerCase())) {
        report.locations.invalidCountryCount += 1
        pushSample(report.locations.samples, { id, title, field: 'country', value: country, reason: 'country outside known allow-list' })
      }
    }

    if (hasValue(temple.deity) && !hasValue(temple.deitySlug)) {
      report.deities.missingDeitySlugCount += 1
      pushSample(report.deities.samples, { id, title, field: 'deitySlug', value: temple.deity, reason: 'missing deitySlug' })
    }
    if (hasValue(temple.deity) && hasValue(temple.deitySlug)) {
      const expected = slugifyTemple(temple.deity)
      if (expected && temple.deitySlug !== expected) {
        report.deities.deitySlugMismatchCount += 1
        pushSample(report.deities.samples, { id, title, field: 'deitySlug', value: temple.deitySlug, expected, reason: 'deitySlug mismatch' })
      }
    }
    if (hasValue(temple.deity) && knownDeitySlugs.size > 0) {
      const deitySlug = slugifyTemple(temple.deity)
      if (deitySlug && !knownDeitySlugs.has(deitySlug)) {
        report.deities.unknownDeityCount += 1
        countMapIncrement(report.deities.unknownValues, String(temple.deity))
        pushSample(report.deities.samples, { id, title, field: 'deity', value: temple.deity, reason: 'deity not found in deity collection' })
      }
    }
  }

  await flush()
  return report
}
