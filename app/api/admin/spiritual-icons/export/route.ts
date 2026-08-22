import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import SpiritualIcon from '@/models/SpiritualIcon'

export const dynamic = 'force-dynamic'

const HEADERS = ['ID', 'Name', 'NameHi', 'Slug', 'Category', 'CategorySlug', 'Title', 'TitleHi', 'ShortBio', 'FullBio', 'Image', 'ImageCard', 'ImageHero', 'GalleryImages', 'Location', 'City', 'State', 'Country', 'Languages', 'Specializations', 'Sampradaya', 'Organization', 'YearsActive', 'NotableWorks', 'ContactPhone', 'ContactEmail', 'Website', 'YouTube', 'Instagram', 'Facebook', 'Twitter', 'BookingAvailable', 'Verified', 'Featured', 'Status', 'Priority', 'MetaTitle', 'MetaDescription', 'OgImage', 'Source']

function isAdmin(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  return Boolean(token && verifyToken(token)?.role === 'admin')
}

function csvEscape(value: unknown) {
  const normalized = Array.isArray(value) ? value.join('; ') : value instanceof Date ? value.toISOString() : String(value ?? '')
  return `"${normalized.replace(/"/g, '""')}"`
}

function rowForIcon(icon: Record<string, any>) {
  return [icon._id, icon.name, icon.nameHi, icon.slug, icon.category, icon.categorySlug, icon.title, icon.titleHi, icon.shortBio, icon.fullBio, icon.image, icon.imageCard, icon.imageHero, icon.galleryImages, icon.location, icon.city, icon.state, icon.country, icon.languages, icon.specializations, icon.sampradaya, icon.organization, icon.yearsActive, icon.notableWorks, icon.contactPhone, icon.contactEmail, icon.website, icon.youtube, icon.instagram, icon.facebook, icon.twitter, icon.bookingAvailable, icon.verified, icon.featured, icon.status, icon.priority, icon.metaTitle, icon.metaDescription, icon.ogImage, icon.source]
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const docs = await SpiritualIcon.find({}, { __v: 0 }).sort({ featured: -1, priority: 1, name: 1 }).lean()
  const csv = [HEADERS.join(','), ...docs.map((icon: any) => rowForIcon(icon).map(csvEscape).join(','))].join('\n')
  return new NextResponse(`\uFEFF${csv}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="spiritual-icons-export-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'private, no-store' } })
}