"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../lib/translation'

type ResultItem = { id: string; title: string; description: string; category: string; link: string }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function SmartSearch() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, ResultItem[]>>({})
  const [searching, setSearching] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const labels = {
    temples: language === 'hi' ? 'मंदिर' : 'Temples',
    devotionals: language === 'hi' ? 'भक्ति सामग्री' : 'Devotionals',
    blogs: language === 'hi' ? 'ब्लॉग' : 'Blog',
    events: language === 'hi' ? 'कार्यक्रम' : 'Events',
    darshan: language === 'hi' ? 'दैनिक दर्शन' : 'Daily Darshan',
  }

  // Debounced server-side search — replaces 5 client-side API calls
  const search = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort()
    if (!q || q.length < 2) { setResults({}); setSearching(false); return }

    setSearching(true)
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()

      const grouped: Record<string, ResultItem[]> = {}

      if (data.temples?.length) {
        grouped[labels.temples] = data.temples.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: [t.location, t.city, t.state, t.deity].filter(Boolean).join(' · '),
          category: labels.temples,
          link: `/temples/${t.slug || slugify(t.title)}`,
        }))
      }
      if (data.devotionals?.length) {
        grouped[labels.devotionals] = data.devotionals.map((d: any) => ({
          id: d._id,
          title: d.title,
          description: [d.deity, d.category].filter(Boolean).join(' · '),
          category: labels.devotionals,
          link: `/devotionals/${d._id}`,
        }))
      }
      if (data.blogs?.length) {
        grouped[labels.blogs] = data.blogs.map((b: any) => ({
          id: b._id,
          title: b.title,
          description: b.excerpt || '',
          category: labels.blogs,
          link: `/blog/${b.slug || b._id}`,
        }))
      }
      if (data.events?.length) {
        grouped[labels.events] = data.events.map((e: any) => ({
          id: e._id,
          title: e.title,
          description: e.location || '',
          category: labels.events,
          link: '/events',
        }))
      }
      if (data.darshan?.length) {
        grouped[labels.darshan] = data.darshan.map((d: any) => ({
          id: d._id,
          title: d.title,
          description: d.temple || '',
          category: labels.darshan,
          link: '/daily-darshan',
        }))
      }

      setResults(grouped)
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('Search error:', err)
    } finally {
      setSearching(false)
    }
  }, [language])

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleResultClick = (link: string) => {
    setQuery('')
    setResults({})
    router.push(link)
  }

  return (
    <div className="relative max-w-2xl mx-auto" suppressHydrationWarning>
      <div className="relative group">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-primary-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.search')}
          className="w-full rounded-xl border border-surface-border bg-surface-raised text-ink text-body pl-12 pr-10 py-3.5 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-400 shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200"
          suppressHydrationWarning
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults({}) }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-faint hover:text-ink-muted hover:bg-surface-sunken transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {query && Object.keys(results).length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated overflow-hidden max-h-96 overflow-y-auto">
          {Object.entries(results).map(([category, items]) => (
            <div key={category} className="border-b border-surface-border last:border-b-0">
              <div className="px-4 pt-3 pb-1">
                <span className="text-overline text-primary-600 uppercase tracking-wider">{category}</span>
              </div>
              {items.map((it) => (
                <button 
                  key={it.id} 
                  onClick={() => handleResultClick(it.link)}
                  className="w-full text-left block px-4 py-2.5 hover:bg-primary-50/50 transition-colors group/item"
                >
                  <div className="text-body-sm font-semibold text-ink group-hover/item:text-primary-700 transition-colors">{it.title}</div>
                  <div className="text-caption text-ink-muted line-clamp-1 mt-0.5">{it.description}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {query && searching && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated p-5 text-center text-ink-muted text-body-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {language === 'hi' ? 'खोज रहे हैं…' : 'Searching…'}
        </div>
      )}

      {query && !searching && query.length >= 2 && Object.keys(results).length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated p-5 text-center text-ink-muted text-body-sm">
          {t('search.noResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
