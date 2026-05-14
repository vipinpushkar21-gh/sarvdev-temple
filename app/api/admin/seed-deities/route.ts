// POST /api/admin/seed-deities — Seed all static deities to database
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { deities } = body

    if (!deities || !Array.isArray(deities)) {
      return NextResponse.json({ error: 'Invalid deities data' }, { status: 400 })
    }

    let orderIndex = 0
    const results = []
    const batchSize = 10 // Process in batches to avoid timeouts

    for (let i = 0; i < deities.length; i += batchSize) {
      const batch = deities.slice(i, i + batchSize)
      
      for (const deity of batch) {
        try {
          // Check if deity already exists
          const existing = await Deity.findOne({ slug: deity.slug })
          
          if (existing) {
            // Update order if it exists
            existing.order = orderIndex
            existing.category = deity.category
            await existing.save()
            results.push({ slug: deity.slug, action: 'updated', order: orderIndex })
          } else {
            // Create new deity
            const newDeity = await Deity.create({
              ...deity,
              order: orderIndex,
              status: 'approved',
            })
            results.push({ slug: deity.slug, action: 'created', order: orderIndex })
          }
          orderIndex++
        } catch (error) {
          console.error(`Error processing deity ${deity.slug}:`, error)
          results.push({ slug: deity.slug, action: 'failed', error: error.message })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} deities`,
      results,
    })
  } catch (error) {
    console.error('Seed deities error:', error)
    return NextResponse.json({ error: 'Failed to seed deities', details: error.message }, { status: 500 })
  }
}
