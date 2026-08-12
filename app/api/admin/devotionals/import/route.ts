// POST /api/admin/devotionals/import — category-scoped CSV import (mirrors the export)
// GET  /api/admin/devotionals/import — blank CSV template for a category
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { runDevotionalImport, type DevotionalImportMode } from '@/lib/devotional-import'
import { getCategoryByName } from '@/lib/devotional-categories'

export const dynamic = 'force-dynamic'

const TEMPLATE_HEADERS = [
  'ID', 'Title', 'TitleHi', 'Slug', 'Category', 'Subcategory', 'Deity', 'DeityHi',
  'Language', 'Description', 'DescriptionHi', 'Content', 'ContentHi', 'Lyrics',
  'Audio', 'AudioUrl', 'Duration', 'Artist', 'Tags', 'Featured', 'Status',
  'Source', 'MetaTitle', 'MetaDescription', 'MetaKeywords', 'Image',
]

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const category = new URL(request.url).searchParams.get('category') || ''
  const sampleRow = TEMPLATE_HEADERS.map((header) => {
    if (header === 'Category') return `"${category}"`
    if (header === 'Status') return '"approved"'
    if (header === 'Featured') return '"false"'
    return '""'
  }).join(',')

  const filename = `devotionals-import-template${category ? `-${getCategoryByName(category)?.slug ?? category.toLowerCase()}` : ''}.csv`
  return new NextResponse(`\uFEFF${TEMPLATE_HEADERS.join(',')}\n${sampleRow}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Expected a multipart form upload' }, { status: 400 })

  const category = String(form.get('category') || '').trim()
  if (!category) return NextResponse.json({ error: 'Select a category to import into' }, { status: 400 })

  const mode: DevotionalImportMode = form.get('mode') === 'execute' ? 'execute' : 'dry-run'

  const file = form.get('file')
  const pastedText = String(form.get('csvText') || '')
  let csvText = pastedText

  if (!csvText && file && typeof (file as File).text === 'function') {
    csvText = await (file as File).text()
  }
  if (!csvText.trim()) {
    return NextResponse.json({ error: 'Upload a CSV file or paste CSV text' }, { status: 400 })
  }

  await connectDB()
  const result = await runDevotionalImport({ csvText, category, mode })
  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
