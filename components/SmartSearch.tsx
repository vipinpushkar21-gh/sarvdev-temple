"use client"
import React, { useEffect, useMemo, useState } from 'react'
import sarvdev from '../data/sarvdev'

type ResultItem = { id: string; title: string; description: string; category: string }

export default function SmartSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, ResultItem[]>>({})
  const items: ResultItem[] = useMemo(() => {
    const t = sarvdev.temples.map((x) => ({ id: x.id, title: x.title, description: x.description, category: 'Temples' }))
    const d = sarvdev.dailyDarshan.map((x) => ({ id: x.id, title: x.title, description: x.description, category: 'Daily Darshan' }))
    const e = sarvdev.events.map((x) => ({ id: x.id, title: x.title, description: x.description, category: 'Events' }))
    const v = sarvdev.devotionals.map((x) => ({ id: x.id, title: x.title, description: x.description, category: 'Devotionals' }))
    return [...t, ...d, ...e, ...v]
  }, [])
  
  useEffect(() => {
    if (!query) {
      setResults({})
      return
    }
    
    // Simple substring search (Fuse.js removed to avoid build issues)
    const out = items.filter((it) => (it.title + ' ' + it.description).toLowerCase().includes(query.toLowerCase()))
    const grouped: Record<string, ResultItem[]> = {}
    out.forEach((it) => {
      if (!grouped[it.category]) grouped[it.category] = []
      grouped[it.category].push(it)
    })
    setResults(grouped)
  }, [query, items])

  return (
    <div className="relative max-w-2xl mx-auto" suppressHydrationWarning>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search temples, events, devotionals..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          suppressHydrationWarning
        />
      </div>

      {query && Object.keys(results).length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {Object.entries(results).map(([category, items]) => (
            <div key={category} className="p-3 border-b last:border-b-0">
              <div className="text-xs font-semibold text-gray-500 mb-2">{category}</div>
              {items.map((it) => (
                <a key={it.id} href="#" className="block px-2 py-2 hover:bg-orange-50">
                  <div className="font-medium text-gray-800">{it.title}</div>
                  <div className="text-sm text-gray-500">{it.description}</div>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
