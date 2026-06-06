"use client"

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'
import ShareButtons from '../../../components/ShareButtons'
import { DetailPageSkeleton } from '../../../components/Skeleton'
import AdminEditBar from '../../../components/AdminEditBar'
import { DEITY_CATEGORIES } from '../page'
import { getDeityCardImage, getDeityHeroImage, getGalleryImage } from '../../../lib/temple-image'
import SarvdevImage from '../../../components/SarvdevImage'
import { renderTextParagraphs } from '../../../components/TextParagraphs'
import { findBestDeityMatch, mergeStaticDeityWithDb } from '../../../lib/deity-identity'
import { compactText } from '../../../lib/text-formatting'
import { useTranslation } from '../../../lib/translation'

const BASE_URL = 'https://sarvdev.com'

const STATIC_DEITIES: any[] = DEITY_CATEGORIES.flatMap((category: any) =>
  category.deities.map((deity: any) => ({
    ...deity,
    category: category.title,
  }))
)

type Props = {
  params: Promise<{ slug: string }>
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function textMatchesDeity(value: unknown, deity: any) {
  const haystack = String(value || '').toLowerCase()
  if (!haystack) return false
  const names = [deity?.name, deity?.nameHi, deity?.slug]
    .filter(Boolean)
    .flatMap((name: string) => [name, name.replace(/\([^)]*\)/g, ''), name.split(/[(/]/)[0]])
    .map((name: string) => name.toLowerCase().trim())
    .filter(Boolean)
  return names.some((name: string) => haystack.includes(name))
}

function isGaneshAlias(slug: string) {
  return ['ganesh-ji', 'lord-ganesh', 'lord-ganesha', 'ganesh', 'ganesha'].includes(slug)
}

function isGaneshaRecord(deity: any) {
  const text = `${deity?.name || ''} ${deity?.slug || ''} ${deity?.staticSlug || ''}`.toLowerCase()
  return /(^|\s|-)ganesh(a)?($|\s|-)/.test(text) && !text.includes('mushak') && !text.includes('mushika') && !text.includes('mushakraj')
}

export default function DeityDetailPage({ params }: Props) {
  const { language } = useTranslation()
  const [deity, setDeity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedDevotionals, setRelatedDevotionals] = useState<any[]>([])
  const [relatedTemples, setRelatedTemples] = useState<any[]>([])

  useEffect(() => {
    async function fetchDeity() {
      try {
        const { slug } = await params
        let foundDeity = null
        let dbDeities: any[] = []
        let dbFetchSucceeded = false

        try {
          const response = await fetch('/api/deities', { cache: 'no-store' })
          if (response.ok) {
            dbFetchSucceeded = true
            const data = await response.json()
            dbDeities = Array.isArray(data) ? data : []
            if (Array.isArray(dbDeities)) {
              foundDeity = dbDeities.find((d: any) => d.slug === slug)
            }
          }
        } catch {
          // Static fallback keeps existing slugs working if DB is unavailable.
        }

        if (foundDeity) {
          setDeity(foundDeity)
          return
        }

        const staticDeity = STATIC_DEITIES.find((d: any) => d.slug === slug)
        if (!staticDeity && isGaneshAlias(slug)) {
          const ganeshStatic = STATIC_DEITIES.find((d: any) => d.slug === 'ganesh-ji')
          const ganeshDb = dbDeities.find(isGaneshaRecord)
          if (ganeshStatic && ganeshDb) {
            setDeity({ ...mergeStaticDeityWithDb(ganeshStatic, ganeshDb), slug })
          } else if (ganeshDb) {
            setDeity({ ...ganeshDb, slug })
          } else if (ganeshStatic) {
            setDeity({ ...ganeshStatic, slug })
          } else {
            setError('Deity not found')
          }
          return
        }
        if (!staticDeity) {
          setError('Deity not found')
          return
        }

        const dbMatch = isGaneshAlias(slug)
          ? dbDeities.find(isGaneshaRecord)
          : findBestDeityMatch(staticDeity, dbDeities)?.deity as any
        if (dbMatch) {
          setDeity(mergeStaticDeityWithDb(staticDeity, dbMatch))
        } else if (dbFetchSucceeded && dbDeities.length > 0) {
          setError('Deity not found')
        } else {
          setDeity(staticDeity)
        }
      } catch {
        setError('Failed to load deity')
      } finally {
        setLoading(false)
      }
    }

    fetchDeity()
  }, [params])

  useEffect(() => {
    if (!deity) return
    let cancelled = false

    async function loadRelated() {
      try {
        const [devotionalRes, templeRes] = await Promise.all([
          fetch('/api/devotionals'),
          fetch('/api/temples'),
        ])
        const devotionals = devotionalRes.ok ? await devotionalRes.json() : []
        const temples = templeRes.ok ? await templeRes.json() : []
        if (cancelled) return

        setRelatedDevotionals((Array.isArray(devotionals) ? devotionals : [])
          .filter((item: any) => item.status === 'approved' || !item.status)
          .filter((item: any) => textMatchesDeity([item.deity, item.title, item.description, item.category].filter(Boolean).join(' '), deity))
          .slice(0, 6))

        setRelatedTemples((Array.isArray(temples) ? temples : [])
          .filter((item: any) => item.status === 'approved' || !item.status)
          .filter((item: any) => textMatchesDeity([item.deity, item.title, item.description, item.speciality].filter(Boolean).join(' '), deity))
          .slice(0, 6))
      } catch {
        if (!cancelled) {
          setRelatedDevotionals([])
          setRelatedTemples([])
        }
      }
    }

    loadRelated()
    return () => { cancelled = true }
  }, [deity])

  if (loading) return <DetailPageSkeleton />

  if (error || !deity) {
    return (
      <div className="page-container section-sm min-h-screen">
        <div className="text-center py-20">
          <h1 className="text-h2 font-serif text-secondary-800 mb-4">Deity Not Found</h1>
          <Link href="/deities" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to Deities
          </Link>
        </div>
      </div>
    )
  }

  const category = DEITY_CATEGORIES.find((cat: any) => cat.deities.some((item: any) => item.slug === deity.slug || item.name === deity.name))
  const relatedForms = (category?.deities || []).filter((item: any) => item.slug !== deity.slug).slice(0, 6)
  const heroImage = getDeityHeroImage(deity)
  const pageUrl = `${BASE_URL}/deities/${deity.slug}`
  const wantsHindi = language === 'hi'
  const aboutText = wantsHindi
    ? (deity.descriptionHi || deity.description)
    : (deity.description || deity.descriptionHi)
  const aboutTextIsHindi = wantsHindi ? Boolean(deity.descriptionHi) : (!deity.description && Boolean(deity.descriptionHi))
  const aboutTitle = wantsHindi ? (deity.nameHi || deity.name) : (deity.name || deity.nameHi)
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Deities', item: `${BASE_URL}/deities` },
      { '@type': 'ListItem', position: 3, name: deity.name, item: pageUrl },
    ],
  }
  const deityLd = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: deity.name,
    alternateName: deity.nameHi,
    description: compactText(deity.description || deity.descriptionHi),
    image: heroImage.src,
    url: pageUrl,
    category: deity.category || category?.title,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(deityLd) }} />
      <Breadcrumbs
        items={[
          { label: 'Deities', href: '/deities' },
          { label: deity.nameHi, href: `/deities/${deity.slug}` },
        ]}
      />
      <AdminEditBar editHref={deity._id ? `/admin/deities/edit/${deity._id}` : undefined} />

      <section className="relative min-h-[680px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage
          image={heroImage}
          alt={deity.name}
          className="absolute inset-0 opacity-70"
          imgClassName="object-cover"
          loading="eager"
          renderMode="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/96 via-stone-950/70 to-stone-950/18" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[680px] flex-col justify-end pb-16 pt-24">
          <div className="max-w-5xl">
            <div className="mb-4 flex flex-wrap gap-2">
              {(deity.category || category?.title) && <span className="deity-detail-badge">{deity.category || category?.title}</span>}
              {category?.titleHi && <span className="deity-detail-badge">{category.titleHi}</span>}
              <span className="deity-detail-badge">Sacred profile</span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,4.5rem)] font-serif leading-tight tracking-normal text-white drop-shadow-2xl">{aboutTitle}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ShareButtons title={`${deity.nameHi} - ${deity.name}`} url={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>
          </div>
        </div>
      </section>

      <main className="bg-surface pb-20">
        <div className="page-container -mt-10 relative z-20">
          <div className="grid gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
            <DeityFact label="Category" value={deity.category || category?.title || 'Deity'} />
            <DeityFact label="Forms nearby" value={`${relatedForms.length} related`} />
            <DeityFact label="Devotionals" value={`${relatedDevotionals.length} linked`} />
            <DeityFact label="Temples" value={`${relatedTemples.length} linked`} />
          </div>
        </div>

        <div className="page-container pt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            {deity.mantra && (
              <section className="deity-mantra-panel">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Mantra</p>
                <p className="mt-4 text-center font-devanagari text-2xl font-bold leading-10 text-stone-950">{deity.mantra}</p>
              </section>
            )}

            <section className="deity-detail-panel">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">About</p>
              <h2 className="mt-1 text-3xl font-serif text-stone-950">{aboutTitle}</h2>
              <div className="mt-5 space-y-5">
                {aboutText
                  ? renderTextParagraphs(
                    aboutText,
                    aboutTextIsHindi
                      ? 'font-devanagari text-lg leading-9 text-stone-800'
                      : 'text-lg leading-9 text-stone-700'
                  )
                  : <p className="text-lg leading-9 text-stone-500">Description will appear here once it is added.</p>}
              </div>
            </section>

            {deity.attributes && deity.attributes.length > 0 && (
              <section className="deity-detail-panel">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Attributes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {deity.attributes.map((attr: string, index: number) => (
                    <span key={index} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-800">{attr}</span>
                  ))}
                </div>
              </section>
            )}

            <RelatedSection
              title="Related devotionals"
              empty="Related mantras, aarti and stotras will appear here as devotional content is mapped."
              footer={
                deity.slug && relatedDevotionals.length > 0 ? (
                  <Link
                    href={`/devotionals/deity/${deity.slug}`}
                    className="text-sm font-semibold text-orange-700 no-underline hover:text-orange-900"
                  >
                    View all {deity.name} devotionals →
                  </Link>
                ) : undefined
              }
            >
              {relatedDevotionals.map((item) => (
                <RelatedTextCard key={item._id || item.title} href={`/devotionals/${item.slug || slugify(item.title || '')}`} title={item.title} subtitle={[item.category, item.language].filter(Boolean).join(' - ')} />
              ))}
            </RelatedSection>

            <RelatedSection title="Related temples" empty="Related temple links will appear here as temple deity fields are mapped.">
              {relatedTemples.map((item) => (
                <RelatedTextCard key={item._id || item.title} href={`/temples/${item.slug || slugify(item.title || '')}`} title={item.title} subtitle={[item.city, item.state].filter(Boolean).join(', ')} />
              ))}
            </RelatedSection>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="deity-detail-panel">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Related forms</p>
              <div className="mt-4 grid gap-3">
                {relatedForms.length > 0 ? relatedForms.map((item: any) => (
                  <Link key={item.slug || item.name} href={`/deities/${item.slug}`} className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 no-underline transition hover:border-amber-300 hover:bg-orange-50">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                      <SarvdevImage image={getDeityCardImage(item)} alt={item.name} className="absolute inset-0" imgClassName="object-cover" renderMode="auto" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-black text-stone-950 group-hover:text-orange-700">{item.nameHi}</p>
                      <p className="truncate text-xs font-semibold text-stone-500">{item.name}</p>
                    </div>
                  </Link>
                )) : <p className="text-sm text-stone-500">Related forms will appear here.</p>}
              </div>
            </section>

            {deity.images && deity.images.length > 0 && (
              <section className="deity-detail-panel">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Gallery</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {deity.images.map((img: string, index: number) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-orange-50">
                      <SarvdevImage image={getGalleryImage(img)} alt={`${deity.name} ${index + 1}`} className="absolute inset-0" imgClassName="object-cover hover:scale-105 transition-transform duration-300" renderMode="auto" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </>
  )
}

function DeityFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-orange-50/70 p-4">
      <span className="block text-xs font-black uppercase tracking-wide text-stone-500">{label}</span>
      <span className="mt-1 block text-sm font-black text-stone-950">{value}</span>
    </div>
  )
}

function RelatedSection({ title, empty, children, footer }: { title: string; empty: string; children: ReactNode; footer?: ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <section className="deity-detail-panel">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">{title}</p>
      {hasChildren ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div> : <p className="mt-4 text-sm text-stone-500">{empty}</p>}
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  )
}

function RelatedTextCard({ href, title, subtitle }: { href: string; title: string; subtitle?: string }) {
  return (
    <Link href={href} className="rounded-xl border border-stone-200 bg-white p-4 no-underline transition hover:border-amber-300 hover:bg-orange-50">
      <p className="font-black text-stone-950">{title}</p>
      {subtitle && <p className="mt-1 text-xs font-semibold text-stone-500">{subtitle}</p>}
    </Link>
  )
}
