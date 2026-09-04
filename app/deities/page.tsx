import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'
import { normalizeDeityForRead } from '@/lib/deity-normalization'
import DeityIndexControls, { type DeityCategoryOption } from './components/DeityIndexControls'
import DeityCard, { type DeityCardRecord } from './components/DeityCard'
import KotiDevtaEditorial from './components/KotiDevtaEditorial'
import DeityFaq from './components/DeityFaq'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'
const PAGE_SIZE = 24
const CARD_FIELDS = 'slug name nameHi description descriptionHi attributes categoryName categorySlug primaryMedia cardMedia heroMedia image imageCard imageHero order'

type SearchParams = { q?: string; category?: string; page?: string }

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildFilter(query: string, category: string) {
  const filter: Record<string, unknown> = { status: { $ne: 'rejected' } }
  if (category) filter.categorySlug = category
  if (query) {
    const regex = new RegExp(escapeRegex(query), 'i')
    filter.$or = [
      { name: regex },
      { nameHi: regex },
      { slug: regex },
      { aliases: regex },
      { slugAliases: regex },
    ]
  }
  return filter
}

let categoryCache: { options: DeityCategoryOption[]; ts: number } | null = null
const CATEGORY_TTL = 5 * 60_000

async function loadCategoryOptions(): Promise<DeityCategoryOption[]> {
  if (categoryCache && Date.now() - categoryCache.ts < CATEGORY_TTL) return categoryCache.options
  const rows = await Deity.aggregate([
    { $match: { status: { $ne: 'rejected' }, categorySlug: { $nin: [null, ''] } } },
    { $group: { _id: '$categorySlug', name: { $first: '$categoryName' }, nameHi: { $first: '$categoryNameHi' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
  const options = rows
    .filter((row: { _id?: string }) => Boolean(row._id))
    .map((row: { _id: string; name?: string; nameHi?: string; count: number }) => ({
      slug: row._id,
      name: row.name || row._id,
      nameHi: row.nameHi,
      count: row.count,
    }))
  categoryCache = { options, ts: Date.now() }
  return options
}

function buildPageHref(query: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/deities?${search}` : '/deities'
}

export default async function DeitiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams
  const query = (resolved.q || '').trim()
  const category = (resolved.category || '').trim()
  const page = Math.max(1, parseInt(resolved.page || '1', 10) || 1)

  let deities: DeityCardRecord[] = []
  let categories: DeityCategoryOption[] = []
  let total = 0
  let failed = false

  try {
    await connectDB()
    const filter = buildFilter(query, category)
    const [rows, count, options] = await Promise.all([
      Deity.find(filter, CARD_FIELDS)
        .sort({ order: 1, name: 1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Deity.countDocuments(filter),
      loadCategoryOptions(),
    ])
    deities = (rows as Record<string, unknown>[])
      .map((row) => normalizeDeityForRead(row))
      .filter((row: DeityCardRecord) => Boolean(row.slug && row.name))
      .map((row: DeityCardRecord) => JSON.parse(JSON.stringify(row)))
    total = count
    categories = options
  } catch {
    failed = true
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const activeCategory = categories.find((option) => option.slug === category)

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: activeCategory ? `${activeCategory.name} — Hindu deities on Sarvdev` : 'Hindu deities on Sarvdev',
    numberOfItems: deities.length,
    itemListElement: deities.map((deity, index) => ({
      '@type': 'ListItem',
      position: (page - 1) * PAGE_SIZE + index + 1,
      name: deity.name,
      url: `${BASE_URL}/deities/${deity.slug}`,
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Deities', item: `${BASE_URL}/deities` },
    ],
  }

  return (
    <>
      {deities.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container max-w-3xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Sacred encyclopedia</p>
          <h1 className="mt-2 font-display text-display-sm text-secondary-800">Explore the Divine</h1>
          <p className="mt-4 text-body text-ink-muted">
            Deities, their names in Hindi and English, mantras and sacred attributes — gathered as a reading
            collection rather than a catalogue. Search by name or move through a tradition.
          </p>
        </div>
      </header>

      <DeityIndexControls query={query} category={category} categories={categories} />

      <main className="page-container py-section-sm">
        {failed ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">Deity records are unavailable right now</h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              We could not reach the deity library. Please refresh in a moment.
            </p>
          </div>
        ) : deities.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">No deities match this search</h2>
            <p className="mt-2 text-body-sm text-ink-muted">Try another name, or browse every tradition.</p>
            <Link href="/deities" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Show all deities
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'deity' : 'deities'}
              {activeCategory ? ` in ${activeCategory.name}` : ''}
              {query ? ` matching “${query}”` : ''}
              {pages > 1 ? ` · page ${page} of ${pages}` : ''}
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {deities.map((deity) => (
                <DeityCard key={deity.slug} deity={deity} />
              ))}
            </div>

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
                {page > 1 ? (
                  <Link href={buildPageHref(query, category, page - 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    ← Previous
                  </Link>
                ) : <span />}
                <span className="text-caption text-ink-muted">Page {page} of {pages}</span>
                {page < pages ? (
                  <Link href={buildPageHref(query, category, page + 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    Next →
                  </Link>
                ) : <span />}
              </nav>
            )}
          </>
        )}
      </main>

      <KotiDevtaEditorial />
      <DeityFaq />
    </>
  )
}
