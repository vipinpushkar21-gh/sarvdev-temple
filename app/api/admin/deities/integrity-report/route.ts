import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'
import { DEITY_CATEGORIES, resolveCategoryForDeity } from '@/lib/deity-categories'
import { getCanonicalDeityCategory } from '@/lib/deity-normalization'
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
  const unknownCategoryRecords: any[] = []
  const categoriesUsedInDb = new Set<string>()
  const configuredCategoryIds = new Set(DEITY_CATEGORIES.map((category) => category.id))
  const slugGroups = new Map<string, any[]>()
  const nameGroups = new Map<string, any[]>()
  const cloudinaryImageRecords = deities.filter((item) =>
    [item.image, item.imageCard, item.imageHero, item.ogImage].some((value) => String(value || '').includes('res.cloudinary.com'))
  )

  for (const deity of deities) {
    const slug = String(deity.slug || '').trim().toLowerCase()
    const name = String(deity.name || '').trim().toLowerCase()
    if (slug) slugGroups.set(slug, [...(slugGroups.get(slug) || []), deity])
    if (name) nameGroups.set(name, [...(nameGroups.get(name) || []), deity])

    const rawCategoryValues = [
      ...(Array.isArray(deity.categories) ? deity.categories : []),
      ...(Array.isArray(deity.categoryIds) ? deity.categoryIds : []),
      deity.category,
      deity.categoryId,
    ].map((value) => String(value || '').trim()).filter(Boolean)

    for (const value of rawCategoryValues) {
      const canonical = resolveCategoryForDeity(value, null)
      categoriesUsedInDb.add(canonical || value)
      if (!canonical && !configuredCategoryIds.has(value)) {
        unknownCategoryRecords.push({
          id: String(deity._id),
          name: deity.name,
          slug: deity.slug,
          categoryValue: value,
        })
      }
    }

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

  const duplicates = (groups: Map<string, any[]>) =>
    Array.from(groups.entries())
      .filter(([, group]) => group.length > 1)
      .map(([key, group]) => ({ key, records: group.map((item) => ({ id: String(item._id), name: item.name, slug: item.slug })) }))

  return {
    ok: true,
    totalDbRecords: deities.length,
    duplicateSlugs: duplicates(slugGroups),
    duplicateNames: duplicates(nameGroups),
    missingSlugs: deities.filter((item) => !String(item.slug || '').trim()).map((item) => ({ id: String(item._id), name: item.name })),
    missingNames: deities.filter((item) => !String(item.name || '').trim()).map((item) => ({ id: String(item._id), slug: item.slug })),
    missingHindiNames: deities.filter((item) => !String(item.nameHi || '').trim()).map((item) => ({ id: String(item._id), name: item.name, slug: item.slug })),
    missingCategories: deities.filter((item) => !resolveCategoryForDeity(item.categorySlug || item.category, item.categoryId)).map((item) => ({ id: String(item._id), name: item.name, slug: item.slug })),
    missingCanonicalFields: deities.filter((item) => !item.categorySlug || !item.categoryName).map((item) => ({ id: String(item._id), name: item.name, slug: item.slug })),
    missingImages: deities.filter((item) => !item.image && !item.imageCard && !item.imageHero).map((item) => ({ id: String(item._id), name: item.name, slug: item.slug })),
    staticSourceRecords: deities.filter((item) => String(item.source || '').includes('static') || item.status === 'not-seeded').map((item) => ({ id: String(item._id), name: item.name, slug: item.slug, source: item.source, status: item.status })),
    configuredCategories: DEITY_CATEGORIES.map((category) => ({
      id: category.id,
      titleEn: category.titleEn,
      legacy: Boolean(category.legacy),
    })),
    categoriesUsedInDb: Array.from(categoriesUsedInDb).sort(),
    categoriesMissingFromConfig: Array.from(categoriesUsedInDb).filter((category) => !configuredCategoryIds.has(category)).sort(),
    unknownCategoryRecords,
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
    const category = getCanonicalDeityCategory({ category: item.repairTo })
    await Deity.updateOne(
      { _id: item.id },
      {
        $set: {
          category: item.repairTo,
          categoryId: item.repairTo,
          categorySlug: category.categorySlug,
          categoryName: category.categoryName,
          categoryNameHi: category.categoryNameHi,
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
