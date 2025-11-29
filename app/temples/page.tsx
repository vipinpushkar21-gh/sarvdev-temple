"use client"

import { useEffect, useState } from 'react'
import TempleCard from '../../components/TempleCard'

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
}

export default function TemplesPage() {
  const [temples, setTemples] = useState<Temple[]>([])
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

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-slate-600">Loading temples...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-rose-600">{error}</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">Temples</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Explore our temple directory and learn about each sacred site.</p>
      </header>

      <section>
        {temples.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No approved temples yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {temples.map((t: Temple) => (
              <TempleCard key={t._id} temple={{ id: t._id, title: t.title, location: t.location || '', description: t.description || '', image: t.image || '', slug: t._id }} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
