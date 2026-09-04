import type { Metadata } from 'next'
import {
  cityMatch,
  deitiesInPlace,
  findTemples,
  templeHref,
  type PlaceCount,
  type TempleCardRecord,
} from '@/lib/temple-discovery'
import { slugifyTemple } from '@/lib/temple-normalization'
import TempleCollection, { type FacetGroup } from '../../components/TempleCollection'

export const revalidate = 3600

const BASE = 'https://sarvdev.com'
const PAGE_SIZE = 24

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params
  const cityName = unslugify(city)
  const title = `Temples in ${cityName} — Sarvdev`
  const description = `Explore Hindu temples in ${cityName}. Find temple timings, deity information, directions and spiritual significance of temples in ${cityName} on Sarvdev.`
  const url = `${BASE}/temples/city/${city}`

  return {
    title,
    description,
    keywords: [`temples in ${cityName}`, `${cityName} mandir`, `${cityName} temples`, 'Hindu temples', 'Sarvdev'],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CityTemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { city } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const cityName = unslugify(city)

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let deities: PlaceCount[] = []
  let resolvedName = cityName
  let stateName = ''
  let districtName = ''

  try {
    const [results, deityRows] = await Promise.all([
      findTemples({ citySlug: city, sort: 'title', page, pageSize: PAGE_SIZE }),
      deitiesInPlace(cityMatch(city), 18),
    ])
    temples = results.temples
    total = results.total
    pages = results.pages
    deities = deityRows
    if (temples[0]?.city) resolvedName = temples[0].city
    stateName = temples[0]?.state || ''
    districtName = temples[0]?.district || ''
  } catch (error) {
    console.error('City temples fetch error:', error)
  }

  const facets: FacetGroup[] = [
    {
      title: 'Presiding deities recorded here',
      links: deities.map((row) => ({
        href: `/temples?q=${encodeURIComponent(row.name)}`,
        label: row.name.length > 42 ? `${row.name.slice(0, 42)}…` : row.name,
      })),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples in ${resolvedName}`,
    description: `Hindu temples in ${resolvedName}${stateName ? `, ${stateName}` : ''} recorded on Sarvdev.`,
    url: `${BASE}/temples/city/${city}`,
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
        ...(stateName
          ? [{ '@type': 'ListItem', position: 3, name: stateName, item: `${BASE}/temples/state/${slugifyTemple(stateName)}` }]
          : []),
        {
          '@type': 'ListItem',
          position: stateName ? 4 : 3,
          name: resolvedName,
          item: `${BASE}/temples/city/${city}`,
        },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TempleCollection
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Temples', href: '/temples' },
          ...(stateName ? [{ label: stateName, href: `/temples/state/${slugifyTemple(stateName)}` }] : []),
          ...(districtName && districtName !== resolvedName
            ? [{ label: districtName, href: `/temples/district/${slugifyTemple(districtName)}` }]
            : []),
          { label: resolvedName },
        ]}
        overline="Sacred atlas · City"
        title={`Temples in ${resolvedName}`}
        intro={`Sacred places recorded in ${resolvedName}${districtName && districtName !== resolvedName ? `, ${districtName} district` : ''}${stateName ? `, ${stateName}` : ''}.`}
        temples={temples}
        total={total}
        page={page}
        pages={pages}
        pageHref={(next) => (next > 1 ? `/temples/city/${city}?page=${next}` : `/temples/city/${city}`)}
        facets={facets}
        emptyMessage={`No temples recorded in ${resolvedName} yet`}
      />
    </>
  )
}
