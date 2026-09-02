/**
 * lib/seo.ts — Centralised SEO helper for Sarvdev
 * Provides builders for metadata, OG, Twitter cards, and JSON-LD schemas.
 */

export const BASE_URL = 'https://sarvdev.com'
export const SITE_NAME = 'Sarvdev'
export const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph-image`
export const DEFAULT_FALLBACK_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

// ── Text helpers ──────────────────────────────────────────────────────────────

/** Join non-empty parts into a page title. */
export function buildTitle(
  parts: (string | null | undefined)[],
  separator = ' — '
): string {
  const filtered = parts.filter(Boolean) as string[]
  return filtered.length ? filtered.join(separator) : SITE_NAME
}

/** Strip HTML, collapse whitespace, and trim to maxLength. */
export function buildDescription(
  text: string | null | undefined,
  maxLength = 155,
  fallback = ''
): string {
  if (!text) return fallback
  const clean = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return clean.length > maxLength ? clean.slice(0, maxLength - 1) + '\u2026' : clean
}

/** Build an absolute canonical URL from a path (leading slash optional). */
export function buildCanonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${clean}`
}

/** Pick the best image URL from an object with multiple image fields. */
export function resolveImage(
  obj: Record<string, any> | null | undefined,
  fields: string[] = ['ogImage', 'imageHero', 'imageCard', 'image']
): string {
  if (!obj) return DEFAULT_OG_IMAGE
  for (const f of fields) {
    const v = obj[f]
    if (typeof v === 'string' && v.startsWith('http')) return v
  }
  return DEFAULT_OG_IMAGE
}

// ── Metadata builders ─────────────────────────────────────────────────────────

export interface OGOptions {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
}

export function buildOpenGraph(opts: OGOptions) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    type: opts.type ?? 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [{ url: opts.image ?? DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: opts.title }],
    ...(opts.publishedTime && { publishedTime: opts.publishedTime }),
    ...(opts.modifiedTime  && { modifiedTime:  opts.modifiedTime  }),
  }
}

export function buildTwitterCard(title: string, description: string, image?: string) {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images: [image ?? DEFAULT_OG_IMAGE],
  }
}

// ── JSON-LD schema builders ───────────────────────────────────────────────────

/** BreadcrumbList schema. Leaf item may omit `item` URL. */
export function buildBreadcrumbSchema(
  crumbs: { name: string; item?: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.item && { item: c.item }),
    })),
  }
}

/** Temple: HinduTemple/TouristAttraction + BreadcrumbList */
export function buildTempleSchema(temple: any, slug: string): object[] {
  const url = `${BASE_URL}/temples/${slug}`
  const image = resolveImage(temple)

  const placeSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['HinduTemple', 'TouristAttraction'],
    name: temple.title,
    url,
    image,
  }

  if (temple.description) {
    placeSchema.description = buildDescription(temple.description, 300)
  }

  const addressParts = [temple.city, temple.state, temple.country].filter(Boolean)
  if (addressParts.length) {
    placeSchema.address = {
      '@type': 'PostalAddress',
      ...(temple.city    && { addressLocality: temple.city }),
      ...(temple.state   && { addressRegion:   temple.state }),
      addressCountry: temple.country || 'IN',
    }
  }

  if (temple.latitude && temple.longitude) {
    placeSchema.geo = {
      '@type': 'GeoCoordinates',
      latitude:  temple.latitude,
      longitude: temple.longitude,
    }
  }

  if (temple.deity) {
    placeSchema.additionalProperty = {
      '@type': 'PropertyValue',
      name:  'Presiding Deity',
      value: temple.deity,
    }
  }

  const statePath = temple.state
    ? `${BASE_URL}/temples/state/${temple.state.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : undefined

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home',    item: BASE_URL },
    { name: 'Temples', item: `${BASE_URL}/temples` },
    ...(statePath ? [{ name: temple.state, item: statePath }] : []),
    { name: temple.title, item: url },
  ])

  return [placeSchema, breadcrumb]
}

/** Blog: BlogPosting + BreadcrumbList */
export function buildBlogSchema(blog: any, slug: string): object[] {
  const url = `${BASE_URL}/blog/${slug}`
  const image = resolveImage(blog)

  const articleSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title ?? blog.metaTitle,
    url,
    image,
    description: buildDescription(blog.excerpt ?? blog.metaDescription ?? blog.description, 300),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url:  BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon.svg` },
    },
    author: {
      '@type': 'Organization',
      name: blog.author ?? SITE_NAME,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const published = blog.publishedAt ?? blog.date ?? blog.createdAt
  if (published) articleSchema.datePublished = new Date(published).toISOString()
  if (blog.updatedAt) articleSchema.dateModified = new Date(blog.updatedAt).toISOString()

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', item: BASE_URL },
    { name: 'Blog', item: `${BASE_URL}/blog` },
    ...(blog.category ? [{ name: blog.category }] : []),
    { name: blog.title, item: url },
  ])

  return [articleSchema, breadcrumb]
}

/** Event: Event schema + BreadcrumbList */
export function buildEventSchema(event: any, slug: string): object[] {
  const url = `${BASE_URL}/events/${slug}`

  const eventSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: buildDescription(event.description, 300),
    startDate: event.date,
    endDate:   event.endDate ?? event.date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || 'India',
      address: {
        '@type': 'PostalAddress',
        addressRegion:  event.state,
        addressCountry: 'IN',
      },
    },
    organizer: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    url,
  }

  if (event.image) eventSchema.image = event.image

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home',   item: BASE_URL },
    { name: 'Events', item: `${BASE_URL}/events` },
    { name: event.title, item: url },
  ])

  return [eventSchema, breadcrumb]
}

/** Deity: Thing + BreadcrumbList */
export function buildDeitySchema(deity: any, slug: string): object[] {
  const url = `${BASE_URL}/deities/${slug}`
  const image = resolveImage(deity)

  const aliases: string[] = [
    deity.nameHi,
    ...(Array.isArray(deity.aliases) ? deity.aliases : []),
  ].filter(Boolean)

  const thingSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name:  deity.name,
    url,
    image,
    description: buildDescription(deity.description ?? deity.metaDescription, 300),
  }

  if (aliases.length)        thingSchema.alternateName = aliases

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home',    item: BASE_URL },
    { name: 'Deities', item: `${BASE_URL}/deities` },
    ...(deity.categoryName
      ? [{ name: deity.categoryName, item: `${BASE_URL}/deities?category=${encodeURIComponent(deity.categorySlug ?? deity.categoryName)}` }]
      : []),
    { name: deity.name, item: url },
  ])

  return [thingSchema, breadcrumb]
}

/** Devotional: CreativeWork or MusicComposition + BreadcrumbList */
export function buildDevotionalSchema(devotional: any, id: string): object[] {
  const url   = `${BASE_URL}/devotionals/${id}`
  const image = resolveImage(devotional, ['imageCard', 'image'])
  const hasAudio = !!(devotional.audio ?? devotional.audioUrl)

  const workSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': hasAudio ? 'MusicComposition' : 'CreativeWork',
    name:       devotional.title,
    url,
    inLanguage: devotional.language ?? 'hi',
    description: buildDescription(devotional.description, 300),
    genre: devotional.category,
    image,
  }

  if (devotional.deity) {
    workSchema.about = { '@type': 'Thing', name: devotional.deity }
  }

  if (hasAudio) {
    workSchema.audio = {
      '@type':      'AudioObject',
      name:         devotional.title,
      contentUrl:   devotional.audio ?? devotional.audioUrl,
    }
  }

  const catSlug = (devotional.categorySlug ?? (devotional.category ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-'))

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home',        item: BASE_URL },
    { name: 'Devotionals', item: `${BASE_URL}/devotionals` },
    ...(devotional.category
      ? [{ name: devotional.category, item: `${BASE_URL}/devotionals/category/${catSlug}` }]
      : []),
    { name: devotional.title, item: url },
  ])

  return [workSchema, breadcrumb]
}

/** Spiritual Icon: Person + BreadcrumbList */
export function buildSpiritualIconSchema(icon: any, slug: string): object[] {
  const url   = `${BASE_URL}/spiritual-icons/${slug}`
  const image = resolveImage(icon, ['ogImage', 'imageHero', 'imageCard', 'image'])

  const personSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Thing'],
    name:        icon.name,
    url,
    image,
    description: buildDescription(icon.shortBio ?? icon.fullBio, 300),
    jobTitle:    icon.title ?? icon.category,
  }

  if (icon.nameHi)   personSchema.alternateName = icon.nameHi
  if (icon.birthYear) personSchema.birthDate    = String(icon.birthYear)

  if (icon.city || icon.state) {
    personSchema.address = {
      '@type': 'PostalAddress',
      ...(icon.city  && { addressLocality: icon.city }),
      ...(icon.state && { addressRegion:   icon.state }),
      addressCountry: 'IN',
    }
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home',           item: BASE_URL },
    { name: 'Spiritual Icons', item: `${BASE_URL}/spiritual-icons` },
    ...(icon.category
      ? [{ name: icon.category, item: `${BASE_URL}/spiritual-icons?category=${encodeURIComponent(icon.category)}` }]
      : []),
    { name: icon.name, item: url },
  ])

  return [personSchema, breadcrumb]
}
