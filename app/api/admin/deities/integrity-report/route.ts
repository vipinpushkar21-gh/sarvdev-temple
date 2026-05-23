import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { resolveCategoryForDeity } from '@/lib/deity-categories'
import Deity from '@/models/Deity'
import ActivityLog from '@/models/ActivityLog'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.role === 'admin' ? payload : null
}

function makeReport(deities: any[]) {
  const invalidCategoryRecords: any[] = []
  const repairableCategoryRecords: any[] = []
  const badCategoryIdRecords: any[] = []
  const cloudinaryImageRecords = deities.filter((item) =>
    [item.image, item.imageCard, item.imageHero, item.ogImage].some((value) => String(value || '').includes('res.cloudinary.com'))
  )

  for (const deity of deities) {
    const canonicalCategory = resolveCategoryForDeity(deity.category, deity.categoryId)
    if (!canonicalCategory) {
      invalidCategoryRecords.push({
        id: String(deity._id),
        name: deity.name,
        slug: deity.slug,
        category: deity.category || '',
        categoryId: deity.categoryId || '',
      })
      continue
    }

    if (deity.category !== canonicalCategory || deity.categoryId !== canonicalCategory) {
      repairableCategoryRecords.push({
        id: String(deity._id),
        name: deity.name,
        slug: deity.slug,
        category: deity.category || '',
        categoryId: deity.categoryId || '',
        repairTo: canonicalCategory,
      })
    }

    if (deity.categoryId && deity.categoryId !== canonicalCategory) {
      badCategoryIdRecords.push({
        id: String(deity._id),
        name: deity.name,
        slug: deity.slug,
        categoryId: deity.categoryId,
        repairTo: canonicalCategory,
      })
    }
  }

  return {
    ok: true,
    totalDbRecords: deities.length,
    invalidCategoryRecords,
    repairableCategoryRecords,
    badCategoryIdRecords,
    customizedRecords: deities.filter((item) => item.isCustomized).length,
    cloudinaryImageRecords: cloudinaryImageRecords.length,
  }
}

export async function GET(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const deities = await Deity.find({}, { __v: 0 }).lean()
  return NextResponse.json(makeReport(deities))
}

export async function POST(req: NextRequest) {
  const admin = getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const deities = await Deity.find({}, { __v: 0 }).lean()
  const report = makeReport(deities)
  let repaired = 0
  const repairedRecords: any[] = []

  for (const item of report.badCategoryIdRecords) {
    await Deity.updateOne(
      { _id: item.id },
      {
        $set: {
          category: item.repairTo,
          categoryId: item.repairTo,
          updatedAt: new Date(),
        },
      }
    )
    repaired += 1
    repairedRecords.push(item)
  }

  try {
    await ActivityLog.create({
      action: 'repair-deity-category-ids',
      entity: 'deity',
      adminId: admin.id,
      adminName: admin.name || admin.email,
      details: JSON.stringify({ repaired, repairedRecords }),
    })
  } catch {
    // Logging should not block non-destructive repair.
  }

  const after = await Deity.find({}, { __v: 0 }).lean()
  return NextResponse.json({
    ok: true,
    repaired,
    before: report,
    after: makeReport(after),
  })
}
