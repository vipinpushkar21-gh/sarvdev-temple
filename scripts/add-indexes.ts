/**
 * Database Index Migration Script
 * Run: npx tsx scripts/add-indexes.ts
 *
 * Creates all required indexes for optimal query performance.
 * Safe to re-run — createIndex is idempotent.
 */

import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* .env.local may not exist if env vars are set externally */ }

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is required. Set it in .env.local')
  process.exit(1)
}

async function createIndexes() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI!)
  const db = mongoose.connection.db!
  console.log('✓ Connected\n')

  // ── Temple ──
  const temples = db.collection('temples')
  await temples.createIndex({ status: 1, createdAt: -1 }, { name: 'status_created' })
  await temples.createIndex(
    { title: 'text', city: 'text', state: 'text', deity: 'text', speciality: 'text' },
    { name: 'temple_text_search' }
  )
  await temples.createIndex({ latitude: 1, longitude: 1 }, { name: 'geo_coords', sparse: true })
  await temples.createIndex({ categories: 1 }, { name: 'categories' })
  console.log('✓ Temple indexes (4)')

  // ── Devotional ──
  const devotionals = db.collection('devotionals')
  await devotionals.createIndex({ status: 1, category: 1 }, { name: 'status_category' })
  await devotionals.createIndex({ status: 1, createdAt: -1 }, { name: 'status_created' })
  await devotionals.createIndex({ title: 'text', deity: 'text' }, { name: 'devotional_text_search' })
  console.log('✓ Devotional indexes (3)')

  // ── Blog ──
  const blogs = db.collection('blogs')
  await blogs.createIndex({ status: 1, createdAt: -1 }, { name: 'status_created' })
  await blogs.createIndex({ slug: 1 }, { name: 'slug_unique', unique: true, sparse: true })
  console.log('✓ Blog indexes (2)')

  // ── User ──
  const users = db.collection('users')
  // email unique index is created by Mongoose schema, but ensure it exists
  await users.createIndex({ email: 1 }, { name: 'email_unique', unique: true })
  await users.createIndex({ role: 1, status: 1 }, { name: 'role_status' })
  console.log('✓ User indexes (2)')

  // ── Event ──
  const events = db.collection('events')
  await events.createIndex({ status: 1, date: 1 }, { name: 'status_date' })
  console.log('✓ Event indexes (1)')

  // ── Darshan ──
  const darshans = db.collection('darshans')
  await darshans.createIndex({ status: 1, createdAt: -1 }, { name: 'status_created' })
  console.log('✓ Darshan indexes (1)')

  // ── Visitor (with 90-day TTL auto-cleanup) ──
  const visitors = db.collection('visitors')
  await visitors.createIndex(
    { timestamp: 1 },
    { name: 'ttl_90days', expireAfterSeconds: 90 * 24 * 3600 }
  )
  await visitors.createIndex({ page: 1, timestamp: -1 }, { name: 'page_time' })
  console.log('✓ Visitor indexes (2) — includes 90-day TTL')

  // ── ForumPost ──
  const forum = db.collection('forumposts')
  await forum.createIndex({ isApproved: 1, createdAt: -1 }, { name: 'approved_created' })
  await forum.createIndex({ category: 1 }, { name: 'category' })
  console.log('✓ ForumPost indexes (2)')

  // ── Review ──
  const reviews = db.collection('reviews')
  await reviews.createIndex({ templeSlug: 1 }, { name: 'temple_slug' })
  console.log('✓ Review indexes (1)')

  // ── ActivityLog ──
  const logs = db.collection('activitylogs')
  await logs.createIndex({ timestamp: -1 }, { name: 'timestamp_desc' })
  console.log('✓ ActivityLog indexes (1)')

  console.log('\n✅ All 19 indexes created successfully')
  await mongoose.disconnect()
  console.log('Disconnected.')
}

createIndexes().catch((err) => {
  console.error('❌ Index creation failed:', err)
  process.exit(1)
})
