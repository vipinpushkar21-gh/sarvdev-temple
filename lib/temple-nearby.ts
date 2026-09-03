import mongoose from 'mongoose'
import Temple from '@/models/Temple'
import { publicTempleFilter } from '@/lib/temple-discovery'

export type NearbyTemple = {
  _id: string
  title: string
  slug?: string
  city?: string
  district?: string
  state?: string
  deity?: string
  distanceKm: number
  distanceBucket: string
}

/**
 * Great-circle distance ranking over stored latitude/longitude. Bounded to a 50 km
 * radius and a small result set; no geo index is required at the current scale.
 */
export async function findNearbyTemples(params: {
  lat: number
  lng: number
  excludeSlug?: string
  excludeId?: string
  limit?: number
}): Promise<NearbyTemple[]> {
  const latRad = (params.lat * Math.PI) / 180
  const lngRad = (params.lng * Math.PI) / 180
  const and: Record<string, unknown>[] = [
    publicTempleFilter(),
    {
      latitude: { $type: 'number', $gte: -90, $lte: 90 },
      longitude: { $type: 'number', $gte: -180, $lte: 180 },
    },
  ]

  if (params.excludeSlug) and.push({ slug: { $ne: params.excludeSlug } })
  if (params.excludeId && mongoose.Types.ObjectId.isValid(params.excludeId)) {
    and.push({ _id: { $ne: new mongoose.Types.ObjectId(params.excludeId) } })
  }

  const cosineExpression = {
    $add: [
      { $multiply: [{ $sin: { $degreesToRadians: '$latitude' } }, Math.sin(latRad)] },
      {
        $multiply: [
          { $cos: { $degreesToRadians: '$latitude' } },
          Math.cos(latRad),
          { $cos: { $subtract: [{ $degreesToRadians: '$longitude' }, lngRad] } },
        ],
      },
    ],
  }

  const distanceExpression = {
    $multiply: [6371, { $acos: { $min: [1, { $max: [-1, cosineExpression] }] } }],
  }

  const rows = await Temple.aggregate([
    { $match: { $and: and } },
    { $addFields: { distanceKm: distanceExpression } },
    { $match: { distanceKm: { $gt: 0.01, $lte: 50 } } },
    { $sort: { distanceKm: 1 } },
    { $limit: Math.min(12, Math.max(1, params.limit || 6)) },
    {
      $project: {
        title: 1,
        slug: 1,
        image: 1,
        imageCard: 1,
        imageHero: 1,
        heroImage: 1,
        city: 1,
        district: 1,
        state: 1,
        deity: 1,
        distanceKm: { $round: ['$distanceKm', 1] },
        distanceBucket: {
          $switch: {
            branches: [
              { case: { $lte: ['$distanceKm', 10] }, then: 'within 10 km' },
              { case: { $lte: ['$distanceKm', 25] }, then: 'within 25 km' },
              { case: { $lte: ['$distanceKm', 50] }, then: 'within 50 km' },
            ],
            default: 'within 50 km',
          },
        },
      },
    },
  ])

  return JSON.parse(JSON.stringify(rows)) as NearbyTemple[]
}
