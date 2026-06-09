import {
  getCategoryById,
  getCategoryDisplayName,
  resolveCategoryForDeity,
} from './deity-categories'

export function slugifyDeity(value: string) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getCanonicalDeityCategory(input: any) {
  const categorySlug = resolveCategoryForDeity(input?.categorySlug, null)
    || resolveCategoryForDeity(input?.category, input?.categoryId)
    || resolveCategoryForDeity(input?.categoryName, null)
    || ''

  const category = categorySlug ? getCategoryById(categorySlug) : null
  const legacyName = String(input?.categoryName || input?.category || input?.categoryId || '').trim()

  return {
    categorySlug: categorySlug || slugifyDeity(legacyName) || 'other',
    categoryName: category?.titleEn || legacyName || 'Other / Misc',
    categoryNameHi: category?.titleHi || input?.categoryNameHi || '',
    isKnownCategory: Boolean(category),
  }
}

export function normalizeAliasList(input: any) {
  const raw = [
    ...(Array.isArray(input?.aliases) ? input.aliases : []),
    ...(Array.isArray(input?.slugAliases) ? input.slugAliases : []),
  ]
  return Array.from(new Set(raw.map((item) => String(item || '').trim()).filter(Boolean)))
}

export function normalizeDeityForRead(input: any) {
  if (!input) return input
  const category = getCanonicalDeityCategory(input)
  const aliases = normalizeAliasList(input)
  const slug = String(input.slug || '').trim() || slugifyDeity(input.name || '')

  return {
    ...input,
    slug,
    categorySlug: input.categorySlug || category.categorySlug,
    categoryName: input.categoryName || category.categoryName,
    categoryNameHi: input.categoryNameHi || category.categoryNameHi,
    category: input.category || category.categorySlug,
    categoryId: input.categoryId || category.categorySlug,
    categories: Array.isArray(input.categories) && input.categories.length > 0 ? input.categories : [category.categorySlug],
    categoryIds: Array.isArray(input.categoryIds) && input.categoryIds.length > 0 ? input.categoryIds : [category.categorySlug],
    aliases,
  }
}

export function getDeityMigrationPatch(input: any) {
  const patch: Record<string, unknown> = {}
  const slug = String(input?.slug || '').trim()
  const generatedSlug = slugifyDeity(input?.name || '')
  const category = getCanonicalDeityCategory(input)
  const aliases = normalizeAliasList(input)

  if (!slug && generatedSlug) patch.slug = generatedSlug
  if (!input?.categorySlug && category.categorySlug) patch.categorySlug = category.categorySlug
  if (!input?.categoryName && category.categoryName) patch.categoryName = category.categoryName
  if (!input?.categoryNameHi && category.categoryNameHi) patch.categoryNameHi = category.categoryNameHi
  if ((!Array.isArray(input?.aliases) || input.aliases.length === 0) && aliases.length > 0) patch.aliases = aliases
  if (!input?.source) patch.source = 'legacy'
  if (input?.isCustomized === undefined || input?.isCustomized === null) patch.isCustomized = false

  return patch
}

export function displayCategoryName(categorySlugOrName: string) {
  return getCategoryDisplayName(categorySlugOrName) || categorySlugOrName
}
