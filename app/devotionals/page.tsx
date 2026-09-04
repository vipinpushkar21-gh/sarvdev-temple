import Link from 'next/link'
import {
  DEVOTIONAL_PAGE_SIZE,
  categoryFacets,
  deityFacets,
  devotionalHref,
  findDevotionals,
  languageFacets,
  normalizeDevotionalSort,
  slugifyDevotionalText,
  type DevotionalCardRecord,
  type DevotionalFacet,
} from '@/lib/devotional-discovery'
import DevotionalCard from './components/DevotionalCard'
import DevotionalLibraryControls, { type LibraryOption } from './components/DevotionalLibraryControls'
import DevotionalPagination from './components/DevotionalPagination'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'

type SearchParams = {
  q?: string
  search?: string
  category?: string
  deity?: string
  language?: string
  sort?: string
  page?: string
}

export default async function DevotionalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams
  const q = (resolved.q || resolved.search || '').trim()
  const category = (resolved.category || '').trim()
  const deity = (resolved.deity || '').trim()
  const language = (resolved.language || '').trim()
  const sort = normalizeDevotionalSort(resolved.sort)
  const page = Math.max(1, parseInt(resolved.page || '1', 10) || 1)

  // `category` accepts either a canonical slug (legacy links) or the stored category name.
  const categoryIsSlug = category.includes('-') || category === category.toLowerCase()

  let devotionals: DevotionalCardRecord[] = []
  let total = 0
  let pages = 1
  let categories: DevotionalFacet[] = []
  let languages: DevotionalFacet[] = []
  let deities: DevotionalFacet[] = []
  let failed = false

  try {
    const [results, categoryRows, languageRows, deityRows] = await Promise.all([
      findDevotionals({
        q,
        category: categoryIsSlug ? undefined : category,
        categorySlug: categoryIsSlug ? category : undefined,
        deity,
        language,
        sort,
        page,
      }),
      categoryFacets(),
      languageFacets(),
      deityFacets(30),
    ])
    devotionals = results.devotionals
    total = results.total
    pages = results.pages
    categories = categoryRows
    languages = languageRows
    deities = deityRows
  } catch {
    failed = true
  }

  const categoryOptions: LibraryOption[] = categories.map((row) => ({
    value: row.value,
    label: row.label,
    count: row.count,
  }))
  const deityOptions: LibraryOption[] = deities.map((row) => ({
    value: row.value,
    label: row.label,
    count: row.count,
  }))
  const languageOptions: LibraryOption[] = languages.map((row) => ({
    value: row.value,
    label: row.label,
    count: row.count,
  }))

  const baseParams: Record<string, string> = {}
  if (q) baseParams.q = q
  if (category) baseParams.category = category
  if (deity) baseParams.deity = deity
  if (language) baseParams.language = language
  if (sort !== 'featured') baseParams.sort = sort

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bhakti Library on Sarvdev',
    numberOfItems: devotionals.length,
    itemListElement: devotionals.map((devotional, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * DEVOTIONAL_PAGE_SIZE + index + 1,
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
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Read · Pray · Reflect</p>
          <h1 className="mt-2 font-display text-display-sm text-secondary-800">Bhakti Library</h1>
          <p className="mt-4 text-body text-ink-muted">
            Aarti, chalisa, stotra, mantra, namavali and vrat katha recorded as readable sacred text in Sanskrit and
            Hindi. Search by name or deity, or read through a devotional form at your own pace.
          </p>
        </div>
      </header>

      <DevotionalLibraryControls
        filters={{ q, category, deity, language, sort }}
        categories={categoryOptions}
        deities={deityOptions}
        languages={languageOptions}
        searchPlaceholder="Search by devotional, deity or form"
      />

      <main className="page-container py-section-sm">
        {failed ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">Devotional texts are unavailable right now</h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              We could not reach the devotional archive. Please refresh in a moment.
            </p>
          </div>
        ) : devotionals.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">No devotionals match this search</h2>
            <p className="mt-2 text-body-sm text-ink-muted">Try another name, deity or devotional form.</p>
            <Link href="/devotionals" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Show the whole library
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'devotional' : 'devotionals'}
              {category ? ` in ${category}` : ''}
              {deity ? ` for ${deity}` : ''}
              {language ? ` in ${language}` : ''}
              {q ? ` matching “${q}”` : ''}
              {pages > 1 ? ` · page ${page} of ${pages}` : ''}
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {devotionals.map((devotional) => (
                <DevotionalCard key={devotional._id} devotional={devotional} />
              ))}
            </div>

            <DevotionalPagination basePath="/devotionals" params={baseParams} page={page} pages={pages} />
          </>
        )}
      </main>

      {categories.length > 0 && (
        <section className="border-t border-surface-border bg-surface-raised py-section-sm">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Devotional forms</p>
              <h2 className="mt-2 font-display text-h1 text-secondary-800">Read by form of practice</h2>
              <p className="mt-3 text-body text-ink-muted">
                Counts are the texts currently recorded in this library for each form.
              </p>
            </div>

            <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((row) => (
                <li key={row.value} className="border-b border-surface-border pb-3">
                  <Link
                    href={`/devotionals/category/${slugifyDevotionalText(row.value)}`}
                    className="group flex items-baseline justify-between gap-4 no-underline hover:no-underline"
                  >
                    <span className="block text-body text-secondary-800 transition-colors group-hover:text-primary-700">
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

      {deities.length > 0 && (
        <section className="border-t border-surface-border py-section-sm">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Devotional streams</p>
              <h2 className="mt-2 font-display text-h1 text-secondary-800">Read by deity</h2>
              <p className="mt-3 text-body text-ink-muted">
                Deity names here are the names recorded on the texts themselves; they group devotionals and do not
                always correspond to a deity profile.
              </p>
            </div>

            <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {deities.map((row) => (
                <li key={row.value} className="border-b border-surface-border pb-3">
                  <Link
                    href={`/devotionals/deity/${slugifyDevotionalText(row.value)}`}
                    className="group flex items-baseline justify-between gap-4 no-underline hover:no-underline"
                  >
                    <span className="block text-body-sm text-secondary-800 transition-colors group-hover:text-primary-700">
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
