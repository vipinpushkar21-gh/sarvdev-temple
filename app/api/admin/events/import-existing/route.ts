import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Event from '@/models/Event'
import ActivityLog from '@/models/ActivityLog'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { existingPublicEvents, staticEventToDb } from '@/lib/events'

type ImportError = { title?: string; slug?: string; reason: string }
type AdminPayload = NonNullable<ReturnType<typeof verifyToken>>

function getAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null
  return payload?.role === 'admin' ? payload : null
}

function errorReason(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown import error'
}

function duplicateQuery(event: { title?: string; slug?: string; date?: string }) {
  const clauses: Record<string, unknown>[] = []
  if (event.slug) clauses.push({ slug: event.slug })
  if (event.title && event.date) {
    clauses.push({ title: event.title, startDate: event.date })
    clauses.push({ title: event.title, date: event.date })
  }
  return clauses.length ? { $or: clauses } : { _id: null }
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized', imported: 0, skipped: 0, failed: 0, errors: [] },
      { status: 401 }
    )
  }

  try {
    await connectDB()
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: `Database connection failed: ${errorReason(error)}`,
        imported: 0,
        skipped: 0,
        failed: existingPublicEvents.length,
        errors: [{ reason: errorReason(error) }],
      },
      { status: 500 }
    )
  }

  let imported = 0
  let skipped = 0
  let failed = 0
  const errors: ImportError[] = []

  for (const staticEvent of existingPublicEvents) {
    try {
      if (!staticEvent.title || !staticEvent.date) {
        failed++
        errors.push({
          title: staticEvent.title,
          slug: staticEvent.slug,
          reason: 'Missing required title or date',
        })
        continue
      }

      const exists = await Event.findOne(duplicateQuery(staticEvent)).lean()

      if (exists) {
        skipped++
        continue
      }

      await Event.create(staticEventToDb(staticEvent))
      imported++
    } catch (error) {
      failed++
      errors.push({
        title: staticEvent.title,
        slug: staticEvent.slug,
        reason: errorReason(error),
      })
    }
  }

  await ActivityLog.create({
    action: 'import-existing-events',
    entity: 'event',
    adminId: admin.id,
    adminName: admin.name,
    details: JSON.stringify({ imported, skipped, failed, sourceCount: existingPublicEvents.length }),
  }).catch(() => null)

  return NextResponse.json({
    ok: true,
    success: true,
    sourceCount: existingPublicEvents.length,
    imported,
    skipped,
    failed,
    errors,
  })
}
