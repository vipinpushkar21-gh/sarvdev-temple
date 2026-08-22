import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { normalizeSpiritualIcon } from '@/lib/spiritual-icons'
import SpiritualIcon from '@/models/SpiritualIcon'

export const dynamic = 'force-dynamic'

const HEADERS = ['ID', 'Name', 'NameHi', 'Slug', 'Category', 'CategorySlug', 'Title', 'TitleHi', 'ShortBio', 'FullBio', 'Image', 'ImageCard', 'ImageHero', 'GalleryImages', 'Location', 'City', 'State', 'Country', 'Languages', 'Specializations', 'Sampradaya', 'Organization', 'YearsActive', 'NotableWorks', 'ContactPhone', 'ContactEmail', 'Website', 'YouTube', 'Instagram', 'Facebook', 'Twitter', 'BookingAvailable', 'Verified', 'Featured', 'Status', 'Priority', 'MetaTitle', 'MetaDescription', 'OgImage', 'Source']
const VALID_STATUSES = new Set(['active', 'inactive', 'draft'])

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  return Boolean(token && verifyToken(token)?.role === 'admin')
}

function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let value = ''; let quoted = false
  const input = text.replace(/^\uFEFF/, '')
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    if (char === '"') { if (quoted && input[index + 1] === '"') { value += '"'; index += 1 } else quoted = !quoted }
    else if (char === ',' && !quoted) { row.push(value); value = '' }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && input[index + 1] === '\n') index += 1; row.push(value); value = ''; if (row.some(Boolean)) rows.push(row); row = [] }
    else value += char
  }
  if (value || row.length) { row.push(value); if (row.some(Boolean)) rows.push(row) }
  return rows
}

function listValue(value: string) { return String(value || '').split(';').map((item) => item.trim()).filter(Boolean) }
function boolValue(value: string) { return ['true', '1', 'yes'].includes(String(value || '').toLowerCase()) }

function mapRow(row: string[], headerIndex: Map<string, number>) {
  const get = (name: string) => row[headerIndex.get(name) ?? -1] || ''
  const data = normalizeSpiritualIcon({ name: get('Name'), nameHi: get('NameHi'), slug: get('Slug'), category: get('Category'), categorySlug: get('CategorySlug'), title: get('Title'), titleHi: get('TitleHi'), shortBio: get('ShortBio'), fullBio: get('FullBio'), image: get('Image'), imageCard: get('ImageCard'), imageHero: get('ImageHero'), galleryImages: listValue(get('GalleryImages')), location: get('Location'), city: get('City'), state: get('State'), country: get('Country'), languages: listValue(get('Languages')), specializations: listValue(get('Specializations')), sampradaya: get('Sampradaya'), organization: get('Organization'), yearsActive: get('YearsActive'), notableWorks: listValue(get('NotableWorks')), contactPhone: get('ContactPhone'), contactEmail: get('ContactEmail'), website: get('Website'), youtube: get('YouTube'), instagram: get('Instagram'), facebook: get('Facebook'), twitter: get('Twitter'), bookingAvailable: boolValue(get('BookingAvailable')), verified: boolValue(get('Verified')), featured: boolValue(get('Featured')), status: VALID_STATUSES.has(get('Status')) ? get('Status') : 'draft', priority: Number(get('Priority') || 999), metaTitle: get('MetaTitle'), metaDescription: get('MetaDescription'), ogImage: get('OgImage'), source: get('Source') || 'csv-import' })
  return { id: get('ID').trim(), data }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return new NextResponse(`\uFEFF${HEADERS.join(',')}\n`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="spiritual-icons-import-template.csv"', 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData().catch(() => null); const file = form?.get('file')
  if (!file || typeof (file as File).text !== 'function') return NextResponse.json({ error: 'CSV file is required' }, { status: 400 })
  const rows = parseCsv(await (file as File).text())
  if (rows.length < 2) return NextResponse.json({ error: 'CSV must include a header and at least one data row' }, { status: 400 })
  const headerIndex = new Map(rows[0].map((header, index) => [header.trim(), index]))
  if (!headerIndex.has('Name')) return NextResponse.json({ error: 'CSV requires a Name column' }, { status: 400 })
  await connectDB(); const execute = form!.get('mode') === 'execute'
  const report = { ok: true, mode: execute ? 'execute' : 'dry-run', total: rows.length - 1, created: 0, updated: 0, errors: [] as string[], rows: [] as any[] }
  for (let index = 1; index < rows.length; index += 1) {
    const { id, data } = mapRow(rows[index], headerIndex)
    if (!data.name) { report.errors.push(`Row ${index + 1}: Name is required`); continue }
    const match = id ? await SpiritualIcon.findById(id).catch(() => null) : await SpiritualIcon.findOne({ $or: [{ slug: data.slug }, { name: data.name }] })
    const action = match ? 'update' : 'create'
    if (execute) { if (match) await SpiritualIcon.findByIdAndUpdate(match._id, { $set: data }, { runValidators: true }); else await SpiritualIcon.create(data) }
    report[action === 'create' ? 'created' : 'updated'] += 1; report.rows.push({ row: index + 1, name: data.name, action, id: match?._id?.toString() })
  }
  report.ok = report.errors.length === 0
  return NextResponse.json(report, { status: report.ok ? 200 : 400 })
}