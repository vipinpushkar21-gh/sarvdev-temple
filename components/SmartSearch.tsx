"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import type { SearchResult } from '../lib/search'

type GroupedResults = Record<string, SearchResult[]>

const TYPE_LABEL_EN: Record<string, string> = {
  temple: 'Temples', deity: 'Deities', devotional: 'Devotionals',
  blog: 'Blog', event: 'Events', darshan: 'Daily Darshan',
  spiritualIcon: 'Spiritual Icons', sacredCategory: 'Sacred Categories',
}
const TYPE_LABEL_HI: Record<string, string> = {
  temple: 'मंदिर', deity: 'देवी-देवता', devotional: 'भक्ति सामग्री',
  blog: 'ब्लॉग', event: 'कार्यक्रम', darshan: 'दैनिक दर्शन',
  spiritualIcon: 'आध्यात्मिक विभूतियाँ', sacredCategory: 'तीर्थ श्रेणियाँ',
}
const RESULT_KEYS: Array<keyof typeof TYPE_LABEL_EN> = [
  'temple', 'deity', 'devotional', 'blog', 'event', 'darshan', 'spiritualIcon', 'sacredCategory',
]

export default function SmartSearch() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [grouped, setGrouped] = useState<GroupedResults>({})
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const hi = language === 'hi'
  const typeLabel = (type: string) => (hi ? TYPE_LABEL_HI[type] : TYPE_LABEL_EN[type]) ?? type

  // Keyboard '/' shortcut — focus the search input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Debounced search (300 ms)
  const search = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort()
    if (!q || q.length < 2) { setGrouped({}); setSearching(false); return }

    setSearching(true)
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      if (!res.ok) throw new Error('search failed')
      const data = await res.json()

      const next: GroupedResults = {}
      for (const key of RESULT_KEYS) {
        // API returns both flat arrays and structured results — use flat arrays
        const arr: SearchResult[] = (data[key + 's'] ?? data[key] ?? data.results?.[key + 's'] ?? []) as SearchResult[]
        if (arr.length > 0) next[key] = arr
      }
      setGrouped(next)
      setOpen(true)
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('[SmartSearch]', err)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const go = (url: string) => {
    setQuery('')
    setGrouped({})
    setOpen(false)
    router.push(url)
  }

  const hasResults = Object.keys(grouped).length > 0
  const showDropdown = query.length >= 2 && open && (hasResults || searching)

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto" suppressHydrationWarning>
      {/* Input */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-primary-500 transition-colors pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim().length >= 2) {
              go(`/search?q=${encodeURIComponent(query.trim())}`)
            }
          }}
          placeholder={t('home.search')}
          className="w-full rounded-xl border border-surface-border bg-surface-raised text-ink text-body pl-12 pr-20 py-3.5 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-400 shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200"
          suppressHydrationWarning
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {!query && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-ink-faint border border-surface-border bg-surface-sunken">/</kbd>
          )}
          {query && (
            <button
              onClick={() => { setQuery(''); setGrouped({}); setOpen(false) }}
              className="p-1 rounded-md text-ink-faint hover:text-ink-muted hover:bg-surface-sunken transition-all"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated overflow-hidden max-h-[480px] overflow-y-auto">
          {searching && !hasResults && (
            <div className="flex items-center justify-center gap-2 px-4 py-5 text-ink-muted text-body-sm">
              <svg className="w-4 h-4 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {hi ? 'खोज रहे हैं…' : 'Searching…'}
            </div>
          )}

          {hasResults && Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="border-b border-surface-border last:border-b-0">
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary-600">{typeLabel(type)}</span>
              </div>
              {items.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.url)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50/50 transition-colors group/item"
                >
                  {item.image && (
                    <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 bg-surface-sunken" loading="lazy" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-body-sm font-semibold text-ink group-hover/item:text-primary-700 transition-colors truncate">{item.title}</div>
                    {(item.excerpt || item.deity || item.location || item.city || item.category) && (
                      <div className="text-caption text-ink-muted truncate mt-0.5">
                        {[item.deity, item.category, item.city, item.state, item.location].filter(Boolean).join(' · ') || item.excerpt}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}

          {/* View all results link */}
          {hasResults && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => { setOpen(false) }}
              className="flex items-center justify-center gap-2 px-4 py-3 text-body-sm font-bold text-primary-600 hover:bg-primary-50/50 transition-colors border-t border-surface-border"
            >
              {hi ? `"${query}" के सभी परिणाम देखें` : `View all results for "${query}"`}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          )}
        </div>
      )}

      {/* No results state */}
      {query.length >= 2 && open && !searching && !hasResults && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated p-5 text-center text-ink-muted text-body-sm">
          {t('search.noResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
