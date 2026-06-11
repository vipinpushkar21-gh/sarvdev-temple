import type { Metadata } from 'next'
import Link from 'next/link'
import { SACRED_CATEGORIES, CATEGORY_GROUPS } from '@/lib/sacred-categories'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { SHAKTI_PEETH_CATEGORY } from '@/data/shakti-peethas'

const BASE = 'https://sarvdev.com'

const CLUSTERS = SACRED_CATEGORIES.filter(c => c.isActive).map(cat => ({
  slug: cat.slug,
  title: cat.name,
  titleHi: cat.nameHi,
  icon: cat.icon,
  deity: cat.deity,
  desc: cat.description,
  group: cat.group,
}))

const GROUPED_CLUSTERS = CATEGORY_GROUPS.map(group => ({
  group,
  clusters: CLUSTERS.filter(cluster => cluster.group === group.key),
})).filter(item => item.clusters.length > 0)

export const metadata: Metadata = {
  title: 'Pilgrimage Circuits — Sacred Temple Routes of India',
  description: `Explore ${CLUSTERS.length} sacred pilgrimage circuits across India — Jyotirlinga, Char Dham, Shakti Peeth, ISKCON, Ramayana Circuit, and more. Complete guides with temples, significance, and directions.`,
  keywords: ['pilgrimage India', 'Hindu pilgrimage', 'Jyotirlinga', 'Char Dham', 'Shakti Peeth', 'ISKCON', 'Ramayana Circuit', 'temple circuits', 'Sarvdev'],
  alternates: {
    canonical: `${BASE}/temples/pilgrimage`,
    languages: { 'en-IN': `${BASE}/temples/pilgrimage`, 'hi-IN': `${BASE}/temples/pilgrimage`, 'x-default': `${BASE}/temples/pilgrimage` },
  },
  openGraph: { title: 'Pilgrimage Circuits — Sarvdev', description: `Explore ${CLUSTERS.length} sacred pilgrimage circuits across India.`, url: `${BASE}/temples/pilgrimage`, type: 'website', siteName: 'Sarvdev' },
}

const APPROVED = {
  $or: [
    { status: 'approved' },
    { status: { $exists: false } },
    { status: '' },
    { status: null },
  ],
}

async function getLiveCounts(): Promise<Record<string, number>> {
  try {
    await connectDB()

    const aggResult: { _id: string; count: number }[] = await Temple.aggregate([
      { $match: APPROVED },
      {
        $project: {
          allCats: {
            $setUnion: [
              { $ifNull: ['$categories', []] },
              { $ifNull: ['$sacredCategories', []] },
            ],
          },
        },
      },
      { $unwind: '$allCats' },
      { $group: { _id: '$allCats', count: { $sum: 1 } } },
    ])

    const byName: Record<string, number> = {}
    for (const r of aggResult) {
      if (r._id) byName[r._id] = r.count
    }

    const shaktiCount: number = await Temple.countDocuments({
      $and: [
        APPROVED,
        { $or: [{ canonicalShaktiPeeth: true }, { categories: SHAKTI_PEETH_CATEGORY }, { sacredCategories: SHAKTI_PEETH_CATEGORY }] },
      ],
    })

    const counts: Record<string, number> = {}
    for (const cat of SACRED_CATEGORIES) {
      counts[cat.slug] = cat.name === SHAKTI_PEETH_CATEGORY ? shaktiCount : (byName[cat.name] || 0)
    }
    return counts
  } catch {
    return {}
  }
}

export default async function PilgrimageIndexPage() {
  const counts = await getLiveCounts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Pilgrimage Circuits of India',
    description: `Complete guide to ${CLUSTERS.length} Hindu pilgrimage circuits and sacred temple categories across India.`,
    url: `${BASE}/temples/pilgrimage`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CLUSTERS.length,
      itemListElement: CLUSTERS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `${BASE}/temples/pilgrimage/${c.slug}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
        { '@type': 'ListItem', position: 3, name: 'Pilgrimage Circuits', item: `${BASE}/temples/pilgrimage` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">Pilgrimage Circuits</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Pilgrimage Circuits of India
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Explore <strong className="text-ink">{CLUSTERS.length}</strong> sacred pilgrimage circuits — from the 12 Jyotirlingas to the Ramayana Circuit. Complete guides with temples, significance, and travel directions.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-12">
          {GROUPED_CLUSTERS.map(({ group, clusters }) => (
            <section key={group.key}>
              <div className="mb-5">
                <h2 className="text-h3 font-serif text-secondary-700">{group.label}</h2>
                <p className="text-caption text-ink-faint font-serif">{group.labelHi}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusters.map((c) => {
                  const count = counts[c.slug] ?? 0
                  return (
                    <Link key={c.slug} href={`/temples/pilgrimage/${c.slug}`}
                      className="group card p-6 hover:shadow-md transition-all duration-300 no-underline">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">{c.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors">{c.title}</h3>
                          <p className="text-caption text-ink-muted mt-0.5">{c.titleHi}</p>
                          <p className="text-caption text-ink-faint mt-2 line-clamp-2">{c.desc}</p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{c.deity}</span>
                            {count > 0 && (
                              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-ink-muted border border-gray-100">
                                {count} temple{count !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/temples" className="btn btn-outline no-underline hover:no-underline">Browse All Temples</Link>
        </div>
      </main>
    </>
  )
}
