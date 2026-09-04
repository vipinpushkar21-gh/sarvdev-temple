/**
 * Non-destructive Mantra subcategory migration.
 * Preview: npx tsx scripts/migrate-mantra-subcategories.ts
 * Apply:   npx tsx scripts/migrate-mantra-subcategories.ts --execute
 */
import 'dotenv/config'
import { connectDB } from '../lib/db'
import Devotional from '../models/Devotional'
import { isValidMantraSubcategory, type MantraSubcategory } from '../lib/mantra-subcategories'

const DEITY_MAPPING: Record<string, MantraSubcategory> = {
  ganesh: 'गणेश', ganesha: 'गणेश', ganpati: 'गणेश',
  shiv: 'शिव व रुद्र', shiva: 'शिव व रुद्र', rudra: 'शिव व रुद्र', mahadev: 'शिव व रुद्र',
  vishnu: 'विष्णु, राम व कृष्ण', ram: 'विष्णु, राम व कृष्ण', rama: 'विष्णु, राम व कृष्ण', krishna: 'विष्णु, राम व कृष्ण',
  durga: 'दुर्गा व शक्ति', parvati: 'दुर्गा व शक्ति', kali: 'दुर्गा व शक्ति', shakti: 'दुर्गा व शक्ति', katyayani: 'दुर्गा व शक्ति',
  lakshmi: 'लक्ष्मी', saraswati: 'सरस्वती', hanuman: 'हनुमान',
  surya: 'सूर्य व नवग्रह', navgrah: 'सूर्य व नवग्रह', navagraha: 'सूर्य व नवग्रह',
  kuber: 'कुबेर', kubera: 'कुबेर', 'vastu purusha': 'वास्तु व गृह शांति', vastu: 'वास्तु व गृह शांति',
}

async function main() {
  const execute = process.argv.includes('--execute')
  await connectDB()
  const records = await Devotional.find({ category: 'Mantra' }).lean()
  let mapped = 0
  let review = 0

  for (const record of records) {
    if (isValidMantraSubcategory(record.subcategory)) continue
    const deityKey = String(record.deity || '').trim().toLowerCase()
    const mappedValue = DEITY_MAPPING[deityKey]
    if (mappedValue) mapped++
    else review++
    console.log(`${execute ? 'APPLY' : 'PREVIEW'} ${record._id}: ${record.title} -> ${mappedValue || 'REVIEW REQUIRED'}`)
    if (execute && mappedValue) {
      await Devotional.updateOne(
        { _id: record._id },
        { $set: { subcategory: mappedValue, subcategoryReviewRequired: false }, $unset: { subcategoryReviewReason: 1 } },
      )
    } else if (execute) {
      await Devotional.updateOne(
        { _id: record._id },
        { $set: { subcategoryReviewRequired: true, subcategoryReviewReason: 'Legacy Mantra subcategory could not be mapped confidently' } },
      )
    }
  }

  console.log(`${execute ? 'Applied' : 'Previewed'}: ${mapped} mapped, ${review} flagged for review; no records deleted.`)
  await Devotional.db.close()
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
