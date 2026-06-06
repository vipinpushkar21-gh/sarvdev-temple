"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Library, Sparkles } from 'lucide-react'
import SarvdevImage from '../../../../components/SarvdevImage'
import { getDevotionalHeroImage } from '../../../../lib/devotional-image'
import DevotionalCardPremium from '../../components/DevotionalCardPremium'
import { FULL_CATEGORIES } from '../../components/categories'
import { getDevotionalHref } from '../../components/devotional-utils'
import type { Devotional } from '../../types'

const BASE = 'https://sarvdev.com'

type DeityInfo = {
  _id?: string
  name?: string | null
  nameHi?: string | null
  slug?: string | null
  imageHero?: string | null
  imageCard?: string | null
  image?: string | null
  category?: string | null
}

type ApiResult = {
  deity: DeityInfo | null
  devotionals: Devotional[]
  stats: { total: number; categoryBreakdown: Record<string, number> }
}

type SortKey = 'popular' | 'newest' | 'az' | 'audio'

function unslugify(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
        <Sparkles className="h-4 w-4" />
        Collection
      </p>
      <h2 className="mt-1 text-3xl font-black tracking-normal text-stone-950">{title}</h2>
      {subtitle && <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p>}
    </div>
  )
}

export default function DeityDevotionalPage() {
  const params = useParams()
  const slug = params.slug as string
  const isOther = slug === 'other'

  const [data, setData] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('popular')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setData(null)
    setActiveCategory('all')

    async function load() {
      try {
        const res = await fetch(`/api/devotionals/deity/${encodeURIComponent(slug)}`)
        if (!res.ok) return
        const json: ApiResult = await res.json()
        if (!cancelled) setData(json)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  const deityName = data?.deity?.name ?? (isOther ? 'Other Devotionals' : unslugify(slug))
  const deityNameHi = data?.deity?.nameHi ?? ''
  const heroImage = getDevotionalHeroImage()

  const allDevotionals = data?.devotionals ?? []

  // Categories that have at least one devotional for this deity, in canonical order
  const categoriesWithCounts = useMemo(() => {
    return FULL_CATEGORIES
      .map((cat) => ({
        ...cat,
        count: allDevotionals.filter((d) =>
          cat.id === 'Namavali'
            ? d.category === 'Namavali' || d.category === '108 Namavali'
            : d.category === cat.id,
        ).length,
      }))
      .filter((c) => c.count > 0)
  }, [allDevotionals])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return allDevotionals
    return allDevotionals.filter((d) =>
      activeCategory === 'Namavali'
        ? d.category === 'Namavali' || d.category === '108 Namavali'
        : d.category === activeCategory,
    )
  }, [allDevotionals, activeCategory])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'newest') return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    if (sort === 'az') return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    if (sort === 'audio') return list.sort((a, b) => Number(Boolean(b.audio)) - Number(Boolean(a.audio)))
    return list.sort((a, b) =>
      Number(Boolean(b.audio)) - Number(Boolean(a.audio)) ||
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    )
  }, [filtered, sort])

  // "Browse by type" grouped view — top 8 categories, 3 cards each
  const groupedByCategory = useMemo(() => {
    return categoriesWithCounts.slice(0, 8).map((cat) => ({
      ...cat,
      items: allDevotionals
        .filter((d) =>
          cat.id === 'Namavali'
            ? d.category === 'Namavali' || d.category === '108 Namavali'
            : d.category === cat.id,
        )
        .sort((a, b) => Number(Boolean(b.audio)) - Number(Boolean(a.audio)))
        .slice(0, 3),
    }))
  }, [allDevotionals, categoriesWithCounts])

  const pageTitle = isOther ? 'Other Devotionals' : `${deityName} Devotionals`
  const pageDesc = isOther
    ? 'Devotionals not matched to a specific deity.'
    : `Complete collection of ${deityName} devotionals — mantras, aartis, stotras, chalisas, bhajans and more.`
  const pageUrl = `${BASE}/devotionals/deity/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDesc,
    url: pageUrl,
    image: heroImage.src,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Devotionals', item: `${BASE}/devotionals` },
      { '@type': 'ListItem', position: 3, name: deityName, item: pageUrl },
    ],
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="h-[420px] animate-pulse bg-stone-900" />
        <div className="page-container py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-stone-100" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[420px] overflow-hidden bg-stone-950 text-white md:min-h-[480px]">
        <SarvdevImage image={heroImage} alt={deityName} className="absolute inset-0 opacity-45" imgClassName="object-cover" loading="eager" renderMode="cinematic-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/18" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[420px] flex-col justify-end pb-14 pt-20 md:min-h-[480px]">
          <div className="max-w-4xl">
            {/* Breadcrumb trail */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Link
                href="/devotionals"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100 no-underline hover:bg-white/15"
              >
                ← Devotionals
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100">
                By Deity
              </span>
            </div>

            <h1 className="text-[clamp(2.2rem,6vw,4.8rem)] font-black leading-tight text-white drop-shadow-xl">
              {deityName}
            </h1>
            {deityNameHi && (
              <p className="mt-2 font-devanagari text-2xl font-bold text-amber-200">{deityNameHi}</p>
            )}
            <p className="mt-3 max-w-xl text-base leading-7 text-stone-300">{pageDesc}</p>

            {/* Stats bar */}
            {data && (
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/12 bg-white/10 px-4 py-2.5 backdrop-blur">
                  <div className="text-xl font-black text-white">{data.stats.total}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-300">Total</div>
                </div>
                {categoriesWithCounts.slice(0, 5).map((cat) => (
                  <div key={cat.id} className="rounded-xl border border-white/12 bg-white/10 px-4 py-2.5 backdrop-blur">
                    <div className="text-xl font-black text-white">{cat.count}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-300">{cat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="min-h-screen bg-surface pb-16">
        {/* Sticky category filter bar */}
        <div className="sticky top-0 z-30 border-b border-amber-200/60 bg-surface/90 backdrop-blur-xl">
          <div className="page-container flex gap-2 overflow-x-auto py-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="category-pill whitespace-nowrap"
              data-active={activeCategory === 'all' ? 'true' : 'false'}
            >
              All ({allDevotionals.length})
            </button>
            {categoriesWithCounts.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className="category-pill whitespace-nowrap"
                data-active={activeCategory === cat.id ? 'true' : 'false'}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <div className="page-container space-y-14 py-12">

          {/* All devotionals → grouped by type */}
          {activeCategory === 'all' && groupedByCategory.length > 0 && (
            <section>
              <SectionTitle
                title={`${deityName} by Type`}
                subtitle="Browse this deity's devotional collection grouped by practice type."
              />
              <div className="space-y-12">
                {groupedByCategory.map((group) => (
                  <div key={group.id}>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-700">{group.label}</p>
                        <h3 className="text-xl font-black text-stone-900">
                          {deityName} {group.label}
                        </h3>
                      </div>
                      {group.count > 3 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory(group.id)}
                          className="text-sm font-semibold text-orange-700 hover:text-orange-900"
                        >
                          View all {group.count} →
                        </button>
                      )}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {group.items.map((d) => (
                        <DevotionalCardPremium key={d._id} devotional={d} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filtered view */}
          {activeCategory !== 'all' && (
            <section>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionTitle
                  title={`${deityName} ${FULL_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory}`}
                  subtitle={`${sorted.length} result${sorted.length !== 1 ? 's' : ''} — sorted ${sort}`}
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="input w-auto self-start bg-white"
                >
                  <option value="popular">Popular first</option>
                  <option value="audio">Audio first</option>
                  <option value="newest">Newest first</option>
                  <option value="az">A to Z</option>
                </select>
              </div>

              {sorted.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center">
                  <Library className="mx-auto h-10 w-10 text-stone-400" />
                  <p className="mt-3 text-stone-600">No entries in this category.</p>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className="btn btn-outline mt-5"
                  >
                    Show all {deityName} devotionals
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {sorted.map((d) => (
                    <DevotionalCardPremium key={d._id} devotional={d} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Empty state — no devotionals found for this deity */}
          {allDevotionals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-14 text-center">
              <Library className="mx-auto h-12 w-12 text-stone-400" />
              <h3 className="mt-4 text-xl font-black text-stone-900">No devotionals found</h3>
              <p className="mt-2 text-stone-600">
                No devotionals have been matched to {isOther ? 'this category' : deityName} yet.
              </p>
              <Link href="/devotionals" className="btn btn-primary mt-6 inline-flex no-underline">
                Browse All Devotionals
              </Link>
            </div>
          )}

          {/* Related deity links */}
          <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Explore More</p>
            <h2 className="mt-1 text-2xl font-black text-stone-950">Browse Other Devotional Deities</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/devotionals" className="btn btn-outline no-underline">
                All Devotionals
              </Link>
              {data?.deity?.slug && (
                <Link
                  href={`/deities/${data.deity.slug}`}
                  className="btn btn-outline no-underline"
                >
                  {deityName} Deity Page
                </Link>
              )}
              <Link href="/devotionals/deity/other" className="btn btn-outline no-underline">
                Other Devotionals
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
