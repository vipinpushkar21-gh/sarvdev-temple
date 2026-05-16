import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'

export const revalidate = 3600

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const REGIONS: Record<string, { title: string; titleHi: string; states: string[]; description: string }> = {
  'north-india': {
    title: 'North India Temples',
    titleHi: 'उत्तर भारत के मंदिर',
    states: ['Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Punjab', 'Haryana', 'Delhi', 'Chandigarh'],
    description: 'Explore temples of North India — from Varanasi to Kedarnath, Haridwar to Amritsar. Ancient shrines in the Himalayan foothills and sacred Ganga belt.',
  },
  'south-india': {
    title: 'South India Temples',
    titleHi: 'दक्षिण भारत के मंदिर',
    states: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry'],
    description: 'Discover the magnificent Dravidian temples of South India — from Meenakshi Amman to Tirupati, Rameshwaram to Padmanabhaswamy.',
  },
  'east-india': {
    title: 'East India Temples',
    titleHi: 'पूर्वी भारत के मंदिर',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam', 'Meghalaya', 'Tripura', 'Manipur', 'Mizoram', 'Nagaland', 'Arunachal Pradesh', 'Sikkim'],
    description: 'Explore the sacred temples of East India — Jagannath Puri, Kalighat, Bodh Gaya, Kamakhya, and more.',
  },
  'west-india': {
    title: 'West India Temples',
    titleHi: 'पश्चिम भारत के मंदिर',
    states: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'],
    description: 'Discover temples of Western India — Somnath, Siddhivinayak, Mahakaleshwar, Dilwara, Shirdi, and the Ashta Vinayak circuit.',
  },
  'central-india': {
    title: 'Central India Temples',
    titleHi: 'मध्य भारत के मंदिर',
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    description: 'Explore temples of Central India — Khajuraho, Mahakaleshwar Ujjain, Omkareshwar, and ancient heritage sites.',
  },
}

export async function generateMetadata(
  { params }: { params: Promise<{ region: string }> }
): Promise<Metadata> {
  const { region } = await params
  const r = REGIONS[region]
  if (!r) return { title: 'Temples by Region — Sarvdev' }

  const url = `${BASE}/temples/region/${region}`
  return {
    title: `${r.title} — Sarvdev`,
    description: r.description,
    keywords: [r.title, r.titleHi, 'temples India', 'Hindu temples', ...r.states.slice(0, 5), 'Sarvdev'],
    alternates: { canonical: url, languages: { 'en-IN': url, 'hi-IN': url, 'x-default': url } },
    openGraph: { title: `${r.title} — Sarvdev`, description: r.description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title: `${r.title} — Sarvdev`, description: r.description },
  }
}

export default async function RegionalTemplesPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const r = REGIONS[region]

  if (!r) {
    return (
      <main className="page-container section-sm text-center py-20">
        <p className="text-h3 font-serif text-ink-muted mb-4">Region not found</p>
        <Link href="/temples" className="btn btn-primary no-underline hover:no-underline">Browse All Temples</Link>
      </main>
    )
  }

  let temples: any[] = []
  try {
    await connectDB()
    const statePattern = r.states.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    temples = await Temple.find(
      { status: 'approved', state: { $regex: new RegExp(statePattern, 'i') } },
      'title description image city state deity'
    ).lean() as any[]
  } catch (e) {
    console.error('Regional temples error:', e)
  }

  const stateGroups: Record<string, any[]> = {}
  for (const t of temples) {
    const st = t.state || 'Other'
    if (!stateGroups[st]) stateGroups[st] = []
    stateGroups[st].push(t)
  }
  const sortedStates = Object.entries(stateGroups).sort((a, b) => b[1].length - a[1].length)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: r.title,
    description: r.description,
    url: `${BASE}/temples/region/${region}`,
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
        { '@type': 'ListItem', position: 3, name: r.title, item: `${BASE}/temples/region/${region}` },
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
            <span className="text-ink font-medium">{r.title}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-2">{r.title}</h1>
          <p className="text-body-sm font-medium text-primary-700 mb-3">{r.titleHi}</p>
          <p className="text-body text-ink-muted max-w-2xl">{r.description}</p>
          <p className="mt-4 text-body-sm text-ink-faint">
            <strong className="text-ink">{temples.length}</strong> temples across <strong className="text-ink">{sortedStates.length}</strong> states
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* State navigation */}
        <section className="mb-10">
          <h2 className="text-h3 font-serif text-secondary-700 mb-4">States in This Region</h2>
          <div className="flex flex-wrap gap-2">
            {sortedStates.map(([state, stTemples]) => (
              <Link key={state} href={`/temples/state/${slugify(state)}`}
                className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">
                {state} ({stTemples.length})
              </Link>
            ))}
          </div>
        </section>

        {/* Temple grid — show top 30 */}
        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found in this region</p>
            <Link href="/list-temple" className="btn btn-primary no-underline hover:no-underline">Submit Temple</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.slice(0, 30).map((t: any) => (
              <Link key={t._id.toString()} href={`/temples/${slugify(t.title)}`}
                className="group card overflow-hidden hover:shadow-md transition-all duration-300 no-underline">
                <div className="relative h-48 overflow-hidden">
                  <img src={t.image || DEFAULT_IMAGE}
                    alt={`${t.title}${t.city ? ` in ${t.city}` : ''}${t.state ? `, ${t.state}` : ''}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {t.deity && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">{t.deity}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{t.title}</h3>
                  <p className="text-caption text-ink-muted mt-1">{[t.city, t.state].filter(Boolean).join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Other regions */}
        <section className="mt-16 pt-10 border-t border-surface-border">
          <h2 className="text-h3 font-serif text-secondary-700 mb-4">Explore Other Regions</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(REGIONS).filter(([k]) => k !== region).map(([k, v]) => (
              <Link key={k} href={`/temples/region/${k}`}
                className="px-4 py-2 rounded-xl text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">
                {v.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
