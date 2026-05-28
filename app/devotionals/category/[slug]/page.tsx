"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Filter, Library, Search, Sparkles } from 'lucide-react'
import CategoryHero from '../../components/CategoryHero'
import DevotionalCardPremium from '../../components/DevotionalCardPremium'
import DevotionalFilterChips from '../../components/DevotionalFilterChips'
import { EXCLUDED_CATEGORY_IDS, FULL_CATEGORIES } from '../../components/categories'
import {
  categoryToSlug,
  getCategoryDescription,
  getCategoryInfo,
  getCategoryPracticeTitle,
  getDevotionalHref,
  matchesCategory,
} from '../../components/devotional-utils'
import type { Devotional } from '../../types'
import { attachMatchedDeities } from '../../../../lib/devotional-deity-match'

type SortKey = 'popular' | 'newest' | 'az' | 'audio'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  const categoryInfo = getCategoryInfo(categorySlug)
  const label = categoryInfo?.label || categorySlug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  const description = categoryInfo?.description || getCategoryDescription(label)

  const [allDevotionals, setAllDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeity, setSelectedDeity] = useState('all')
  const [sort, setSort] = useState<SortKey>('popular')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [res, deityRes] = await Promise.all([
          fetch('/api/devotionals'),
          fetch('/api/deities', { cache: 'no-store' }).catch(() => null),
        ])
        if (!res.ok) return
        const [data, deityData] = await Promise.all([
          res.json(),
          deityRes?.ok ? deityRes.json() : Promise.resolve([]),
        ])
        if (!cancelled) {
          const approved = (Array.isArray(data) ? data : []).filter((item: Devotional) => item.status === 'approved' || !item.status)
          setAllDevotionals(attachMatchedDeities(approved, Array.isArray(deityData) ? deityData : []))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const categoryDevotionals = useMemo(
    () => allDevotionals.filter((devotional) => matchesCategory(devotional, categorySlug)),
    [allDevotionals, categorySlug]
  )

  const deityCounts = useMemo(() => {
    const counts = new Map<string, number>()
    categoryDevotionals.forEach((devotional) => {
      if (!devotional.deity) return
      counts.set(devotional.deity, (counts.get(devotional.deity) || 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [categoryDevotionals])

  const deityChips = useMemo(() => [
    { id: 'all', label: 'All Deities', meta: categoryDevotionals.length },
    ...deityCounts.map(([deity, count]) => ({ id: deity, label: deity, meta: count })),
  ], [categoryDevotionals.length, deityCounts])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return categoryDevotionals.filter((devotional) => {
      if (selectedDeity !== 'all' && devotional.deity !== selectedDeity) return false
      if (!term) return true
      return [devotional.title, devotional.description, devotional.deity, devotional.language, devotional.artist]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    })
  }, [categoryDevotionals, search, selectedDeity])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'audio') return list.sort((a, b) => Number(Boolean(b.audio)) - Number(Boolean(a.audio)))
    if (sort === 'newest') return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    if (sort === 'az') return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    return list.sort((a, b) =>
      Number(Boolean(b.audio)) - Number(Boolean(a.audio)) ||
      Number(Boolean(b.duration)) - Number(Boolean(a.duration)) ||
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  }, [filtered, sort])

  const popular = useMemo(() => sorted.slice(0, 6), [sorted])
  const relatedCategories = useMemo(() => {
    return FULL_CATEGORIES
      .filter((category) => !EXCLUDED_CATEGORY_IDS.has(category.id) && categoryToSlug(category.id) !== categorySlug)
      .slice(0, 6)
  }, [categorySlug])

  const groupedByDeity = useMemo(() => {
    return deityCounts.slice(0, 8).map(([deity]) => ({
      deity,
      items: categoryDevotionals.filter((item) => item.deity === deity).slice(0, 4),
    }))
  }, [categoryDevotionals, deityCounts])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${label} Devotionals`,
    itemListElement: sorted.slice(0, 24).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `https://sarvdev.com${getDevotionalHref(item)}`,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'Devotionals', item: 'https://sarvdev.com/devotionals' },
      { '@type': 'ListItem', position: 3, name: label, item: `https://sarvdev.com/devotionals/category/${categorySlug}` },
    ],
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="h-80 animate-pulse bg-stone-900" />
        <div className="page-container py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 rounded-2xl bg-stone-100" />)}
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <CategoryHero
        label={label}
        hindi={categoryInfo?.hindi}
        description={description}
        count={categoryDevotionals.length}
        deityCount={deityCounts.length}
        audioCount={categoryDevotionals.filter((item) => item.audio).length}
      />

      <main className="min-h-screen bg-surface pb-16">
        <div className="sticky top-0 z-30 border-b border-amber-200/60 bg-surface/90 backdrop-blur-xl">
          <div className="page-container flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {FULL_CATEGORIES.filter((category) => !EXCLUDED_CATEGORY_IDS.has(category.id)).map((category) => {
              const slug = categoryToSlug(category.id)
              return (
                <Link
                  key={category.id}
                  href={`/devotionals/category/${slug}`}
                  className="category-pill whitespace-nowrap no-underline hover:no-underline"
                  data-active={slug === categorySlug ? 'true' : 'false'}
                >
                  {category.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="page-container space-y-14 py-12">
          <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Category Guide</p>
                <h2 className="mt-1 text-3xl font-black text-stone-950">{getCategoryPracticeTitle(label)}</h2>
                <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600">
                  {description} Use the filters below to find deity-specific versions, audio-ready entries and readable lyrics for home puja or daily chanting.
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="text-sm font-black text-stone-900">SEO focus</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {label} lyrics, {label.toLowerCase()} audio, Hindi and Sanskrit devotional reading, and deity-wise discovery.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                  <Filter className="h-4 w-4" />
                  Filters
                </p>
                <h2 className="mt-1 text-2xl font-black text-stone-950">Refine {label}</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative min-w-[18rem]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="input bg-white pl-10"
                    placeholder={`Search ${label.toLowerCase()}...`}
                  />
                </label>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="input w-auto bg-white">
                  <option value="popular">Popular first</option>
                  <option value="audio">Audio first</option>
                  <option value="newest">Newest first</option>
                  <option value="az">A to Z</option>
                </select>
              </div>
            </div>

            {deityChips.length > 1 && (
              <DevotionalFilterChips chips={deityChips} activeId={selectedDeity} onChange={setSelectedDeity} ariaLabel={`Filter ${label} by deity`} />
            )}
          </section>

          {popular.length > 0 && (
            <section>
              <SectionTitle title={categorySlug === 'aarti' ? 'Popular Aartis' : `Popular ${label}`} subtitle="Prioritized by audio availability, freshness and completeness." />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {popular.map((devotional) => <DevotionalCardPremium key={devotional._id} devotional={devotional} featured />)}
              </div>
            </section>
          )}

          <section>
            <SectionTitle title={`All ${label}`} subtitle={`${sorted.length} result${sorted.length === 1 ? '' : 's'} after filters.`} />
            {sorted.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center">
                <Library className="mx-auto h-10 w-10 text-stone-400" />
                <h3 className="mt-3 text-xl font-black text-stone-900">No entries found</h3>
                <p className="mt-2 text-stone-600">Try another deity or clear the search text.</p>
                <button type="button" onClick={() => { setSearch(''); setSelectedDeity('all') }} className="btn btn-primary mt-5">Reset filters</button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((devotional) => <DevotionalCardPremium key={devotional._id} devotional={devotional} />)}
              </div>
            )}
          </section>

          {groupedByDeity.length > 0 && (
            <section>
              <SectionTitle title={`${label} by Deity`} subtitle="Dynamic deity grouping across this category." />
              <div className="grid gap-5 lg:grid-cols-2">
                {groupedByDeity.map((group) => (
                  <div key={group.deity} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-lg font-black text-stone-900">{group.deity} {label}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.items.map((item) => <DevotionalCardPremium key={item._id} devotional={item} compact />)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle title="Related Categories" subtitle="Continue exploring other devotional forms." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCategories.map((category) => (
                <Link key={category.id} href={`/devotionals/category/${categoryToSlug(category.id)}`} className="rounded-2xl border border-amber-200 bg-white p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-800 hover:shadow-md">
                  <p className="text-xs font-black uppercase tracking-wide text-orange-700">Category</p>
                  <h3 className="mt-1 text-xl font-black text-stone-900">{category.label}</h3>
                  {category.hindi && <p className="font-devanagari text-stone-500">{category.hindi}</p>}
                  <p className="mt-2 text-sm leading-6 text-stone-600">{category.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
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
