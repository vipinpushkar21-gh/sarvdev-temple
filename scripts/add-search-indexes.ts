/**
 * SARVDEV Phase 5.2 — Search Index Hardening
 * scripts/add-search-indexes.ts
 *
 * Run:  npx tsx scripts/add-search-indexes.ts
 *       npx tsx scripts/add-search-indexes.ts --audit-only   (print audit, no writes)
 *       npx tsx scripts/add-search-indexes.ts --dry-run      (alias for --audit-only)
 *
 * Rules:
 *  ✓ createIndex is idempotent — safe to re-run at any time.
 *  ✓ Text indexes: only created if the collection has NO text index yet.
 *    If one already exists, a warning is printed and the operation is skipped.
 *    To replace an outdated text index, drop it manually first:
 *      db.<collection>.dropIndex('<index_name>')
 *  ✗ Never drops or modifies existing indexes automatically.
 *  ✗ Never modifies documents.
 */

import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load .env.local ───────────────────────────────────────────────────────────
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
} catch { /* env vars may be set externally */ }

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is required. Set it in .env.local')
  process.exit(1)
}

const AUDIT_ONLY =
  process.argv.includes('--audit-only') || process.argv.includes('--dry-run')

// ── Helpers ───────────────────────────────────────────────────────────────────

type IndexInfo = { name: string; key: Record<string, any>; unique?: boolean; sparse?: boolean }

async function getIndexes(col: mongoose.mongo.Collection): Promise<IndexInfo[]> {
  const raw = await col.indexes()
  return raw.map((idx: any) => ({
    name: idx.name as string,
    key:  idx.key  as Record<string, any>,
    unique: idx.unique ?? false,
    sparse: idx.sparse ?? false,
  }))
}

function hasTextIndex(indexes: IndexInfo[]): IndexInfo | undefined {
  return indexes.find((idx) => Object.values(idx.key).includes('text'))
}

type CreateResult = 'created' | 'exists' | 'skipped' | 'error'

async function safeCreate(
  col: mongoose.mongo.Collection,
  key: Record<string, any>,
  options: Record<string, any>,
  dryRun: boolean
): Promise<CreateResult> {
  if (dryRun) return 'skipped'
  try {
    await col.createIndex(key as any, options)
    return 'created'
  } catch (err: any) {
    // Code 85 = IndexOptionsConflict, 86 = IndexKeySpecsConflict
    // Both mean an equivalent index already exists
    if (err?.code === 85 || err?.code === 86 || /already exists/i.test(err?.message ?? '')) {
      return 'exists'
    }
    console.error(`  ⚠  createIndex failed [${options.name}]: ${err?.message}`)
    return 'error'
  }
}

async function safeCreateTextIndex(
  col: mongoose.mongo.Collection,
  key: Record<string, 'text'>,
  options: Record<string, any>,
  existingIndexes: IndexInfo[],
  dryRun: boolean
): Promise<CreateResult> {
  const existing = hasTextIndex(existingIndexes)
  if (existing) {
    const fields = Object.keys(existing.key).join(', ')
    console.log(`  ℹ  Text index already exists [${existing.name}] on fields: ${fields}`)
    console.log(`     To upgrade: db.${col.collectionName}.dropIndex('${existing.name}') then re-run.`)
    return 'exists'
  }
  return safeCreate(col, key as any, options, dryRun)
}

// ── Reporting ─────────────────────────────────────────────────────────────────

type CollectionReport = {
  collection: string
  existing: IndexInfo[]
  created: string[]
  skipped: string[]
  alreadyExists: string[]
  errors: string[]
}

function printReport(reports: CollectionReport[]) {
  console.log('\n' + '═'.repeat(70))
  console.log('  SARVDEV Phase 5.2 — Search Index Hardening — Final Report')
  console.log('═'.repeat(70))

  let totalCreated = 0
  let totalExisting = 0
  let totalErrors = 0

  for (const r of reports) {
    console.log(`\n┌─ ${r.collection.toUpperCase()}`)
    console.log(`│  Existing indexes (${r.existing.length}):`)
    for (const idx of r.existing) {
      const keyStr = Object.entries(idx.key).map(([k, v]) => `${k}:${v}`).join(', ')
      const flags = [idx.unique && 'unique', idx.sparse && 'sparse'].filter(Boolean).join(' ')
      console.log(`│    • ${idx.name.padEnd(42)} { ${keyStr} } ${flags}`)
    }
    if (r.created.length) {
      console.log(`│  ✅ Created (${r.created.length}): ${r.created.join(', ')}`)
      totalCreated += r.created.length
    }
    if (r.alreadyExists.length) {
      console.log(`│  ✓  Already existed: ${r.alreadyExists.join(', ')}`)
      totalExisting += r.alreadyExists.length
    }
    if (r.skipped.length) {
      console.log(`│  ⏩ Dry-run skipped: ${r.skipped.join(', ')}`)
    }
    if (r.errors.length) {
      console.log(`│  ❌ Errors: ${r.errors.join(', ')}`)
      totalErrors += r.errors.length
    }
    console.log('└' + '─'.repeat(68))
  }

  console.log(`\nSummary: ${totalCreated} created, ${totalExisting} already existed, ${totalErrors} errors`)
  if (AUDIT_ONLY) console.log('(Dry-run / audit-only — no indexes were written)')
  console.log('═'.repeat(70) + '\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🔗  Connecting to MongoDB…`)
  await mongoose.connect(MONGODB_URI!)
  const db = mongoose.connection.db!
  console.log(`✓   Connected  ${AUDIT_ONLY ? '(AUDIT ONLY — no writes)' : ''}`)

  const reports: CollectionReport[] = []

  // ── Helper to record results ─────────────────────────────────────────────
  async function addIndex(
    report: CollectionReport,
    col: mongoose.mongo.Collection,
    key: Record<string, any>,
    options: Record<string, any>
  ) {
    const result = await safeCreate(col, key, options, AUDIT_ONLY)
    if      (result === 'created')  report.created.push(options.name)
    else if (result === 'exists')   report.alreadyExists.push(options.name)
    else if (result === 'skipped')  report.skipped.push(options.name)
    else if (result === 'error')    report.errors.push(options.name)
  }

  async function addTextIndex(
    report: CollectionReport,
    col: mongoose.mongo.Collection,
    key: Record<string, 'text'>,
    options: Record<string, any>,
    existing: IndexInfo[]
  ) {
    const result = await safeCreateTextIndex(col, key, options, existing, AUDIT_ONLY)
    if      (result === 'created')  report.created.push(options.name)
    else if (result === 'exists')   report.alreadyExists.push(options.name)
    else if (result === 'skipped')  report.skipped.push(options.name)
    else if (result === 'error')    report.errors.push(options.name)
  }

  // ════════════════════════════════════════════════════════════════════
  // 1. TEMPLE
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('temples')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'temples', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Compound: status + search fields ──
    await addIndex(r, col, { status: 1, titleNormalized: 1 },
      { name: 'status_titleNormalized' })

    await addIndex(r, col, { status: 1, cityNormalized: 1 },
      { name: 'status_cityNormalized' })

    // status + stateNormalized is a PREFIX of the existing
    // { status, stateNormalized, cityNormalized } index, so skip it.
    // Adding it would be redundant.

    // ── Text index (upgrade: add titleHi, titleNormalized, district) ──
    await addTextIndex(r, col,
      {
        title:           'text',
        titleHi:         'text',
        titleNormalized: 'text',
        deity:           'text',
        city:            'text',
        state:           'text',
        district:        'text',
        speciality:      'text',
      },
      {
        name: 'temple_search_text_v2',
        weights: {
          title:           10,
          titleHi:         9,
          titleNormalized: 8,
          deity:           6,
          speciality:      4,
          district:        3,
          city:            3,
          state:           2,
        },
        default_language: 'none',  // avoid English stemming on Hindi content
      },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 2. DEITY
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('deities')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'deities', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Single field: status ──
    await addIndex(r, col, { status: 1 },
      { name: 'status' })

    // ── Array field: aliases ──
    await addIndex(r, col, { aliases: 1 },
      { name: 'aliases', sparse: true })

    // ── Compound indexes ──
    await addIndex(r, col, { status: 1, categorySlug: 1 },
      { name: 'status_categorySlug' })

    await addIndex(r, col, { status: 1, order: 1 },
      { name: 'status_order' })

    // ── Text index (new — no text index exists on this collection) ──
    await addTextIndex(r, col,
      {
        name:         'text',
        nameHi:       'text',
        aliases:      'text',
        description:  'text',
        categoryName: 'text',
      },
      {
        name: 'deity_search_text',
        weights: {
          name:         10,
          nameHi:       10,
          aliases:      8,
          categoryName: 4,
          description:  2,
        },
        default_language: 'none',
      },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 3. DEVOTIONAL
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('devotionals')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'devotionals', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Compound: status + slug for fast slug lookup ──
    await addIndex(r, col, { status: 1, slug: 1 },
      { name: 'status_slug', sparse: true })

    // ── Text index (upgrade: add titleHi, category to existing title+deity) ──
    await addTextIndex(r, col,
      {
        title:       'text',
        titleHi:     'text',
        deity:       'text',
        category:    'text',
        categorySlug:'text',
      },
      {
        name: 'devotional_search_text_v2',
        weights: {
          title:       10,
          titleHi:     9,
          deity:       6,
          category:    4,
          categorySlug: 3,
        },
        default_language: 'none',
        language_override: '_textLang',
      },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 4. BLOG
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('blogs')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'blogs', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Compound indexes ──
    await addIndex(r, col, { status: 1, category: 1, createdAt: -1 },
      { name: 'status_category_created' })

    await addIndex(r, col, { status: 1, featured: 1, createdAt: -1 },
      { name: 'status_featured_created' })

    // ── Text index (new — none exists) ──
    await addTextIndex(r, col,
      {
        title:    'text',
        titleHi:  'text',
        excerpt:  'text',
        category: 'text',
      },
      {
        name: 'blog_search_text',
        weights: {
          title:    10,
          titleHi:  9,
          excerpt:  4,
          category: 3,
        },
        default_language: 'none',
      },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 5. EVENT
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('events')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'events', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Single field ──
    await addIndex(r, col, { status: 1 },
      { name: 'status' })

    await addIndex(r, col, { category: 1 },
      { name: 'category', sparse: true })

    await addIndex(r, col, { deitySlug: 1 },
      { name: 'deitySlug', sparse: true })

    // ── Compound indexes ──
    await addIndex(r, col, { status: 1, createdAt: -1 },
      { name: 'status_created' })

    await addIndex(r, col, { status: 1, deitySlug: 1 },
      { name: 'status_deitySlug', sparse: true })

    await addIndex(r, col, { status: 1, category: 1, date: 1 },
      { name: 'status_category_date', sparse: true })

    // ── Text index (new — none exists) ──
    await addTextIndex(r, col,
      {
        title:       'text',
        titleHi:     'text',
        description: 'text',
        category:    'text',
        city:        'text',
        state:       'text',
      },
      {
        name: 'event_search_text',
        weights: {
          title:       10,
          titleHi:     9,
          category:    5,
          description: 3,
          city:        3,
          state:       2,
        },
        default_language: 'none',
      },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 6. SPIRITUAL ICON (already has full text index)
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('spiritualicons')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'spiritualicons', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Compound for featured listing ──
    await addIndex(r, col, { status: 1, featured: 1, priority: 1 },
      { name: 'status_featured_priority' })

    await addIndex(r, col, { status: 1, categorySlug: 1 },
      { name: 'status_categorySlug' })

    // Text index already exists in schema — addTextIndex will detect and skip
    await addTextIndex(r, col,
      {
        name:      'text',
        nameHi:    'text',
        title:     'text',
        shortBio:  'text',
        state:     'text',
        city:      'text',
        category:  'text',
      },
      { name: 'spiritualicon_search_text' },
      existing
    )

    reports.push(r)
  }

  // ════════════════════════════════════════════════════════════════════
  // 7. DARSHAN (no indexes defined in schema currently)
  // ════════════════════════════════════════════════════════════════════
  {
    const col = db.collection('darshans')
    const existing = await getIndexes(col)
    const r: CollectionReport = { collection: 'darshans', existing, created: [], skipped: [], alreadyExists: [], errors: [] }

    // ── Single field ──
    await addIndex(r, col, { status: 1 },
      { name: 'status' })

    await addIndex(r, col, { templeSlug: 1 },
      { name: 'templeSlug', sparse: true })

    await addIndex(r, col, { deitySlug: 1 },
      { name: 'deitySlug', sparse: true })

    // ── Compound ──
    await addIndex(r, col, { status: 1, featured: 1, priority: 1 },
      { name: 'status_featured_priority' })

    await addIndex(r, col, { status: 1, templeSlug: 1 },
      { name: 'status_templeSlug', sparse: true })

    // ── Text index (new — none exists) ──
    await addTextIndex(r, col,
      {
        title:    'text',
        temple:   'text',
        location: 'text',
        city:     'text',
        state:    'text',
      },
      {
        name: 'darshan_search_text',
        weights: {
          title:    10,
          temple:   7,
          location: 4,
          city:     3,
          state:    2,
        },
        default_language: 'none',
      },
      existing
    )

    reports.push(r)
  }

  // ── Print report ─────────────────────────────────────────────────────────
  printReport(reports)

  await mongoose.disconnect()
  console.log('Disconnected.\n')
}

run().catch((err) => {
  console.error('\n❌  Script failed:', err?.message ?? err)
  process.exit(1)
})
