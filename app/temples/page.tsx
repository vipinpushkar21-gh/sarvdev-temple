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
}

export default function TemplesPage() {
  const { t } = useTranslation()
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
        <div className="text-center">{t('temples.loading')}</div>
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
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">{t('temples.title')}</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">{t('temples.subtitle')}</p>
      </header>

      <section>
        {temples.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {t('temples.noTemples')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {temples.map((t: Temple) => {
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
