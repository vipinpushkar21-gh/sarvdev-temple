/**
 * Safe Temple migration and integrity runner.
 *
 * Dry run:
 *   npx tsx scripts/migrate-temple-normalized-fields.ts
 *
 * Execute safe migration:
 *   npx tsx scripts/migrate-temple-normalized-fields.ts --apply
 *
 * This script only fills missing normalized fields. It does not create,
 * delete, rename, merge, or overwrite temple content.
 */

import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { runTempleIntegrity } from '../lib/temple-integrity'

try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  // Environment may already be provided by the runner.
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required')

  const apply = process.argv.includes('--apply')
  await mongoose.connect(uri)
  const report = await runTempleIntegrity({ apply, batchSize: 500 })
  console.log(JSON.stringify(report, null, 2))
  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error)
  try {
    await mongoose.disconnect()
  } catch {}
  process.exit(1)
})
