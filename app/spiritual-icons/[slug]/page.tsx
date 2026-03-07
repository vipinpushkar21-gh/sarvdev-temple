"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Hero from '../../../components/Hero'
import { getSpiritualIconBySlug, getRelatedIcons, categories } from '../../../data/spiritual-icons'
import type { SpiritualIcon } from '../../../data/spiritual-icons'

const typeBgs: Record<string, string> = {
  'katha-vachak': 'bg-primary-100',
  'bhajan-gayak': 'bg-secondary-100',
  'pandit': 'bg-accent-100',
}

const typeLabels: Record<string, string> = {
  'katha-vachak': 'Katha Vachak',
  'bhajan-gayak': 'Bhajan Gayak',
  'pandit': 'Pandit / Purohit',
}

export default function SpiritualIconDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const icon = getSpiritualIconBySlug(slug)

  if (!icon) {
    return (
      <>
        <Hero title="Not Found" subtitle="This spiritual icon could not be found." />
        <main className="content-container py-12 text-center">
          <p className="text-body text-ink-muted mb-6">The page you are looking for does not exist.</p>
          <Link href="/spiritual-icons" className="btn btn-primary no-underline hover:no-underline">
            Back to Spiritual Icons
          </Link>
        </main>
      </>
    )
  }

  const category = categories.find(c => c.id === icon.type)
  const relatedIcons = getRelatedIcons(icon, 3)

  return (
    <>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/15 border-b border-surface-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-36 h-36 bg-accent/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="page-container py-10 md:py-14 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-ink-muted text-body-sm">
            <Link href="/" className="hover:text-primary-600 no-underline hover:no-underline transition-colors">Home</Link>
            <span>/</span>
            <Link href="/spiritual-icons" className="hover:text-primary-600 no-underline hover:no-underline transition-colors">
              Spiritual Icons
            </Link>
            <span>/</span>
            <span className="text-ink font-medium">{category?.label}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full ${typeBgs[icon.type]} flex items-center justify-center flex-shrink-0 border-4 border-white/60 shadow-lg overflow-hidden`}>
              {icon.image ? (
                <img src={icon.image} alt={icon.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-6xl font-serif font-bold text-secondary-700">{icon.name.charAt(0)}</span>
              )}
            </div>

            <div>
              <span className="badge badge-primary text-xs font-medium mb-3 inline-block">
                {typeLabels[icon.type]}
              </span>
              <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">{icon.name}</h1>
              <p className="text-h3 text-ink-muted font-serif mt-1">{icon.nameHi}</p>
              <div className="mt-3 flex items-center gap-2 text-ink-muted">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-body">{icon.state}</span>
              </div>
              <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="content-container py-10">

        {/* About Section */}
        <section className="mb-10">
          <h2 className="text-h2 font-serif text-secondary-800 mb-4">About</h2>
          <p className="text-body text-ink leading-relaxed">{icon.description}</p>
        </section>

        {/* Details Grid */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Speciality */}
          <div className="card p-6">
            <h3 className="text-h4 font-serif text-secondary-700 mb-3">Speciality</h3>
            <span className="badge bg-primary-50 text-primary-700 text-sm px-3 py-1">{icon.speciality}</span>
          </div>

          {/* State */}
          <div className="card p-6">
            <h3 className="text-h4 font-serif text-secondary-700 mb-3">Based In</h3>
            <div className="flex items-center gap-2 text-body text-ink">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {icon.state}
            </div>
          </div>
        </section>

        {/* Famous For */}
        <section className="mb-10">
          <h2 className="text-h2 font-serif text-secondary-800 mb-4">Famous For</h2>
          <div className="flex flex-wrap gap-3">
            {icon.famousFor.map((tag) => (
              <span key={tag} className="badge bg-surface-sunken text-secondary-700 text-sm px-4 py-2 border border-surface-border">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Category Info */}
        {category && (
          <section className="mb-10 card p-6 bg-surface-sunken border border-surface-border">
            <div>
              <h3 className="text-h4 font-serif text-secondary-700">{category.label}</h3>
              <p className="text-caption text-ink-muted">{category.labelHi}</p>
            </div>
            <p className="text-body-sm text-ink-muted mt-2">{category.desc}</p>
          </section>
        )}

        {/* Related Icons */}
        {relatedIcons.length > 0 && (
          <section>
            <h2 className="text-h2 font-serif text-secondary-800 mb-6">More {category?.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedIcons.map((related) => (
                <RelatedCard key={related.id} icon={related} />
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link href="/spiritual-icons" className="btn btn-outline no-underline hover:no-underline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Spiritual Icons
          </Link>
        </div>
      </main>
    </>
  )
}

function RelatedCard({ icon }: { icon: SpiritualIcon }) {
  return (
    <Link
      href={`/spiritual-icons/${icon.slug}`}
      className="card-interactive overflow-hidden no-underline hover:no-underline group"
    >
      <div className={`relative h-32 w-full ${typeBgs[icon.type]} flex items-center justify-center`}>
        <div className="w-14 h-14 rounded-full bg-secondary-200 flex items-center justify-center">
          <span className="text-2xl font-serif font-bold text-secondary-700">{icon.name.charAt(0)}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-h4 font-serif text-secondary-800 line-clamp-1">{icon.name}</h4>
        <p className="text-caption text-primary-600 mt-0.5">{icon.nameHi}</p>
        <p className="text-caption text-ink-muted mt-1">{icon.speciality}</p>
      </div>
    </Link>
  )
}
