"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Hero from '../../components/Hero'

const sacredCategories = [
  { name: "Dwadash Jyotirlinga (12 Jyotirlingas)", icon: "🕉️", desc: "12 sacred Shiva shrines across the world" },
  { name: "Shakti Peeth (51 Shakti Peethas)", icon: "🔱", desc: "Places where Goddess Sati's body parts fell" },
  { name: "Char Dham", icon: "🏔️", desc: "Four sacred pilgrimage sites (Badrinath, Dwarka, Puri, Rameshwaram)" },
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

type Temple = {
  _id: string
  title: string
  location?: string
  city?: string
  state?: string
  categories?: string[]
  status?: string
}

export default function SacredCategoriesPage() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemples() {
      try {
        const res = await fetch('/api/temples')
        if (res.ok) {
          const data = await res.json()
          setTemples(data.filter((t: Temple) => t.status === 'approved'))
        }
      } catch (error) {
        console.error('Failed to fetch temples:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTemples()
  }, [])

  function getTemplesForCategory(categoryName: string) {
    return temples.filter(t => t.categories?.includes(categoryName))
  }

  if (loading) {
    return (
      <>
        <Hero title="Sacred Temple Categories" subtitle="Explore temples by their sacred significance and groupings" />
        <main className="page-container py-12">
          <div className="text-center">Loading sacred categories...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Hero title="Sacred Temple Categories" subtitle="Explore temples by their sacred significance and groupings" />
      <main className="page-container section-sm">

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sacredCategories.map((category) => {
          const count = getTemplesForCategory(category.name).length
          const isOpen = selectedCategory === category.name
          
          return (
            <div 
              key={category.name}
              className="group card-interactive cursor-pointer overflow-hidden"
              onClick={() => setSelectedCategory(isOpen ? null : category.name)}
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3">
                  <span className="text-3xl flex-shrink-0 mt-0.5">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-h4 text-secondary-700 group-hover:text-primary-600 transition-colors leading-snug">{category.name}</h3>
                    <p className="text-caption text-ink-muted mt-1">{category.desc}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    {count} {count === 1 ? 'temple' : 'temples'}
                  </span>
                  <span className={`text-caption font-semibold text-primary-600 inline-flex items-center gap-1 transition-transform ${isOpen ? '' : 'group-hover:translate-x-0.5'}`}>
                    {isOpen ? 'Hide' : 'View'}
                    <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                </div>

                {isOpen && count > 0 && (
                  <div className="mt-4 pt-4 border-t border-surface-border space-y-2">
                    {getTemplesForCategory(category.name).map(temple => {
                      const slug = temple.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      return (
                        <Link 
                          key={temple._id} 
                          href={`/temples/${slug}`}
                          className="block p-3 bg-surface-sunken rounded-lg hover:bg-primary-50/50 transition-colors no-underline hover:no-underline group/item"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-body-sm font-semibold text-ink group-hover/item:text-primary-700 transition-colors">{temple.title}</div>
                          {temple.city && temple.state && (
                            <div className="text-caption text-ink-muted mt-0.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                              {temple.city}, {temple.state}
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {isOpen && count === 0 && (
                  <div className="mt-4 pt-4 border-t border-surface-border text-caption text-ink-muted text-center">
                    No temples listed yet in this category
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <div className="relative card overflow-hidden mt-12">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="p-6 md:p-8 text-center">
          <h3 className="text-h3 font-serif text-secondary-700 mb-2">Know a temple that belongs to these sacred groups?</h3>
          <p className="text-body-sm text-ink-muted mb-5">Help us build a complete directory of sacred temples</p>
          <Link 
            href="/list-temple"
            className="btn btn-primary no-underline hover:no-underline group"
          >
            List a Temple
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
      </main>
    </>
  )
}
