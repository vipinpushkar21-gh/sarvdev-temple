import Link from 'next/link'
import {
  TEMPLE_PAGE_SIZE,
  findTemples,
  normalizeSort,
  sacredCategoryCounts,
  statesWithCounts,
  templeHref,
  type PlaceCount,
  type TempleCardRecord,
} from '@/lib/temple-discovery'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/sacred-categories'
import TempleCard from './components/TempleCard'
import TempleSearchControls, { type FilterOption } from './components/TempleSearchControls'
import PlaceDiscovery from './components/PlaceDiscovery'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'

type SearchParams = {
  q?: string
  search?: string
  state?: string
  category?: string
  sort?: string
  page?: string
}

function buildPageHref(params: Record<string, string>, page: number) {
  const search = new URLSearchParams(params)
  if (page > 1) search.set('page', String(page))
  else search.delete('page')
  const query = search.toString()
  return query ? `/temples?${query}` : '/temples'
}

export default async function TemplesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams
  const q = (resolved.q || resolved.search || '').trim()
  const state = (resolved.state || '').trim()
  const category = (resolved.category || '').trim()
  const sort = normalizeSort(resolved.sort)
  const page = Math.max(1, parseInt(resolved.page || '1', 10) || 1)

  let temples: TempleCardRecord[] = []
  let total = 0
  let pages = 1
  let states: PlaceCount[] = []
  let collections: PlaceCount[] = []
  let failed = false

  try {
    const [results, stateRows, categoryRows] = await Promise.all([
      findTemples({ q, state, category, sort, page }),
      statesWithCounts(),
      sacredCategoryCounts(),
    ])
    temples = results.temples
    total = results.total
    pages = results.pages
    states = stateRows
    collections = categoryRows
  } catch {
    failed = true
  }

  const knownCategorySlugs = new Set(getAllCategorySlugs())
  const collectionOptions: FilterOption[] = collections.map((row) => ({
    value: row.name,
    label: getCategoryBySlug(row.name)?.name || row.name,
    count: row.count,
  }))
  const stateOptions: FilterOption[] = states.map((row) => ({ value: row.name, label: row.name, count: row.count }))

  const activeCollection = category ? getCategoryBySlug(category) : undefined
  const baseParams: Record<string, string> = {}
  if (q) baseParams.q = q
  if (state) baseParams.state = state
  if (category) baseParams.category = category
  if (sort !== 'newest') baseParams.sort = sort

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sacred places of Bharat on Sarvdev',
    numberOfItems: temples.length,
    itemListElement: temples.map((temple, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * TEMPLE_PAGE_SIZE + index + 1,
      name: temple.title,
      url: `${BASE_URL}${templeHref(temple)}`,
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE_URL}/temples` },
    ],
  }

  return (
    <>
      {temples.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container max-w-3xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Sacred atlas</p>
          <h1 className="mt-2 font-display text-display-sm text-secondary-800">Sacred Places of Bharat</h1>
          <p className="mt-4 text-body text-ink-muted">
            Temples recorded with their place, presiding deity, history and darshan timings — a reading atlas of
            living sacred geography. Search by name, or travel inward from a state to a town.
          </p>
        </div>
      </header>

      <TempleSearchControls
        filters={{ q, state, category, sort }}
        states={stateOptions}
        categories={collectionOptions}
      />

      <main className="page-container py-section-sm">
        {failed ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">Temple records are unavailable right now</h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              We could not reach the temple archive. Please refresh in a moment.
            </p>
          </div>
        ) : temples.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">No temples match this search</h2>
            <p className="mt-2 text-body-sm text-ink-muted">Try another name or place, or browse the whole atlas.</p>
            <Link href="/temples" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Show all temples
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'temple' : 'temples'}
              {activeCollection ? ` in ${activeCollection.name}` : ''}
              {state ? ` in ${state}` : ''}
              {q ? ` matching “${q}”` : ''}
              {pages > 1 ? ` · page ${page} of ${pages}` : ''}
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {temples.map((temple) => (
                <TempleCard key={temple._id} temple={temple} />
              ))}
            </div>

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
                {page > 1 ? (
                  <Link href={buildPageHref(baseParams, page - 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    ← Previous
                  </Link>
                ) : <span />}
                <span className="text-caption text-ink-muted">Page {page} of {pages}</span>
                {page < pages ? (
                  <Link href={buildPageHref(baseParams, page + 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    Next →
                  </Link>
                ) : <span />}
              </nav>
            )}
          </>
        )}
      </main>

      <PlaceDiscovery states={states} />

      {collections.length > 0 && (
        <section className="border-t border-surface-border bg-surface-raised py-section-sm">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Sacred collections</p>
              <h2 className="mt-2 font-display text-h1 text-secondary-800">Pilgrimage circuits and temple traditions</h2>
              <p className="mt-3 text-body text-ink-muted">
                Counts below are the temples currently recorded in this archive for each collection, not the
                traditional total of the circuit.
              </p>
            </div>

            <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => {
                const known = getCategoryBySlug(collection.name)
                const href = knownCategorySlugs.has(collection.name)
                  ? `/temples/pilgrimage/${collection.name}`
                  : `/temples?category=${encodeURIComponent(collection.name)}`
                return (
                  <li key={collection.name} className="border-b border-surface-border pb-3">
                    <Link href={href} className="group flex items-baseline justify-between gap-4 no-underline hover:no-underline">
                      <span>
                        <span className="block text-body text-secondary-800 transition-colors group-hover:text-primary-700">
                          {known?.name || collection.name}
                        </span>
                        {known?.nameHi && (
                          <span className="mt-0.5 block font-devanagari text-body-sm text-ink-muted">{known.nameHi}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-caption text-ink-muted">{collection.count}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <Link
              href="/temples/pilgrimage"
              className="mt-8 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
            >
              All pilgrimage collections →
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
