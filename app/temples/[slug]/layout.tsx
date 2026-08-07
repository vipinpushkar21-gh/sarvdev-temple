import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Review from '@/models/Review'
import { getOGImage, getTempleHeroImage } from '@/lib/temple-image'
import { normalizeTempleText, slugifyTemple } from '@/lib/temple-normalization'

// ISR: revalidate temple detail pages every 5 minutes
export const revalidate = 300

const BASE = 'https://sarvdev.com'

function cleanText(value: unknown, max = 155) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean)
  if (typeof value === 'string') {
    const separator = value.includes('|') ? '|' : value.includes(';') ? ';' : ','
    return value.split(separator).map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function uniqueStrings(values: unknown[]) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)))
}

function templeSlugQuery(slug: string) {
  const words = slug.split('-').map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean)
  const titleRegex = words.length > 0 ? new RegExp(`^${words.join('[\\s\\W]+')}$`, 'i') : null
  return {
    status: 'approved',
    $or: [
      { slug },
      { titleNormalized: normalizeTempleText(slug.replace(/-/g, ' ')) },
      ...(titleRegex ? [{ title: titleRegex }] : []),
    ],
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    await connectDB()
    const temple = await Temple.findOne(
      templeSlugQuery(slug),
      'title titleHi slug description descriptionHi metaTitle metaDescription image primaryImage imageCard imageHero heroImage ogImage city state deity templeType templeTypes tags keywords metaKeywords categories sacredCategories'
    ).lean() as any

    if (!temple) {
      return {
        title: 'Temple — Sarvdev',
        description: 'Explore sacred temples on Sarvdev.',
      }
    }

    const locationParts = [temple.city, temple.state].filter(Boolean)
    const location = locationParts.join(', ')
    const title = cleanText(temple.metaTitle, 80) || `${temple.title || temple.titleHi} - Sarvdev`
    const description = cleanText(temple.metaDescription)
      || (temple.description
        ? cleanText(temple.description)
        : temple.descriptionHi
          ? cleanText(temple.descriptionHi)
          : `Explore ${temple.title || temple.titleHi}${location ? ` in ${location}` : ''}${temple.deity ? `, dedicated to ${temple.deity}` : ''}. Find timings, location and more on Sarvdev.`)
    const image = getOGImage(temple).src
    const url = `${BASE}/temples/${temple.slug || slug}`
    const keywords = uniqueStrings([
      ...asStringArray(temple.metaKeywords),
      ...asStringArray(temple.keywords),
      ...asStringArray(temple.tags),
      ...asStringArray(temple.categories),
      ...asStringArray(temple.sacredCategories),
      temple.title,
      temple.deity,
      temple.city,
      temple.state,
      temple.templeType,
      ...(Array.isArray(temple.templeTypes) ? temple.templeTypes : []),
      'temple',
      'mandir',
      'darshan',
      'Hindu temple India',
    ])

    return {
      title,
      description,
      keywords,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        siteName: 'Sarvdev',
        images: [{ url: image, width: 1200, height: 630, alt: temple.title || temple.titleHi }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    }
  } catch {
    return { title: 'Temple — Sarvdev' }
  }
}

export default async function TempleSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  let jsonLdArray: object[] = []
  try {
    const { slug } = await params
    await connectDB()
    const temple = await Temple.findOne(
      templeSlugQuery(slug),
      'title slug description streetAddress city district state country pincode image primaryImage imageCard imageHero heroImage ogImage deity templeType templeTypes categories sacredCategories timings phone website'
    ).lean() as any
    if (temple) {
      const pageUrl = `${BASE}/temples/${temple.slug || slug}`
      const heroImage = getTempleHeroImage(temple).src
      const breadcrumbItems = [
        { name: 'Home', item: BASE },
        { name: 'Temples', item: `${BASE}/temples` },
        ...(temple.state ? [{ name: temple.state, item: `${BASE}/temples/state/${slugifyTemple(temple.state)}` }] : []),
        { name: temple.title, item: pageUrl },
      ]
      // BreadcrumbList
      jsonLdArray.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      })
      // HinduTemple / Place structured data
      const placeSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'HinduTemple',
        name: temple.title,
        url: pageUrl,
        image: heroImage,
      }
      if (temple.description) {
        placeSchema.description = cleanText(temple.description, 300)
      }
      const addressParts = [temple.streetAddress, temple.city, temple.district, temple.state, temple.pincode, temple.country].filter(Boolean)
      if (addressParts.length) {
        placeSchema.address = {
          '@type': 'PostalAddress',
          ...(temple.streetAddress && { streetAddress: temple.streetAddress }),
          ...(temple.city && { addressLocality: temple.city }),
          ...(temple.district && { addressSubregion: temple.district }),
          ...(temple.state && { addressRegion: temple.state }),
          ...(temple.pincode && { postalCode: temple.pincode }),
          addressCountry: temple.country || 'IN',
        }
      }
      if (temple.timings) {
        placeSchema.openingHours = temple.timings
      }
      // ImageObject for Google Images discoverability
      placeSchema.photo = {
        '@type': 'ImageObject',
        url: heroImage,
        name: `${temple.title} Temple Photo`,
        caption: `${temple.title}${temple.city ? ` in ${temple.city}` : ''}${temple.state ? `, ${temple.state}` : ''}`,
      }
      // Speakable for voice search
      placeSchema.speakable = {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.temple-description'],
      }

      // telephone for local SEO
      if (temple.phone) placeSchema.telephone = temple.phone
      if (temple.website) placeSchema.sameAs = [temple.website]

      // AggregateRating from reviews
      try {
        const reviews = await Review.find({ templeSlug: slug, status: { $ne: 'rejected' } }, 'rating').lean() as any[]
        if (reviews.length >= 1) {
          const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
          placeSchema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: Math.round(avg * 10) / 10,
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          }
        }
      } catch { /* reviews optional */ }

      jsonLdArray.push(placeSchema)
    }
  } catch { /* silent */ }

  return (
    <>
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {children}
    </>
  )
}
