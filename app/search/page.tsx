"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SearchResult, SearchResponse } from '@/lib/search'

// ── Types ──────────────────────────────────────────────────────────────────────

type TabKey = 'all' | 'temple' | 'deity' | 'devotional' | 'blog' | 'event' | 'spiritualIcon'

const TABS: { key: TabKey; label: string; labelHi: string }[] = [
  { key: 'all',          label: 'All',             labelHi: 'सभी' },
  { key: 'temple',       label: 'Temples',         labelHi: 'मंदिर' },
  { key: 'deity',        label: 'Deities',         labelHi: 'देवी-देवता' },
  { key: 'devotional',   label: 'Devotionals',     labelHi: 'भक्ति सामग्री' },
  { key: 'blog',         label: 'Blog',            labelHi: 'ब्लॉग' },
  { key: 'event',        label: 'Events',          labelHi: 'कार्यक्रम' },
  { key: 'spiritualIcon',label: 'Spiritual Icons', labelHi: 'आध्यात्मिक विभूतियाँ' },
]

const RESULT_GROUP_KEYS: Array<keyof SearchResponse['results']> = [
  'temples', 'deities', 'devotionals', 'blogs', 'events', 'darshan', 'spiritualIcons', 'sacredCategories',
]

const GROUP_LABEL: Record<string, string> = {
  temples: 'Temples', deities: 'Deities', devotionals: 'Devotionals',
  blogs: 'Blog', events: 'Events', darshan: 'Daily Darshan',
  spiritualIcons: 'Spiritual Icons', sacredCategories: 'Sacred Categories',
}

const PLACEHOLDER_QUERIES = ['hanuman', 'shiva', 'aarti', 'pushkar', 'ganesh chalisa', 'आरती']

// ── Result Card ─────────────────────────────────────────────────────────────────

function ResultCard({ item }: { item: SearchResult }) {
  const meta = [item.deity, item.category, item.city, item.state, item.location]
    .filter(Boolean)
    .join(' · ')
  return (
    <Link
      href={item.url}
      className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-orange-200 transition-all group"
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100"
          loading="lazy"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-orange-50 shrink-0 flex items-center justify-center">
          <span className="text-xl select-none">🛕</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
            {GROUP_LABEL[item.type + 's'] ?? item.type}
          </span>
        </div>
        <p className="mt-1 font-bold text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-1">
          {item.title}
        </p>
        {item.titleHi && (
          <p className="text-sm text-gray-500 font-medium line-clamp-1">{item.titleHi}</p>
        )}
        {(meta || item.excerpt) && (
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{meta || item.excerpt}</p>
        )}
      </div>
    </Link>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQ    = searchParams.get('q')    ?? ''
  const initialType = (searchParams.get('type') ?? 'all') as TabKey
  const initialPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const [query,   setQuery]   = useState(initialQ)
  const [input,   setInput]   = useState(initialQ)
  const [tab,     setTab]     = useState<TabKey>(initialType)
  const [page,    setPage]    = useState(initialPage)
  const [state,   setState]   = useState(searchParams.get('state') ?? '')
  const [loading, setLoading] = useState(false)
  const [data,    setData]    = useState<SearchResponse | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Push URL updates without re-mounting
  const pushUrl = useCallback((q: string, t: TabKey, p: number, st: string) => {
    const params = new URLSearchParams()
    if (q)       params.set('q', q)
    if (t !== 'all') params.set('type', t)
    if (p > 1)   params.set('page', String(p))
    if (st)      params.set('state', st)
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router])

  const doSearch = useCallback(async (q: string, t: TabKey, p: number, st: string) => {
    if (abortRef.current) abortRef.current.abort()
    if (!q || q.trim().length < 2) { setData(null); setLoading(false); return }

    setLoading(true)
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const params = new URLSearchParams({ q: q.trim(), limit: '12', page: String(p) })
      if (t !== 'all') params.set('type', t)
      if (st) params.set('state', st)

      const res = await fetch(`/api/search?${params.toString()}`, { signal: ctrl.signal })
      if (!res.ok) throw new Error('search failed')
      const json: SearchResponse = await res.json()
      setData(json)
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('[search page]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger search when query/tab/page/state changes
  useEffect(() => {
    doSearch(query, tab, page, state)
    pushUrl(query, tab, page, state)
  }, [query, tab, page, state, doSearch, pushUrl])

  // Debounce input → query
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [input])

  const handleTabChange = (t: TabKey) => {
    setTab(t)
    setPage(1)
  }

  // Flatten results for "All" tab
  const allResults: SearchResult[] = data
    ? RESULT_GROUP_KEYS.flatMap((k) => data.results[k] ?? [])
    : []

  // Per-type results
  const groupedForTab = (t: TabKey): SearchResult[] => {
    if (!data) return []
    if (t === 'all') return allResults
    const key = (t + 's') as keyof SearchResponse['results']
    return data.results[key] ?? []
  }

  const currentResults = groupedForTab(tab)
  const totalForTab = tab === 'all' ? (data?.totalResults ?? 0) : (currentResults.length)
  const hasMore = data?.hasMore ?? false

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Search header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-xl hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && router.back()}
                placeholder="Search temples, deities, devotionals…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400 transition"
              />
              {input && (
                <button
                  onClick={() => { setInput(''); setQuery(''); setData(null) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          {query && (
            <div className="mt-3 flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
              {TABS.map((t) => {
                const count = t.key === 'all'
                  ? (data?.totalResults ?? 0)
                  : (data?.counts?.[(t.key + 's') as keyof typeof data.counts] ?? 0)
                return (
                  <button
                    key={t.key}
                    onClick={() => handleTabChange(t.key)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      tab === t.key
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                    {count > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* State filter (for temples/events) */}
        {query && (tab === 'all' || tab === 'temple' || tab === 'event') && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Filter by state:</span>
            <input
              type="text"
              value={state}
              onChange={(e) => { setState(e.target.value); setPage(1) }}
              placeholder="e.g. Rajasthan"
              className="text-sm px-3 py-1.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-400 transition w-48"
            />
            {state && (
              <button onClick={() => setState('')} className="text-xs text-orange-600 font-bold hover:underline">
                Clear
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty / no-query state */}
        {!loading && !query && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 select-none">🔍</div>
            <p className="text-lg font-bold text-gray-800">Search Sarvdev</p>
            <p className="text-sm text-gray-500 mt-1 mb-6">Temples, deities, devotionals, blogs, events and more</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PLACEHOLDER_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="text-sm px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && query && data && totalForTab === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 select-none">🔎</div>
            <p className="text-base font-bold text-gray-700">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-gray-400 mt-1">Try a different spelling, or switch to another tab</p>
            {tab !== 'all' && (
              <button onClick={() => setTab('all')} className="mt-4 text-sm font-bold text-orange-600 hover:underline">
                Search All
              </button>
            )}
          </div>
        )}

        {/* All-tab grouped view */}
        {!loading && query && tab === 'all' && data && allResults.length > 0 && (
          <div className="space-y-6">
            {RESULT_GROUP_KEYS.map((groupKey) => {
              const items = data.results[groupKey] ?? []
              if (items.length === 0) return null
              return (
                <section key={groupKey}>
                  <h2 className="text-xs font-black uppercase tracking-[0.15em] text-orange-600 mb-3">
                    {GROUP_LABEL[groupKey]}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((item) => <ResultCard key={item.id} item={item} />)}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* Single-type flat list */}
        {!loading && query && tab !== 'all' && currentResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentResults.map((item) => <ResultCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && query && (page > 1 || hasMore) && (
          <div className="flex items-center justify-center gap-3 mt-8">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="px-5 py-2.5 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
            )}
            <span className="text-sm font-semibold text-gray-500">Page {page}</span>
            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2.5 text-sm font-bold rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
