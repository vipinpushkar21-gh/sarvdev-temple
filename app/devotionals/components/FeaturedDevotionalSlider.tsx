"use client"

import { ChevronLeft, ChevronRight, Headphones, Music2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Devotional } from '../types'
import { getDevotionalHref } from './devotional-utils'

const SLIDE_GRADIENTS = [
  'from-stone-950 via-amber-950 to-stone-900',
  'from-stone-950 via-indigo-950 to-stone-900',
  'from-stone-950 via-purple-950 to-stone-900',
  'from-stone-950 via-emerald-950 to-stone-900',
  'from-stone-950 via-rose-950 to-stone-900',
  'from-stone-950 via-blue-950 to-stone-900',
  'from-stone-950 via-violet-950 to-stone-900',
  'from-stone-950 via-teal-950 to-stone-900',
]

export default function FeaturedDevotionalSlider({ items }: { items: Devotional[] }) {
  const safeItems = items.slice(0, 8)
  const total = safeItems.length
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    timerRef.current = setInterval(next, 7000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [next, paused, total])

  if (!safeItems.length) return null

  const item = safeItems[current]
  const gradient = SLIDE_GRADIENTS[current % SLIDE_GRADIENTS.length]

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} min-h-[300px] md:min-h-[320px] transition-colors duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,153,51,0.12),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-7 md:min-h-[320px] md:p-10">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {item.category && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/30 bg-amber-200/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-100">
                <Music2 className="h-3 w-3" />
                {item.category}
              </span>
            )}
            {item.deity && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-stone-200">
                {item.deity}
              </span>
            )}
            {item.audio && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-[11px] font-bold text-emerald-200">
                <Headphones className="h-3 w-3" />
                Audio
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black leading-tight text-white md:text-3xl">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-stone-300">
              {item.description}
            </p>
          )}

          <Link
            href={getDevotionalHref(item)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-stone-950 no-underline transition-colors hover:bg-amber-300"
          >
            {item.audio ? '▶ Listen Now' : '📖 Read'}
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {safeItems.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-amber-400' : 'w-3 bg-white/25 hover:bg-white/45'
                }`}
              />
            ))}
            <span className="ml-3 text-[11px] font-semibold text-stone-400">
              {current + 1} / {total}
            </span>
          </div>
          {total > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
