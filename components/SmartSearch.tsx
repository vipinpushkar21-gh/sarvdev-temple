"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../lib/translation'
import { useTempleData } from '../lib/temple-data'

type ResultItem = { id: string; title: string; description: string; category: string; link: string }

export default function SmartSearch() {
  const { t, language } = useTranslation()
  const { temples: allTemples } = useTempleData()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, ResultItem[]>>({})
  const [allItems, setAllItems] = useState<ResultItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  
  // Build search corpus from provider temples + fetch other data
  useEffect(() => {
    async function fetchData() {
      try {
        const [darshanRes, eventsRes, blogsRes, devotionalsRes] = await Promise.all([
          fetch('/api/darshan'),
          fetch('/api/events'),
          fetch('/api/blogs'),
          fetch('/api/devotionals'),
        ])
        
        const darshan = darshanRes.ok ? await darshanRes.json() : []
        const events = eventsRes.ok ? await eventsRes.json() : []
        const blogs = blogsRes.ok ? await blogsRes.json() : []
        const devotionals = devotionalsRes.ok ? await devotionalsRes.json() : []
        
        const templeItems: ResultItem[] = allTemples.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: [t.description, t.location, t.city, t.state, t.deity, t.speciality, ...(t.categories || [])].filter(Boolean).join(' '),
          category: language === 'hi' ? 'मंदिर' : 'Temples',
          link: `/temples/${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
        }))

        const items: ResultItem[] = [
          ...templeItems,
          ...darshan.filter((d: any) => d.status === 'approved').map((d: any) => ({
            id: d._id,
            title: d.title,
            description: d.description || '',
            category: language === 'hi' ? 'दैनिक दर्शन' : 'Daily Darshan',
            link: '/daily-darshan'
          })),
          ...events.filter((e: any) => e.status === 'approved').map((e: any) => ({
            id: e._id,
            title: e.title,
            description: e.description || '',
            category: language === 'hi' ? 'कार्यक्रम' : 'Events',
            link: '/events'
          })),
          ...blogs.filter((b: any) => b.status === 'approved').map((b: any) => ({
            id: b._id,
            title: b.title,
            description: b.content?.substring(0, 100) || '',
            category: language === 'hi' ? 'ब्लॉग' : 'Blog',
            link: '/blog'
          })),
          ...(Array.isArray(devotionals) ? devotionals : []).filter((d: any) => d.status === 'approved').map((d: any) => ({
            id: d._id,
            title: d.title,
            description: [d.description, d.deity, d.category, d.language].filter(Boolean).join(' '),
            category: language === 'hi' ? 'भक्ति सामग्री' : 'Devotionals',
            link: `/devotionals/${d._id}`
          })),
        ]
        
        setAllItems(items)
      } catch (error) {
        console.error('Failed to fetch search data:', error)
      } finally {
        setDataLoading(false)
      }
    }
    
    fetchData()
  }, [allTemples, language])
  
  useEffect(() => {
    if (!query) {
      setResults({})
      return
    }
    
    // Multi-word search: every word must appear somewhere in title or description
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    const out = allItems.filter((it) => {
      const text = (it.title + ' ' + it.description).toLowerCase()
      return words.every(w => text.includes(w))
    })
    const grouped: Record<string, ResultItem[]> = {}
    out.forEach((it) => {
      if (!grouped[it.category]) grouped[it.category] = []
      grouped[it.category].push(it)
    })
    setResults(grouped)
  }, [query, allItems])

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
      
      {query && dataLoading && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated p-5 text-center text-ink-muted text-body-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {language === 'hi' ? 'खोज रहे हैं…' : 'Loading search data…'}
        </div>
      )}

      {query && !dataLoading && Object.keys(results).length === 0 && allItems.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface-raised rounded-xl border border-surface-border shadow-elevated p-5 text-center text-ink-muted text-body-sm">
          {t('search.noResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
