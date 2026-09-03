import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { applyRateLimit } from '@/lib/rate-limit'
import { normalizeTempleText, sacredCategorySlug, slugifyTemple } from '@/lib/temple-normalization'
import { findNearbyTemples } from '@/lib/temple-nearby'

const APPROVED = {
  $or: [
    { status: 'approved' },
    { status: { $exists: false } },
    { status: '' },
    { status: null },
  ],
}

const PROJ = 'title slug image imageCard imageHero heroImage city district state deity deitySlug templeType templeTypes categories sacredCategories sacredCategorySlugs latitude longitude'

function esc(v: string) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitList(raw: string | null) {
  if (!raw) return []
  const separator = raw.includes('|') ? '|' : raw.includes(';') ? ';' : ','
  return Array.from(new Set(raw.split(separator).map((item) => item.trim()).filter(Boolean)))
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean)
  if (typeof value === 'string') return splitList(value)
  return []
}

function sameText(a: unknown, b: unknown) {
  return normalizeTempleText(a) === normalizeTempleText(b)
}

function anchored(value: string) {
  return new RegExp(`^${esc(value)}$`, 'i')
}

function overlap(a: string[], b: string[]) {
  const set = new Set(a.map((item) => normalizeTempleText(item)))
  return b.filter((item) => set.has(normalizeTempleText(item))).length
}

function scoreTemple(
  temple: any,
  context: {
    deity: string
    deitySlug: string
    categories: string[]
    categorySlugs: string[]
    state: string
    district: string
    types: string[]
  }
) {
  let score = 0
  if (context.deitySlug && temple.deitySlug === context.deitySlug) {
    score += 105
  } else if (context.deity && sameText(temple.deity, context.deity)) {
    score += 100
  }

  const templeCategories = [...toArray(temple.categories), ...toArray(temple.sacredCategories)]
  const templeCategorySlugs = toArray(temple.sacredCategorySlugs)
  const categoryMatches =
    overlap(templeCategories, context.categories) +
    overlap(templeCategorySlugs, context.categorySlugs)
  if (categoryMatches > 0) score += 80 + Math.min(20, categoryMatches * 5)

  if (context.state && sameText(temple.state, context.state)) score += 45
  if (context.district && sameText(temple.district, context.district)) score += 35

  const templeTypes = [...toArray(temple.templeTypes), ...(temple.templeType ? [String(temple.templeType)] : [])]
  const typeMatches = overlap(templeTypes, context.types)
  if (typeMatches > 0) score += 25

  return score
}

function finiteCoordinate(value: string | null) {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function GET(req: NextRequest) {
  const limited = applyRateLimit(req, 'temples')
  if (limited) return limited

  try {
    const { searchParams } = new URL(req.url)
    const excludeSlug = searchParams.get('slug') || ''
    const excludeId = searchParams.get('id') || ''
    const deity = (searchParams.get('deity') || '').trim()
    const deitySlug = slugifyTemple(searchParams.get('deitySlug') || deity)
    const state = (searchParams.get('state') || '').trim()
    const district = (searchParams.get('district') || '').trim()
    const category = (searchParams.get('category') || '').trim()
    const categories = Array.from(new Set([...splitList(searchParams.get('categories')), category].filter(Boolean)))
    const categorySlugs = Array.from(new Set([
      ...splitList(searchParams.get('sacredCategorySlugs')),
      ...categories.map((cat) => sacredCategorySlug(cat)).filter(Boolean),
    ]))
    const types = Array.from(new Set([
      ...splitList(searchParams.get('templeTypes')),
      ...splitList(searchParams.get('templeType')),
    ]))
    const limit = Math.min(8, Math.max(1, parseInt(searchParams.get('limit') || '8', 10) || 8))
    const includeNearby = searchParams.get('includeNearby') === '1'
    const lat = finiteCoordinate(searchParams.get('lat'))
    const lng = finiteCoordinate(searchParams.get('lng'))

    await connectDB()

    const clauses: Record<string, any>[] = []
    if (deitySlug) clauses.push({ deitySlug })
    if (deity) clauses.push({ deity: anchored(deity) })
    if (categories.length > 0) {
      clauses.push({ categories: { $in: categories } }, { sacredCategories: { $in: categories } })
    }
    if (categorySlugs.length > 0) clauses.push({ sacredCategorySlugs: { $in: categorySlugs } })
    if (state) clauses.push({ state: anchored(state) }, { stateNormalized: normalizeTempleText(state) })
    if (district) clauses.push({ district: anchored(district) })
    if (types.length > 0) clauses.push({ templeType: { $in: types } }, { templeTypes: { $in: types } })

    const and: Record<string, any>[] = [APPROVED]
    if (excludeSlug) and.push({ slug: { $ne: excludeSlug } })
    if (mongoose.Types.ObjectId.isValid(excludeId)) {
      and.push({ _id: { $ne: new mongoose.Types.ObjectId(excludeId) } })
    }

    const [candidates, nearby] = await Promise.all([
      clauses.length > 0
        ? Temple.find({ $and: [...and, { $or: clauses }] }, PROJ)
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(80)
            .lean()
        : Promise.resolve([]),
      includeNearby && lat !== null && lng !== null
        ? findNearbyTemples({ lat, lng, excludeSlug, excludeId })
        : Promise.resolve([]),
    ])

    const context = { deity, deitySlug, categories, categorySlugs, state, district, types }
    const seen = new Set<string>()
    const results = candidates
      .map((temple: any) => ({ temple, score: scoreTemple(temple, context) }))
      .filter(({ temple, score }: any) => {
        if (score <= 0) return false
        const id = String(temple._id)
        const templeSlug = String(temple.slug || '')
        if (seen.has(id) || (excludeSlug && templeSlug === excludeSlug)) return false
        seen.add(id)
        return true
      })
      .sort((a: any, b: any) => b.score - a.score || String(a.temple.title || '').localeCompare(String(b.temple.title || '')))
      .slice(0, limit)
      .map(({ temple }: any) => temple)

    const res = NextResponse.json(includeNearby ? { related: results, nearby } : results)
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return res
  } catch (error) {
    console.error('Related temples error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
