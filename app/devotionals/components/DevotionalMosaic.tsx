"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { FULL_CATEGORIES } from './categories'

/* ─── Types ─── */
type Devotional = {
  _id: string
  title: string
  description?: string
  category?: string
  language?: string
  deity?: string
  audio?: string
  type?: string
  createdAt?: string
}

type CellSize = 'normal' | 'wide'

interface MosaicCell {
  devotional: Devotional
  size: CellSize
}

/* ─── Category Gradient Map ─── */
const CATEGORY_GRADIENTS: Record<string, { from: string; via: string; to: string; accent: string }> = {
  Aarti:          { from: 'from-amber-600',   via: 'via-orange-500',  to: 'to-yellow-500',   accent: 'bg-amber-400/20' },
  Bhajan:         { from: 'from-rose-600',    via: 'via-pink-500',    to: 'to-fuchsia-400',   accent: 'bg-rose-400/20' },
  Chalisa:        { from: 'from-indigo-700',  via: 'via-blue-600',    to: 'to-sky-400',       accent: 'bg-indigo-400/20' },
  Mantra:         { from: 'from-violet-700',  via: 'via-purple-600',  to: 'to-fuchsia-500',   accent: 'bg-violet-400/20' },
  Stotra:         { from: 'from-emerald-700', via: 'via-green-600',   to: 'to-teal-400',      accent: 'bg-emerald-400/20' },
  Stuti:          { from: 'from-teal-600',    via: 'via-cyan-500',    to: 'to-sky-400',       accent: 'bg-teal-400/20' },
  Shloka:         { from: 'from-amber-700',   via: 'via-yellow-600',  to: 'to-orange-400',    accent: 'bg-amber-400/20' },
  'Ek Shloki':    { from: 'from-orange-700',  via: 'via-red-600',     to: 'to-rose-400',      accent: 'bg-orange-400/20' },
  Ashtaka:        { from: 'from-pink-600',    via: 'via-rose-500',    to: 'to-red-400',       accent: 'bg-pink-400/20' },
  Path:           { from: 'from-stone-700',   via: 'via-amber-800',   to: 'to-yellow-700',    accent: 'bg-stone-400/20' },
  Namavali:       { from: 'from-cyan-700',    via: 'via-teal-600',    to: 'to-emerald-400',   accent: 'bg-cyan-400/20' },
  Kavacham:       { from: 'from-slate-700',   via: 'via-zinc-600',    to: 'to-stone-500',     accent: 'bg-slate-400/20' },
  Prarthana:      { from: 'from-sky-700',     via: 'via-blue-600',    to: 'to-indigo-400',    accent: 'bg-sky-400/20' },
  'Vrat Katha':   { from: 'from-red-700',     via: 'via-orange-600',  to: 'to-amber-400',     accent: 'bg-red-400/20' },
}

const DEFAULT_GRADIENT = { from: 'from-stone-700', via: 'via-amber-800', to: 'to-yellow-700', accent: 'bg-stone-400/20' }

function getGradient(category?: string) {
  if (!category) return DEFAULT_GRADIENT
  return CATEGORY_GRADIENTS[category] || DEFAULT_GRADIENT
}

function getCategoryEmoji(category?: string): string {
  const cat = FULL_CATEGORIES.find(c => c.id === category)
  return cat?.emoji || '🙏'
}

/* ─── Slug Helper ─── */
function createSlug(title: string): string {
  const englishMatch = title.match(/\(([^)]+)\)/)
  let text = englishMatch ? englishMatch[1] : title
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  if (!slug || slug === '-' || slug === '') {
    const translitMap: { [key: string]: string } = {
      'श्री': 'shri', 'गणेश': 'ganesh', 'आरती': 'aarti',
      'चालीसा': 'chalisa', 'मंत्र': 'mantra', 'स्तोत्र': 'stotra', 'भजन': 'bhajan',
    }
    let transliterated = title.toLowerCase()
    for (const [dev, eng] of Object.entries(translitMap)) {
      transliterated = transliterated.replace(new RegExp(dev, 'g'), eng)
    }
    slug = transliterated.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }
  return slug || 'devotional'
}

/* ─── Size Assignment ─── */
function assignSizes(devotionals: Devotional[]): MosaicCell[] {
  const pattern: CellSize[] = ['wide', 'normal', 'normal', 'wide', 'normal', 'normal']
  return devotionals.map((devotional, i) => ({
    devotional,
    size: pattern[i % pattern.length],
  }))
}

function chunkRows(cells: MosaicCell[], perRow: number): MosaicCell[][] {
  const rows: MosaicCell[][] = []
  for (let i = 0; i < cells.length; i += perRow) {
    rows.push(cells.slice(i, i + perRow))
  }
  return rows
}

/* ─── Desktop Mosaic Row ─── */
function MosaicRow({
  cells,
  rowIndex,
  hoveredId,
  onHover,
  onLeave,
}: {
  cells: MosaicCell[]
  rowIndex: number
  hoveredId: string | null
  onHover: (id: string) => void
  onLeave: () => void
}) {
  const rowHeight = rowIndex % 2 === 0 ? 'h-[260px] md:h-[300px]' : 'h-[220px] md:h-[260px]'

  return (
    <div className={`flex gap-2 md:gap-3 ${rowHeight}`}>
      {cells.map((cell) => {
        const { devotional, size } = cell
        const id = devotional._id
        const gradient = getGradient(devotional.category)
        const emoji = getCategoryEmoji(devotional.category)

        const baseFlex = size === 'wide' ? 1.6 : 1
        const isHovered = hoveredId === id
        const siblingHovered = hoveredId !== null && hoveredId !== id

        let flex = baseFlex
        if (isHovered) flex = baseFlex * 1.8
        else if (siblingHovered) flex = baseFlex * 0.85

        return (
          <Link
            key={id}
            href={`/devotionals/${createSlug(devotional.title || '')}`}
            className="relative block overflow-hidden rounded-card no-underline hover:no-underline group"
            style={{
              flex: `${flex} 1 0%`,
              transition: 'flex 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={onLeave}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.via} ${gradient.to} transition-all duration-700`} />

            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Large emoji watermark */}
            <div
              className="absolute top-4 right-4 text-[4rem] md:text-[5rem] leading-none opacity-[0.12] transition-all duration-500 select-none"
              style={{ transform: isHovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1) rotate(0deg)' }}
            >
              {emoji}
            </div>

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end">
              {/* Category badge */}
              {devotional.category && (
                <span
                  className="inline-flex items-center gap-1 text-caption text-white/70 mb-1.5 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 400ms ease, transform 400ms ease',
                  }}
                >
                  <span>{emoji}</span>
                  {devotional.category}
                  {devotional.language && <span className="mx-1 opacity-50">•</span>}
                  {devotional.language}
                </span>
              )}

              {/* Title */}
              <h3
                className="text-h4 md:text-h3 font-serif text-white leading-snug transition-all duration-400"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'transform 400ms ease',
                }}
              >
                {devotional.title}
              </h3>

              {/* Deity — only on hover */}
              {devotional.deity && (
                <p
                  className="text-body-sm text-white/60 mt-1 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 400ms ease 60ms, transform 400ms ease 60ms',
                  }}
                >
                  {devotional.deity}
                </p>
              )}

              {/* Audio indicator */}
              {devotional.audio && (
                <div
                  className="flex items-center gap-1.5 mt-2 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 400ms ease 120ms, transform 400ms ease 120ms',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                  <span className="text-caption text-white/50">Audio available</span>
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Mobile Horizontal Scroll ─── */
function MobileScrollRow({
  cells,
  hoveredId,
  onHover,
  onLeave,
}: {
  cells: MosaicCell[]
  hoveredId: string | null
  onHover: (id: string) => void
  onLeave: () => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
      {cells.map((cell) => {
        const { devotional } = cell
        const id = devotional._id
        const isHovered = hoveredId === id
        const gradient = getGradient(devotional.category)
        const emoji = getCategoryEmoji(devotional.category)

        return (
          <Link
            key={id}
            href={`/devotionals/${createSlug(devotional.title || '')}`}
            className="relative flex-shrink-0 w-[75vw] h-[220px] rounded-card overflow-hidden no-underline hover:no-underline snap-start"
            onMouseEnter={() => onHover(id)}
            onMouseLeave={onLeave}
            onTouchStart={() => onHover(id)}
            onTouchEnd={onLeave}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.via} ${gradient.to}`} />

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Emoji watermark */}
            <div className="absolute top-3 right-3 text-[3.5rem] leading-none opacity-[0.12] select-none">
              {emoji}
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              {devotional.category && (
                <span className="inline-flex items-center gap-1 text-caption text-white/60 mb-1">
                  <span>{emoji}</span>
                  {devotional.category}
                </span>
              )}
              <h3 className="text-h4 font-serif text-white leading-snug">
                {devotional.title}
              </h3>
              {devotional.deity && (
                <p className="text-body-sm text-white/50 mt-0.5">{devotional.deity}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Main Exported Component ─── */
export default function DevotionalMosaic({
  devotionals,
  title,
  subtitle,
}: {
  devotionals: Devotional[]
  title: string
  subtitle?: string
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const handleHover = useCallback((id: string) => setHoveredId(id), [])
  const handleLeave = useCallback(() => setHoveredId(null), [])

  if (devotionals.length === 0) return null

  const cells = assignSizes(devotionals)
  const desktopRows = chunkRows(cells, 3)

  return (
    <section className="section-sm overflow-hidden">
      <div className="page-container">
        {/* Section header */}
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        {/* Desktop mosaic */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3">
          {desktopRows.map((row, i) => (
            <MosaicRow
              key={i}
              cells={row}
              rowIndex={i}
              hoveredId={hoveredId}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex flex-col gap-3">
          <MobileScrollRow
            cells={cells}
            hoveredId={hoveredId}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        </div>
      </div>
    </section>
  )
}
