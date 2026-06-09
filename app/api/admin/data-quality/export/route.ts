/**
 * GET /api/admin/data-quality/export?type=seo|images|location|duplicates
 *
 * CSV export for data quality reports. Admin-only.
 * Returns text/csv with Content-Disposition attachment.
 *
 * Columns per type:
 *   seo:       id, title, slug, city, state, hasMetaTitle, hasMetaDesc, hasOgImage, hasCanonical
 *   images:    id, title, slug, city, hasCardImage, hasHeroImage, cardIsCloudinary, heroIsCloudinary
 *   location:  id, title, slug, city, state, hasLatitude, hasLongitude, isValidCoords
 *   duplicates: type, key, count, slugs (one row per duplicate group)
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

const BASE_MATCH = { status: { $ne: 'rejected' } }

function toCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const escape = (v: string | number | boolean | null | undefined): string => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.map(escape).join(',')]
  for (const row of rows) lines.push(row.map(escape).join(','))
  return lines.join('\r\n')
}

function csvResponse(filename: string, content: string): NextResponse {
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

function isCloudinary(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.length > 0 && url.includes('cloudinary.com')
}

function hasVal(v: any): boolean {
  return v != null && String(v).trim().length > 0
}

function isValidCoord(lat: any, lng: any): boolean {
  return (
    typeof lat === 'number' && lat !== 0 && lat >= -90  && lat <= 90 &&
    typeof lng === 'number' && lng !== 0 && lng >= -180 && lng <= 180
  )
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return new NextResponse('Unauthorized', { status: 401 })

  const type = new URL(req.url).searchParams.get('type') || 'seo'

  try {
    await connectDB()

    // ── SEO Report ────────────────────────────────────────────────────────────
    if (type === 'seo') {
      const temples = await Temple.find(BASE_MATCH, {
        title: 1, slug: 1, city: 1, state: 1,
        metaTitle: 1, metaDescription: 1, ogImage: 1, canonicalUrl: 1,
      }).sort({ createdAt: -1 }).limit(5000).lean()

      const headers = ['id', 'title', 'slug', 'city', 'state',
        'hasMetaTitle', 'hasMetaDesc', 'hasOgImage', 'hasCanonical']
      const rows = temples.map((t: any) => [
        String(t._id), t.title, t.slug, t.city ?? '', t.state ?? '',
        hasVal(t.metaTitle), hasVal(t.metaDescription),
        hasVal(t.ogImage), hasVal(t.canonicalUrl),
      ])
      return csvResponse(`sarvdev-seo-report-${Date.now()}.csv`, toCsv(headers, rows))
    }

    // ── Image Report ──────────────────────────────────────────────────────────
    if (type === 'images') {
      const temples = await Temple.find(BASE_MATCH, {
        title: 1, slug: 1, city: 1,
        image: 1, imageCard: 1, imageHero: 1, heroImage: 1,
      }).sort({ createdAt: -1 }).limit(5000).lean()

      const headers = ['id', 'title', 'slug', 'city',
        'hasCardImage', 'hasHeroImage', 'cardIsCloudinary', 'heroIsCloudinary', 'cardUrl', 'heroUrl']
      const rows = temples.map((t: any) => {
        const card = t.imageCard || t.image || ''
        const hero = t.imageHero || t.heroImage || ''
        return [
          String(t._id), t.title, t.slug, t.city ?? '',
          hasVal(card), hasVal(hero),
          isCloudinary(card), isCloudinary(hero),
          card, hero,
        ]
      })
      return csvResponse(`sarvdev-images-report-${Date.now()}.csv`, toCsv(headers, rows))
    }

    // ── Location Report ───────────────────────────────────────────────────────
    if (type === 'location') {
      const temples = await Temple.find(BASE_MATCH, {
        title: 1, slug: 1, city: 1, state: 1, country: 1,
        latitude: 1, longitude: 1, streetAddress: 1,
      }).sort({ createdAt: -1 }).limit(5000).lean()

      const headers = ['id', 'title', 'slug', 'city', 'state', 'country',
        'latitude', 'longitude', 'hasLatitude', 'hasLongitude', 'isValidCoords', 'streetAddress']
      const rows = temples.map((t: any) => [
        String(t._id), t.title, t.slug, t.city ?? '', t.state ?? '', t.country ?? 'India',
        t.latitude ?? '', t.longitude ?? '',
        hasVal(t.latitude) && t.latitude !== 0,
        hasVal(t.longitude) && t.longitude !== 0,
        isValidCoord(t.latitude, t.longitude),
        t.streetAddress ?? '',
      ])
      return csvResponse(`sarvdev-location-report-${Date.now()}.csv`, toCsv(headers, rows))
    }

    // ── Duplicates Report ─────────────────────────────────────────────────────
    if (type === 'duplicates') {
      const [slugDups, titleCityDups, coordDups] = await Promise.all([
        Temple.aggregate([
          { $match: { ...BASE_MATCH, slug: { $nin: [null, ''] } } },
          { $group: { _id: '$slug', count: { $sum: 1 }, titles: { $push: '$title' }, ids: { $push: '$_id' } } },
          { $match: { count: { $gt: 1 } } },
          { $sort: { count: -1 } }, { $limit: 200 },
        ]),
        Temple.aggregate([
          { $match: { ...BASE_MATCH, title: { $nin: [null, ''] }, city: { $nin: [null, ''] } } },
          { $group: { _id: { title: '$title', city: '$city' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
          { $match: { count: { $gt: 1 } } },
          { $sort: { count: -1 } }, { $limit: 200 },
        ]),
        Temple.aggregate([
          { $match: { ...BASE_MATCH, latitude: { $nin: [null, 0] }, longitude: { $nin: [null, 0] } } },
          { $group: {
            _id: { lat: { $round: [{ $toDouble: '$latitude' }, 4] }, lng: { $round: [{ $toDouble: '$longitude' }, 4] } },
            count: { $sum: 1 }, titles: { $push: '$title' }, ids: { $push: '$_id' },
          }},
          { $match: { count: { $gt: 1 } } },
          { $sort: { count: -1 } }, { $limit: 200 },
        ]),
      ])

      const headers = ['duplicateType', 'key', 'count', 'ids', 'titles']
      const rows: any[][] = [
        ...slugDups.map((d: any) => ['slug', d._id, d.count, d.ids.join('|'), d.titles.join('|')]),
        ...titleCityDups.map((d: any) => ['title+city', `${d._id.title} / ${d._id.city}`, d.count, d.ids.join('|'), '']),
        ...coordDups.map((d: any) => ['coordinates', `${d._id.lat},${d._id.lng}`, d.count, d.ids.join('|'), d.titles.join('|')]),
      ]
      return csvResponse(`sarvdev-duplicates-report-${Date.now()}.csv`, toCsv(headers, rows))
    }

    return new NextResponse('Unknown type', { status: 400 })
  } catch (err: any) {
    console.error('[data-quality/export]', err?.message)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
