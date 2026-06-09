// app/api/admin/devotionals/migrate/route.ts
// v4-plain-objects — fills only missing canonical fields, never overwrites content.
//
//   GET  /api/admin/devotionals/migrate                          — dry-run
//   POST /api/admin/devotionals/migrate                          — full migration
//   POST /api/admin/devotionals/migrate?testOne=1                — preview single op (no write)
//   POST /api/admin/devotionals/migrate?testOne=1&applyTest=1    — write one record only
//
// Safe fields:   slug, categorySlug, categoryHi, deitySlug (confident only), source
// Protected:     title, titleHi, content, lyrics, audioUrl, audio, images, isCustomized

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Devotional from '@/models/Devotional'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { getCategoryByName, categoryNameToSlug } from '@/lib/devotional-categories'

const ROUTE_VERSION = 'devotional-migrate-v4-plain-objects'
const BATCH_SIZE = 50

// ── Auth ─────────────────────────────────────────────────────────────────────
function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)?.role === 'admin'
}

// ── Slug helpers ─────────────────────────────────────────────────────────────
function createDevotionalSlug(title: string): string {
  if (!title) return ''
  const englishMatch = title.match(/\(([^)]+)\)/)
  const text = englishMatch ? englishMatch[1] : title
  const attempt = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (attempt) return attempt
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Deity aliases ─────────────────────────────────────────────────────────────
const DEITY_ALIASES: Record<string, string[]> = {
  shiva:      ['shiva', 'shiv', 'mahadev', 'bholenath', 'shankar', 'mahesh', 'neelkanth', 'rudra', 'mahadeva'],
  vishnu:     ['vishnu', 'narayan', 'hari', 'vaikuntha', 'narayana'],
  krishna:    ['krishna', 'kanha', 'gopal', 'govind', 'banke bihari', 'dwarkadhish', 'bal krishna', 'girdhar'],
  rama:       ['rama', 'ram', 'shri ram', 'sita ram', 'raghav', 'raghuvar', 'maryada purushottam'],
  hanuman:    ['hanuman', 'bajrangbali', 'maruti', 'anjaneya', 'pawan putra', 'sankat mochan'],
  ganesha:    ['ganesha', 'ganesh', 'ganpati', 'vinayak', 'vignaharta', 'lambodar', 'gajanand'],
  durga:      ['durga', 'ambe', 'jagdamba', 'bhawani', 'chamunda', 'sherawali', 'ambika'],
  lakshmi:    ['lakshmi', 'laxmi', 'mahalakshmi', 'mahalaxmi'],
  saraswati:  ['saraswati', 'sharada', 'vagdevi', 'bharati'],
  kali:       ['kali', 'mahakali', 'kaali'],
  parvati:    ['parvati', 'gauri', 'uma', 'bhavani', 'shakti'],
  'sai-baba': ['sai baba', 'shirdi sai', 'sai', 'sainath'],
  surya:      ['surya', 'sun god', 'aditya', 'bhaskar'],
  shani:      ['shani', 'shani dev', 'shanidev'],
  radha:      ['radha', 'radha rani', 'radhika'],
  subramanya: ['subramanya', 'murugan', 'kartikeya', 'skanda', 'kumara'],
}

function matchDeitySlug(deity: string): string | null {
  if (!deity) return null
  const normalized = deity
    .toLowerCase()
    .replace(/\b(lord|goddess|bhagwan|shri|sri|ji|maa|mata|dev|devi)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  if (!normalized) return null
  for (const slug of Object.keys(DEITY_ALIASES)) {
    const aliases = DEITY_ALIASES[slug]
    for (let ai = 0; ai < aliases.length; ai++) {
      if (normalized === aliases[ai]) return slug
    }
  }
  return null
}

// ── Build the plain fields object for one document ────────────────────────────
// Returns null if nothing needs updating.
// Result is a normal plain object ({}), never null-prototype.
function buildMissingFields(
  doc: Record<string, any>,
  existingSlugs: Set<string>,
  slugDuplicates: Array<{ id: string; title: string; slug: string }>
): Record<string, any> | null {
  const fields: Record<string, any> = {}   // plain {}  — important for BSON compat

  // slug
  if (!doc.slug) {
    const generated = createDevotionalSlug(String(doc.title || ''))
    if (!generated) {
      console.warn('[migrate] empty slug for id=' + String(doc._id))
    } else if (existingSlugs.has(generated)) {
      console.warn('[migrate] slug collision "' + generated + '" id=' + String(doc._id))
      slugDuplicates.push({ id: String(doc._id), title: String(doc.title || ''), slug: generated })
    } else {
      fields['slug'] = generated
      existingSlugs.add(generated)
    }
  }

  // categorySlug
  if (!doc.categorySlug && doc.category) {
    const cs = categoryNameToSlug(String(doc.category))
    if (cs) fields['categorySlug'] = cs
  }

  // categoryHi
  if (!doc.categoryHi && doc.category) {
    const cat = getCategoryByName(String(doc.category))
    if (cat && cat.nameHi) fields['categoryHi'] = cat.nameHi
  }

  // deitySlug
  if (!doc.deitySlug && doc.deity) {
    const matched = matchDeitySlug(String(doc.deity))
    if (matched) fields['deitySlug'] = matched
  }

  // source
  if (!doc.source && !doc.isCustomized) {
    fields['source'] = 'seed'
  }

  const meaningfulKeys = Object.keys(fields)
  if (meaningfulKeys.length === 0) return null

  fields['updatedAt'] = new Date()
  return fields
}

// ── Build a single validated bulkWrite op ────────────────────────────────────
// Uses plain object {} and explicit string key '$set' — never shorthand.
function makeUpdateOneOp(docId: any, setFields: Record<string, any>): Record<string, any> {
  // Plain object literal with explicit string key — no shorthand, no null-prototype
  const op: Record<string, any> = {
    updateOne: {
      filter: { _id: docId },
      update: { '$set': setFields },
    },
  }
  return op
}

// ── Validate every op before sending ─────────────────────────────────────────
function assertAllOps(ops: Record<string, any>[]): void {
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]
    if (!op || typeof op !== 'object') {
      throw new Error('[assertOps] op[' + i + '] is not an object')
    }
    if (!op['updateOne']) {
      throw new Error('[assertOps] op[' + i + '] missing updateOne key')
    }
    const update = op['updateOne']['update']
    if (!update || typeof update !== 'object') {
      throw new Error('[assertOps] op[' + i + '] update is missing or not an object')
    }
    if (!Object.prototype.hasOwnProperty.call(update, '$set')) {
      throw new Error(
        '[assertOps] op[' + i + '] update missing $set. Keys: [' +
        Object.keys(update).join(', ') + '] op=' + JSON.stringify(op)
      )
    }
    const setVal = update['$set']
    if (!setVal || typeof setVal !== 'object' || Array.isArray(setVal)) {
      throw new Error('[assertOps] op[' + i + '] $set value is invalid: ' + JSON.stringify(setVal))
    }
    if (Object.keys(setVal).length === 0) {
      throw new Error('[assertOps] op[' + i + '] $set value is empty object')
    }
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
type FailedRecord = {
  id: string
  title: string
  errorCode?: number | string
  errorMsg: string
}

// ── Main migration logic ──────────────────────────────────────────────────────
async function runMigration(dryRun: boolean) {
  const slugDocs = await Devotional.find(
    { slug: { '$exists': true, '$nin': [null, ''] } },
    'slug'
  ).lean() as unknown as Array<{ slug: string }>

  const existingSlugs = new Set<string>(slugDocs.map((d) => String(d.slug)))
  console.log('[migrate] v4 dryRun=' + dryRun + ' existingSlugs=' + existingSlugs.size)

  let skip = 0
  let batchNum = 0
  let totalProcessed = 0
  let totalUpdated = 0
  const slugDuplicates: Array<{ id: string; title: string; slug: string }> = []
  const changes: Array<{ id: string; title: string; fields: string[] }> = []
  const failedRecords: FailedRecord[] = []
  let firstOpPreview: Record<string, any> | null = null

  while (true) {
    batchNum++
    const batch = await Devotional.find(
      {},
      'title category deity slug categorySlug categoryHi deitySlug source isCustomized'
    )
      .sort({ _id: 1 })
      .skip(skip)
      .limit(BATCH_SIZE)
      .lean() as Array<Record<string, any>>

    if (batch.length === 0) break
    skip += BATCH_SIZE
    totalProcessed += batch.length
    console.log('[migrate] batch ' + batchNum + ': ' + batch.length + ' docs skip=' + (skip - BATCH_SIZE))

    const ops: any[] = []

    for (const doc of batch) {
      const setFields = buildMissingFields(doc, existingSlugs, slugDuplicates)
      if (!setFields) continue

      const meaningfulKeys = Object.keys(setFields).filter((k) => k !== 'updatedAt')
      const op = makeUpdateOneOp(doc['_id'], setFields)

      if (!firstOpPreview) {
        firstOpPreview = op
        console.log('[migrate] first op: ' + JSON.stringify(op, null, 2))
      }

      ops.push(op)
      changes.push({ id: String(doc['_id']), title: String(doc['title'] || ''), fields: meaningfulKeys })
    }

    if (!dryRun && ops.length > 0) {
      // Guard: assert every op has proper $set shape before any I/O
      assertAllOps(ops)

      try {
        const result = await Devotional.bulkWrite(ops as any[], { ordered: false })
        const modified = result.modifiedCount ?? (result as any).nModified ?? ops.length
        totalUpdated += modified
        console.log('[migrate] batch ' + batchNum + ' OK modified=' + modified)
      } catch (bulkErr: any) {
        const succeeded = bulkErr?.result?.modifiedCount ?? bulkErr?.result?.nModified ?? 0
        totalUpdated += succeeded
        const writeErrors: any[] = bulkErr?.writeErrors ?? bulkErr?.result?.writeErrors ?? []
        console.error('[migrate] batch ' + batchNum + ' bulkWrite threw: ' + String(bulkErr?.message))
        if (writeErrors.length > 0) {
          for (const we of writeErrors) {
            const idx: number = we?.index ?? -1
            const rec: FailedRecord = {
              id: String(ops[idx]?.updateOne?.filter?._id ?? 'unknown'),
              title: (idx >= 0 ? changes[changes.length - ops.length + idx]?.title : '') ?? 'unknown',
              errorCode: we?.code ?? we?.err?.code,
              errorMsg: we?.errmsg ?? we?.message ?? String(we),
            }
            console.error('[migrate] writeError[' + idx + ']: ' + JSON.stringify(we))
            failedRecords.push(rec)
          }
        } else {
          console.error('[migrate] raw error (no writeErrors): ' + String(bulkErr))
          failedRecords.push({
            id: 'batch-' + batchNum,
            title: 'batch ' + batchNum,
            errorMsg: String(bulkErr?.message ?? bulkErr),
          })
        }
      }
    } else if (dryRun) {
      totalUpdated += ops.length
    }
  }

  console.log(
    '[migrate] done processed=' + totalProcessed +
    ' updated=' + totalUpdated +
    ' collisions=' + slugDuplicates.length +
    ' failed=' + failedRecords.length
  )

  const firstOpUpdateKeys = firstOpPreview
    ? Object.keys(firstOpPreview['updateOne']?.update ?? {})
    : []
  const firstOpHasDollarSet = firstOpUpdateKeys.length > 0
    ? firstOpUpdateKeys.includes('$set')
    : null

  return {
    routeVersion: ROUTE_VERSION,
    totalProcessed,
    totalUpdated,
    slugDuplicates,
    failedRecords,
    changes: changes.slice(0, 20),
    firstOpPreview,
    firstOpUpdateKeys,
    firstOpHasDollarSet,
    batchCount: batchNum,
  }
}

// ── GET — dry-run ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const result = await runMigration(true)
    return NextResponse.json({ dryRun: true, ...result })
  } catch (err: any) {
    console.error('[migrate] GET error: ' + String(err?.message))
    return NextResponse.json(
      { routeVersion: ROUTE_VERSION, error: 'Dry-run failed', message: String(err?.message ?? err) },
      { status: 500 }
    )
  }
}

// ── POST — execute or test ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const testOne = url.searchParams.get('testOne') === '1'
  const applyTest = url.searchParams.get('applyTest') === '1'

  try {
    await connectDB()
  } catch (dbErr: any) {
    return NextResponse.json(
      { routeVersion: ROUTE_VERSION, error: 'DB connect failed', message: String(dbErr?.message ?? dbErr) },
      { status: 500 }
    )
  }

  // ── TEST MODE ──────────────────────────────────────────────────────────────
  if (testOne) {
    const testDoc = await Devotional.findOne(
      { '$or': [{ source: null }, { source: '' }, { source: { '$exists': false } }] }
    ).select('title source').lean() as Record<string, any> | null

    if (!testDoc) {
      return NextResponse.json({
        routeVersion: ROUTE_VERSION, testOne: true,
        message: 'No record with missing source — nothing to test with',
      })
    }

    // Plain object literal — guaranteed Object prototype
    const testSetFields: Record<string, any> = {
      source: 'migration-test',
      updatedAt: new Date(),
    }
    const testOp = makeUpdateOneOp(testDoc['_id'], testSetFields)

    // Assert shape
    assertAllOps([testOp])

    const preview = {
      routeVersion: ROUTE_VERSION,
      testOne: true,
      applyTest,
      recordId: String(testDoc['_id']),
      recordTitle: String(testDoc['title'] || ''),
      op: testOp,
      opUpdateKeys: Object.keys(testOp['updateOne']['update']),
      hasDollarSet: Object.prototype.hasOwnProperty.call(testOp['updateOne']['update'], '$set'),
    }

    if (!applyTest) {
      return NextResponse.json({ ...preview, applied: false, message: 'Preview only — add &applyTest=1 to write' })
    }

    try {
      const r = await Devotional.bulkWrite([testOp] as any[], { ordered: false })
      return NextResponse.json({
        ...preview, applied: true,
        modifiedCount: r.modifiedCount ?? (r as any).nModified ?? 0,
        message: 'Single test write succeeded.',
      })
    } catch (testErr: any) {
      return NextResponse.json({
        ...preview, applied: false,
        error: String(testErr?.message ?? testErr),
        message: 'Test write FAILED.',
      }, { status: 500 })
    }
  }

  // ── FULL MIGRATION ──────────────────────────────────────────────────────────
  try {
    const result = await runMigration(false)
    const hasFailures = result.failedRecords.length > 0
    return NextResponse.json(
      { dryRun: false, ...result },
      { status: hasFailures ? 207 : 200 }
    )
  } catch (err: any) {
    console.error('[migrate] POST full error: ' + String(err?.message))
    return NextResponse.json(
      { routeVersion: ROUTE_VERSION, error: 'Migration failed', message: String(err?.message ?? err) },
      { status: 500 }
    )
  }
}