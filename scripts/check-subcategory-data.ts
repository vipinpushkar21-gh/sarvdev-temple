/**
 * Script to check subcategory data in the database
 * Run with: npx tsx scripts/check-subcategory-data.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'
import Devotional from '../models/Devotional'

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function checkSubcategoryData() {
  try {
    // Connect to MongoDB directly
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env.local')
    }
    await mongoose.connect(mongoUri)
    console.log('✓ Connected to MongoDB')

    // Find all Aarti devotionals
    const aartiDevotionals = await Devotional.find({ category: 'Aarti' }, { title: 1, subcategory: 1 }).lean()
    console.log(`\nFound ${aartiDevotionals.length} Aarti devotionals`)

    // Check subcategory distribution
    const subcategoryCounts = new Map<string, number>()
    const withoutSubcategory: string[] = []

    for (const devotional of aartiDevotionals) {
      if (devotional.subcategory) {
        subcategoryCounts.set(devotional.subcategory, (subcategoryCounts.get(devotional.subcategory) || 0) + 1)
        console.log(`✓ "${devotional.title}" → ${devotional.subcategory}`)
      } else {
        withoutSubcategory.push(devotional.title)
        console.log(`⚠ "${devotional.title}" → NO SUBCATEGORY`)
      }
    }

    console.log(`\n=== Subcategory Distribution ===`)
    for (const [subcategory, count] of Array.from(subcategoryCounts.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`${subcategory}: ${count}`)
    }

    if (withoutSubcategory.length > 0) {
      console.log(`\n=== Without Subcategory (${withoutSubcategory.length}) ===`)
      withoutSubcategory.forEach(title => console.log(`- ${title}`))
    }

  } catch (error) {
    console.error('Error checking subcategory data:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n✓ Disconnected from MongoDB')
  }
}

checkSubcategoryData()
