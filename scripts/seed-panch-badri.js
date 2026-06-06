// scripts/seed-panch-badri.js
// Seeds the 5 Panch Badri temples into MongoDB.
// Usage:  node scripts/seed-panch-badri.js
//
// - Skips existing temples (matched by slug or title)
// - Never overwrites images or descriptions
// - Only creates missing records
// - Reports: created, skipped, failed

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

// ─── Load .env.local ──────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set. Add it to .env.local')
  process.exit(1)
}

// ─── Temple schema (matches models/Temple.ts) ─────────
const TempleSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  deity: String,
  templeType: String,
  sacredCategories: [String],
  categories: [String],
  description: String,
  descriptionHi: String,
  speciality: String,
  city: String,
  state: String,
  country: String,
  image: String,
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false })

const PANCH_BADRI_CATEGORY = 'Panch Badri'

const PANCH_BADRI_TEMPLES = [
  {
    title: 'Badrinath',
    slug: 'badrinath-vishal-badri',
    deity: 'Lord Vishnu',
    templeType: 'Sacred Temple',
    sacredCategories: ['Panch Badri', 'Char Dham', 'Chota Char Dham (Uttarakhand)'],
    city: 'Badrinath, Chamoli District',
    state: 'Uttarakhand',
    country: 'India',
    description: 'Badrinath, also known as Vishal Badri, is the most important and principal temple among the Panch Badri shrines. Dedicated to Lord Vishnu, it is one of the four sacred Char Dham pilgrimage sites and one of the most revered temples in Hinduism. Located on the banks of the Alaknanda River in Chamoli district, the temple attracts millions of devotees seeking liberation and divine blessings.',
    descriptionHi: 'बद्रीनाथ, जिसे विशाल बद्री भी कहा जाता है, पंच बद्री में सबसे प्रमुख और मुख्य मंदिर है। यह भगवान विष्णु को समर्पित है तथा हिंदुओं की प्रसिद्ध चार धाम यात्रा का एक महत्वपूर्ण भाग है। चमोली जिले में अलकनंदा नदी के किनारे स्थित यह मंदिर मोक्ष और भगवान विष्णु की कृपा प्राप्त करने के लिए अत्यंत पवित्र माना जाता है।',
    speciality: 'Main Panch Badri temple and Char Dham pilgrimage site.',
    alternateNames: ['Vishal Badri', 'Badrinath Temple'],
  },
  {
    title: 'Yogadhyan Badri',
    slug: 'yogadhyan-badri',
    deity: 'Lord Vishnu',
    templeType: 'Sacred Temple',
    sacredCategories: ['Panch Badri'],
    city: 'Pandukeshwar, Chamoli District',
    state: 'Uttarakhand',
    country: 'India',
    description: 'Yogadhyan Badri is located at Pandukeshwar near Badrinath. The temple enshrines Lord Vishnu in a meditative posture. According to tradition, King Pandu, the father of the Pandavas, performed penance here. It is one of the most spiritually significant shrines among the Panch Badri temples.',
    descriptionHi: 'योगध्यान बद्री पांडुकेश्वर में स्थित है। यहां भगवान विष्णु की मूर्ति ध्यान मुद्रा में विराजमान है। मान्यता है कि पांडवों के पिता महाराज पांडु ने यहीं तपस्या की थी। पंच बद्री के प्रमुख आध्यात्मिक तीर्थों में इसका विशेष स्थान है।',
    speciality: 'Lord Vishnu in meditation posture.',
  },
  {
    title: 'Bhavishya Badri',
    slug: 'bhavishya-badri',
    deity: 'Lord Vishnu',
    templeType: 'Sacred Temple',
    sacredCategories: ['Panch Badri'],
    city: 'Subhai Village, Near Joshimath',
    state: 'Uttarakhand',
    country: 'India',
    description: 'Bhavishya Badri is located in the forests near Subhai village close to Joshimath. Hindu tradition states that at the end of Kali Yuga, when access to the present Badrinath temple becomes impossible, worship of Lord Vishnu will continue at Bhavishya Badri. This belief gives the temple immense spiritual significance.',
    descriptionHi: 'भविष्य बद्री जोशीमठ के पास सुभाई गांव के घने जंगलों में स्थित है। मान्यता है कि कलियुग के अंत में जब वर्तमान बद्रीनाथ मंदिर का मार्ग बंद हो जाएगा, तब भगवान विष्णु की पूजा इसी भविष्य बद्री में होगी। यही मान्यता इसे अत्यंत महत्वपूर्ण बनाती है।',
    speciality: 'Future seat of Vishnu worship according to tradition.',
  },
  {
    title: 'Vridha Badri',
    slug: 'vridha-badri',
    deity: 'Lord Vishnu',
    templeType: 'Sacred Temple',
    sacredCategories: ['Panch Badri'],
    city: 'Animath',
    state: 'Uttarakhand',
    country: 'India',
    description: 'Vridha Badri is located in Animath and is associated with the worship of Lord Vishnu in an elderly form. Tradition states that before Adi Shankaracharya established the idol at Badrinath, worship of Lord Vishnu was performed here. The shrine is one of the oldest among the Panch Badri temples.',
    descriptionHi: 'वृद्ध बद्री अणीमठ में स्थित है। यहां भगवान विष्णु की पूजा वृद्ध रूप में की जाती है। मान्यता है कि आदि शंकराचार्य द्वारा बद्रीनाथ में मूर्ति स्थापित करने से पहले भगवान विष्णु की पूजा यहीं होती थी। यह पंच बद्री के सबसे प्राचीन मंदिरों में से एक माना जाता है।',
    speciality: 'Ancient Vishnu shrine worshipped before Badrinath tradition.',
  },
  {
    title: 'Adi Badri',
    slug: 'adi-badri',
    deity: 'Lord Vishnu (Narayana)',
    templeType: 'Temple Complex',
    sacredCategories: ['Panch Badri'],
    city: 'Near Karnaprayag',
    state: 'Uttarakhand',
    country: 'India',
    description: 'Adi Badri is a group of sixteen ancient temples located near Karnaprayag. The main shrine is dedicated to Lord Vishnu in the form of Narayana. The temple complex is believed to date back to the Gupta period and represents one of the oldest centers of Vishnu worship in the Himalayan region.',
    descriptionHi: 'आदि बद्री कर्णप्रयाग के निकट स्थित 16 प्राचीन मंदिरों का समूह है। इसका मुख्य मंदिर भगवान विष्णु (नारायण) को समर्पित है। माना जाता है कि इन मंदिरों का निर्माण गुप्त काल में हुआ था और यह हिमालय क्षेत्र में विष्णु उपासना के प्राचीनतम केंद्रों में से एक है।',
    speciality: 'Ancient Gupta-period Vishnu temple complex.',
  },
]

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function findExistingTemple(entry, temples) {
  const entrySlug = entry.slug
  const entryTitle = entry.title.toLowerCase()
  const altNames = (entry.alternateNames || []).map(n => n.toLowerCase())

  for (const t of temples) {
    const tSlug = t.slug || slugify(t.title || '')
    const tTitle = (t.title || '').toLowerCase()

    if (tSlug === entrySlug) return t
    if (tTitle === entryTitle) return t
    for (const alt of altNames) {
      if (tTitle.includes(alt) || tTitle === alt) return t
    }
    if (entryTitle.length >= 5 && tTitle.includes(entryTitle)) return t
  }
  return null
}

async function main() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)

  const Temple = mongoose.models.Temple || mongoose.model('Temple', TempleSchema)

  const allTemples = await Temple.find(
    {},
    'title slug sacredCategories categories description descriptionHi image status'
  ).lean()

  console.log(`Found ${allTemples.length} existing temples in DB.\n`)

  const created = []
  const skipped = []
  const tagged = []
  const failed = []

  for (const entry of PANCH_BADRI_TEMPLES) {
    try {
      const match = findExistingTemple(entry, allTemples)

      if (match) {
        const cats = [...(match.categories || []), ...(match.sacredCategories || [])]
        const hasPanchBadri = cats.includes(PANCH_BADRI_CATEGORY)

        if (hasPanchBadri) {
          console.log(`  SKIP  "${entry.title}" — already exists & tagged (${match.slug})`)
          skipped.push(entry.title)
        } else {
          const existingCats = match.sacredCategories || []
          const newCats = [...new Set([...existingCats, PANCH_BADRI_CATEGORY])]
          await Temple.findByIdAndUpdate(match._id, { $set: { sacredCategories: newCats } })
          console.log(`  TAG   "${entry.title}" — added Panch Badri category to existing (${match.slug})`)
          tagged.push(entry.title)
        }
      } else {
        await Temple.create({
          title: entry.title,
          slug: entry.slug,
          deity: entry.deity,
          templeType: entry.templeType,
          sacredCategories: entry.sacredCategories,
          categories: entry.sacredCategories,
          description: entry.description,
          descriptionHi: entry.descriptionHi,
          speciality: entry.speciality,
          city: entry.city,
          state: entry.state,
          country: entry.country,
          status: 'approved',
        })
        console.log(`  CREATE "${entry.title}" — new temple created (${entry.slug})`)
        created.push(entry.title)
      }
    } catch (err) {
      console.error(`  FAIL  "${entry.title}" — ${err.message}`)
      failed.push(entry.title)
    }
  }

  console.log('\n════════════════════════════════════')
  console.log('  PANCH BADRI SEED REPORT')
  console.log('════════════════════════════════════')
  console.log(`  Created:  ${created.length}  ${created.join(', ') || '—'}`)
  console.log(`  Skipped:  ${skipped.length}  ${skipped.join(', ') || '—'}`)
  console.log(`  Tagged:   ${tagged.length}  ${tagged.join(', ') || '—'}`)
  console.log(`  Failed:   ${failed.length}  ${failed.join(', ') || '—'}`)
  console.log('════════════════════════════════════\n')

  await mongoose.disconnect()
  console.log('Done.')
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
