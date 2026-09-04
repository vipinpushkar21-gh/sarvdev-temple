import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { notFound } from 'next/navigation'
import RelatedSacredContent from '@/components/RelatedSacredContent'
import { SHAKTI_PEETH_CATEGORY } from '@/data/shakti-peethas'
import { SACRED_CATEGORIES, getCategoryBySlug } from '@/lib/sacred-categories'
import SarvdevImage from '@/components/SarvdevImage'
import { getTempleCardImage } from '@/lib/temple-image'
import { resolveMediaOriginal, type SarvdevMediaInput } from '@/lib/media-asset'

const BASE = 'https://sarvdev.com'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getCategoryQueryValues(cluster: PilgrimageCluster) {
  const canonical = getCategoryBySlug(cluster.slug)
  return Array.from(new Set([
    cluster.categoryMatch,
    cluster.slug,
    canonical?.name,
    canonical?.slug,
  ].filter(Boolean) as string[]))
}

type TempleMediaFields = {
  cardMedia?: SarvdevMediaInput
  primaryMedia?: SarvdevMediaInput
  imageCard?: SarvdevMediaInput
  image?: SarvdevMediaInput
}

function hasTempleMedia(temple: TempleMediaFields) {
  return [temple.cardMedia, temple.primaryMedia, temple.imageCard, temple.image]
    .some((media) => Boolean(resolveMediaOriginal(media)))
}

type PilgrimageCluster = {
  slug: string
  title: string
  titleHi: string
  description: string
  longDescription: string
  categoryMatch: string
  deity: string
  relatedClusters: string[]
}

// Derive pilgrimage clusters from the central sacred categories source
const CLUSTERS: PilgrimageCluster[] = SACRED_CATEGORIES.filter(c => c.isActive).map(cat => ({
  slug: cat.slug,
  title: cat.name,
  titleHi: cat.nameHi,
  description: cat.description,
  longDescription: cat.longDescription,
  categoryMatch: cat.name,
  deity: cat.deity,
  relatedClusters: cat.relatedSlugs,
}))

const CLUSTER_MAP: Record<string, PilgrimageCluster> = Object.fromEntries(CLUSTERS.map(c => [c.slug, c]))

// Backward-compatible slug aliases
const shaktiPeethCluster = CLUSTER_MAP['shakti-peeth']
if (shaktiPeethCluster) {
  CLUSTER_MAP['shakti-peethas'] = shaktiPeethCluster
  CLUSTER_MAP['51-shakti-peethas'] = shaktiPeethCluster
  CLUSTER_MAP['52-shakti-peethas'] = shaktiPeethCluster
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const cluster = CLUSTER_MAP[slug]
  if (!cluster) return { title: 'Pilgrimage — Sarvdev' }

  const url = `${BASE}/temples/pilgrimage/${slug}`
  return {
    title: `${cluster.title} — Sarvdev`,
    description: cluster.description,
    keywords: [cluster.title, cluster.titleHi, 'pilgrimage', 'temples', 'India', 'Sarvdev'],
    alternates: { canonical: url },
    openGraph: { title: `${cluster.title} — Sarvdev`, description: cluster.description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary', title: `${cluster.title} — Sarvdev`, description: cluster.description },
  }
}

const PAGE_SIZE = 48

export default async function PilgrimageClusterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const cluster = CLUSTER_MAP[slug]
  if (!cluster) notFound()

  let temples: any[] = []
  let totalTemples = 0
  try {
    await connectDB()
    const categoryValues = getCategoryQueryValues(cluster)
    const categorySlugs = Array.from(new Set(categoryValues.map(slugify).filter(Boolean)))
    const categoryFilter = {
      status: 'approved',
      $or: [
        { sacredCategorySlugs: { $in: categorySlugs } },
        { categories: { $in: categoryValues } },
        { sacredCategories: { $in: categoryValues } },
        ...(cluster.categoryMatch === SHAKTI_PEETH_CATEGORY ? [{ canonicalShaktiPeeth: true }] : []),
      ],
    }
    const projection = 'title titleHi slug description image imageCard primaryMedia cardMedia city state country deity categories sacredCategories sacredCategorySlugs templeType templeTypes canonicalShaktiPeeth canonicalShaktiPeethKey canonicalShaktiPeethName shaktiPeethMeta'

    {
      const [items, total] = await Promise.all([
        Temple.find(categoryFilter, projection)
          .sort({ createdAt: -1, _id: 1 })
          .skip(skip)
          .limit(PAGE_SIZE)
          .lean() as Promise<any[]>,
        Temple.countDocuments(categoryFilter),
      ])
      temples = items
      totalTemples = total
    }
  } catch (e) {
    console.error('Pilgrimage cluster fetch error:', e)
  }

  const totalPages = Math.max(1, Math.ceil(totalTemples / PAGE_SIZE))

  const states = page === 1
    ? Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))).sort() as string[]
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.title,
    description: cluster.description,
    url: `${BASE}/temples/pilgrimage/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: temples.length,
      itemListElement: temples.slice(0, 50).map((t: any, i: number) => ({
        '@type': 'ListItem',
        position: skip + i + 1,
        name: t.title,
        url: `${BASE}/temples/${slugify(t.title)}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
        { '@type': 'ListItem', position: 3, name: 'Pilgrimage', item: `${BASE}/temples/pilgrimage` },
        { '@type': 'ListItem', position: 4, name: cluster.title, item: `${BASE}/temples/pilgrimage/${slug}` },
      ],
    },
  }

  const relatedClusters = cluster.relatedClusters
    .map(s => CLUSTER_MAP[s])
    .filter(Boolean)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-surface-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">Pilgrimage Circuits</span>
          </nav>
          <div className="border-l-2 border-primary-700 pl-5"><p className="text-overline font-semibold uppercase tracking-[.16em] text-primary-700">Sacred Collection</p><h1 className="mt-3 text-display font-serif text-secondary-800">{cluster.title}</h1><p className="text-body-sm text-ink-faint font-serif">{cluster.titleHi}</p></div>
          <p className="text-body text-ink-muted max-w-3xl">{cluster.longDescription}</p>
          <p className="mt-4 text-body-sm text-ink-faint">
            <strong className="text-ink">{totalTemples}</strong> temples currently available on Sarvdev
            {states.length > 0 && <> across <strong className="text-ink">{states.length}</strong> states</>}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* State quick-links */}
        {states.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Temples by State</h2>
            <div className="flex flex-wrap gap-2">
              {states.map(s => (
                <Link key={s} href={`/temples/state/${slugify(s)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">
                  {s}
                </Link>
              ))}
            </div>
          </section>
        )}

        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples listed in this pilgrimage group yet</p>
            <p className="text-body-sm text-ink-faint mb-6">Help us build the directory — submit temples in this sacred category.</p>
            <div className="flex justify-center gap-3">
              <Link href="/list-temple" className="btn btn-primary no-underline hover:no-underline">Submit Temple</Link>
              <Link href="/temples" className="btn btn-outline no-underline hover:no-underline">Browse All Temples</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {temples.map((t: any) => (
              <Link key={t._id.toString()} href={`/temples/${t.slug || slugify(t.title)}`}
                className="group border-t border-surface-border pt-4 no-underline">
                {hasTempleMedia(t) && <div className="relative mb-4 h-44 overflow-hidden bg-surface-sunken">
                  <SarvdevImage image={getTempleCardImage(t)} alt={`${t.title} — ${cluster.title}`} className="absolute inset-0" imgClassName="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {t.deity && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">{t.deity}</span>
                  )}
                </div>}
                <div className="p-4">
                  <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{t.title}</h3>
                  {t.titleHi && <p className="mt-1 font-devanagari text-body-sm text-ink-muted">{t.titleHi}</p>}
                  <p className="text-caption text-ink-muted mt-1">{[t.city, t.state].filter(Boolean).join(', ')}</p>
                  {t.description && (
                    <p className="text-caption text-ink-faint mt-2 line-clamp-2">{t.description.replace(/<[^>]+>/g, '').slice(0, 120)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
            {page > 1 && (
              <Link
                href={`/temples/pilgrimage/${slug}?page=${page - 1}`}
                className="px-4 py-2 rounded-lg border border-surface-border text-body-sm font-medium text-ink hover:bg-surface-sunken transition-colors no-underline"
              >
                ← Previous
              </Link>
            )}
            <span className="text-body-sm text-ink-muted">
              Page {page} of {totalPages}
              <span className="ml-2 text-ink-faint">({totalTemples.toLocaleString()} temples)</span>
            </span>
            {page < totalPages && (
              <Link
                href={`/temples/pilgrimage/${slug}?page=${page + 1}`}
                className="px-4 py-2 rounded-lg border border-surface-border text-body-sm font-medium text-ink hover:bg-surface-sunken transition-colors no-underline"
              >
                Next →
              </Link>
            )}
          </nav>
        )}

        {/* Related Pilgrimage Circuits */}
        {relatedClusters.length > 0 && (
          <section className="mt-16 pt-10 border-t border-surface-border">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Related Pilgrimage Circuits</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedClusters.map(rc => (
                <Link key={rc.slug} href={`/temples/pilgrimage/${rc.slug}`}
                  className="group border-l border-primary-200 pl-4 no-underline">
                  <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors">{rc.title}</h3>
                  <p className="text-caption text-ink-faint font-serif">{rc.titleHi}</p>
                  <p className="text-caption text-ink-muted mt-1 line-clamp-2">{rc.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedSacredContent
          title="Explore More"
          states={[{ href: '/temples/pilgrimage', label: 'All Sacred Collections' }, { href: '/temples', label: 'All Temples' }, { href: '/events', label: 'Events & Festivals' }]}
          deities={cluster.deity ? [{ href: `/temples/deity/${slugify(cluster.deity)}`, label: `${cluster.deity} Temples` }] : []}
        />
      </main>
    </>
  )
}
