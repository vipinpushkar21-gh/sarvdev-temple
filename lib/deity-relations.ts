import { connectDB } from './db'
import Devotional from '@/models/Devotional'

/**
 * Devotional records store the deity as free text plus a derived `deitySlug`,
 * so deity pages are matched through this alias table rather than a hard relation.
 */
export const DEITY_NAME_ALIASES: Record<string, string[]> = {
  shiva: ['shiva', 'shiv', 'mahadev', 'bholenath', 'shankar'],
  vishnu: ['vishnu', 'narayan', 'hari'],
  krishna: ['krishna', 'kanha', 'gopal', 'govind', 'banke bihari', 'dwarkadhish'],
  rama: ['rama', 'ram', 'shri ram', 'sita ram'],
  hanuman: ['hanuman', 'bajrangbali', 'maruti', 'anjaneya'],
  ganesha: ['ganesha', 'ganesh', 'ganpati', 'vinayak'],
  durga: ['durga', 'ambe', 'jagdamba'],
  lakshmi: ['lakshmi', 'laxmi', 'mahalakshmi', 'mahalaxmi'],
  saraswati: ['saraswati', 'sharada'],
  kali: ['kali', 'mahakali'],
  parvati: ['parvati', 'gauri', 'uma'],
  'sai-baba': ['sai baba', 'shirdi sai', 'sai'],
  surya: ['surya'],
  shani: ['shani'],
  radha: ['radha', 'radha rani'],
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function slugifyDeityValue(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function titleFromSlug(slug: string) {
  return slug.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

export function devotionalBelongsToSlug(devotional: { deity?: string }, slug: string) {
  const deity = String(devotional.deity || '').trim()
  if (!deity) return false
  const deitySlug = slugifyDeityValue(deity)
  if (deitySlug === slug) return true
  const aliases = DEITY_NAME_ALIASES[slug] || []
  return aliases.some((alias) => slugifyDeityValue(alias) === deitySlug || deity.toLowerCase() === alias)
}

/** Every spelling a deity is known by, used for alias-aware content lookups. */
export function buildDeityAliases(deity: {
  slug?: string
  name?: string
  nameHi?: string
  aliases?: string[]
  slugAliases?: string[]
}) {
  const seeds = [
    deity.slug,
    deity.name,
    ...(deity.aliases || []),
    ...(deity.slugAliases || []),
  ].filter(Boolean) as string[]

  const expanded = seeds.flatMap((seed) => {
    const key = slugifyDeityValue(seed)
    const base = [seed, key.replace(/-/g, ' ')]
    const withoutHonorific = key.replace(/-(ji|dev|devi|maa|mata|bhagwan|lord|shri|sri)$/g, '')
    if (withoutHonorific && withoutHonorific !== key) base.push(withoutHonorific.replace(/-/g, ' '))
    return [...base, ...(DEITY_NAME_ALIASES[key] || []), ...(DEITY_NAME_ALIASES[withoutHonorific] || [])]
  })

  return Array.from(new Set(expanded.map((value) => value.trim()).filter((value) => value.length > 2)))
}

export type RelatedDevotional = {
  _id: string
  slug?: string
  title: string
  titleHi?: string
  category?: string
  deity?: string
  language?: string
}

/**
 * Devotionals linked to a deity through its real names and aliases.
 * Returns only what actually matches — never a padded list.
 */
export async function findDevotionalsForDeity(
  deity: { slug?: string; name?: string; nameHi?: string; aliases?: string[]; slugAliases?: string[] },
  limit = 8,
): Promise<RelatedDevotional[]> {
  const aliases = buildDeityAliases(deity)
  if (aliases.length === 0) return []

  const aliasSlugs = Array.from(new Set(aliases.map(slugifyDeityValue).filter(Boolean)))
  const exactDeityRegexes = aliases.map((alias) => new RegExp(`^${escapeRegex(alias).replace(/[-\s]/g, '[-\\s]')}$`, 'i'))

  await connectDB()
  const rows = await Devotional.find(
    {
      status: { $ne: 'rejected' },
      $or: [
        { deitySlug: { $in: aliasSlugs } },
        { deity: { $in: exactDeityRegexes } },
      ],
    },
    'slug title titleHi category deity language',
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  return (rows as Record<string, unknown>[]).map((row) => ({
    ...row,
    _id: String(row._id),
  })) as RelatedDevotional[]
}
