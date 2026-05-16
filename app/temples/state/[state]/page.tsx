import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import RelatedSacredContent from '@/components/RelatedSacredContent'
import { hinduEvents } from '@/data/events'

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

      {/* Hero — Enhanced editorial */}
      <section className="relative bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-[10%] w-72 h-72 bg-primary/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[5%] w-56 h-56 bg-accent/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span className="text-ink-faint">/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span className="text-ink-faint">/</span>
            <span className="text-ink font-medium">{stateName}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Temples in {stateName}
          </h1>
          <p className="text-body text-ink-muted max-w-2xl leading-relaxed">
            Explore <strong className="text-ink">{temples.length}</strong> sacred temples across {stateName}. 
            Discover temple timings, deity information, and spiritual significance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-body-sm">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-surface-border text-ink-muted shadow-sm">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4" /></svg>
              <strong className="text-ink">{temples.length}</strong> temples
            </span>
            {cities.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-surface-border text-ink-muted shadow-sm">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <strong className="text-ink">{cities.length}</strong> {cities.length === 1 ? 'city' : 'cities'}
              </span>
            )}
            {deities.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-surface-border text-ink-muted shadow-sm">
                <svg className="w-3.5 h-3.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <strong className="text-ink">{deities.length}</strong> {deities.length === 1 ? 'deity' : 'deities'}
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

        {/* City quick links */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Browse by City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(city => (
                <Link
                  key={city}
                  href={`/temples/city/${slugify(city)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline"
                >
                  {city}
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
