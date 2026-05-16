import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

/**
 * GET /api/admin/contributors
 *
 * Returns contributor leaderboard based on temple submissions:
 *  - Top submitters by count
 *  - Submission status breakdown per contributor
 *  - Recent submissions timeline
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const temples = await Temple.find(
      { submittedBy: { $exists: true, $ne: '' } },
      'title submittedBy submitterEmail status createdAt'
    ).sort({ createdAt: -1 }).lean() as any[]

    // Leaderboard
    const submitterMap: Record<string, { name: string; email: string; total: number; approved: number; pending: number; rejected: number }> = {}
    for (const t of temples) {
      const key = t.submitterEmail || t.submittedBy || 'anonymous'
      if (!submitterMap[key]) {
        submitterMap[key] = { name: t.submittedBy || 'Anonymous', email: t.submitterEmail || '', total: 0, approved: 0, pending: 0, rejected: 0 }
      }
      submitterMap[key].total++
      const status = t.status || 'pending'
      if (status === 'approved') submitterMap[key].approved++
      else if (status === 'rejected') submitterMap[key].rejected++
      else submitterMap[key].pending++
    }

    const leaderboard = Object.values(submitterMap)
      .sort((a, b) => b.approved - a.approved || b.total - a.total)
      .slice(0, 25)

    // Recent submissions
    const recent = temples.slice(0, 20).map(t => ({
      title: t.title,
      submittedBy: t.submittedBy || 'Anonymous',
      status: t.status,
      date: t.createdAt,
    }))

    return NextResponse.json({
      totalSubmissions: temples.length,
      uniqueContributors: Object.keys(submitterMap).length,
      leaderboard,
      recent,
    })
  } catch (error) {
    console.error('Contributors API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
