import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { applyRateLimit } from '@/lib/rate-limit'

const APPROVED = {
  $or: [
    { status: 'approved' },
    { status: { $exists: false } },
    { status: '' },
    { status: null },
  ],
}

export async function GET(req: NextRequest) {
  const _t0 = performance.now();
  const limited = applyRateLimit(req, 'temples')
  if (limited) return limited

  try {
    await connectDB()

    const [statesRaw, deitiesRaw] = await Promise.all([
      Temple.distinct('state', APPROVED),
      Temple.distinct('deity', APPROVED),
    ])

    const states = (statesRaw as string[])
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      .sort()

    const deities = (deitiesRaw as string[])
      .filter((d): d is string => typeof d === 'string' && d.trim().length > 0)
      .sort()

    console.log("[api/filter-options] " + (performance.now() - _t0).toFixed(0) + "ms");
    const res = NextResponse.json({ states, deities })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return res
  } catch (error) {
    console.error('Filter options error:', error)
    return NextResponse.json({ states: [], deities: [] }, { status: 500 })
  }
}
