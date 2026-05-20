import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import ActivityLog from '@/models/ActivityLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import {
  getMappedShaktiPeethEntry,
  getShaktiPeethMatch,
  hasShaktiPeethCategoryTag,
  isCanonicalShaktiPeethTemple,
  normalizeTempleName,
  SHAKTI_PEETH_51,
  ShaktiPeethReference,
} from '@/data/shakti-peethas'

type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

type TempleRecord = {
  _id: unknown
  title?: unknown
  slug?: unknown
  deity?: unknown
  city?: unknown
  state?: unknown
  country?: unknown
  status?: unknown
  categories?: unknown
  sacredCategories?: unknown
  templeType?: unknown
  templeTypes?: unknown
  canonicalShaktiPeeth?: unknown
  canonicalShaktiPeethKey?: unknown
  canonicalShaktiPeethName?: unknown
  shaktiPeethMeta?: unknown
}

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => stringValue(item)).filter(Boolean)
}

function templeId(temple: TempleRecord): string {
  return String(temple._id || '')
}

function templeSummary(temple: TempleRecord) {
  const fuzzyMatch = getShaktiPeethMatch(temple)
  const mappedMatch = getMappedShaktiPeethEntry(temple)

  return {
    id: templeId(temple),
    title: stringValue(temple.title) || 'Untitled temple',
    slug: stringValue(temple.slug),
    deity: stringValue(temple.deity),
    city: stringValue(temple.city),
    state: stringValue(temple.state),
    country: stringValue(temple.country),
    status: stringValue(temple.status) || 'approved',
    categories: stringList(temple.categories),
    sacredCategories: stringList(temple.sacredCategories),
    canonicalShaktiPeeth: temple.canonicalShaktiPeeth === true,
    canonicalShaktiPeethKey: stringValue(temple.canonicalShaktiPeethKey),
    canonicalShaktiPeethName: stringValue(temple.canonicalShaktiPeethName),
    canonicalMatch: fuzzyMatch ? {
      key: fuzzyMatch.key,
      name: fuzzyMatch.name,
    } : null,
    mappedMatch: mappedMatch ? {
      key: mappedMatch.key,
      name: mappedMatch.name,
    } : null,
  }
}

function tokens(value: string): string[] {
  return normalizeTempleName(value).split(' ').filter(token => token.length >= 3)
}

function tokenSimilarity(a: string, b: string): number {
  const left = new Set(tokens(a))
  const right = new Set(tokens(b))
  if (left.size === 0 || right.size === 0) return 0

  let overlap = 0
  for (const token of left) {
    if (right.has(token)) overlap += 1
  }

  return (2 * overlap) / (left.size + right.size)
}

function includesPhrase(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false
  return haystack === needle ||
    haystack.startsWith(`${needle} `) ||
    haystack.endsWith(` ${needle}`) ||
    haystack.includes(` ${needle} `)
}

function entrySearchPhrases(entry: ShaktiPeethReference): string[] {
  return Array.from(new Set([
    entry.name,
    ...entry.aliases,
    entry.shaktiName || '',
  ].map(normalizeTempleName).filter(value => value.length >= 4)))
}

function candidateScore(entry: ShaktiPeethReference, temple: TempleRecord): { score: number; reasons: string[] } {
  const phrases = entrySearchPhrases(entry)
  const title = normalizeTempleName(temple.title)
  const slug = normalizeTempleName(temple.slug)
  const deity = normalizeTempleName(temple.deity)
  const city = normalizeTempleName(temple.city)
  const state = normalizeTempleName(temple.state)
  const country = normalizeTempleName(temple.country)
  const entryState = normalizeTempleName(entry.state)
  const entryCountry = normalizeTempleName(entry.country)
  const primary = [title, slug].filter(Boolean)
  const secondary = [city, deity].filter(Boolean)
  const reasons = new Set<string>()
  let score = 0

  for (const phrase of phrases) {
    if (primary.some(value => includesPhrase(value, phrase))) {
      score += 70
      reasons.add('title/slug contains canonical name or alias')
      continue
    }

    if (secondary.some(value => includesPhrase(value, phrase))) {
      score += 25
      reasons.add('city/deity contains canonical name or alias')
    }

    const titleSimilarity = Math.max(tokenSimilarity(title, phrase), tokenSimilarity(slug, phrase))
    if (titleSimilarity > 0) {
      score += titleSimilarity * 35
      if (titleSimilarity >= 0.5) reasons.add('title is similar to alias')
    }
  }

  if (state && (includesPhrase(state, entryState) || includesPhrase(entryState, state))) {
    score += 15
    reasons.add('state matches')
  }

  if (country && (includesPhrase(country, entryCountry) || includesPhrase(entryCountry, country))) {
    score += 8
    reasons.add('country matches')
  }

  if (hasShaktiPeethCategoryTag(temple)) {
    score += 10
    reasons.add('already tagged Shakti Peeth')
  }

  const canonicalMatch = getShaktiPeethMatch(temple)
  if (canonicalMatch?.key === entry.key) {
    score += 40
    reasons.add('canonical matcher already points here')
  } else if (canonicalMatch && canonicalMatch.key !== entry.key) {
    score -= 45
    reasons.add(`appears closer to ${canonicalMatch.name}`)
  }

  return {
    score: Math.max(0, Math.round(score)),
    reasons: Array.from(reasons),
  }
}

function topCandidates(entry: ShaktiPeethReference, temples: TempleRecord[]) {
  return temples
    .filter(temple => {
      const mapped = getMappedShaktiPeethEntry(temple)
      return !mapped || mapped.key === entry.key
    })
    .map(temple => {
      const scored = candidateScore(entry, temple)
      return {
        temple: templeSummary(temple),
        score: scored.score,
        reasons: scored.reasons,
      }
    })
    .filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.temple.title.localeCompare(b.temple.title))
    .slice(0, 5)
}

function bestMatchedTemple(entry: ShaktiPeethReference, temples: TempleRecord[]): TempleRecord | null {
  const metadataMatches = temples.filter(temple => getMappedShaktiPeethEntry(temple)?.key === entry.key)
  if (metadataMatches.length > 0) {
    return metadataMatches
      .sort((a, b) => stringValue(a.title).localeCompare(stringValue(b.title)))[0]
  }

  const fuzzyMatches = temples.filter(temple => getShaktiPeethMatch(temple)?.key === entry.key)
  if (fuzzyMatches.length === 0) return null

  return fuzzyMatches
    .map(temple => ({ temple, score: candidateScore(entry, temple).score }))
    .sort((a, b) => b.score - a.score || stringValue(a.temple.title).localeCompare(stringValue(b.temple.title)))[0].temple
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

async function loadTemples() {
  return await Temple.find(
    {},
    'title slug deity city state country status categories sacredCategories templeType templeTypes canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName shaktiPeethMeta'
  ).sort({ title: 1 }).lean() as TempleRecord[]
}

export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const temples = await loadTemples()

    const entries = SHAKTI_PEETH_51.map(entry => {
      const matchedTemple = bestMatchedTemple(entry, temples)
      const matchedBy = matchedTemple
        ? getMappedShaktiPeethEntry(matchedTemple)?.key === entry.key ? 'metadata' : 'matcher'
        : null

      return {
        entry,
        matched: Boolean(matchedTemple),
        matchedBy,
        matchedTemple: matchedTemple ? templeSummary(matchedTemple) : null,
        candidates: matchedTemple ? [] : topCandidates(entry, temples),
      }
    })

    const matchedCanonicalCount = entries.filter(entry => entry.matched).length
    const extraTaggedNonCanonicalTemples = temples
      .filter(temple => hasShaktiPeethCategoryTag(temple) && !isCanonicalShaktiPeethTemple(temple))
      .map(templeSummary)

    const mappedTodayCount = await ActivityLog.countDocuments({
      action: 'map-canonical-shakti-peeth',
      timestamp: { $gte: startOfToday() },
    })

    return NextResponse.json({
      ok: true,
      summary: {
        matchedCanonicalCount,
        unmatchedCanonicalCount: SHAKTI_PEETH_51.length - matchedCanonicalCount,
        extraTaggedNonCanonicalCount: extraTaggedNonCanonicalTemples.length,
        mappedTodayCount,
      },
      entries,
      extraTaggedNonCanonicalTemples,
    })
  } catch (error) {
    console.error('Shakti Peeth mapping fetch error:', error)
    return NextResponse.json({ error: 'Failed to load Shakti Peeth mapping data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const canonicalKey = typeof body?.canonicalKey === 'string' ? body.canonicalKey.trim() : ''
    const templeIdValue = typeof body?.templeId === 'string' ? body.templeId.trim() : ''
    const entry = SHAKTI_PEETH_51.find(item => item.key === canonicalKey)

    if (!entry) {
      return NextResponse.json({ error: 'Invalid canonical Shakti Peeth key' }, { status: 400 })
    }

    if (!Types.ObjectId.isValid(templeIdValue)) {
      return NextResponse.json({ error: 'Invalid temple id' }, { status: 400 })
    }

    await connectDB()

    const temple = await Temple.findById(templeIdValue).select(
      'title canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName'
    ).lean() as TempleRecord | null

    if (!temple) {
      return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
    }

    const existingKey = stringValue(temple.canonicalShaktiPeethKey)
    if (temple.canonicalShaktiPeeth === true && existingKey && existingKey !== entry.key) {
      return NextResponse.json({
        error: `Temple is already mapped to ${stringValue(temple.canonicalShaktiPeethName) || existingKey}.`,
      }, { status: 409 })
    }

    const templeTitle = stringValue(temple.title) || 'Untitled temple'
    const now = new Date()
    const shaktiPeethMeta = {
      key: entry.key,
      name: entry.name,
      aliases: entry.aliases,
      state: entry.state,
      country: entry.country,
      shaktiName: entry.shaktiName || '',
      bhairavName: entry.bhairavName || '',
      bodyPart: entry.bodyPart || '',
      mappedAt: now.toISOString(),
      mappedByAdminId: admin.id,
      mappedByAdminEmail: admin.email,
      source: 'admin-reviewed-canonical-mapping',
    }

    await Temple.findByIdAndUpdate(templeIdValue, {
      $set: {
        canonicalShaktiPeeth: true,
        canonicalShaktiPeethKey: entry.key,
        canonicalShaktiPeethName: entry.name,
        shaktiPeethMeta,
      },
    }, { runValidators: true })

    let logCreated = false
    try {
      await ActivityLog.create({
        action: 'map-canonical-shakti-peeth',
        entity: 'temple',
        entityId: templeIdValue,
        entityTitle: templeTitle,
        adminId: admin.id,
        adminName: admin.name || admin.email,
        details: JSON.stringify({
          canonicalKey: entry.key,
          canonicalName: entry.name,
          adminEmail: admin.email,
          source: 'admin-reviewed-canonical-mapping',
        }),
        timestamp: now,
      })
      logCreated = true
    } catch (logError) {
      console.error('Shakti Peeth mapping audit log failed:', logError)
    }

    return NextResponse.json({
      ok: true,
      temple: {
        id: templeIdValue,
        title: templeTitle,
      },
      canonical: {
        key: entry.key,
        name: entry.name,
      },
      logCreated,
    })
  } catch (error) {
    console.error('Shakti Peeth mapping save error:', error)
    return NextResponse.json({ error: 'Failed to save Shakti Peeth mapping' }, { status: 500 })
  }
}
