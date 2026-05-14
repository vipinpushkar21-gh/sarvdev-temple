'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'
import ShareButtons from '../../../components/ShareButtons'
import { DetailPageSkeleton } from '../../../components/Skeleton'
import AdminEditBar from '../../../components/AdminEditBar'
import { DEITY_CATEGORIES } from '../page'

// Flatten all deities from categories for fallback
const STATIC_DEITIES: any[] = DEITY_CATEGORIES.flatMap((category: any) =>
  category.deities.map((deity: any) => ({
    ...deity,
    category: category.title,
  }))
)

type Props = {
  params: Promise<{ slug: string }>
}

export default function DeityDetailPage({ params }: Props) {
  const [deity, setDeity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDeity() {
      try {
        const { slug } = await params
        const response = await fetch('/api/deities')
        const deities = await response.json()
        const foundDeity = deities.find((d: any) => d.slug === slug)
        
        if (foundDeity) {
          setDeity(foundDeity)
        } else {
          // Fallback to static data
          const staticDeity = STATIC_DEITIES.find((d: any) => d.slug === slug)
          if (staticDeity) {
            setDeity(staticDeity)
          } else {
            setError('Deity not found')
          }
        }
      } catch (err) {
        setError('Failed to fetch deity')
      } finally {
        setLoading(false)
      }
    }

    fetchDeity()
  }, [params])

  if (loading) {
    return <DetailPageSkeleton />
  }

  if (error || !deity) {
    return (
      <div className="page-container section-sm min-h-screen">
        <div className="text-center py-20">
          <h1 className="text-h2 font-serif text-secondary-800 mb-4">Deity Not Found</h1>
          <Link href="/deities" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Deities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Deities', href: '/deities' },
          { label: deity.nameHi, href: `/deities/${deity.slug}` },
        ]}
      />

      <div className="page-container section-sm min-h-screen">
        {deity._id && (
          <AdminEditBar 
            editHref={`/admin/deities/edit/${deity._id}`}
          />
        )}

        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl mb-8">
            <img
              src={deity.image || 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'}
              alt={deity.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-display-sm font-serif text-secondary-800 mb-2">{deity.nameHi}</h1>
              <p className="text-h3 text-primary-700 font-semibold">{deity.name}</p>
              {deity.category && (
                <span className="inline-block mt-3 px-3 py-1 text-caption font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                  {deity.category}
                </span>
              )}
            </div>
            <ShareButtons
              title={`${deity.nameHi} - ${deity.name}`}
              url={typeof window !== 'undefined' ? window.location.href : ''}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="card p-6 md:p-8 mb-8">
          <h2 className="text-h3 font-serif text-secondary-800 mb-4">About</h2>
          <div className="space-y-4">
            {deity.descriptionHi && (
              <p className="text-body font-devanagari text-ink leading-relaxed">{deity.descriptionHi}</p>
            )}
            {deity.description && (
              <p className="text-body text-ink leading-relaxed">{deity.description}</p>
            )}
          </div>
        </div>

        {/* Attributes Section */}
        {deity.attributes && deity.attributes.length > 0 && (
          <div className="card p-6 md:p-8 mb-8">
            <h2 className="text-h3 font-serif text-secondary-800 mb-4">Attributes</h2>
            <div className="flex flex-wrap gap-2">
              {deity.attributes.map((attr: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-body-sm font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mantra Section */}
        {deity.mantra && (
          <div className="card p-6 md:p-8 mb-8 bg-gradient-to-br from-primary-50/80 to-accent-50/50 border-primary-200/50">
            <h2 className="text-h3 font-serif text-secondary-800 mb-4">मंत्र / Mantra</h2>
            <p className="text-body-lg font-devanagari text-secondary-800 font-medium text-center py-4">
              {deity.mantra}
            </p>
          </div>
        )}

        {/* Gallery Section */}
        {deity.images && deity.images.length > 0 && (
          <div className="card p-6 md:p-8 mb-8">
            <h2 className="text-h3 font-serif text-secondary-800 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {deity.images.map((img: string, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={img}
                    alt={`${deity.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
