"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─── Types ─── */
interface Temple {
  _id: string
  title: string
  description: string
  image?: string
  location?: string
  city?: string
  state?: string
  deity?: string
  slug?: string
}

/* Each cell can be "normal" or "wide" in its base flex ratio */
type CellSize = 'normal' | 'wide'

interface GalleryCell {
  temple: Temple
  size: CellSize
}

/* ─── Helpers ─── */
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()

/**
 * Assign sizes to temples to create visual variety.
 * Pattern: wide, normal, normal, wide, normal, normal, wide …
 */
function assignSizes(temples: Temple[]): GalleryCell[] {
  const pattern: CellSize[] = ['wide', 'normal', 'normal', 'wide', 'normal', 'normal']
  return temples.map((temple, i) => ({
    temple,
    size: pattern[i % pattern.length],
  }))
}

/**
 * Split cells into rows of a given target count.
 */
function chunkRows(cells: GalleryCell[], perRow: number): GalleryCell[][] {
  const rows: GalleryCell[][] = []
  for (let i = 0; i < cells.length; i += perRow) {
    rows.push(cells.slice(i, i + perRow))
  }
  return rows
}

/* ─── Mosaic Row ─── */
function MosaicRow({
  cells,
  rowIndex,
  hoveredId,
  onHover,
  onLeave,
}: {
  cells: GalleryCell[]
  rowIndex: number
  hoveredId: string | null
  onHover: (id: string) => void
  onLeave: () => void
}) {
  /* Row heights alternate for visual rhythm */
  const rowHeight = rowIndex % 2 === 0 ? 'h-[340px] md:h-[400px]' : 'h-[280px] md:h-[340px]'

  return (
    <div className={`flex gap-2 md:gap-3 ${rowHeight}`}>
      {cells.map((cell) => {
        const { temple, size } = cell
        const id = temple._id

        /* Base flex ratios */
        const baseFlex = size === 'wide' ? 1.6 : 1

        /* When ANY cell in the gallery is hovered, this cell either expands or contracts */
        const isHovered = hoveredId === id
        const siblingHovered = hoveredId !== null && hoveredId !== id

        let flex = baseFlex
        if (isHovered) flex = baseFlex * 1.8
        else if (siblingHovered) flex = baseFlex * 0.85

        const slug = temple.slug || generateSlug(temple.title)
        const locationLabel = temple.city && temple.state
          ? `${temple.city}, ${temple.state}`
          : temple.location || ''

        return (
          <Link
            key={id}
            href={`/temples/${slug}`}
            className="relative block overflow-hidden rounded-card no-underline hover:no-underline group"
            style={{
              flex: `${flex} 1 0%`,
              transition: 'flex 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={onLeave}
          >
            {/* Image */}
            <img
              src={
                temple.image ||
                'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=1200&q=75'
              }
              alt={temple.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* Gradient overlay — always present, deepens on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(to top, rgba(26,17,15,0.75) 0%, rgba(26,17,15,0.25) 40%, rgba(26,17,15,0.05) 100%)',
                opacity: isHovered ? 1 : 0.6,
              }}
            />

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end">
              {/* Location badge */}
              {locationLabel && (
                <span
                  className="inline-flex items-center gap-1 text-caption text-white/70 mb-1.5 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 400ms ease, transform 400ms ease',
                  }}
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {locationLabel}
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
                {temple.title}
              </h3>

              {/* Deity / subtitle — only on hover */}
              {temple.deity && (
                <p
                  className="text-body-sm text-white/60 mt-1 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 400ms ease 60ms, transform 400ms ease 60ms',
                  }}
                >
                  {temple.deity}
                </p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Mobile horizontal scroll variant ─── */
function MobileScrollRow({
  cells,
  hoveredId,
  onHover,
  onLeave,
}: {
  cells: GalleryCell[]
  hoveredId: string | null
  onHover: (id: string) => void
  onLeave: () => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
      {cells.map((cell) => {
        const { temple } = cell
        const id = temple._id
        const isHovered = hoveredId === id
        const slug = temple.slug || generateSlug(temple.title)
        const locationLabel = temple.city && temple.state
          ? `${temple.city}, ${temple.state}`
          : temple.location || ''

        return (
          <Link
            key={id}
            href={`/temples/${slug}`}
            className="relative flex-shrink-0 w-[75vw] h-[260px] rounded-card overflow-hidden no-underline hover:no-underline snap-start"
            onMouseEnter={() => onHover(id)}
            onMouseLeave={onLeave}
            onTouchStart={() => onHover(id)}
            onTouchEnd={onLeave}
          >
            <img
              src={
                temple.image ||
                'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=800&q=75'
              }
              alt={temple.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(26,17,15,0.7) 0%, rgba(26,17,15,0.15) 50%, transparent 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              {locationLabel && (
                <span className="inline-flex items-center gap-1 text-caption text-white/60 mb-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {locationLabel}
                </span>
              )}
              <h3 className="text-h4 font-serif text-white leading-snug">
                {temple.title}
              </h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Main Component ─── */
export default function TempleGalleryMosaic() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    fetchTemples()
  }, [])

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        const featured = data
          .filter((t: Temple) => t.image)
          .slice(0, 12)
        setTemples(featured)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    }
  }

  const handleHover = useCallback((id: string) => setHoveredId(id), [])
  const handleLeave = useCallback(() => setHoveredId(null), [])

  if (temples.length === 0) return null

  const cells = assignSizes(temples)
  /* Desktop: 3-4 items per row; build rows */
  const desktopRows = chunkRows(cells, 4)

  return (
    <section className="section-sm overflow-hidden">
      <div className="page-container">
        {/* Section header */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-h1 font-serif text-secondary-800">
            Highlighted Temples
          </h2>
          <p className="mt-2 text-body text-ink-muted max-w-xl">
            Explore sacred destinations across India — hover to discover.
          </p>
        </div>

        {/* Desktop mosaic (hidden on small screens) */}
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

        {/* Mobile horizontal scroll (visible on small screens) */}
        <div className="md:hidden flex flex-col gap-3">
          <MobileScrollRow
            cells={cells}
            hoveredId={hoveredId}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        </div>

        {/* "View all" link */}
        <div className="mt-6 md:mt-8 text-center">
          <Link
            href="/temples"
            className="btn btn-outline no-underline hover:no-underline inline-flex items-center gap-2"
          >
            View All Temples
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
