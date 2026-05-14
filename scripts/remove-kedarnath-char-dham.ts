import { connectDB } from '../lib/db'
import Temple from '../models/Temple'

async function removeKedarnathFromCharDham() {
  try {
    await connectDB()
    
    // Find Kedarnath temple by title or slug
    const temple = await Temple.findOne({ 
      $or: [
        { title: /kedarnath/i },
        { slug: 'kedarnath-temple' }
      ]
    })
    
    if (!temple) {
      console.log('❌ Kedarnath temple not found')
      process.exit(1)
    }
    
    console.log('🔍 Found temple:', temple.title)
    console.log('📋 Current sacredCategories:', temple.sacredCategories)
    
    // Remove "Char Dham" from sacredCategories
    if (temple.sacredCategories && temple.sacredCategories.includes('Char Dham')) {
      temple.sacredCategories = temple.sacredCategories.filter(cat => cat !== 'Char Dham')
      await temple.save()
      console.log('✅ Removed "Char Dham" from sacredCategories')
      console.log('📋 Updated sacredCategories:', temple.sacredCategories)
    } else {
      console.log('ℹ️  "Char Dham" not found in sacredCategories')
    }
    
    console.log('\n🎉 Kedarnath temple updated successfully!')
    console.log('📌 Temple still exists in database with ID:', temple._id)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

removeKedarnathFromCharDham()
