"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useTempleData } from '../lib/temple-data'
import { useTranslation } from '../lib/translation'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'

const CATEGORIES = [
  { name: "Dwadash Jyotirlinga (12 Jyotirlingas)", short: "Jyotirlinga" },
  { name: "Shakti Peeth (51 Shakti Peethas)", short: "Shakti Peeth" },
  { name: "Char Dham", short: "Char Dham" },
  { name: "Chota Char Dham (Uttarakhand)", short: "Chota Char Dham" },
  { name: "Panch Kedar", short: "Panch Kedar" },
  { name: "Arupadai Veedu (6 Abodes of Murugan)", short: "Arupadai Veedu" },
  { name: "Navagraha Temples", short: "Navagraha" },
  { name: "Divya Desam (108 Vishnu Temples)", short: "Divya Desam" },
  { name: "Pancha Bhoota Stalam", short: "Pancha Bhoota" },
  { name: "Ashta Vinayak", short: "Ashta Vinayak" },
  { name: "Sapta Puri (7 Sacred Cities)", short: "Sapta Puri" },
  { name: "108 Shiva Temples", short: "108 Shiva" },
]

export default function HomeCategoryShowcase() {
  const { temples: allTemples, loading } = useTempleData()
  const { language } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const categoryData = useMemo(() => {
    if (allTemples.length === 0) return []
    return CATEGORIES.map(cat => {
      const matched = allTemples.filter((t: any) => t.categories?.includes(cat.name))
      if (matched.length === 0) return null
      const cover = matched[Math.floor(Math.random() * matched.length)]
      return { cat, count: matched.length, cover }
    }).filter(Boolean) as { cat: typeof CATEGORIES[0]; count: number; cover: any }[]
  }, [allTemples])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [categoryData])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="section-sm bg-gray-50">
        <div className="page-container">
          <div className="h-7 bg-gray-100 rounded w-56 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-80 mb-8 animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-56 h-72 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categoryData.length === 0) return null

  return (
    <section className="section-sm bg-gray-50">
      <div className="page-container">
        {/* Section heading */}
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <div>
            <h2 className="section-title">
              {language === 'hi' ? 'पवित्र श्रेणियाँ' : 'Sacred Categories'}
            </h2>
            <p className="section-subtitle">
              {language === 'hi' ? 'प्रतिष्ठित मंदिर समूहों की खोज करें' : 'Explore revered temple groups from across India'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 disabled:opacity-30 transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 disabled:opacity-30 transition-all duration-200"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
          style={{ cursor: 'grab' }}
          onMouseDown={(e) => {
            const el = scrollRef.current
            if (!el) return
            const startX = e.pageX - el.offsetLeft
            const scrollLeft = el.scrollLeft
            const onMove = (ev: MouseEvent) => {
              el.style.cursor = 'grabbing'
              el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX)
            }
            const onUp = () => {
              el.style.cursor = 'grab'
              window.removeEventListener('mousemove', onMove)
              window.removeEventListener('mouseup', onUp)
            }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
          }}
        >
          {categoryData.map(({ cat, count, cover }) => (
            <Link
              key={cat.name}
              href={`/temples?category=${encodeURIComponent(cat.name)}`}
              className="group relative shrink-0 w-52 rounded-2xl overflow-hidden no-underline hover:no-underline snap-start"
              style={{ height: 300 }}
              draggable={false}
            >
              {/* Full-bleed temple image */}
              <img
                src={getTempleImage(cover)}
                alt={cat.short}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = TEMPLE_PLACEHOLDER }}
              />
              {/* Bottom gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-overline uppercase tracking-[0.1em] text-white/60 mb-1">
                  {count} {count === 1 ? 'temple' : 'temples'}
                </p>
                <h3 className="text-h4 font-serif text-white leading-snug">
                  {cat.short}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link
            href="/sacred-categories"
            className="inline-flex items-center gap-2 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors no-underline hover:no-underline"
          >
            {language === 'hi' ? 'सभी पवित्र श्रेणियाँ देखें' : 'Explore all sacred categories'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
