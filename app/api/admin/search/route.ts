/**
 * GET /api/admin/search
 *
 * Search health dashboard analytics.
 * Admin-only. Returns aggregated search statistics from SearchLog.
 *
 * Query params:
 *   tab=stats (default) — full health report
 *   tab=popular&period=daily|weekly|monthly — top queries for period
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import SearchLog from '@/models/SearchLog'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { ACTIVE_PROVIDER_NAME, PROVIDER_META, SUPPORTED_PROVIDERS } from '@/lib/search-providers'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

function ago(days: number): Date {
  return new Date(Date.now() - days * 86_400_000)
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const url = new URL(req.url)
    const tab    = url.searchParams.get('tab') || 'stats'
    const period = url.searchParams.get('period') || 'weekly'

    // ── Popular queries tab ───────────────────────────────────────────────────
    if (tab === 'popular') {
      const days = period === 'daily' ? 1 : period === 'monthly' ? 30 : 7
      const since = ago(days)

      const topQueries = await SearchLog.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id:        '$normalizedQuery',
          count:      { $sum: 1 },
          avgResults: { $avg: '$resultCount' },
          lastSeen:   { $max: '$timestamp' },
        }},
        { $sort: { count: -1 } },
        { $limit: 50 },
        { $project: { _id: 0, query: '$_id', count: 1, avgResults: { $round: ['$avgResults', 1] }, lastSeen: 1 } },
      ])

      return NextResponse.json({ tab: 'popular', period, topQueries }, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // ── Full stats (default) ──────────────────────────────────────────────────

    const [
      total24h,
      total7d,
      total30d,
      topQueries,
      zeroResults,
      slowQueries,
      avgDuration24h,
    ] = await Promise.all([
      // Counts per period
      SearchLog.countDocuments({ timestamp: { $gte: ago(1) } }),
      SearchLog.countDocuments({ timestamp: { $gte: ago(7) } }),
      SearchLog.countDocuments({ timestamp: { $gte: ago(30) } }),

      // Top 20 queries (last 7 days)
      SearchLog.aggregate([
        { $match: { timestamp: { $gte: ago(7) } } },
        { $group: {
          _id:        '$normalizedQuery',
          count:      { $sum: 1 },
          avgResults: { $avg: '$resultCount' },
          lastSeen:   { $max: '$timestamp' },
        }},
        { $sort: { count: -1 } },
        { $limit: 20 },
        { $project: { _id: 0, query: '$_id', count: 1, avgResults: { $round: ['$avgResults', 1] }, lastSeen: 1 } },
      ]),

      // Zero-result queries (last 7 days)
      SearchLog.aggregate([
        { $match: { timestamp: { $gte: ago(7) }, resultCount: 0 } },
        { $group: {
          _id:      '$normalizedQuery',
          count:    { $sum: 1 },
          lastSeen: { $max: '$timestamp' },
        }},
        { $sort: { count: -1 } },
        { $limit: 20 },
        { $project: { _id: 0, query: '$_id', count: 1, lastSeen: 1 } },
      ]),

      // Slow queries > 800ms (last 24 h)
      SearchLog.aggregate([
        { $match: { timestamp: { $gte: ago(1) }, durationMs: { $gt: 800 } } },
        { $group: {
          _id:      '$normalizedQuery',
          maxMs:    { $max: '$durationMs' },
          avgMs:    { $avg: '$durationMs' },
          count:    { $sum: 1 },
        }},
        { $sort: { maxMs: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, query: '$_id', maxMs: 1, avgMs: { $round: ['$avgMs', 0] }, count: 1 } },
      ]),

      // Avg duration last 24h
      SearchLog.aggregate([
        { $match: { timestamp: { $gte: ago(1) }, durationMs: { $ne: null } } },
        { $group: { _id: null, avgMs: { $avg: '$durationMs' } } },
        { $project: { _id: 0, avgMs: { $round: ['$avgMs', 0] } } },
      ]),
    ])

    const activeMeta = PROVIDER_META[ACTIVE_PROVIDER_NAME]

    return NextResponse.json({
      totals: {
        last24h:  total24h,
        last7d:   total7d,
        last30d:  total30d,
      },
      avgDurationMs:   (avgDuration24h[0] as any)?.avgMs ?? null,
      topQueries,
      zeroResultQueries: zeroResults,
      slowQueries,
      provider: {
        name:        ACTIVE_PROVIDER_NAME,
        label:       activeMeta.label,
        description: activeMeta.description,
        fuzzy:       activeMeta.supportsFuzzy,
        vector:      activeMeta.supportsVector,
      },
      availableProviders: SUPPORTED_PROVIDERS.map(p => ({
        name:           p,
        label:          PROVIDER_META[p].label,
        productionReady: PROVIDER_META[p].productionReady,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('[admin/search]', err?.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
