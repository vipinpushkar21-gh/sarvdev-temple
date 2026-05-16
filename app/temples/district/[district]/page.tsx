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
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params
  const name = unslugify(district)
  const title = `Temples in ${name} District`
  const description = `Discover Hindu temples in ${name} district. Find temple timings, deity information, spiritual significance, and how to reach temples in ${name} on Sarvdev.`
  const url = `${BASE}/temples/district/${district}`
  return {
    title,
    description,
    keywords: [`temples in ${name}`, `${name} district temples`, `${name} mandir`, 'Hindu temples', 'Sarvdev'],
    alternates: { canonical: url, languages: { 'en-IN': url, 'hi-IN': url, 'x-default': url } },
    openGraph: { title, description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function DistrictTemplesPage({ params }: { params: Promise<{ district: string }> }) {
  const { district } = await params
  const districtName = unslugify(district)

  let temples: any[] = []
  let stateName = ''
  try {
    await connectDB()
    const all = await Temple.find(
      { status: 'approved' },
      'title description image city state deity pincode categories'
    ).lean() as any[]

    // Match by city slug OR pincode prefix
    temples = all.filter((t: any) => {
      if (t.city && slugify(t.city) === district) return true
      if (t.pincode && t.pincode.startsWith(district)) return true
      return false
    })

    if (temples.length === 0) {
      // Fallback: fuzzy match on city name containing district
      temples = all.filter((t: any) =>
        t.city && t.city.toLowerCase().includes(district.replace(/-/g, ' '))
      )
    }

    if (temples.length > 0) stateName = temples[0].state || ''
  } catch (e) {
    console.error('District temples error:', e)
  }

  const deities = Array.from(new Set(temples.map((t: any) => t.deity).filter(Boolean))).sort() as string[]
  const cities = Array.from(new Set(temples.map((t: any) => t.city).filter(Boolean))).sort() as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples in ${districtName} District`,
    description: `Hindu temples in ${districtName} district — ${temples.length} temples on Sarvdev.`,
    url: `${BASE}/temples/district/${district}`,
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
        ...(stateName ? [{ '@type': 'ListItem', position: 3, name: stateName, item: `${BASE}/temples/state/${slugify(stateName)}` }] : []),
        { '@type': 'ListItem', position: stateName ? 4 : 3, name: `${districtName} District`, item: `${BASE}/temples/district/${district}` },
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
            {stateName && (
              <>
                <span>/</span>
                <Link href={`/temples/state/${slugify(stateName)}`} className="hover:text-primary-600 transition-colors no-underline">{stateName}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-ink font-medium">{districtName} District</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Temples in {districtName} District
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Explore <strong className="text-ink">{temples.length}</strong> sacred temples in {districtName}
            {stateName ? `, ${stateName}` : ''}. Find timings, directions, and spiritual significance.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Nearby Cities</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => (
                <Link key={c} href={`/temples/city/${slugify(c)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">{c}</Link>
              ))}
            </div>
          </section>
        )}

        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found in {districtName} district</p>
            <p className="text-body-sm text-ink-faint mb-6">Help us build the directory by submitting temples from this area.</p>
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
                    alt={`${t.title} temple in ${districtName}${stateName ? `, ${stateName}` : ''}`}
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
          title={`Explore ${districtName} & Beyond`}
          deities={deities.slice(0, 4).map(d => ({ href: `/temples/deity/${slugify(d)}`, label: `${d} Temples` }))}
          states={[
            ...(stateName ? [{ href: `/temples/state/${slugify(stateName)}`, label: `All Temples in ${stateName}` }] : []),
            { href: '/temples', label: 'All Temples' },
            { href: '/sacred-categories', label: 'Sacred Categories' },
          ]}
        />
      </main>
    </>
  )
}
