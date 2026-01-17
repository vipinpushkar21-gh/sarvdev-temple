"use client"

import { useEffect, useState } from 'react'
import TempleCard from '../../components/TempleCard'
import { useTranslation } from '../../lib/translation'

type Temple = {
  _id: string
  title: string
  location?: string
  description?: string
  image?: string
  timings?: string
  contact?: string
  deity?: string
  state?: string
  type?: string
  status?: string
  categories?: string[]
}

const sacredCategories = [
  "Dwadash Jyotirlinga (12 Jyotirlingas)",
  "Shakti Peeth (51 Shakti Peethas)",
  "Char Dham",
  "Chota Char Dham (Uttarakhand)",
  "Panch Kedar",
  "Panch Prayag",
  "Arupadai Veedu (6 Abodes of Murugan)",
  "Navagraha Temples",
  "Divya Desam (108 Vishnu Temples)",
  "Pancha Bhoota Stalam",
  "Ashta Vinayak",
  "Sapta Puri (7 Sacred Cities)",
  "108 Shiva Temples",
  "Other Sacred Group"
]

export default function TemplesPage() {
  const { t } = useTranslation()
  const [temples, setTemples] = useState<Temple[]>([])
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTemples() {
      try {
        const res = await fetch('/api/temples')
        if (res.ok) {
          const data = await res.json()
          console.log('Fetched temples:', data) // Debug log
          // Only show approved temples
          const approved = data.filter((t: Temple) => t.status === 'approved')
          setTemples(approved)
          setFilteredTemples(approved)
        } else {
          setError('Failed to fetch temples')
        }
      } catch (error) {
        console.error('Failed to fetch temples:', error)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTemples()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTemples(temples)
    } else {
      const filtered = temples.filter(t => 
        t.categories && t.categories.includes(selectedCategory)
      )
      setFilteredTemples(filtered)
    }
  }, [selectedCategory, temples])

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">{t('temples.loading')}</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-text">{error}</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{t('temples.title')}</h1>
        <p className="mt-2 text-text text-base">{t('temples.subtitle')}</p>
      </header>

      {/* Category Filter */}
      <div className="mb-8 bg-background rounded-lg p-4 shadow-md border border-accent">
        <label className="block text-sm font-semibold text-text mb-3">
          🔍 Filter by Sacred Category:
        </label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none bg-background text-text border-accent"
        >
          <option value="all">All Temples ({temples.length})</option>
          {sacredCategories.map(category => {
            const count = temples.filter(t => t.categories?.includes(category)).length
            if (count > 0) {
              return (
                <option key={category} value={category}>
                  {category} ({count})
                </option>
              )
            }
            return null
          })}
        </select>
        
        {selectedCategory !== 'all' && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-text">
              Showing {filteredTemples.length} temple{filteredTemples.length !== 1 ? 's' : ''} in <span className="font-semibold text-primary">{selectedCategory}</span>
            </p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear Filter ✕
            </button>
          </div>
        )}
      </div>

      <section>
        {filteredTemples.length === 0 ? (
          <div className="text-center py-12 text-text">
            {selectedCategory === 'all' 
              ? t('temples.noTemples')
              : `No temples found in ${selectedCategory}`
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemples.map((t: Temple) => {
              const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              return (
                <TempleCard key={t._id} temple={{ id: t._id, title: t.title, location: t.location || '', description: t.description || '', image: t.image || '', slug: slug }} />
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
