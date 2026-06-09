/**
 * /api/admin/migrate-category-slugs
 *
 * Dry-run or execute normalization of known alias slugs → canonical slugs.
 * Only updates `sacredCategorySlugs` (and `updatedAt`). Never touches
 * temple content, images, SEO, or any other field.
 *
 * GET  → dry-run report (no DB writes)
 * POST { execute: true } → run the migration
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { SLUG_ALIASES } from '@/lib/sacred-categories'
import { getCategoryBySlug } from '@/lib/sacred-categories'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)))
}

/**
 * Build a normalisation plan:
 * Returns every (alias → canonical) mapping that is
 * (a) present in SLUG_ALIASES, AND
 * (b) resolvable to a real registry entry via getCategoryBySlug.
 */
function buildAliasMap(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [alias, canonical] of Object.entries(SLUG_ALIASES)) {
    const entry = getCategoryBySlug(canonical)
    if (entry) out[alias] = entry.slug  // always use the canonical slug from the registry entry
  }
  return out
}

type AffectedTemple = {
  _id: string
  title: string
  city?: string
  state?: string
  current: string[]
  normalized: string[]
  aliasesFound: string[]
}

async function computePlan(aliasMap: Record<string, string>): Promise<AffectedTemple[]> {
  const aliasKeys = Object.keys(aliasMap)
  if (!aliasKeys.length) return []

  const temples = await Temple.find(
    { sacredCategorySlugs: { $in: aliasKeys } },
    '_id title city state sacredCategorySlugs'
  ).lean() as any[]

  return temples
    .map((t: any) => {
      const current: string[] = t.sacredCategorySlugs ?? []
      const aliasesFound = current.filter((s: string) => aliasMap[s])
      const normalized = uniqueStrings(
        current.map((s: string) => aliasMap[s] ?? s)
      )
      return {
        _id: String(t._id),
        title: t.title,
        city: t.city,
        state: t.state,
        current,
        normalized,
        aliasesFound,
      }
    })
    .filter(t => t.aliasesFound.length > 0)
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const aliasMap = buildAliasMap()
    const affected = await computePlan(aliasMap)

    return NextResponse.json({
      dryRun: true,
      aliasMap,
      totalAffected: affected.length,
      affected,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('Dry-run error:', err)
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any = {}
  try { body = await req.json() } catch { /* empty body OK */ }

  if (body?.execute !== true) {
    return NextResponse.json(
      { error: 'Missing { execute: true } in request body. This prevents accidental execution.' },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    const aliasMap = buildAliasMap()
    const affected = await computePlan(aliasMap)

    if (!affected.length) {
      return NextResponse.json({
        updated: 0,
        errors: 0,
        message: 'No temples required normalization.',
        aliasMap,
      })
    }

    const errors: { id: string; title: string; error: string }[] = []
    let updated = 0

    for (const temple of affected) {
      try {
        await Temple.updateOne(
          { _id: temple._id },
          {
            $set: {
              sacredCategorySlugs: temple.normalized,
              updatedAt: new Date(),
            },
          }
        )
        updated++
      } catch (err: any) {
        errors.push({ id: temple._id, title: temple.title, error: String(err?.message ?? err) })
      }
    }

    return NextResponse.json({
      updated,
      errors: errors.length,
      errorDetails: errors.length ? errors : undefined,
      message: `Normalized ${updated} temple(s). ${errors.length} error(s).`,
      aliasMap,
      templatesProcessed: affected.map(t => ({
        _id: t._id,
        title: t.title,
        aliasesFound: t.aliasesFound,
        before: t.current,
        after: t.normalized,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('Migration execute error:', err)
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
