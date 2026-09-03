import Link from 'next/link'
import {
  categoryFacets,
  deityFacets,
  devotionalHref,
  findDevotionals,
  languageFacets,
  normalizeDevotionalSort,
  slugifyDevotionalText,
  subcategoryFacets,
  titleFromSlug,
  type DevotionalCardRecord,
  type DevotionalFacet,
} from '@/lib/devotional-discovery'
import DevotionalCard from '../../components/DevotionalCard'
import DevotionalLibraryControls, { type LibraryOption } from '../../components/DevotionalLibraryControls'
import DevotionalPagination from '../../components/DevotionalPagination'
import { getCategoryDescription, getCategoryInfo } from '../../components/devotional-utils'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'
const PAGE_SIZE = 24

type SearchParams = {
  q?: string
  deity?: string
  language?: string
  subcategory?: string
  sort?: string
  page?: string
}

export default async function DevotionalCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const resolved = await searchParams
  const categorySlug = slug.toLowerCase()
  const categoryInfo = getCategoryInfo(categorySlug)
  const label = categoryInfo?.label || titleFromSlug(categorySlug)
  const description = categoryInfo?.description || getCategoryDescription(label)

  const q = (resolved.q || '').trim()
  const deity = (resolved.deity || '').trim()
  const language = (resolved.language || '').trim()
  const subcategory = (resolved.subcategory || '').trim()
  const sort = normalizeDevotionalSort(resolved.sort)
  const page = Math.max(1, parseInt(resolved.page || '1', 10) || 1)

  let devotionals: DevotionalCardRecord[] = []
  let total = 0
  let pages = 1
  let deities: DevotionalFacet[] = []
  let languages: DevotionalFacet[] = []
  let subcategories: DevotionalFacet[] = []
  let siblings: DevotionalFacet[] = []
  let failed = false

  try {
    const [results, deityRows, languageRows, subcategoryRows, categoryRows] = await Promise.all([
      findDevotionals({ q, categorySlug, deity, language, subcategory, sort, page, pageSize: PAGE_SIZE }),
      deityFacets(24, { categorySlug }),
      languageFacets(),
      subcategoryFacets(categorySlug),
      categoryFacets(),
    ])
    devotionals = results.devotionals
    total = results.total
    pages = results.pages
    deities = deityRows
    languages = languageRows
    subcategories = subcategoryRows
    siblings = categoryRows
  } catch {
    failed = true
  }

  const basePath = `/devotionals/category/${categorySlug}`
  const baseParams: Record<string, string> = {}
  if (q) baseParams.q = q
  if (deity) baseParams.deity = deity
  if (language) baseParams.language = language
  if (subcategory) baseParams.subcategory = subcategory
  if (sort !== 'featured') baseParams.sort = sort

  const toOption = (row: DevotionalFacet): LibraryOption => ({
    value: row.value,
    label: row.label,
    count: row.count,
  })

  function subcategoryHref(value: string) {
    const next = new URLSearchParams(baseParams)
    if (value) next.set('subcategory', value)
    else next.delete('subcategory')
    next.delete('page')
    const search = next.toString()
    return search ? `${basePath}?${search}` : basePath
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${label} devotionals on Sarvdev`,
    numberOfItems: devotionals.length,
    itemListElement: devotionals.map((devotional, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * PAGE_SIZE + index + 1,
      name: devotional.title,
      url: `${BASE_URL}${devotionalHref(devotional)}`,
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Devotionals', item: `${BASE_URL}/devotionals` },
      { '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}${basePath}` },
    ],
  }

  return (
    <>
      {devotionals.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-caption text-ink-muted">
            <Link href="/devotionals" className="no-underline hover:text-primary-700">Bhakti Library</Link>
            <span className="px-2">/</span>
            <span>{label}</span>
          </nav>
          <h1 className="mt-3 font-display text-display-sm text-secondary-800">{label}</h1>
          {categoryInfo?.hindi && (
            <p className="mt-1 font-devanagari text-h3 text-ink-muted">{categoryInfo.hindi}</p>
          )}
          <p className="mt-4 text-body text-ink-muted">{description}</p>
        </div>
      </header>

      <DevotionalLibraryControls
        basePath={basePath}
        filters={{ q, category: label, deity, language, sort }}
        categories={[]}
        deities={deities.map(toOption)}
        languages={languages.map(toOption)}
        lockedCategory
        extraParams={subcategory ? { subcategory } : undefined}
        searchPlaceholder={`Search within ${label}`}
      />

      <main className="page-container py-section-sm">
        {subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-surface-border pb-5 text-body-sm">
            <Link
              href={subcategoryHref('')}
              className={`no-underline ${subcategory ? 'text-ink-muted hover:text-primary-700' : 'font-semibold text-primary-700'}`}
            >
              All
            </Link>
            {subcategories.map((row) => (
              <Link
                key={row.value}
                href={subcategoryHref(row.value)}
                className={`font-devanagari no-underline ${subcategory === row.value ? 'font-semibold text-primary-700' : 'text-ink-muted hover:text-primary-700'}`}
              >
                {row.label} <span className="text-caption text-ink-faint">{row.count}</span>
              </Link>
            ))}
          </div>
        )}

        {failed ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">This collection is unavailable right now</h2>
            <p className="mt-2 text-body-sm text-ink-muted">Please refresh in a moment.</p>
          </div>
        ) : devotionals.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">No {label} texts match this search</h2>
            <Link href={basePath} className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Show all {label}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'text' : 'texts'}
              {subcategory ? ` in ${subcategory}` : ''}
              {deity ? ` for ${deity}` : ''}
              {q ? ` matching “${q}”` : ''}
              {pages > 1 ? ` · page ${page} of ${pages}` : ''}
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {devotionals.map((devotional) => (
                <DevotionalCard key={devotional._id} devotional={devotional} />
              ))}
            </div>

            <DevotionalPagination basePath={basePath} params={baseParams} page={page} pages={pages} />
          </>
        )}
      </main>

      {siblings.length > 0 && (
        <section className="border-t border-surface-border bg-surface-raised py-section-sm">
          <div className="page-container">
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Continue reading</p>
            <h2 className="mt-2 font-display text-h1 text-secondary-800">Other devotional forms</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings
                .filter((row) => slugifyDevotionalText(row.value) !== categorySlug)
                .map((row) => (
                  <li key={row.value} className="border-b border-surface-border pb-3">
                    <Link
                      href={`/devotionals/category/${slugifyDevotionalText(row.value)}`}
                      className="group flex items-baseline justify-between gap-4 no-underline hover:no-underline"
                    >
                      <span className="text-body text-secondary-800 transition-colors group-hover:text-primary-700">
                        {row.label}
                      </span>
                      <span className="shrink-0 text-caption text-ink-muted">{row.count}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
