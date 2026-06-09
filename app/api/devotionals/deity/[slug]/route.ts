import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'

const _cache = new Map<string, { data: any; ts: number }>()
const TTL = 5 * 60_000

const OMIT: Record<string, 0> = {
  lyrics: 0,
  __v: 0,
  descriptionHi: 0,
  updatedAt: 0,
  image: 0,
  imageCard: 0,
  imageHero: 0,
  ogImage: 0,
  thumbnail: 0,
  coverImage: 0,
}

const ALIASES: Record<string, string[]> = {
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function titleFromSlug(slug: string) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function devotionalBelongsToSlug(devotional: any, slug: string) {
  const deity = String(devotional.deity || '').trim()
  if (!deity) return false
  const deitySlug = slugify(deity)
  if (deitySlug === slug) return true
  const aliases = ALIASES[slug] || []
  return aliases.some((alias) => slugify(alias) === deitySlug || deity.toLowerCase() === alias)
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '60', 10) || 60))
  const key = slug.toLowerCase().trim()
  const isOther = key === 'other'

  const hit = _cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) {
    return NextResponse.json(hit.data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  }

  await connectDB()
  const aliases = Array.from(new Set([key, titleFromSlug(key), ...(ALIASES[key] || [])].filter(Boolean)))
  const exactAliasRegexes = aliases.map((alias) => new RegExp(`^${escapeRegex(alias).replace(/-/g, '[-\\s]')}$`, 'i'))
  const keywordRegex = new RegExp(aliases.map((alias) => escapeRegex(alias).replace(/-/g, '[-\\s]')).join('|'), 'i')
  const matchFilter = isOther
    ? {
        status: { $ne: 'rejected' },
        $or: [{ deity: { $exists: false } }, { deity: null }, { deity: '' }],
      }
    : {
        status: { $ne: 'rejected' },
        $or: [
          { deity: { $in: exactAliasRegexes } },
          { title: keywordRegex },
          { titleHi: keywordRegex },
          { description: keywordRegex },
        ],
      }
  const rawDocs = await Devotional.find(matchFilter, OMIT)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as any[]
  const matched = rawDocs
    .filter((doc) => isOther ? !doc.deity : devotionalBelongsToSlug(doc, key))
    .map((doc) => ({
      ...doc,
      _id: typeof doc._id?.toString === 'function' ? doc._id.toString() : String(doc._id),
    }))

  const categoryBreakdown: Record<string, number> = {}
  for (const doc of matched) {
    if (doc.category) categoryBreakdown[doc.category] = (categoryBreakdown[doc.category] || 0) + 1
  }

  const result = {
    deity: isOther ? null : { name: titleFromSlug(key), slug: key, image: null, imageCard: null, imageHero: null },
    devotionals: matched,
    stats: { total: matched.length, categoryBreakdown },
  }

  _cache.set(key, { data: result, ts: Date.now() })

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
  })
}
