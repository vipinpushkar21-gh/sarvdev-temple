import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Review from '@/models/Review'
import { getOGImage, getTempleHeroImage } from '@/lib/temple-image'

// ISR: revalidate temple detail pages every 5 minutes
export const revalidate = 300

const BASE = 'https://sarvdev.com'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    await connectDB()
    const temples = await Temple.find(
      { status: 'approved' },
      'title description image imageCard imageHero heroImage ogImage city state deity templeType'
    ).lean() as any[]

    const temple = temples.find((t: any) => slugify(t.title) === slug)

    if (!temple) {
      return {
        title: 'Temple — Sarvdev',
        description: 'Explore sacred temples on Sarvdev.',
      }
    }

    const locationParts = [temple.city, temple.state].filter(Boolean)
    const location = locationParts.join(', ')
    const title = `${temple.title} — Sarvdev`
    const description = temple.description
      ? temple.description.replace(/<[^>]+>/g, '').slice(0, 155)
      : `Explore ${temple.title}${location ? ` in ${location}` : ''}${temple.deity ? `, dedicated to ${temple.deity}` : ''}. Find timings, history and more on Sarvdev.`
    const image = getOGImage(temple).src
    const url = `${BASE}/temples/${slug}`
    const keywords = [
      temple.title,
      temple.deity,
      temple.city,
      temple.state,
      temple.templeType,
      'temple',
      'mandir',
      'darshan',
      'Hindu temple India',
    ].filter(Boolean) as string[]

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
        images: [{ url: image, width: 1200, height: 630, alt: temple.title }],
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
    const temples = await Temple.find(
      { status: 'approved' },
      'title description image city state country deity latitude longitude timings phone website'
    ).lean() as any[]
    const temple = temples.find((t: any) => slugify(t.title) === slug)
    if (temple) {
      // BreadcrumbList
      jsonLdArray.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
          { '@type': 'ListItem', position: 3, name: temple.title, item: `${BASE}/temples/${slug}` },
        ],
      })
      // HinduTemple / Place structured data
      const placeSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'HinduTemple',
        name: temple.title,
        url: `${BASE}/temples/${slug}`,
        image: getTempleHeroImage(temple).src,
      }
      if (temple.description) {
        placeSchema.description = temple.description.replace(/<[^>]+>/g, '').slice(0, 300)
      }
      const addressParts = [temple.city, temple.state, temple.country].filter(Boolean)
      if (addressParts.length) {
        placeSchema.address = {
          '@type': 'PostalAddress',
          ...(temple.city && { addressLocality: temple.city }),
          ...(temple.state && { addressRegion: temple.state }),
          addressCountry: temple.country || 'IN',
        }
      }
      if (temple.latitude && temple.longitude) {
        placeSchema.geo = {
          '@type': 'GeoCoordinates',
          latitude: temple.latitude,
          longitude: temple.longitude,
        }
      }
      if (temple.timings) {
        placeSchema.openingHours = temple.timings
      }
      // ImageObject for Google Images discoverability
      placeSchema.photo = {
        '@type': 'ImageObject',
        url: getTempleHeroImage(temple).src,
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
      if (temple.website) placeSchema.url = temple.website

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
