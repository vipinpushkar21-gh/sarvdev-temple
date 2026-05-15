import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import RelatedSacredContent from '@/components/RelatedSacredContent'
import { hinduEvents } from '@/data/events'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ state: string }> }
): Promise<Metadata> {
  const { state } = await params
  const stateName = unslugify(state)
  const title = `Temples in ${stateName} — Sarvdev`
  const description = `Explore Hindu temples in ${stateName}. Find temple timings, deity information, directions and spiritual significance of temples across ${stateName} on Sarvdev.`
  const url = `${BASE}/temples/state/${state}`

  return {
    title,
    description,
    keywords: [`temples in ${stateName}`, `${stateName} mandir`, 'Hindu temples', 'temple directory', 'Sarvdev'],
    alternates: {
      canonical: url,
      languages: { 'en-IN': url, 'hi-IN': url, 'x-default': url },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Sarvdev',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function StateTemplesPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  const stateName = unslugify(state)

  let temples: any[] = []
  try {
    await connectDB()
    temples = await Temple.find(
      { status: 'approved' },
      'title description image city state deity categories'
    ).lean()
    temples = temples.filter(
      (t: any) => t.state && slugify(t.state) === state
    )
  } catch (e) {
    console.error('State temples fetch error:', e)
  }

  const cities = Array.from(new Set(temples.map((t: any) => t.city).filter(Boolean))).sort() as string[]
  const deities = Array.from(new Set(temples.map((t: any) => t.deity).filter(Boolean))).sort() as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples in ${stateName}`,
    description: `Hindu temples in ${stateName} — explore ${temples.length} temples on Sarvdev.`,
    url: `${BASE}/temples/state/${state}`,
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
        { '@type': 'ListItem', position: 3, name: stateName, item: `${BASE}/temples/state/${state}` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">{stateName}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Temples in {stateName}
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Explore <strong className="text-ink">{temples.length}</strong> sacred temples across {stateName}. 
            Discover temple timings, deity information, and spiritual significance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-body-sm">
            {cities.length > 0 && (
              <span className="px-3 py-1.5 rounded-full bg-white/80 border border-surface-border text-ink-muted">
                {cities.length} {cities.length === 1 ? 'city' : 'cities'}
              </span>
            )}
            {deities.length > 0 && (
              <span className="px-3 py-1.5 rounded-full bg-white/80 border border-surface-border text-ink-muted">
                {deities.length} {deities.length === 1 ? 'deity' : 'deities'}
              </span>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Deity quick links */}
        {deities.length > 0 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Browse by Deity</h2>
            <div className="flex flex-wrap gap-2">
              {deities.map(deity => (
                <Link
                  key={deity}
                  href={`/temples/deity/${slugify(deity)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline"
                >
                  {deity}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Temple Grid */}
        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found in {stateName}</p>
            <p className="text-body-sm text-ink-faint mb-6">We're continuously adding temples. Check back soon!</p>
            <Link href="/temples" className="btn btn-primary no-underline hover:no-underline">Browse All Temples</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((t: any) => {
              const slug = slugify(t.title)
              return (
                <Link
                  key={t._id.toString()}
                  href={`/temples/${slug}`}
                  className="group card overflow-hidden hover:shadow-md transition-all duration-300 no-underline"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={t.image || DEFAULT_IMAGE}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {t.deity && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">
                        {t.deity}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">
                      {t.title}
                    </h3>
                    <p className="text-caption text-ink-muted mt-1">
                      {[t.city, t.state].filter(Boolean).join(', ')}
                    </p>
                    {t.description && (
                      <p className="text-caption text-ink-faint mt-2 line-clamp-2">
                        {t.description.replace(/<[^>]+>/g, '').slice(0, 120)}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <RelatedSacredContent
          title={`More from ${stateName} & Beyond`}
          deities={deities.slice(0, 6).map(d => ({ href: `/temples/deity/${slugify(d)}`, label: `${d} Temples` }))}
          festivals={hinduEvents.filter(e => e.state === stateName || e.state === 'All States').slice(0, 4).map(f => ({ href: `/events/${f.slug}`, label: f.title, sub: String(f.year) }))}
          states={[{ href: '/temples', label: 'All Temples' }, { href: '/devotionals', label: 'Devotionals' }, { href: '/events', label: 'Events & Festivals' }]}
        />
      </main>
    </>
  )
}
