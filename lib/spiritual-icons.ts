import { SPIRITUAL_ICON_CATEGORIES, getSpiritualIconCategory } from '@/data/spiritual-icon-categories'
import { spiritualIcons as staticSpiritualIcons } from '@/data/spiritual-icons'
import { sanitizeImageUrl } from './imageGuard'

export type SpiritualIconRecord = {
  _id?: string
  isStaticFallback?: boolean
  id?: string
  name: string
  nameHi?: string
  slug: string
  category?: string
  categorySlug: string
  title?: string
  titleHi?: string
  shortBio?: string
  shortBioHi?: string
  fullBio?: string
  fullBioHi?: string
  image?: string
  imageCard?: string
  imageHero?: string
  galleryImages?: string[]
  location?: string
  city?: string
  state?: string
  country?: string
  languages?: string[]
  specializations?: string[]
  sampradaya?: string
  organization?: string
  yearsActive?: string
  notableWorks?: string[]
  contactPhone?: string
  contactEmail?: string
  website?: string
  youtube?: string
  instagram?: string
  facebook?: string
  twitter?: string
  bookingAvailable?: boolean
  verified?: boolean
  featured?: boolean
  status?: 'active' | 'inactive' | 'draft'
  priority?: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  source?: string
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  pandit: 'pandit',
  purohit: 'pandit',
  'pandit-purohit': 'pandit',
  'pandit / purohit': 'pandit',
  'katha-vachak': 'katha-vachak',
  'katha vachak': 'katha-vachak',
  'bhajan-gayak': 'bhajan-gayak',
  'bhajan gayak': 'bhajan-gayak',
}

export function slugifySpiritualIcon(value: string) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function resolveSpiritualIconCategorySlug(value?: string) {
  const key = (value || '').toLowerCase().trim()
  if (LEGACY_CATEGORY_MAP[key]) return LEGACY_CATEGORY_MAP[key]
  const bySlug = SPIRITUAL_ICON_CATEGORIES.find((category) => category.slug === key)
  if (bySlug) return bySlug.slug
  const byName = SPIRITUAL_ICON_CATEGORIES.find((category) => category.name.toLowerCase() === key)
  return byName?.slug || 'katha-vachak'
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

export function normalizeSpiritualIcon(input: any): SpiritualIconRecord {
  const categorySlug = resolveSpiritualIconCategorySlug(input.categorySlug || input.category || input.type)
  const category = getSpiritualIconCategory(categorySlug)
  const name = String(input.name || '').trim()
  const slug = slugifySpiritualIcon(input.slug || name)
  const imageCard = sanitizeImageUrl(input.imageCard || input.image || '')
  const imageHero = sanitizeImageUrl(input.imageHero || '')
  const image = sanitizeImageUrl(input.image || imageCard || '')
  const ogImage = sanitizeImageUrl(input.ogImage || imageHero || imageCard || image || '')

  return {
    _id: input._id ? String(input._id) : undefined,
    isStaticFallback: Boolean(input.isStaticFallback),
    id: input.id ? String(input.id) : undefined,
    name,
    nameHi: input.nameHi || '',
    slug,
    category: input.category || category?.name || 'Katha Vachak',
    categorySlug,
    title: input.title || input.speciality || input.category || category?.name || '',
    titleHi: input.titleHi || '',
    shortBio: input.shortBio || input.description || '',
    shortBioHi: input.shortBioHi || '',
    fullBio: input.fullBio || input.description || '',
    fullBioHi: input.fullBioHi || '',
    image,
    imageCard,
    imageHero,
    galleryImages: stringList(input.galleryImages).map((url) => sanitizeImageUrl(url)).filter(Boolean),
    location: input.location || input.state || '',
    city: input.city || '',
    state: input.state || '',
    country: input.country || 'India',
    languages: stringList(input.languages),
    specializations: stringList(input.specializations || input.famousFor || input.speciality),
    sampradaya: input.sampradaya || '',
    organization: input.organization || '',
    yearsActive: input.yearsActive || '',
    notableWorks: stringList(input.notableWorks || input.famousFor),
    contactPhone: input.contactPhone || '',
    contactEmail: input.contactEmail || '',
    website: input.website || '',
    youtube: input.youtube || '',
    instagram: input.instagram || '',
    facebook: input.facebook || '',
    twitter: input.twitter || '',
    bookingAvailable: Boolean(input.bookingAvailable),
    verified: Boolean(input.verified),
    featured: Boolean(input.featured),
    status: input.status || 'active',
    priority: Number.isFinite(Number(input.priority)) ? Number(input.priority) : 999,
    metaTitle: input.metaTitle || '',
    metaDescription: input.metaDescription || '',
    ogImage,
    source: input.source || '',
  }
}

export function getStaticSpiritualIconsForSeed(): SpiritualIconRecord[] {
  return staticSpiritualIcons.map((icon, index) => normalizeSpiritualIcon({
    ...icon,
    categorySlug: icon.type,
    category: getSpiritualIconCategory(resolveSpiritualIconCategorySlug(icon.type))?.name,
    title: icon.speciality,
    shortBio: icon.description,
    fullBio: icon.description,
    specializations: icon.famousFor,
    notableWorks: icon.famousFor,
    status: 'active',
    priority: index + 1,
    source: 'static-spiritual-icons',
  }))
}

export function filterSpiritualIcons(records: SpiritualIconRecord[], searchParams: URLSearchParams) {
  const category = searchParams.get('category') || ''
  const state = searchParams.get('state') || ''
  const language = searchParams.get('language') || ''
  const featured = searchParams.get('featured') || ''
  const slug = searchParams.get('slug') || ''
  const q = (searchParams.get('search') || searchParams.get('q') || '').toLowerCase().trim()

  return records.filter((icon) => {
    if (slug && icon.slug !== slug) return false
    if (category && icon.categorySlug !== category) return false
    if (state && icon.state !== state) return false
    if (language && !(icon.languages || []).some((item) => item.toLowerCase() === language.toLowerCase())) return false
    if (featured === 'true' && !icon.featured) return false
    if (q) {
      const haystack = [
        icon.name,
        icon.nameHi,
        icon.title,
        icon.category,
        icon.shortBio,
        icon.state,
        icon.city,
        icon.location,
        ...(icon.specializations || []),
        ...(icon.notableWorks || []),
        ...(icon.languages || []),
      ].filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}
