/**
 * GET /api/admin/data-quality/duplicates
 *
 * Read-only duplicate detection across all approved+pending temples.
 * Detects:
 *   1. Same slug
 *   2. Same title + city combination
 *   3. Same GPS coordinates (rounded to 4 decimal places, ~11m precision)
 *   4. Same maps URL (mapsLink / googleMapsUrl)
 *
 * Admin-only. Never modifies data.
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
const PROJ = { title: 1, slug: 1, city: 1, state: 1, status: 1 }

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [slugDups, titleCityDups, coordDups, mapsDups] = await Promise.all([

      // 1. Duplicate slugs
      Temple.aggregate([
        { $match: { ...BASE_MATCH, slug: { $nin: [null, ''] } } },
        { $group: {
          _id:    '$slug',
          count:  { $sum: 1 },
          ids:    { $push: '$_id' },
          titles: { $push: '$title' },
          cities: { $push: '$city' },
          statuses: { $push: '$status' },
        }},
        { $match: { count: { $gt: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 30 },
        { $project: { _id: 0, slug: '$_id', count: 1, ids: 1, titles: 1, cities: 1, statuses: 1 } },
      ]),

      // 2. Same title + city
      Temple.aggregate([
        { $match: { ...BASE_MATCH, title: { $nin: [null, ''] }, city: { $nin: [null, ''] } } },
        { $group: {
          _id:    { title: '$title', city: '$city' },
          count:  { $sum: 1 },
          ids:    { $push: '$_id' },
          slugs:  { $push: '$slug' },
          states: { $push: '$state' },
          statuses: { $push: '$status' },
        }},
        { $match: { count: { $gt: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 30 },
        { $project: {
          _id: 0,
          title:    '$_id.title',
          city:     '$_id.city',
          count: 1, ids: 1, slugs: 1, states: 1, statuses: 1,
        }},
      ]),

      // 3. Same coordinates (4 decimal places = ~11m precision)
      Temple.aggregate([
        { $match: {
          ...BASE_MATCH,
          latitude:  { $nin: [null, 0], $gte: -90,  $lte: 90  },
          longitude: { $nin: [null, 0], $gte: -180, $lte: 180 },
        }},
        { $group: {
          _id: {
            lat: { $round: [{ $toDouble: '$latitude'  }, 4] },
            lng: { $round: [{ $toDouble: '$longitude' }, 4] },
          },
          count:   { $sum: 1 },
          ids:     { $push: '$_id' },
          titles:  { $push: '$title' },
          slugs:   { $push: '$slug' },
          statuses: { $push: '$status' },
        }},
        { $match: { count: { $gt: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 20 },
        { $project: {
          _id: 0,
          lat:    '$_id.lat',
          lng:    '$_id.lng',
          count: 1, ids: 1, titles: 1, slugs: 1, statuses: 1,
        }},
      ]),

      // 4. Same maps URL (mapsLink or googleMapsUrl)
      Temple.aggregate([
        { $match: {
          ...BASE_MATCH,
          $or: [
            { mapsLink:     { $nin: [null, ''] } },
            { googleMapsUrl: { $nin: [null, ''] } },
          ],
        }},
        { $addFields: {
          _mapsUrl: { $ifNull: ['$mapsLink', '$googleMapsUrl'] },
        }},
        { $group: {
          _id:      '$_mapsUrl',
          count:    { $sum: 1 },
          ids:      { $push: '$_id' },
          titles:   { $push: '$title' },
          slugs:    { $push: '$slug' },
          statuses: { $push: '$status' },
        }},
        { $match: { count: { $gt: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 20 },
        { $project: {
          _id: 0, mapsUrl: '$_id', count: 1, ids: 1, titles: 1, slugs: 1, statuses: 1,
        }},
      ]),
    ])

    return NextResponse.json({
      slugDuplicates:       slugDups,
      titleCityDuplicates:  titleCityDups,
      coordDuplicates:      coordDups,
      mapsDuplicates:       mapsDups,
      summary: {
        slugGroups:       slugDups.length,
        titleCityGroups:  titleCityDups.length,
        coordGroups:      coordDups.length,
        mapsGroups:       mapsDups.length,
        totalGroups:      slugDups.length + titleCityDups.length + coordDups.length + mapsDups.length,
      },
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('[data-quality/duplicates]', err?.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
