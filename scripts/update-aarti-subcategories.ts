/**
 * Migration script to update Aarti devotionals with subcategory field
 * Run with: npx tsx scripts/update-aarti-subcategories.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import Devotional from '../models/Devotional'
import { AARTI_SUBCATEGORY_MAPPING } from '../data/aarti-subcategory-mapping'

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function updateAartiSubcategories() {
  try {
    // Connect to MongoDB directly
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local')
    }
    await mongoose.connect(mongoUri)
    console.log('✓ Connected to MongoDB')

    // Find all Aarti devotionals
    const aartiDevotionals = await Devotional.find({ category: 'Aarti' })
    console.log(`\nFound ${aartiDevotionals.length} Aarti devotionals`)

    let updatedCount = 0
    let notFoundCount = 0

    for (const devotional of aartiDevotionals) {
      const subcategory = AARTI_SUBCATEGORY_MAPPING[devotional.title]
      
      if (subcategory) {
        await Devotional.findByIdAndUpdate(devotional._id, { subcategory })
        console.log(`✓ Updated: "${devotional.title}" → ${subcategory}`)
        updatedCount++
      } else {
        console.log(`⚠ No mapping found: "${devotional.title}"`)
        notFoundCount++
      }
    }

    console.log(`\n=== Summary ===`)
    console.log(`Total Aarti devotionals: ${aartiDevotionals.length}`)
    console.log(`Updated with subcategory: ${updatedCount}`)
    console.log(`No mapping found: ${notFoundCount}`)

  } catch (error) {
    console.error('Error updating Aarti subcategories:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n✓ Disconnected from MongoDB')
  }
}

updateAartiSubcategories()
