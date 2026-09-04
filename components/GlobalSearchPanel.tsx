"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import { MAIN_NAV_ITEMS } from '../lib/navigation'
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

// Reuse existing nav icon glyphs so each result type reads consistently with the header/menu.
const navIcon = (id: string) => MAIN_NAV_ITEMS.find((item) => item.id === id)?.icon
const FALLBACK_ICON = 'M4 6h16M4 12h16M4 18h16'
const TYPE_ICON: Record<string, string> = {
  temple: navIcon('temples') ?? FALLBACK_ICON,
  deity: navIcon('deities') ?? FALLBACK_ICON,
  devotional: navIcon('devotionals') ?? FALLBACK_ICON,
  blog: navIcon('blog') ?? FALLBACK_ICON,
  event: navIcon('events') ?? FALLBACK_ICON,
  darshan: navIcon('daily-darshan') ?? FALLBACK_ICON,
  spiritualIcon: navIcon('spiritual-icons') ?? FALLBACK_ICON,
  sacredCategory: FALLBACK_ICON,
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function GlobalSearchPanel({ open, onClose }: Props) {
  const { t, language } = useTranslation()
  const router = useRouter()
  const hi = language === 'hi'
  const [query, setQuery] = useState('')
  const [grouped, setGrouped] = useState<GroupedResults>({})
  const [searching, setSearching] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const typeLabel = (type: string) => (hi ? TYPE_LABEL_HI[type] : TYPE_LABEL_EN[type]) ?? type

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
        const arr: SearchResult[] = (data[key + 's'] ?? data[key] ?? data.results?.[key + 's'] ?? []) as SearchResult[]
        if (arr.length > 0) next[key] = arr
      }
      setGrouped(next)
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('[GlobalSearchPanel]', err)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => search(query), 250)
    return () => clearTimeout(timer)
  }, [query, open, search])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const raf = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(raf)
    }
    document.body.style.overflow = ''
    setQuery('')
    setGrouped({})
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (url: string) => {
    onClose()
    router.push(url)
  }

  const hasResults = Object.keys(grouped).length > 0

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t('nav.search')}>
      <div className="absolute inset-0 bg-dark-sacred/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative mx-auto mt-[8vh] flex max-h-[80vh] w-[min(94vw,720px)] flex-col overflow-hidden rounded-2xl border fade-up"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 24px 64px rgba(23,20,17,0.35)' }}
      >
        <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--color-border)' }}>
          <svg className="h-5 w-5 shrink-0 text-ink-faint" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim().length >= 2) go(`/search?q=${encodeURIComponent(query.trim())}`)
            }}
            placeholder={t('home.search')}
            className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-faint focus:outline-none"
            suppressHydrationWarning
          />
          {searching && (
            <svg className="h-4 w-4 shrink-0 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-btn p-1.5 text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!query && !hasResults && (
            <div className="px-5 py-10 text-center text-body-sm text-ink-muted">
              {hi ? 'मंदिर, देवी-देवता, भक्ति सामग्री, कार्यक्रम खोजें…' : 'Search temples, deities, devotionals, events and more…'}
            </div>
          )}

          {hasResults && Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="px-2 pb-1 pt-3">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--color-primary)' }}>
                {typeLabel(type)}
              </div>
              {items.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.url)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-sunken"
                >
                  {item.image ? (
                    <img src={item.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg bg-surface-sunken object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-sunken)' }}>
                      <svg className="h-5 w-5" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={TYPE_ICON[type] ?? FALLBACK_ICON} />
                      </svg>
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sm font-semibold text-ink">{item.title}</span>
                    {(item.deity || item.category || item.city || item.location || item.excerpt) && (
                      <span className="mt-0.5 block truncate text-caption text-ink-muted">
                        {[item.deity, item.category, item.city, item.state, item.location].filter(Boolean).join(' · ') || item.excerpt}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {query.length >= 2 && !searching && !hasResults && (
            <div className="px-5 py-10 text-center text-body-sm text-ink-muted">
              {t('search.noResults')} &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {hasResults && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 border-t px-4 py-3.5 text-body-sm font-bold no-underline hover:no-underline"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
          >
            {hi ? `"${query}" के सभी परिणाम देखें` : `View all results for "${query}"`}
          </Link>
        )}
      </div>
    </div>
  )
}
