"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../lib/translation'

type ResultItem = { id: string; title: string; description: string; category: string; link: string }

export default function SmartSearch() {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, ResultItem[]>>({})
  const [allItems, setAllItems] = useState<ResultItem[]>([])
  
  // Fetch data from MongoDB on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [templesRes, darshanRes, eventsRes, blogsRes] = await Promise.all([
          fetch('/api/temples'),
          fetch('/api/darshan'),
          fetch('/api/events'),
          fetch('/api/blogs')
        ])
        
        const temples = templesRes.ok ? await templesRes.json() : []
        const darshan = darshanRes.ok ? await darshanRes.json() : []
        const events = eventsRes.ok ? await eventsRes.json() : []
        const blogs = blogsRes.ok ? await blogsRes.json() : []
        
        const items: ResultItem[] = [
          ...temples.filter((t: any) => t.status === 'approved').map((t: any) => ({
            id: t._id,
            title: t.title,
            description: t.description || t.location || '',
            category: 'Temples',
            link: `/temples/${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          })),
          ...darshan.filter((d: any) => d.status === 'approved').map((d: any) => ({
            id: d._id,
            title: d.title,
            description: d.description || '',
            category: 'Daily Darshan',
            link: '/daily-darshan'
          })),
          ...events.filter((e: any) => e.status === 'approved').map((e: any) => ({
            id: e._id,
            title: e.title,
            description: e.description || '',
            category: 'Events',
            link: '/events'
          })),
          ...blogs.filter((b: any) => b.status === 'approved').map((b: any) => ({
            id: b._id,
            title: b.title,
            description: b.content?.substring(0, 100) || '',
            category: 'Blog',
            link: '/blog'
          }))
        ]
        
        setAllItems(items)
      } catch (error) {
        console.error('Failed to fetch search data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  useEffect(() => {
    if (!query) {
      setResults({})
      return
    }
    
    // Simple substring search
    const out = allItems.filter((it) => (it.title + ' ' + it.description).toLowerCase().includes(query.toLowerCase()))
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
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('home.search')}
          className="input pr-10"
          suppressHydrationWarning
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults({}) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {query && Object.keys(results).length > 0 && (
        <div className="absolute z-50 mt-2 w-full card shadow-dropdown overflow-hidden max-h-96 overflow-y-auto">
          {Object.entries(results).map(([category, items]) => (
            <div key={category} className="p-3 border-b border-surface-border last:border-b-0">
              <div className="text-overline text-primary-600 mb-2 uppercase tracking-wider">{category}</div>
              {items.map((it) => (
                <button 
                  key={it.id} 
                  onClick={() => handleResultClick(it.link)}
                  className="w-full text-left block px-3 py-2 hover:bg-surface-sunken rounded-btn transition-colors"
                >
                  <div className="text-body-sm font-medium text-ink">{it.title}</div>
                  <div className="text-caption text-ink-muted line-clamp-2">{it.description}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {query && Object.keys(results).length === 0 && allItems.length > 0 && (
        <div className="absolute z-50 mt-2 w-full card shadow-dropdown p-4 text-center text-ink-muted text-body-sm">
          {t('search.noResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
