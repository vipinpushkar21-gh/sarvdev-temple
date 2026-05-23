export type DeityIdentityLike = {
  _id?: unknown
  name?: string
  nameHi?: string
  slug?: string
  staticSlug?: string
  slugAliases?: string[]
  category?: string
  categoryId?: string
  source?: string
  isCustomized?: boolean
  image?: string
  imageCard?: string
  imageHero?: string
  updatedAt?: string | Date
}

const HONORIFIC_WORDS = new Set([
  'bhagwan',
  'bhagavan',
  'lord',
  'god',
  'goddess',
  'mata',
  'maa',
  'ma',
  'ji',
  'devi',
  'dev',
  'shri',
  'sri',
  'sree',
  'maharaj',
])

export function normalizeDeityIdentity(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[-_/()]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !HONORIFIC_WORDS.has(part))
    .join(' ')
}

function slugKey(value: unknown) {
  const slug = String(value || '').trim().toLowerCase()
  return slug ? `slug:${slug}` : ''
}

function coreKey(value: unknown) {
  const core = normalizeDeityIdentity(value)
  return core ? `core:${core}` : ''
}

export function getDeityIdentityKeys(deity: DeityIdentityLike) {
  const keys = new Set<string>()
  const add = (key: string) => {
    if (key) keys.add(key)
  }

  add(slugKey(deity.slug))
  add(slugKey(deity.staticSlug))
  ;(deity.slugAliases || []).forEach((alias) => add(slugKey(alias)))
  add(coreKey(deity.name))
  add(coreKey(deity.slug))
  add(coreKey(deity.staticSlug))

  return keys
}

function hasMedia(deity: DeityIdentityLike) {
  return Boolean(deity.imageCard || deity.imageHero || deity.image)
}

export function scoreDeityMatch(staticDeity: DeityIdentityLike, dbDeity: DeityIdentityLike) {
  const staticSlug = String(staticDeity.slug || '').toLowerCase()
  const dbSlug = String(dbDeity.slug || '').toLowerCase()
  const dbStaticSlug = String(dbDeity.staticSlug || '').toLowerCase()
  const aliases = (dbDeity.slugAliases || []).map((alias) => alias.toLowerCase())
  const staticCore = normalizeDeityIdentity(staticDeity.name || staticDeity.slug)
  const dbNameCore = normalizeDeityIdentity(dbDeity.name)
  const dbSlugCore = normalizeDeityIdentity(dbDeity.slug)

  let score = 0
  if (staticSlug && dbStaticSlug === staticSlug) score += 600
  if (staticSlug && aliases.includes(staticSlug)) score += 550
  if (staticSlug && dbSlug === staticSlug) score += 500
  if (staticCore && (dbNameCore === staticCore || dbSlugCore === staticCore)) score += 260
  if (
    staticCore.length >= 4 &&
    (dbNameCore.includes(staticCore) || staticCore.includes(dbNameCore) || dbSlugCore.includes(staticCore))
  ) {
    score += 120
  }

  if (dbDeity.isCustomized) score += 60
  if (dbDeity.source === 'manual') score += 30
  if (hasMedia(dbDeity)) score += 35
  if (dbDeity.imageCard) score += 15
  if (dbDeity.imageHero) score += 15

  return score
}

export function findBestDeityMatch(
  staticDeity: DeityIdentityLike,
  dbDeities: DeityIdentityLike[],
  usedDbIds: Set<string> = new Set()
) {
  let best: { deity: DeityIdentityLike; score: number } | null = null

  for (const dbDeity of dbDeities) {
    const id = String(dbDeity._id || '')
    if (id && usedDbIds.has(id)) continue
    const score = scoreDeityMatch(staticDeity, dbDeity)
    if (score >= 180 && (!best || score > best.score)) {
      best = { deity: dbDeity, score }
    }
  }

  return best
}

export function mergeStaticDeityWithDb(staticDeity: DeityIdentityLike, dbDeity: DeityIdentityLike, category?: { title?: string; id?: string }) {
  return {
    ...staticDeity,
    ...dbDeity,
    slug: staticDeity.slug || dbDeity.staticSlug || dbDeity.slug,
    dbSlug: dbDeity.slug,
    staticSlug: dbDeity.staticSlug || staticDeity.slug,
    slugAliases: Array.from(new Set([...(dbDeity.slugAliases || []), dbDeity.slug].filter(Boolean) as string[])),
    category: category?.title || dbDeity.category || staticDeity.category,
    categoryId: category?.id || staticDeity.categoryId || dbDeity.categoryId,
    source: dbDeity.source || 'legacy-db',
    isStaticFallback: false,
  }
}
