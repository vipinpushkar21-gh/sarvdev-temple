/**
 * POST /api/search/log
 *
 * Records a client-side click event from search results.
 * Called after a user clicks a result in SmartSearch or the search page.
 *
 * Body (JSON):
 *   query        — the search query string (required)
 *   type?        — content type filter ('all' | 'temple' | ...)
 *   clickedUrl?  — URL of the result that was clicked
 *   clickedType? — content type of clicked result ('temple', 'deity', ...)
 *   resultCount? — total results returned for this query
 *
 * No auth required — lightweight public endpoint.
 * Rate-limited to prevent abuse.
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import SearchLog from '@/models/SearchLog'
import { normalizeQuery } from '@/lib/search'
import { applyRateLimit } from '@/lib/rate-limit'
import { ACTIVE_PROVIDER_NAME } from '@/lib/search-providers'

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, 'search')
  if (limited) return limited

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { query, type, clickedUrl, clickedType, resultCount } = body

  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return NextResponse.json({ ok: false, error: 'query too short' }, { status: 400 })
  }

  try {
    await connectDB()

    await SearchLog.create({
      query:          query.trim().slice(0, 300),
      normalizedQuery: normalizeQuery(query).slice(0, 300),
      provider:       ACTIVE_PROVIDER_NAME,
      type:           typeof type === 'string' ? type.slice(0, 50) : 'all',
      clickedResult:  typeof clickedUrl  === 'string' ? clickedUrl.slice(0, 500)  : null,
      clickedType:    typeof clickedType === 'string' ? clickedType.slice(0, 50)  : null,
      resultCount:    typeof resultCount === 'number'  ? resultCount               : 0,
      durationMs:     null,
      timestamp:      new Date(),
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    console.error('[search/log POST]', err?.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
