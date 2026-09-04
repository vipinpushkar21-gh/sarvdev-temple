import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'
import { resolveCategoryForDeity } from '@/lib/deity-categories'

export const dynamic = 'force-dynamic'

const HEADERS = [
  'ID', 'Name', 'NameHi', 'Slug', 'StaticSlug', 'Description', 'DescriptionHi', 'Mantra',
  'Attributes', 'Categories', 'Aliases', 'SlugAliases', 'Image', 'ImageCard', 'ImageHero',
  'Images', 'OgImage', 'Order', 'Status', 'Source', 'MetaTitle', 'MetaDescription', 'MetaKeywords',
]
const VALID_STATUSES = new Set(['pending', 'approved', 'rejected'])

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  return Boolean(token && verifyToken(token)?.role === 'admin')
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false
  const input = text.replace(/^\uFEFF/, '')
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    if (char === '"') {
      if (quoted && input[index + 1] === '"') { value += '"'; index += 1 } else quoted = !quoted
    } else if (char === ',' && !quoted) { row.push(value); value = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[index + 1] === '\n') index += 1
      row.push(value); value = ''
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else value += char
  }
  if (value || row.length) { row.push(value); if (row.some(Boolean)) rows.push(row) }
  return rows
}

function listValue(value: string) {
  return String(value || '').split(';').map(item => item.trim()).filter(Boolean)
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function mapRow(row: string[], headerIndex: Map<string, number>) {
  const get = (name: string) => row[headerIndex.get(name) ?? -1] || ''
  const categories = listValue(get('Categories'))
  const canonicalCategories = categories.map(value => resolveCategoryForDeity(value, null)).filter(Boolean) as string[]
  return {
    id: get('ID').trim(), name: get('Name').trim(), nameHi: get('NameHi').trim(), slug: get('Slug').trim(),
    staticSlug: get('StaticSlug').trim(), description: get('Description'), descriptionHi: get('DescriptionHi'), mantra: get('Mantra'),
    attributes: listValue(get('Attributes')), categories: canonicalCategories, aliases: listValue(get('Aliases')),
    slugAliases: listValue(get('SlugAliases')), image: get('Image').trim(), imageCard: get('ImageCard').trim(), imageHero: get('ImageHero').trim(),
    images: listValue(get('Images')), ogImage: get('OgImage').trim(), order: Number(get('Order') || 0),
    status: VALID_STATUSES.has(get('Status')) ? get('Status') : 'pending', source: 'imported',
    metaTitle: get('MetaTitle'), metaDescription: get('MetaDescription'), metaKeywords: get('MetaKeywords'),
  }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return new NextResponse(`\uFEFF${HEADERS.join(',')}\n`, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="deities-import-template.csv"', 'Cache-Control': 'private, no-store' },
  })
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || typeof (file as File).text !== 'function') return NextResponse.json({ error: 'CSV file is required' }, { status: 400 })
  const rows = parseCsv(await (file as File).text())
  if (rows.length < 2) return NextResponse.json({ error: 'CSV must include a header and at least one data row' }, { status: 400 })
  const headerIndex = new Map(rows[0].map((header, index) => [header.trim(), index]))
  if (!headerIndex.has('Name') || !headerIndex.has('NameHi')) return NextResponse.json({ error: 'CSV requires Name and NameHi columns' }, { status: 400 })
  await connectDB()
  const execute = form!.get('mode') === 'execute'
  const report = { ok: true, mode: execute ? 'execute' : 'dry-run', total: rows.length - 1, created: 0, updated: 0, skipped: 0, errors: [] as string[], rows: [] as any[] }

  for (let index = 1; index < rows.length; index += 1) {
    const data = mapRow(rows[index], headerIndex)
    if (!data.name || !data.nameHi) { report.errors.push(`Row ${index + 1}: Name and NameHi are required`); continue }
    if (data.categories.length === 0) { report.errors.push(`Row ${index + 1}: at least one valid category is required`); continue }
    const match = data.id ? await Deity.findById(data.id).catch(() => null) : await Deity.findOne({ $or: [{ slug: data.slug }, { name: data.name }] })
    const action = match ? 'update' : 'create'
    if (execute) {
      const payload: any = { ...data }
      delete payload.id
      payload.category = data.categories[0]; payload.categoryId = data.categories[0]; payload.categorySlug = data.categories[0]
      payload.categoryName = data.categories[0]; payload.categoryNameHi = data.categories[0]; payload.categories = data.categories; payload.categoryIds = data.categories
      if (!payload.slug) payload.slug = slugify(data.name)
      if (match) await Deity.findByIdAndUpdate(match._id, { $set: payload }, { runValidators: true })
      else await Deity.create(payload)
    }
    report[action === 'create' ? 'created' : 'updated'] += 1
    report.rows.push({ row: index + 1, name: data.name, action, id: match?._id?.toString() })
  }
  report.ok = report.errors.length === 0
  return NextResponse.json(report, { status: report.ok ? 200 : 400 })
}
