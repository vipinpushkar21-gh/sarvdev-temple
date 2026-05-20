import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { getShaktiPeethDebugReport, getShaktiPeethMatch, SHAKTI_PEETH_51 } from '@/data/shakti-peethas'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function templeSummary(temple: any) {
  const match = getShaktiPeethMatch(temple)

  return {
    id: String(temple._id || temple.id || ''),
    title: stringValue(temple.title) || stringValue(temple.name),
    slug: stringValue(temple.slug),
    deity: stringValue(temple.deity),
    city: stringValue(temple.city),
    state: stringValue(temple.state),
    categories: Array.isArray(temple.categories) ? temple.categories : [],
    sacredCategories: Array.isArray(temple.sacredCategories) ? temple.sacredCategories : [],
    canonicalMatch: match ? {
      key: match.key,
      name: match.name,
      state: match.state,
      country: match.country,
    } : null,
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const temples = await Temple.find(
      { status: 'approved' },
      'title slug deity city state country categories sacredCategories templeType templeTypes status canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName shaktiPeethMeta'
    ).lean() as any[]

    const report = getShaktiPeethDebugReport(temples)

    return NextResponse.json({
      ok: true,
      scope: 'approved-temples',
      beforeTaggedCount: report.taggedCount,
      afterCanonicalMatchedCount: report.canonicalMatchedCount,
      canonicalEntryMatchedCount: SHAKTI_PEETH_51.length - report.missingCanonicalCount,
      extraTaggedCount: report.extraTaggedCount,
      missingCanonicalCount: report.missingCanonicalCount,
      extraTaggedTemples: report.extraTaggedTemples.map(templeSummary),
      canonicalMatchedTemples: report.canonicalTemples.map(templeSummary),
      missingCanonical: report.missingCanonical.map(entry => ({
        key: entry.key,
        name: entry.name,
        state: entry.state,
        country: entry.country,
        aliases: entry.aliases,
        shaktiName: entry.shaktiName,
        bhairavName: entry.bhairavName,
        bodyPart: entry.bodyPart,
      })),
    })
  } catch (error) {
    console.error('Shakti Peeth report error:', error)
    return NextResponse.json({ error: 'Failed to build Shakti Peeth report' }, { status: 500 })
  }
}
