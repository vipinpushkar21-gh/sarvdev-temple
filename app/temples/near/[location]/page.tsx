import type { Metadata } from 'next'
import { findTemples, templeHref, type TempleCardRecord } from '@/lib/temple-discovery'
import TempleCollection from '../../components/TempleCollection'

export const revalidate = 3600

const BASE = 'https://sarvdev.com'
const PAGE_SIZE = 24

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ location: string }> }
): Promise<Metadata> {
  const { location } = await params
  const name = unslugify(location)
  const title = `Temples in ${name} — Hindu Temples by Place`
  const description = `Hindu temples recorded in ${name}. Temple timings, presiding deity, history and how to reach, on Sarvdev.`
  const url = `${BASE}/temples/near/${location}`
  return {
    title,
    description,
    keywords: [`temples in ${name}`, `mandir ${name}`, `${name} temples`, 'Hindu temples', 'Sarvdev'],
    alternates: { canonical: url, languages: { 'en-IN': url, 'hi-IN': url, 'x-default': url } },
    openGraph: { title, description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function NearLocationTemplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ location: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { location } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const locationName = unslugify(location)

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let matchedBy: 'city' | 'state' | 'none' = 'none'

  try {
    const cityResults = await findTemples({ citySlug: location, sort: 'title', page, pageSize: PAGE_SIZE })
    if (cityResults.total > 0) {
      temples = cityResults.temples
      total = cityResults.total
      pages = cityResults.pages
      matchedBy = 'city'
    } else {
      const stateResults = await findTemples({ stateSlug: location, sort: 'title', page, pageSize: PAGE_SIZE })
      if (stateResults.total > 0) {
        temples = stateResults.temples
        total = stateResults.total
        pages = stateResults.pages
        matchedBy = 'state'
      }
    }
  } catch (error) {
    console.error('Location temples error:', error)
  }

  const canonicalHref =
    matchedBy === 'city'
      ? `/temples/city/${location}`
      : matchedBy === 'state'
        ? `/temples/state/${location}`
        : '/temples'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Temples in ${locationName}`,
    description: `Hindu temples recorded in ${locationName} on Sarvdev.`,
    url: `${BASE}/temples/near/${location}`,
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
        { '@type': 'ListItem', position: 3, name: locationName, item: `${BASE}/temples/near/${location}` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TempleCollection
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Temples', href: '/temples' }, { label: locationName }]}
        overline="Sacred atlas · Place"
        title={`Temples in ${locationName}`}
        intro={
          matchedBy === 'none'
            ? `No temple is recorded for ${locationName} in this archive yet.`
            : `These temples are listed because their recorded ${matchedBy} is ${locationName}. This is a place listing, not a distance-based search — for temples measured by distance, open a temple page and read its nearby section.`
        }
        temples={temples}
        total={total}
        page={page}
        pages={pages}
        pageHref={(next) => (next > 1 ? `/temples/near/${location}?page=${next}` : `/temples/near/${location}`)}
        emptyMessage={`No temples recorded for ${locationName} yet`}
      >
        {matchedBy !== 'none' && (
          <p className="mt-10 border-t border-surface-border pt-5 text-body-sm text-ink-muted">
            Canonical listing for this place:{' '}
            <a href={canonicalHref} className="font-semibold text-primary-700 no-underline hover:text-maroon">
              {matchedBy === 'city' ? `Temples in ${locationName}` : `Temples in ${locationName} state`}
            </a>
          </p>
        )}
      </TempleCollection>
    </>
  )
}
