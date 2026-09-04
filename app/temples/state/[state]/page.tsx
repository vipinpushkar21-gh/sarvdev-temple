import type { Metadata } from 'next'
import {
  citiesInPlace,
  deitiesInPlace,
  districtsInPlace,
  findTemples,
  stateMatch,
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
    openGraph: { title, description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function StateTemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ state: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { state } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const stateName = unslugify(state)

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let districts: PlaceCount[] = []
  let cities: PlaceCount[] = []
  let deities: PlaceCount[] = []
  let resolvedName = stateName

  const match = stateMatch(state)

  try {
    const [results, districtRows, cityRows, deityRows] = await Promise.all([
      findTemples({ stateSlug: state, sort: 'title', page, pageSize: PAGE_SIZE }),
      districtsInPlace(match, 60),
      citiesInPlace(match, 60),
      deitiesInPlace(match, 18),
    ])
    temples = results.temples
    total = results.total
    pages = results.pages
    districts = districtRows
    cities = cityRows
    deities = deityRows
    if (temples[0]?.state) resolvedName = temples[0].state
  } catch (error) {
    console.error('State temples fetch error:', error)
  }

  const facets: FacetGroup[] = [
    {
      title: 'Districts',
      links: districts.map((row) => ({
        href: `/temples/district/${slugifyTemple(row.name)}`,
        label: row.name,
        count: row.count,
      })),
    },
    {
      title: 'Cities and towns',
      links: cities.map((row) => ({
        href: `/temples/city/${slugifyTemple(row.name)}`,
        label: row.name,
        count: row.count,
      })),
    },
    {
      title: 'Presiding deities recorded here',
      links: deities.slice(0, 18).map((row) => ({
        href: `/temples?q=${encodeURIComponent(row.name)}`,
        label: row.name.length > 42 ? `${row.name.slice(0, 42)}…` : row.name,
      })),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples in ${resolvedName}`,
    description: `Hindu temples in ${resolvedName} recorded on Sarvdev.`,
    url: `${BASE}/temples/state/${state}`,
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
        { '@type': 'ListItem', position: 3, name: resolvedName, item: `${BASE}/temples/state/${state}` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TempleCollection
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Temples', href: '/temples' }, { label: resolvedName }]}
        overline="Sacred atlas · State"
        title={`Temples in ${resolvedName}`}
        intro={`Sacred places recorded across ${resolvedName}, with their districts, towns and presiding deities.`}
        temples={temples}
        total={total}
        page={page}
        pages={pages}
        pageHref={(next) => (next > 1 ? `/temples/state/${state}?page=${next}` : `/temples/state/${state}`)}
        facets={facets}
        emptyMessage={`No temples recorded in ${resolvedName} yet`}
      />
    </>
  )
}
