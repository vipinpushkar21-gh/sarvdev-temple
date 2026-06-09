import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { runTempleImport } from '@/lib/temple-import'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!file || typeof (file as any).stream !== 'function') {
    return NextResponse.json({ error: 'CSV file is required' }, { status: 400 })
  }

  await connectDB()
  const dryRun = form.get('dryRun') === '1' || form.get('dryRun') === 'true'
  const result = await runTempleImport({
    file: file as any,
    mode: dryRun ? 'dry-run' : 'execute',
    admin: admin as any,
    chunkSize: 500,
  })

  return NextResponse.json({
    ...result,
    updated: result.updatedMissingFields + result.mergedCategories,
    failed: result.failedRows + result.invalidRows,
    skipped: result.skippedExisting + result.skippedDuplicate + result.wouldSkip,
  }, { status: result.ok ? 200 : 400 })
}
