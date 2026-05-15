import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import RelatedSacredContent from '@/components/RelatedSacredContent'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ deity: string }> }
): Promise<Metadata> {
  const { deity } = await params
  const deityName = unslugify(deity)
  const title = `${deityName} Temples — Sarvdev`
  const description = `Discover temples dedicated to ${deityName} across India. Find timings, location, spiritual significance and more on Sarvdev.`
  const url = `${BASE}/temples/deity/${deity}`

  return {
    title,
    description,
    keywords: [`${deityName} temples`, `${deityName} mandir`, 'Hindu temples', 'temple directory', 'Sarvdev'],
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

export default async function DeityTemplesPage({
  params,
}: {
  params: Promise<{ deity: string }>
}) {
  const { deity } = await params
  const deityName = unslugify(deity)

  let temples: any[] = []
  try {
    await connectDB()
    temples = await Temple.find(
      { status: 'approved' },
      'title description image city state deity categories'
    ).lean()
    temples = temples.filter(
      (t: any) => t.deity && slugify(t.deity) === deity
    )
  } catch (e) {
    console.error('Deity temples fetch error:', e)
  }

  const states = Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))).sort() as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${deityName} Temples`,
    description: `Temples dedicated to ${deityName} — explore ${temples.length} temples on Sarvdev.`,
    url: `${BASE}/temples/deity/${deity}`,
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
        { '@type': 'ListItem', position: 3, name: deityName, item: `${BASE}/temples/deity/${deity}` },
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
            <span className="text-ink font-medium">{deityName}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            {deityName} Temples
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Explore <strong className="text-ink">{temples.length}</strong> temples dedicated to {deityName} across India.
            Discover darshan timings, history, and spiritual significance.
          </p>
          {states.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 text-body-sm">
              <span className="text-ink-faint">Present in:</span>
              {states.slice(0, 8).map(s => (
                <Link
                  key={s}
                  href={`/temples/state/${slugify(s)}`}
                  className="px-2.5 py-1 rounded-full bg-white/80 border border-surface-border text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all no-underline"
                >
                  {s}
                </Link>
              ))}
              {states.length > 8 && (
                <span className="px-2.5 py-1 text-ink-faint">+{states.length - 8} more</span>
              )}
            </div>
          )}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found for {deityName}</p>
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
                    {t.state && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">
                        {t.state}
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
          title={`Explore ${deityName} & More`}
          states={states.slice(0, 6).map(s => ({ href: `/temples/state/${slugify(s)}`, label: `Temples in ${s}` }))}
          deities={[{ href: '/deities', label: 'All Deities' }, { href: '/temples', label: 'All Temples' }, { href: '/devotionals', label: 'Devotionals' }]}
        />
      </main>
    </>
  )
}
