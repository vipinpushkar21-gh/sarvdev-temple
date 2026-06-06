import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const PANCH_BADRI_CATEGORY = 'Panch Badri'

const PANCH_BADRI_TEMPLES = [
  {
    title: 'Badrinath',
    titleHi: 'बद्रीनाथ',
    alternateName: 'Vishal Badri',
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
  },
  {
    title: 'Yogadhyan Badri',
    titleHi: 'योगध्यान बद्री',
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
    titleHi: 'भविष्य बद्री',
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
    titleHi: 'वृद्ध बद्री',
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
    titleHi: 'आदि बद्री',
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

// GET: Dry-run report (no mutations)
export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const temples = await Temple.find(
      {},
      'title slug sacredCategories categories status'
    ).lean() as any[]

    const results: any[] = []
    let existingCount = 0
    let toCreateCount = 0

    for (const entry of PANCH_BADRI_TEMPLES) {
      const match = findExistingTemple(entry, temples)
      if (match) {
        existingCount++
        const cats = [...(match.categories || []), ...(match.sacredCategories || [])]
        const hasPanchBadri = cats.includes(PANCH_BADRI_CATEGORY)
        results.push({
          temple: entry.title,
          slug: entry.slug,
          action: hasPanchBadri ? 'already-tagged' : 'will-tag',
          existingId: String(match._id),
          existingTitle: match.title,
        })
      } else {
        toCreateCount++
        results.push({
          temple: entry.title,
          slug: entry.slug,
          action: 'will-create',
          existingId: null,
          existingTitle: null,
        })
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun: true,
      summary: {
        total: PANCH_BADRI_TEMPLES.length,
        existingMatched: existingCount,
        toCreate: toCreateCount,
      },
      entries: results,
    })
  } catch (error) {
    console.error('Seed Panch Badri dry-run error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

// POST: Execute seed (create missing, tag existing)
export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const temples = await Temple.find(
      {},
      'title slug sacredCategories categories description descriptionHi image status'
    ).lean() as any[]

    const created: any[] = []
    const skippedExisting: any[] = []
    const tagged: any[] = []
    const failed: any[] = []

    for (const entry of PANCH_BADRI_TEMPLES) {
      try {
        const match = findExistingTemple(entry, temples)

        if (match) {
          // Never overwrite images or descriptions
          const cats = [...(match.categories || []), ...(match.sacredCategories || [])]
          const hasPanchBadri = cats.includes(PANCH_BADRI_CATEGORY)

          if (hasPanchBadri) {
            skippedExisting.push({
              slug: entry.slug,
              title: match.title,
              id: String(match._id),
              reason: 'already-tagged',
            })
          } else {
            // Only add the category tag — never overwrite existing data
            const existingCats = match.sacredCategories || []
            const newCats = [...new Set([...existingCats, PANCH_BADRI_CATEGORY])]
            await Temple.findByIdAndUpdate(match._id, {
              $set: { sacredCategories: newCats },
            })
            tagged.push({
              slug: entry.slug,
              title: match.title,
              id: String(match._id),
            })
          }
        } else {
          // Create new temple record
          const newTemple = await Temple.create({
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
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          created.push({
            slug: entry.slug,
            title: entry.title,
            id: String(newTemple._id),
          })
        }
      } catch (entryError: any) {
        failed.push({
          slug: entry.slug,
          title: entry.title,
          error: entryError?.message || 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      ok: true,
      summary: {
        total: PANCH_BADRI_TEMPLES.length,
        created: created.length,
        skippedExisting: skippedExisting.length,
        tagged: tagged.length,
        failed: failed.length,
      },
      created,
      skippedExisting,
      tagged,
      failed,
    })
  } catch (error) {
    console.error('Seed Panch Badri error:', error)
    return NextResponse.json({ error: 'Failed to seed Panch Badri temples' }, { status: 500 })
  }
}

// Match by slug, title, or alternate names
function findExistingTemple(entry: typeof PANCH_BADRI_TEMPLES[0], temples: any[]): any | null {
  const entrySlug = entry.slug
  const entryTitle = entry.title.toLowerCase()
  const altName = ('alternateName' in entry ? (entry as any).alternateName : '').toLowerCase()

  for (const t of temples) {
    const tSlug = t.slug || slugify(t.title || '')
    const tTitle = (t.title || '').toLowerCase()

    // Slug match
    if (tSlug === entrySlug) return t

    // Title exact match
    if (tTitle === entryTitle) return t

    // Alternate name match
    if (altName && tTitle.includes(altName.toLowerCase())) return t
    if (altName && tTitle === altName) return t

    // Partial: title contains entry title or vice versa (for Badrinath)
    if (entryTitle.length >= 5 && tTitle.includes(entryTitle)) return t
  }

  return null
}
