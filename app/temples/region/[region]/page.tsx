import type { Metadata } from 'next'
import Link from 'next/link'
import {
  findTemples,
  statesInPlace,
  templeHref,
  type PlaceCount,
  type TempleCardRecord,
} from '@/lib/temple-discovery'
import { normalizeTempleText } from '@/lib/temple-normalization'
import TempleCollection, { type FacetGroup } from '../../components/TempleCollection'

export const revalidate = 3600

const BASE = 'https://sarvdev.com'
const PAGE_SIZE = 24

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

export default async function RegionalTemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { region } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const r = REGIONS[region]

  if (!r) {
    return (
      <main className="page-container section-sm text-center py-20">
        <p className="text-h3 font-serif text-ink-muted mb-4">Region not found</p>
        <Link href="/temples" className="btn btn-primary no-underline hover:no-underline">Browse All Temples</Link>
      </main>
    )
  }

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let states: PlaceCount[] = []

  try {
    const [results, stateRows] = await Promise.all([
      findTemples({ states: r.states, sort: 'place', page, pageSize: PAGE_SIZE }),
      statesInPlace({ stateNormalized: { $in: r.states.map((state) => normalizeTempleText(state)) } }, 40),
    ])
    temples = results.temples
    total = results.total
    pages = results.pages
    states = stateRows
  } catch (error) {
    console.error('Regional temples error:', error)
  }

  const facets: FacetGroup[] = [
    {
      title: 'States in this region',
      links: states.map((row) => ({
        href: `/temples/state/${slugify(row.name)}`,
        label: row.name,
        count: row.count,
      })),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: r.title,
    description: r.description,
    url: `${BASE}/temples/region/${region}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: temples.map((temple, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * PAGE_SIZE + index + 1,
        name: temple.title,
        url: `${BASE}${templeHref(temple)}`,
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
      <TempleCollection
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Temples', href: '/temples' }, { label: r.title }]}
        overline="Sacred atlas · Region"
        title={r.title}
        intro={r.description}
        temples={temples}
        total={total}
        page={page}
        pages={pages}
        pageHref={(next) => (next > 1 ? `/temples/region/${region}?page=${next}` : `/temples/region/${region}`)}
        facets={facets}
        emptyMessage="No temples recorded in this region yet"
      >
        <section className="mt-14 border-t border-surface-border pt-8">
          <h2 className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Other regions</h2>
          <p className="mt-2.5 text-body-sm leading-loose text-ink-muted">
            {Object.entries(REGIONS)
              .filter(([key]) => key !== region)
              .map(([key, value], index, list) => (
                <span key={key}>
                  <Link href={`/temples/region/${key}`} className="text-ink-muted no-underline transition-colors hover:text-primary-700">
                    {value.title}
                  </Link>
                  {index < list.length - 1 ? <span className="px-2 text-ink-faint">·</span> : null}
                </span>
              ))}
          </p>
        </section>
      </TempleCollection>
    </>
  )
}
