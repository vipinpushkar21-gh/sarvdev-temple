import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import RelatedSacredContent from '@/components/RelatedSacredContent'

export const revalidate = 3600

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ location: string }> }
): Promise<Metadata> {
  const { location } = await params
  const name = unslugify(location)
  const title = `Temples Near ${name} — Find Hindu Temples Near Me`
  const description = `Find Hindu temples near ${name}. Discover nearby mandir with timings, directions, and darshan information. Temples near me in ${name} on Sarvdev.`
  const url = `${BASE}/temples/near/${location}`
  return {
    title,
    description,
    keywords: [
      `temples near ${name}`, `temples near me ${name}`, `mandir near ${name}`,
      `${name} temples nearby`, 'Hindu temples near me', 'Sarvdev',
    ],
    alternates: { canonical: url, languages: { 'en-IN': url, 'hi-IN': url, 'x-default': url } },
    openGraph: { title, description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function NearMeTemplesPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params
  const locationName = unslugify(location)

  let temples: any[] = []
  let matchType = 'city' // city, state, or fuzzy
  try {
    await connectDB()
    const all = await Temple.find(
      { status: 'approved' },
      'title description image city state deity pincode categories'
    ).lean() as any[]

    // Try exact city match first
    temples = all.filter((t: any) => t.city && slugify(t.city) === location)
    if (temples.length === 0) {
      // Try state match
      temples = all.filter((t: any) => t.state && slugify(t.state) === location)
      matchType = 'state'
    }
    if (temples.length === 0) {
      // Fuzzy match on city/state containing the query
      const q = location.replace(/-/g, ' ').toLowerCase()
      temples = all.filter((t: any) =>
        (t.city && t.city.toLowerCase().includes(q)) ||
        (t.state && t.state.toLowerCase().includes(q))
      )
      matchType = 'fuzzy'
    }
  } catch (e) {
    console.error('Near-me temples error:', e)
  }

  const deities = Array.from(new Set(temples.map((t: any) => t.deity).filter(Boolean))).sort() as string[]
  const cities = Array.from(new Set(temples.map((t: any) => t.city).filter(Boolean))).sort() as string[]
  const states = Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))).sort() as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples Near ${locationName}`,
    description: `Hindu temples near ${locationName} — ${temples.length} temples found on Sarvdev.`,
    url: `${BASE}/temples/near/${location}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: temples.length,
      itemListElement: temples.slice(0, 50).map((t: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: `${BASE}/temples/${slugify(t.title)}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
        { '@type': 'ListItem', position: 3, name: `Near ${locationName}`, item: `${BASE}/temples/near/${location}` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">Near {locationName}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Temples Near {locationName}
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Discover <strong className="text-ink">{temples.length}</strong> Hindu temples near {locationName}.
            Find darshan timings, directions, and spiritual significance of nearby temples.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Nearby cities */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Temples by Nearby City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => (
                <Link key={c} href={`/temples/city/${slugify(c)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">{c}</Link>
              ))}
            </div>
          </section>
        )}

        {/* Deity filter */}
        {deities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Browse by Deity</h2>
            <div className="flex flex-wrap gap-2">
              {deities.map(d => (
                <Link key={d} href={`/temples/deity/${slugify(d)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">{d}</Link>
              ))}
            </div>
          </section>
        )}

        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found near {locationName}</p>
            <p className="text-body-sm text-ink-faint mb-6">Help us by submitting temples from your area!</p>
            <div className="flex justify-center gap-3">
              <Link href="/list-temple" className="btn btn-primary no-underline hover:no-underline">Submit Temple</Link>
              <Link href="/temples" className="btn btn-outline no-underline hover:no-underline">Browse All Temples</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((t: any) => (
              <Link key={t._id.toString()} href={`/temples/${slugify(t.title)}`}
                className="group card overflow-hidden hover:shadow-md transition-all duration-300 no-underline">
                <div className="relative h-48 overflow-hidden">
                  <img src={t.image || DEFAULT_IMAGE}
                    alt={`${t.title} — temple near ${locationName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {t.deity && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">{t.deity}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{t.title}</h3>
                  <p className="text-caption text-ink-muted mt-1">{[t.city, t.state].filter(Boolean).join(', ')}</p>
                  {t.description && (
                    <p className="text-caption text-ink-faint mt-2 line-clamp-2">{t.description.replace(/<[^>]+>/g, '').slice(0, 120)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <RelatedSacredContent
          title={`Explore More Near ${locationName}`}
          deities={deities.slice(0, 4).map(d => ({ href: `/temples/deity/${slugify(d)}`, label: `${d} Temples` }))}
          states={[
            ...states.map(s => ({ href: `/temples/state/${slugify(s)}`, label: `All Temples in ${s}` })),
            { href: '/sacred-categories', label: 'Sacred Categories' },
          ]}
        />
      </main>
    </>
  )
}
