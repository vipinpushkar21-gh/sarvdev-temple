"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useTempleData } from '../lib/temple-data'
import { useTranslation } from '../lib/translation'

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

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/* ─── Category Card ─── */
function CategoryCard({
  category,
  templeCount,
}: {
  category: typeof allSacredCategories[0]
  templeCount: number
}) {
  return (
    <Link
      href={`/temples?category=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-surface-border bg-surface 
                 hover:border-primary-200 hover:shadow-lg hover:shadow-primary/[0.06] 
                 transition-all duration-300 no-underline hover:no-underline"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 
                      flex items-center justify-center text-2xl 
                      group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
        {category.icon}
      </div>

      {/* Name */}
      <h3 className="text-h4 font-serif text-secondary-700 leading-snug 
                     group-hover:text-primary-700 transition-colors duration-200">
        {category.name}
      </h3>

      {/* Description */}
      <p className="text-body-sm text-ink-muted leading-relaxed line-clamp-2">
        {category.desc}
      </p>

      {/* Footer */}
      <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-border/50">
        <span className="text-caption font-semibold text-primary-600 bg-primary-50/60 px-2.5 py-1 rounded-full">
          {templeCount} {templeCount === 1 ? 'temple' : 'temples'}
        </span>
        <svg
          className="w-4 h-4 text-ink-faint group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}

/* ─── Main Component ─── */
export default function HomeCategoryShowcase() {
  const { temples: allTemples, loading } = useTempleData()
  const { language } = useTranslation()
  const [shuffledCategories, setShuffledCategories] = useState<typeof allSacredCategories>([])

  useEffect(() => {
    setShuffledCategories(shuffleArray(allSacredCategories))
  }, [])

  const categoryData = useMemo(() => {
    if (shuffledCategories.length === 0 || allTemples.length === 0) return []

    const items: { category: typeof allSacredCategories[0]; templeCount: number }[] = []
    for (const cat of shuffledCategories) {
      const count = allTemples.filter(t => t.categories?.includes(cat.name)).length
      if (count === 0) continue
      items.push({ category: cat, templeCount: count })
    }
    return items
  }, [shuffledCategories, allTemples])

  if (loading) {
    return (
      <section className="section-sm overflow-hidden">
        <div className="page-container">
          <div className="h-7 bg-secondary-100 rounded w-56 mb-3 animate-pulse" />
          <div className="h-4 bg-secondary-50 rounded w-80 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 bg-surface-sunken rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categoryData.length === 0) return null

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

        {/* Category card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {categoryData.map(({ category, templeCount }) => (
            <CategoryCard
              key={category.name}
              category={category}
              templeCount={templeCount}
            />
          ))}
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
