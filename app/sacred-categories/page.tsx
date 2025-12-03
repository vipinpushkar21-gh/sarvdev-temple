"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

const sacredCategories = [
  { name: "Dwadash Jyotirlinga (12 Jyotirlingas)", icon: "🕉️", desc: "12 sacred Shiva shrines across India" },
  { name: "Shakti Peeth (51 Shakti Peethas)", icon: "🔱", desc: "Places where Goddess Sati's body parts fell" },
  { name: "Char Dham", icon: "🏔️", desc: "Four sacred pilgrimage sites" },
  { name: "Panch Kedar", icon: "⛰️", desc: "Five Shiva temples in Uttarakhand" },
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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">Loading sacred categories...</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-playfair text-orange-600 font-bold">Sacred Temple Categories</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">Explore temples by their sacred significance and groupings</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sacredCategories.map((category) => {
          const count = getTemplesForCategory(category.name).length
          
          return (
            <div 
              key={category.name}
              className="bg-gradient-to-br from-white to-orange-50/30 p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">{category.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-orange-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-600">{category.desc}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-orange-600">
                  {count} {count === 1 ? 'temple' : 'temples'} listed
                </span>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  {selectedCategory === category.name ? 'Hide ↑' : 'View →'}
                </button>
              </div>

              {selectedCategory === category.name && count > 0 && (
                <div className="mt-4 pt-4 border-t border-orange-200 space-y-2">
                  {getTemplesForCategory(category.name).map(temple => {
                    const slug = temple.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    return (
                      <Link 
                        key={temple._id} 
                        href={`/temples/${slug}`}
                        className="block p-3 bg-white rounded-lg hover:bg-orange-50 transition-colors border border-orange-100"
                      >
                        <div className="font-medium text-slate-800">{temple.title}</div>
                        {temple.city && temple.state && (
                          <div className="text-xs text-slate-500 mt-1">📍 {temple.city}, {temple.state}</div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}

              {selectedCategory === category.name && count === 0 && (
                <div className="mt-4 pt-4 border-t border-orange-200 text-sm text-slate-500 text-center">
                  No temples listed yet in this category
                </div>
              )}
            </div>
          )
        })}
      </section>

      <div className="mt-12 text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Know a temple that belongs to these sacred groups?</h3>
        <p className="text-slate-600 mb-4">Help us build a complete directory of sacred temples</p>
        <Link 
          href="/list-temple"
          className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          List a Temple
        </Link>
      </div>
    </main>
  )
}
