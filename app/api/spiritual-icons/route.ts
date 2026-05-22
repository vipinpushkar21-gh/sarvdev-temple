import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { filterSpiritualIcons, getStaticSpiritualIconsForSeed, normalizeSpiritualIcon } from '@/lib/spiritual-icons'
import SpiritualIcon from '@/models/SpiritualIcon'

let cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 60_000

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    await connectDB()

    let records: any[]
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      records = cache.data
    } else {
      records = await SpiritualIcon.find({ status: 'active' }, { __v: 0 }).sort({ featured: -1, priority: 1, name: 1 }).lean()
      if (records.length === 0) {
        records = getStaticSpiritualIconsForSeed()
      }
      cache = { data: records, ts: Date.now() }
    }

    const normalized = records.map(normalizeSpiritualIcon)
    return NextResponse.json(filterSpiritualIcons(normalized, searchParams))
  } catch (error) {
    const fallback = filterSpiritualIcons(getStaticSpiritualIconsForSeed(), new URL(req.url).searchParams)
    return NextResponse.json(fallback)
  }
}
