import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '../../components/Hero'
import { getGroupedCategories, SACRED_CATEGORIES } from '../../lib/sacred-categories'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { SHAKTI_PEETH_CATEGORY } from '@/data/shakti-peethas'

const BASE = 'https://sarvdev.com'

export const metadata: Metadata = {
  title: 'Sacred Temple Categories — Pilgrimage Circuits of India',
  description: `Explore ${SACRED_CATEGORIES.filter(c => c.isActive).length} sacred temple categories and pilgrimage circuits of India — Jyotirlinga, Char Dham, Shakti Peeth, Divya Desam and more.`,
  alternates: { canonical: `${BASE}/sacred-categories` },
  openGraph: {
    title: 'Sacred Temple Categories — Sarvdev',
    description: 'Explore all sacred pilgrimage circuits and temple groupings across India.',
    url: `${BASE}/sacred-categories`,
    type: 'website',
    siteName: 'Sarvdev',
  },
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
        {
          $or: [
            { canonicalShaktiPeeth: true },
            { categories: SHAKTI_PEETH_CATEGORY },
            { sacredCategories: SHAKTI_PEETH_CATEGORY },
          ],
        },
      ],
    })

    const counts: Record<string, number> = {}
    for (const cat of SACRED_CATEGORIES) {
      counts[cat.slug] = cat.name === SHAKTI_PEETH_CATEGORY
        ? shaktiCount
        : (byName[cat.name] || 0)
    }
    return counts
  } catch {
    return {}
  }
}

export default async function SacredCategoriesPage() {
  const grouped = getGroupedCategories()
  const counts  = await getLiveCounts()
  const totalActive = SACRED_CATEGORIES.filter(c => c.isActive).length

  return (
    <>
      <Hero title="Sacred Temple Categories" subtitle="Explore temples by their sacred significance and groupings" overline="Sacred Groupings" />
      <main className="page-container section-sm">

        <p className="text-body text-ink-muted mb-10">
          Browse <strong className="text-ink">{totalActive}</strong> sacred pilgrimage circuits and temple categories across India.
        </p>

        {grouped.map(({ group, categories }) => (
          <section key={group.key} className="mb-12">
            <h2 className="text-h3 font-serif text-secondary-700 mb-1">{group.label}</h2>
            <p className="text-caption text-ink-faint font-serif mb-5">{group.labelHi}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const count = counts[cat.slug] ?? 0
                return (
                  <Link
                    key={cat.slug}
                    href={`/temples/pilgrimage/${cat.slug}`}
                    className="group card-interactive overflow-hidden no-underline hover:no-underline"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3.5 mb-3">
                        <span className="text-3xl flex-shrink-0 mt-0.5">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-body font-semibold text-secondary-700 group-hover:text-primary-600 transition-colors leading-snug">
                            {cat.name}
                          </h3>
                          <p className="text-caption text-ink-faint font-serif">{cat.nameHi}</p>
                          <p className="text-caption text-ink-muted mt-1.5 line-clamp-2">{cat.description}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-muted bg-surface-sunken px-2.5 py-1 rounded-full">
                          {cat.deity}
                        </span>
                        <div className="flex items-center gap-2">
                          {count > 0 && (
                            <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                              {count} temple{count !== 1 ? 's' : ''}
                            </span>
                          )}
                          <span className="text-caption font-semibold text-primary-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Explore
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}

        <div className="relative card overflow-hidden mt-12">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-6 md:p-8 text-center">
            <h3 className="text-h3 font-serif text-secondary-700 mb-2">Know a temple that belongs to these sacred groups?</h3>
            <p className="text-body-sm text-ink-muted mb-5">Help us build a complete directory of sacred temples</p>
            <Link
              href="/list-temple"
              className="btn btn-primary no-underline hover:no-underline group"
            >
              List a Temple
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
