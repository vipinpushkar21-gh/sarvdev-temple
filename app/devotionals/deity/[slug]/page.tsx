import Link from 'next/link'
import {
  categoryFacets,
  deityAliasNames,
  devotionalHref,
  findDevotionals,
  languageFacets,
  normalizeDevotionalSort,
  resolveDeityProfile,
  slugifyDevotionalText,
  titleFromSlug,
  type DevotionalCardRecord,
  type DevotionalFacet,
} from '@/lib/devotional-discovery'
import DevotionalCard from '../../components/DevotionalCard'
import DevotionalLibraryControls, { type LibraryOption } from '../../components/DevotionalLibraryControls'
import DevotionalPagination from '../../components/DevotionalPagination'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'
const PAGE_SIZE = 24

type SearchParams = {
  q?: string
  category?: string
  language?: string
  sort?: string
  page?: string
}

export default async function DevotionalDeityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const resolved = await searchParams
  const deitySlug = slug.toLowerCase()
  const label = titleFromSlug(deitySlug)

  const q = (resolved.q || '').trim()
  const category = (resolved.category || '').trim()
  const language = (resolved.language || '').trim()
  const sort = normalizeDevotionalSort(resolved.sort)
  const page = Math.max(1, parseInt(resolved.page || '1', 10) || 1)

  let devotionals: DevotionalCardRecord[] = []
  let total = 0
  let pages = 1
  let categories: DevotionalFacet[] = []
  let languages: DevotionalFacet[] = []
  let deityProfile: { slug: string; name?: string; nameHi?: string } | null = null
  let failed = false

  try {
    const [results, categoryRows, languageRows, profile] = await Promise.all([
      findDevotionals({ q, deitySlug, category, language, sort, page, pageSize: PAGE_SIZE }),
      categoryFacets(),
      languageFacets(),
      resolveDeityProfile(deitySlug),
    ])
    devotionals = results.devotionals
    total = results.total
    pages = results.pages
    categories = categoryRows
    languages = languageRows
    deityProfile = profile
  } catch {
    failed = true
  }

  const deityHi = devotionals.find((item) => item.deityHi)?.deityHi
  const displayName = devotionals.find((item) => item.deity)?.deity || label
  const aliases = deityAliasNames(deitySlug).filter((alias) => alias.toLowerCase() !== deitySlug)

  const basePath = `/devotionals/deity/${deitySlug}`
  const baseParams: Record<string, string> = {}
  if (q) baseParams.q = q
  if (category) baseParams.category = category
  if (language) baseParams.language = language
  if (sort !== 'featured') baseParams.sort = sort

  const toOption = (row: DevotionalFacet): LibraryOption => ({
    value: row.value,
    label: row.label,
    count: row.count,
  })

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${displayName} devotionals on Sarvdev`,
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
      { '@type': 'ListItem', position: 3, name: displayName, item: `${BASE_URL}${basePath}` },
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
            <span>{displayName}</span>
          </nav>
          <h1 className="mt-3 font-display text-display-sm text-secondary-800">Devotionals for {displayName}</h1>
          {deityHi && <p className="mt-1 font-devanagari text-h3 text-ink-muted">{deityHi}</p>}
          <p className="mt-4 text-body text-ink-muted">
            Texts recorded under this name in the Bhakti Library
            {aliases.length > 0 ? `, including entries written as ${aliases.slice(0, 4).join(', ')}` : ''}.
          </p>
          {deityProfile && (
            <Link
              href={`/deities/${deityProfile.slug}`}
              className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
            >
              Read about {deityProfile.name || displayName} →
            </Link>
          )}
        </div>
      </header>

      <DevotionalLibraryControls
        basePath={basePath}
        filters={{ q, category, deity: '', language, sort }}
        categories={categories.map(toOption)}
        deities={[]}
        languages={languages.map(toOption)}
        searchPlaceholder={`Search ${displayName} devotionals`}
      />

      <main className="page-container py-section-sm">
        {failed ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">This collection is unavailable right now</h2>
            <p className="mt-2 text-body-sm text-ink-muted">Please refresh in a moment.</p>
          </div>
        ) : devotionals.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">No devotionals recorded for this name yet</h2>
            <Link href="/devotionals" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Return to the Bhakti Library
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'text' : 'texts'}
              {category ? ` · ${category}` : ''}
              {language ? ` · ${language}` : ''}
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

      {categories.length > 0 && (
        <section className="border-t border-surface-border bg-surface-raised py-section-sm">
          <div className="page-container">
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Devotional forms</p>
            <h2 className="mt-2 font-display text-h1 text-secondary-800">Read by form</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((row) => (
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
