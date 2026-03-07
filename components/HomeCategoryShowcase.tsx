"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'

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
  { name: "Dwadash Jyotirlinga (12 Jyotirlingas)", icon: "🕉️", desc: "12 sacred Shiva shrines across India" },
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

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function CategorySlider({ category, temples }: { category: typeof allSacredCategories[0]; temples: Temple[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [checkScroll, temples])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.7
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const slug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  if (temples.length === 0) return null

  return (
    <div className="mb-12">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h3 className="text-h3 font-serif text-secondary-800">{category.name}</h3>
            <p className="text-body-sm text-ink-muted">{category.desc}</p>
          </div>
        </div>
        <Link
          href={`/temples?category=${encodeURIComponent(category.name)}`}
          className="btn btn-outline btn-sm no-underline hover:no-underline hidden sm:inline-flex"
        >
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Slider */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg text-secondary-700 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg text-secondary-700 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {temples.map((temple) => (
            <TempleSlideCard key={temple._id} temple={temple} slug={slug(temple.title)} />
          ))}
        </div>
      </div>

      {/* Mobile "View All" link */}
      <div className="sm:hidden mt-4 text-center">
        <Link
          href={`/temples?category=${encodeURIComponent(category.name)}`}
          className="btn btn-outline btn-sm no-underline hover:no-underline"
        >
          View All {category.name}
        </Link>
      </div>
    </div>
  )
}

function TempleSlideCard({ temple, slug }: { temple: Temple; slug: string }) {
  const [imgSrc, setImgSrc] = useState(getTempleImage(temple))

  return (
    <Link
      href={`/temples/${slug}`}
      className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] card-interactive overflow-hidden no-underline hover:no-underline group"
    >
      <div className="relative h-44 w-full bg-surface-sunken overflow-hidden">
        <Image
          src={imgSrc}
          alt={temple.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(TEMPLE_PLACEHOLDER)}
        />
        {temple.location && (
          <span className="absolute bottom-2 left-2 badge bg-secondary-800/80 text-white text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {temple.location}
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-h4 text-secondary-700 font-serif line-clamp-1">{temple.title}</h4>
        {temple.description && (
          <p className="mt-1.5 text-body-sm text-ink-muted line-clamp-2">{temple.description}</p>
        )}
      </div>
    </Link>
  )
}

export default function HomeCategoryShowcase() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [randomCategories, setRandomCategories] = useState<typeof allSacredCategories>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pick 3 random categories on mount (changes every refresh)
    const shuffled = shuffleArray(allSacredCategories)
    setRandomCategories(shuffled.slice(0, 3))

    async function fetchTemples() {
      try {
        const res = await fetch('/api/temples')
        if (res.ok) {
          const data = await res.json()
          const approved = data.filter((t: Temple) => t.status === 'approved')
          setTemples(approved)
        }
      } catch (err) {
        console.error('Failed to fetch temples for category showcase:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTemples()
  }, [])

  // Filter: only show categories that have temples
  const categoriesWithTemples = randomCategories
    .map(cat => ({
      category: cat,
      temples: temples.filter(t => t.categories?.includes(cat.name)),
    }))
    .filter(c => c.temples.length > 0)

  if (loading) {
    return (
      <section className="section-sm">
        <div className="page-container">
          <div className="flex items-center justify-center gap-3 py-12">
            <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-body text-ink-muted">Loading sacred categories...</span>
          </div>
        </div>
      </section>
    )
  }

  if (categoriesWithTemples.length === 0) return null

  return (
    <section className="section-sm bg-surface-sunken border-y border-surface-border">
      <div className="page-container">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-h1 font-serif text-secondary-800">Sacred Temple Categories</h2>
          <p className="mt-2 text-body text-ink-muted max-w-xl mx-auto">
            Explore revered temple groups from across India — refreshed every visit
          </p>
        </div>

        {/* Category sliders */}
        {categoriesWithTemples.map(({ category, temples: catTemples }) => (
          <CategorySlider key={category.name} category={category} temples={catTemples} />
        ))}

        {/* CTA to see all categories */}
        <div className="text-center mt-4">
          <Link
            href="/sacred-categories"
            className="btn btn-primary no-underline hover:no-underline"
          >
            Explore All Sacred Categories
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
