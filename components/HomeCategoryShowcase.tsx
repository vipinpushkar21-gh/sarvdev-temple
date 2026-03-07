"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'
import { useTempleData } from '../lib/temple-data'
import { useTranslation } from '../lib/translation'

interface Temple {
  _id: string
  title: string
  location?: string
  description?: string
  image?: string
  categories?: string[]
  status?: string
}

const allSacredCategories = [
  { name: "Dwadash Jyotirlinga (12 Jyotirlingas)", icon: "🕉️", desc: "12 sacred Shiva shrines across the world" },
  { name: "Shakti Peeth (51 Shakti Peethas)", icon: "🔱", desc: "Places where Goddess Sati's body parts fell" },
  { name: "Char Dham", icon: "🏔️", desc: "Four sacred pilgrimage sites" },
  { name: "Chota Char Dham (Uttarakhand)", icon: "⛰️", desc: "Four sacred sites in Uttarakhand Himalayas" },
  { name: "Panch Kedar", icon: "🏔️", desc: "Five Shiva temples in Uttarakhand" },
  { name: "Panch Prayag", icon: "🌊", desc: "Five sacred river confluences" },
  { name: "Arupadai Veedu (6 Abodes of Murugan)", icon: "🦚", desc: "Six homes of Lord Murugan" },
  { name: "Navagraha Temples", icon: "🌟", desc: "Nine temples dedicated to celestial bodies" },
  { name: "Divya Desam (108 Vishnu Temples)", icon: "🪷", desc: "108 temples glorified by Alwars" },
  { name: "Pancha Bhoota Stalam", icon: "🔥", desc: "Five Shiva temples representing elements" },
  { name: "Ashta Vinayak", icon: "🐘", desc: "Eight Ganesha temples in Maharashtra" },
  { name: "Sapta Puri (7 Sacred Cities)", icon: "🏛️", desc: "Seven holiest cities granting moksha" },
  { name: "108 Shiva Temples", icon: "🙏", desc: "Sacred collection of Shiva temples" },
]

type CellSize = 'normal' | 'wide'

interface CategoryCell {
  category: typeof allSacredCategories[0]
  representativeTemple: Temple
  templeCount: number
  size: CellSize
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function assignCellSizes(cells: CategoryCell[]): CategoryCell[] {
  const pattern: CellSize[] = ['wide', 'normal', 'normal', 'wide', 'normal', 'normal']
  return cells.map((cell, i) => ({
    ...cell,
    size: pattern[i % pattern.length],
  }))
}

function chunkRows(cells: CategoryCell[], perRow: number): CategoryCell[][] {
  const rows: CategoryCell[][] = []
  for (let i = 0; i < cells.length; i += perRow) {
    rows.push(cells.slice(i, i + perRow))
  }
  return rows
}

/* ─── Mosaic Row for Categories ─── */
function CategoryMosaicRow({
  cells,
  rowIndex,
  hoveredName,
  onHover,
  onLeave,
}: {
  cells: CategoryCell[]
  rowIndex: number
  hoveredName: string | null
  onHover: (name: string) => void
  onLeave: () => void
}) {
  const rowHeight = rowIndex % 2 === 0 ? 'h-[300px] md:h-[360px]' : 'h-[260px] md:h-[300px]'

  return (
    <div className={`flex gap-2 md:gap-3 ${rowHeight}`}>
      {cells.map((cell) => {
        const { category, representativeTemple, templeCount, size } = cell
        const isHovered = hoveredName === category.name
        const siblingHovered = hoveredName !== null && hoveredName !== category.name

        const baseFlex = size === 'wide' ? 1.6 : 1
        let flex = baseFlex
        if (isHovered) flex = baseFlex * 1.8
        else if (siblingHovered) flex = baseFlex * 0.85

        return (
          <Link
            key={category.name}
            href={`/temples?category=${encodeURIComponent(category.name)}`}
            className="relative block overflow-hidden rounded-card no-underline hover:no-underline group"
            style={{
              flex: `${flex} 1 0%`,
              transition: 'flex 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={() => onHover(category.name)}
            onMouseLeave={onLeave}
          >
            {/* Image */}
            <img
              src={getTempleImage(representativeTemple)}
              alt={category.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              onError={(e) => { (e.target as HTMLImageElement).src = TEMPLE_PLACEHOLDER }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(to top, rgba(26,17,15,0.8) 0%, rgba(26,17,15,0.3) 45%, rgba(26,17,15,0.08) 100%)',
                opacity: isHovered ? 1 : 0.65,
              }}
            />

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end">
              {/* Icon + temple count badge */}
              <div
                className="flex items-center gap-2 mb-2 transition-all duration-400"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 400ms ease, transform 400ms ease',
                }}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-caption text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {templeCount} temples
                </span>
              </div>

              {/* Category name */}
              <h3
                className="text-h4 md:text-h3 font-serif text-white leading-snug transition-all duration-400"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'transform 400ms ease',
                }}
              >
                {category.name}
              </h3>

              {/* Description — only on hover */}
              <p
                className="text-body-sm text-white/60 mt-1 transition-all duration-400"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 400ms ease 60ms, transform 400ms ease 60ms',
                }}
              >
                {category.desc}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Mobile horizontal scroll for categories ─── */
function CategoryMobileScroll({
  cells,
  hoveredName,
  onHover,
  onLeave,
}: {
  cells: CategoryCell[]
  hoveredName: string | null
  onHover: (name: string) => void
  onLeave: () => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
      {cells.map((cell) => {
        const { category, representativeTemple, templeCount } = cell
        const isHovered = hoveredName === category.name

        return (
          <Link
            key={category.name}
            href={`/temples?category=${encodeURIComponent(category.name)}`}
            className="relative flex-shrink-0 w-[75vw] h-[260px] rounded-card overflow-hidden no-underline hover:no-underline snap-start"
            onMouseEnter={() => onHover(category.name)}
            onMouseLeave={onLeave}
            onTouchStart={() => onHover(category.name)}
            onTouchEnd={onLeave}
          >
            <img
              src={getTempleImage(representativeTemple)}
              alt={category.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = TEMPLE_PLACEHOLDER }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(26,17,15,0.8) 0%, rgba(26,17,15,0.2) 50%, transparent 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{category.icon}</span>
                <span className="text-caption text-white/60 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {templeCount} temples
                </span>
              </div>
              <h3 className="text-h4 font-serif text-white leading-snug">
                {category.name}
              </h3>
              <p className="text-body-sm text-white/50 mt-1">{category.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Main Component ─── */
export default function HomeCategoryShowcase() {
  const { temples: allTemples, loading } = useTempleData()
  const { language } = useTranslation()
  const [hoveredName, setHoveredName] = useState<string | null>(null)
  const [shuffledCategories, setShuffledCategories] = useState<typeof allSacredCategories>([])

  useEffect(() => {
    setShuffledCategories(shuffleArray(allSacredCategories))
  }, [])

  const handleHover = useCallback((name: string) => setHoveredName(name), [])
  const handleLeave = useCallback(() => setHoveredName(null), [])

  const categoryCells: CategoryCell[] = useMemo(() => {
    if (shuffledCategories.length === 0 || allTemples.length === 0) return []

    const cells: CategoryCell[] = []
    for (const cat of shuffledCategories) {
      const catTemples = allTemples.filter(t => t.categories?.includes(cat.name))
      if (catTemples.length === 0) continue
      // Pick a random representative temple for the image
      const representative = catTemples[Math.floor(Math.random() * catTemples.length)]
      cells.push({
        category: cat,
        representativeTemple: representative,
        templeCount: catTemples.length,
        size: 'normal',
      })
    }
    return assignCellSizes(cells)
  }, [shuffledCategories, allTemples])

  if (loading) {
    return (
      <section className="section-sm overflow-hidden">
        <div className="page-container">
          <div className="h-7 bg-secondary-100 rounded w-56 mb-3 animate-pulse" />
          <div className="h-4 bg-secondary-50 rounded w-80 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 md:h-64 bg-surface-sunken rounded-card animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categoryCells.length === 0) return null

  const desktopRows = chunkRows(categoryCells, 3)

  return (
    <section className="section-sm relative bg-surface-sunken border-y border-surface-border overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="page-container relative z-10">
        {/* Section heading */}
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="section-title">{language === 'hi' ? 'पवित्र मंदिर श्रेणियाँ' : 'Sacred Temple Categories'}</h2>
          <p className="section-subtitle">
            {language === 'hi' ? 'सम्पूर्ण विश्व के प्रतिष्ठित मंदिर समूहों की खोज करें — हर बार नये' : 'Explore revered temple groups from across the world — refreshed every visit'}
          </p>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        {/* Desktop mosaic (hidden on small screens) */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3">
          {desktopRows.map((row, i) => (
            <CategoryMosaicRow
              key={i}
              cells={row}
              rowIndex={i}
              hoveredName={hoveredName}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
        </div>

        {/* Mobile horizontal scroll (visible on small screens) */}
        <div className="md:hidden flex flex-col gap-3">
          <CategoryMobileScroll
            cells={categoryCells}
            hoveredName={hoveredName}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        </div>

        {/* CTA to see all categories */}
        <div className="mt-8 md:mt-10 text-center">
          <Link
            href="/sacred-categories"
            className="btn btn-primary no-underline hover:no-underline group"
          >
            {language === 'hi' ? 'सभी पवित्र श्रेणियाँ देखें' : 'Explore All Sacred Categories'}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
