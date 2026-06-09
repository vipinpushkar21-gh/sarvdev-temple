/**
 * GET /api/search/suggest?q=<query>
 *
 * Lightweight autocomplete — returns max 10 suggestions fast.
 * Prioritises: deities > temples > devotionals > categories
 * Uses text index with regex fallback. Projections only.
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Deity from '@/models/Deity'
import { SACRED_CATEGORIES } from '@/lib/sacred-categories'
import { buildRegex, type Suggestion } from '@/lib/search'
import { expandQuery, buildExpandedRegex } from '@/lib/transliteration'
import { applyRateLimit } from '@/lib/rate-limit'

const MAX_SUGGESTIONS = 10
const PER_TYPE = 4  // fetch a few extra per type so ranking can re-sort

// ── Suggestion ranking ────────────────────────────────────────────────────────
// Lower score = shown first.
// 0 exact | 1 startsWith | 2 contains | 3 alias/transliteration | 4 default

function scoreSuggestion(
  title: string,
  q: string,
  isExpandedMatch: boolean
): number {
  const tl = title.toLowerCase().trim()
  const ql = q.toLowerCase().trim()
  if (tl === ql)          return 0
  if (tl.startsWith(ql)) return 1
  if (tl.includes(ql))   return 2
  if (isExpandedMatch)   return 3
  return 4
}

type RawSuggestion = Suggestion & { _score?: number }

async function quickFind(
  model: any,
  q: string,
  expandedTerms: string[],
  filter: Record<string, any>,
  searchFields: string[],
  returnFields: string[]
): Promise<any[]> {
  const projection = Object.fromEntries(returnFields.map((f) => [f, 1]))
  const regex = expandedTerms.length > 1 ? buildExpandedRegex(expandedTerms) : buildRegex(q)
  const textSearch = expandedTerms.join(' ')
  try {
    const docs = await model
      .find({ $text: { $search: textSearch }, ...filter }, { ...projection, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(PER_TYPE)
      .lean()
    if ((docs as any[]).length > 0) return docs as any[]
    throw new Error('empty')
  } catch {
    const orQuery = searchFields.map((f) => ({ [f]: regex }))
    return model.find({ $or: orQuery, ...filter }, projection).limit(PER_TYPE).lean()
  }
}

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const limited = applyRateLimit(req, 'suggest')
  if (limited) return limited

  try {
    await connectDB()

    const expandedTerms = expandQuery(q)

    const [rawDeities, rawTemples, rawDevotionals] = await Promise.all([
      quickFind(Deity, q, expandedTerms,
        { status: { $ne: 'rejected' } },
        ['name', 'nameHi', 'description', 'categoryName'],
        ['name', 'nameHi', 'slug', 'imageCard', 'image', 'categoryName']),
      quickFind(Temple, q, expandedTerms,
        { status: { $ne: 'rejected' } },
        ['title', 'titleHi', 'deity', 'city', 'state'],
        ['title', 'titleHi', 'slug', 'imageCard', 'image', 'city', 'state', 'deity']),
      quickFind(Devotional, q, expandedTerms,
        {},
        ['title', 'titleHi', 'deity', 'category'],
        ['title', 'titleHi', 'slug', 'imageCard', 'image', 'category', 'deity']),
    ])

    const ql = q.toLowerCase()
    const allTermsLower = expandedTerms.map((t) => t.toLowerCase())
    const catMatches = SACRED_CATEGORIES
      .filter((c) =>
        c.isActive &&
        (allTermsLower.some((t) => c.name.toLowerCase().includes(t) || c.nameHi.includes(t) || c.slug.includes(t.replace(/\s+/g, '-'))) ||
         c.name.toLowerCase().includes(ql))
      )
      .slice(0, PER_TYPE)

    const isExpanded = expandedTerms.length > 1

    const rawSuggestions: RawSuggestion[] = [
      ...rawDeities.map((d: any): RawSuggestion => {
        const title = String(d.name || '')
        return {
          type: 'deity',
          title,
          titleHi: d.nameHi || undefined,
          url: `/deities/${d.slug || d._id}`,
          image: d.imageCard || d.image || undefined,
          category: d.categoryName || d.category || undefined,
          _score: scoreSuggestion(title, q, isExpanded),
        }
      }),
      ...rawTemples.map((t: any): RawSuggestion => {
        const title = String(t.title || '')
        return {
          type: 'temple',
          title,
          titleHi: t.titleHi || undefined,
          url: `/temples/${t.slug || t._id}`,
          image: t.imageCard || t.image || undefined,
          category: [t.city, t.state].filter(Boolean).join(', ') || undefined,
          _score: scoreSuggestion(title, q, isExpanded),
        }
      }),
      ...rawDevotionals.map((d: any): RawSuggestion => {
        const title = String(d.title || '')
        return {
          type: 'devotional',
          title,
          titleHi: d.titleHi || undefined,
          url: `/devotionals/${d.slug || d._id}`,
          image: d.imageCard || d.image || undefined,
          category: d.category || d.deity || undefined,
          _score: scoreSuggestion(title, q, isExpanded),
        }
      }),
      ...catMatches.map((c): RawSuggestion => ({
        type: 'sacredCategory',
        title: c.name,
        titleHi: c.nameHi,
        url: `/temples/pilgrimage/${c.slug}`,
        _score: scoreSuggestion(c.name, q, isExpanded),
      })),
    ]

    // Sort by priority score (exact > startsWith > contains > alias)
    rawSuggestions.sort((a, b) => (a._score ?? 4) - (b._score ?? 4))

    // Strip internal _score before sending
    const suggestions: Suggestion[] = rawSuggestions.map(({ _score: _s, ...s }) => s)

    return NextResponse.json(suggestions.slice(0, MAX_SUGGESTIONS), { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } })
  } catch (err: any) {
    console.error('[search/suggest] error:', err?.message)
    return NextResponse.json([])
  }
}
