import type { Metadata } from 'next'
import {
  citiesInPlace,
  deitiesInPlace,
  districtMatch,
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

export default async function DistrictTemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ district: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { district } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const districtName = unslugify(district)

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let cities: PlaceCount[] = []
  let deities: PlaceCount[] = []
  let resolvedName = districtName
  let stateName = ''

  const match = districtMatch(district)

  try {
    const [results, cityRows, deityRows] = await Promise.all([
      findTemples({ districtSlug: district, sort: 'title', page, pageSize: PAGE_SIZE }),
      citiesInPlace(match, 40),
      deitiesInPlace(match, 18),
    ])
    temples = results.temples
    total = results.total
    pages = results.pages
    cities = cityRows
    deities = deityRows
    if (temples[0]?.district) resolvedName = temples[0].district
    stateName = temples[0]?.state || ''
  } catch (error) {
    console.error('District temples error:', error)
  }

  const facets: FacetGroup[] = [
    {
      title: 'Cities and towns in this district',
      links: cities.map((row) => ({
        href: `/temples/city/${slugifyTemple(row.name)}`,
        label: row.name,
        count: row.count,
      })),
    },
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
    name: `Temples in ${resolvedName} District`,
    description: `Hindu temples recorded in ${resolvedName} district on Sarvdev.`,
    url: `${BASE}/temples/district/${district}`,
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
          name: `${resolvedName} District`,
          item: `${BASE}/temples/district/${district}`,
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
          { label: `${resolvedName} District` },
        ]}
        overline="Sacred atlas · District"
        title={`Temples in ${resolvedName} District`}
        intro={`Sacred places recorded in ${resolvedName} district${stateName ? `, ${stateName}` : ''}.`}
        temples={temples}
        total={total}
        page={page}
        pages={pages}
        pageHref={(next) => (next > 1 ? `/temples/district/${district}?page=${next}` : `/temples/district/${district}`)}
        facets={facets}
        emptyMessage={`No temples recorded in ${resolvedName} district yet`}
      />
    </>
  )
}
