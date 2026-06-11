'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from '../../../lib/translation'
import { getTempleHeroImage, getTempleCardImage } from '../../../lib/temple-image'
import BookmarkButton from '../../../components/BookmarkButton'
import ShareButtons from '../../../components/ShareButtons'
import { DetailPageSkeleton } from '../../../components/Skeleton'
import ReviewSection from '../../../components/ReviewSection'
import ClaimTempleButton from '../../../components/ClaimTempleButton'
import AdminEditBar from '../../../components/AdminEditBar'
import DeitySmartContent from '../../../components/DeitySmartContent'
import TempleImageGallery from '../../../components/TempleImageGallery'
import SarvdevImage from '../../../components/SarvdevImage'

type Props = {
  params: Promise<{ slug: string }>
}

const TEMPLE_TYPE_HI: Record<string, string> = {
  'Ancient': 'प्राचीन',
  'Modern': 'आधुनिक',
  'Heritage': 'विरासत',
  'Char Dham': 'चार धाम',
  'Jyotirlinga': 'ज्योतिर्लिंग',
  'Shakti Peeth': 'शक्तिपीठ',
  'ISKCON': 'इस्कॉन',
  'Buddhist': 'बौद्ध',
  'Jain': 'जैन',
  'Sikh': 'सिख',
  'Famous': 'प्रसिद्ध',
  'Regional': 'क्षेत्रीय',
  'Tribal': 'जनजातीय',
  'Panch Kedar': 'पंच केदार',
  'Panch Badri': 'पंच बद्री',
  'Divya Desam': 'दिव्य देसम',
}

const DEITY_HI: Record<string, string> = {
  'Shiva': 'शिव',
  'Lord Shiva': 'भगवान शिव',
  'Mahadev': 'महादेव',
  'Vishnu': 'विष्णु',
  'Lord Vishnu': 'भगवान विष्णु',
  'Brahma': 'ब्रह्मा',
  'Ganesha': 'गणेश',
  'Ganesh': 'गणेश',
  'Durga': 'दुर्गा',
  'Maa Durga': 'माँ दुर्गा',
  'Lakshmi': 'लक्ष्मी',
  'Saraswati': 'सरस्वती',
  'Hanuman': 'हनुमान',
  'Ram': 'राम',
  'Lord Ram': 'भगवान राम',
  'Krishna': 'कृष्ण',
  'Lord Krishna': 'भगवान कृष्ण',
  'Kali': 'काली',
  'Maa Kali': 'माँ काली',
  'Parvati': 'पार्वती',
  'Surya': 'सूर्य',
  'Balaji': 'बालाजी',
  'Venkateswara': 'वेंकटेश्वर',
  'Murugan': 'मुरुगन',
  'Ayyappa': 'अय्यप्पा',
  'Nataraj': 'नटराज',
  'Nataraja': 'नटराज',
  'Rama': 'राम',
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean)
  if (typeof value === 'string') {
    const separator = value.includes('|') ? '|' : value.includes(';') ? ';' : ','
    return value.split(separator).map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function uniqueStrings(values: unknown[]): string[] {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)))
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function formatDistance(distanceKm: unknown): string {
  const n = Number(distanceKm)
  if (!Number.isFinite(n)) return ''
  return `${n.toFixed(n < 10 ? 1 : 0)} km away`
}

/** Small helper so we can use useState for the onError fallback */
function TempleDetailImage({ temple, alt }: { temple: any; alt: string }) {
  const heroImage = getTempleHeroImage(temple)
  return (
    <SarvdevImage
      image={heroImage}
      alt={alt}
      className="absolute inset-0"
      imgClassName="object-cover"
      loading="eager"
      renderMode="auto"
    />
  )
}

/** Bento info card with icon and animated gradient top border */
function BentoInfoCard({ icon, label, value, className = '', children }: {
  icon: string; label: string; value?: string; className?: string; children?: React.ReactNode
}) {
  return (
    <div className={`bento-card reveal-up gradient-shimmer group ${className}`}>
      <div className="flex items-start gap-4">
        <div className="bento-icon flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold text-ink-muted uppercase tracking-wider mb-1">{label}</p>
          {value && <p className="text-body font-medium text-ink leading-relaxed whitespace-pre-line">{value}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}

function TempleSummaryCard({
  temple,
  meta,
}: {
  temple: any
  meta?: React.ReactNode
}) {
  const templeSlug = temple.slug || slugify(temple.title || '')
  return (
    <Link href={'/temples/' + templeSlug}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 no-underline flex flex-col">
      <div className="relative h-36 overflow-hidden bg-gray-50">
        <SarvdevImage image={getTempleCardImage(temple)} alt={temple.title} className="absolute inset-0" imgClassName="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-ink group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">{temple.title}</h3>
        <p className="text-xs text-ink-muted mt-1">{[temple.city, temple.state].filter(Boolean).join(', ')}</p>
        {temple.deity && <p className="text-xs text-primary-600 font-medium mt-1">{temple.deity}</p>}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
    </Link>
  )
}

export default function TemplePage({ params }: Props) {
  const { t, language } = useTranslation()
  const [temple, setTemple] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [nearby, setNearby] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')
  const heroRef = useRef<HTMLDivElement>(null)
  const heroImageLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    
    async function fetchTemple() {
      try {
        const res = await fetch(`/api/temples/${encodeURIComponent(slug)}?t=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        if (!res.ok) {
          setLoading(false)
          return
        }
        const found = await res.json()
        setTemple(found || null)
      } catch (error) {
        console.error('Error fetching temple:', error)
        setTemple(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTemple()
  }, [slug])

  useEffect(() => {
    if (!temple) return
    const controller = new AbortController()
    const qs = new URLSearchParams()
    if (slug) qs.set('slug', slug)
    if (temple._id) qs.set('id', String(temple._id))
    if (temple.deity) qs.set('deity', temple.deity)
    if (temple.deitySlug) qs.set('deitySlug', temple.deitySlug)
    if (temple.state) qs.set('state', temple.state)
    if (temple.district) qs.set('district', temple.district)
    const categoryNames = uniqueStrings([
      ...asStringArray(temple.categories),
      ...asStringArray(temple.sacredCategories),
    ])
    const categorySlugs = asStringArray(temple.sacredCategorySlugs)
    const templeTypes = uniqueStrings([
      ...asStringArray(temple.templeTypes),
      ...(temple.templeType ? [temple.templeType] : []),
    ])
    if (categoryNames[0]) qs.set('category', categoryNames[0])
    if (categoryNames.length > 0) qs.set('categories', categoryNames.join('|'))
    if (categorySlugs.length > 0) qs.set('sacredCategorySlugs', categorySlugs.join('|'))
    if (templeTypes.length > 0) qs.set('templeTypes', templeTypes.join('|'))
    if (isFiniteNumber(temple.latitude) && isFiniteNumber(temple.longitude)) {
      qs.set('includeNearby', '1')
      qs.set('lat', String(temple.latitude))
      qs.set('lng', String(temple.longitude))
    }
    fetch('/api/temples/related?' + qs.toString(), { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setRelated(d.slice(0, 8))
          setNearby([])
          return
        }
        setRelated(Array.isArray(d?.related) ? d.related.slice(0, 8) : [])
        setNearby(Array.isArray(d?.nearby) ? d.nearby.slice(0, 6) : [])
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          setRelated([])
          setNearby([])
        }
      })
    return () => controller.abort()
  }, [temple, slug])

  // Parallax zoom effect on hero image
  useEffect(() => {
    let raf = 0
    function handleScroll() {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        if (!heroRef.current || !heroImageLayerRef.current) {
          raf = 0
          return
        }
        const rect = heroRef.current.getBoundingClientRect()
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height))
        heroImageLayerRef.current.style.transform = `scale(${1 + scrollProgress * 0.04})`
        raf = 0
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  if (loading) {
    return (
      <main className="content-container section-sm">
        <DetailPageSkeleton />
      </main>
    )
  }

  if (!temple) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bento-card p-10 text-center max-w-md">
          <div className="bento-icon mx-auto mb-5 w-16 h-16 text-2xl">🏛️</div>
          <h1 className="text-h2 font-serif text-secondary-700">{t('temple.notFound')}</h1>
          <p className="mt-3 text-body text-ink-muted">{t('temple.notFoundDesc')}</p>
          <Link href="/temples" className="inline-block mt-6 btn btn-primary btn-lg">
            {t('temple.backToTemples')}
          </Link>
        </div>
      </main>
    )
  }

  // Use mapsLink embed URL stored in DB
  const mapsLink = (temple.mapsLink && temple.mapsLink.includes('google.com/maps/embed')) ? temple.mapsLink : null
  const displayLocation = ((language === 'hi' && temple.locationHi) ? temple.locationHi : temple.location)?.trim()
  const descriptionText = String(
    (language === 'hi' ? temple.descriptionHi || temple.description : temple.description || temple.descriptionHi) || ''
  ).trim()

  // Collect bento items
  const bentoItems: { icon: string; label: string; value: string; span?: boolean }[] = []
  const deityValue = temple.deity
    ? (language === 'hi' ? (DEITY_HI[temple.deity] || temple.deity) : temple.deity)
    : null
  if (deityValue) bentoItems.push({ icon: '🕉️', label: t('temple.deity'), value: deityValue })
  const cityVal = (language === 'hi' && temple.cityHi) ? temple.cityHi : temple.city
  const stateVal = (language === 'hi' && temple.stateHi) ? temple.stateHi : temple.state
  const pincodeVal = (language === 'hi' && temple.pincodeHi) ? temple.pincodeHi : temple.pincode
  if (temple.city && temple.state && !temple.city.includes('http'))
    bentoItems.push({ icon: '📍', label: t('temple.location'), value: `${cityVal}, ${stateVal}${pincodeVal ? ` — ${pincodeVal}` : ''}` })
  const allTempleTypes: string[] = (Array.isArray(temple.templeTypes) && temple.templeTypes.length > 0)
    ? temple.templeTypes
    : (temple.templeType ? [temple.templeType] : [])
  const templeTypeValue = allTempleTypes.length > 0
    ? allTempleTypes.map((tt: string) => language === 'hi' ? (TEMPLE_TYPE_HI[tt] || tt) : tt).join(' · ')
    : null
  if (templeTypeValue) bentoItems.push({ icon: '🏛️', label: t('temple.templeType'), value: templeTypeValue })
  const establishedVal = (language === 'hi' && temple.establishedYearHi) ? temple.establishedYearHi : temple.establishedYear
  if (establishedVal) bentoItems.push({ icon: '📅', label: t('temple.established'), value: establishedVal })
  const timingValue = temple.timingSlots?.length > 0
    ? temple.timingSlots.join('\n')
    : temple.timings
  if (timingValue) bentoItems.push({ icon: '⏰', label: t('temple.timings'), value: timingValue })
  const specialityVal = (language === 'hi' && temple.specialityHi) ? temple.specialityHi : temple.speciality
  if (specialityVal) bentoItems.push({ icon: '✨', label: t('temple.speciality'), value: specialityVal, span: true })

  const districtVal = (language === 'hi' && temple.districtHi) ? temple.districtHi : temple.district
  const sacredCategoryNames = uniqueStrings([
    ...asStringArray(temple.categories),
    ...asStringArray(temple.sacredCategories),
  ])
  const sacredCategorySlugs = asStringArray(temple.sacredCategorySlugs)
  const quickFacts = [
    stateVal && { label: 'State', value: stateVal },
    districtVal && { label: 'District', value: districtVal },
    cityVal && { label: 'City', value: cityVal },
    deityValue && { label: 'Deity', value: deityValue },
    templeTypeValue && { label: 'Temple Type', value: templeTypeValue },
    sacredCategoryNames.length > 0 && { label: 'Sacred Categories', value: sacredCategoryNames.join(' · ') },
  ].filter(Boolean) as { label: string; value: string }[]

  const internalLinks = uniqueStrings([
    temple.deity ? JSON.stringify({ label: `More ${temple.deity} temples`, href: `/temples/deity/${slugify(temple.deity)}` }) : '',
    temple.state ? JSON.stringify({ label: `Temples in ${temple.state}`, href: `/temples/state/${slugify(temple.state)}` }) : '',
    sacredCategoryNames[0]
      ? JSON.stringify({
        label: `${sacredCategoryNames[0]} temples`,
        href: `/temples/pilgrimage/${sacredCategorySlugs[0] || slugify(sacredCategoryNames[0])}`,
      })
      : '',
  ]).map((item) => JSON.parse(item) as { label: string; href: string })

  return (
    <>
      {/* ── Immersive Hero Section ── */}
      <div ref={heroRef} className="temple-hero-2030">
        <div
          ref={heroImageLayerRef}
          className="absolute inset-0 parallax-zoom"
          style={{ transform: 'scale(1)', transformOrigin: 'top center' }}
        >
          <TempleDetailImage temple={temple} alt={temple.title} />
        </div>
        {/* Ambient orb particles */}
        <div className="hero-orb hero-orb-gold" aria-hidden="true" />
        <div className="hero-orb hero-orb-saffron" aria-hidden="true" />
        <div className="hero-orb hero-orb-maroon" aria-hidden="true" />
        {/* Sacred gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-temple-gold-DEFAULT to-transparent opacity-70 z-20" />

        {/* Hero overlay content */}
        <div className="temple-hero-content">
          <div className="max-w-page mx-auto">
            {/* Breadcrumb over hero */}
            <nav className="mb-4 fade-in">
              <ol className="flex items-center gap-1.5 text-body-sm text-white/70 flex-wrap">
                <li><Link href="/" className="hover:text-white transition-colors text-white/70 no-underline hover:no-underline">{t('nav.home')}</Link></li>
                <li className="text-white/40">/</li>
                <li><Link href="/temples" className="hover:text-white transition-colors text-white/70 no-underline hover:no-underline">{t('nav.temples')}</Link></li>
                <li className="text-white/40">/</li>
                {temple.state && (
                  <>
                    <li><Link href={`/temples/state/${slugify(temple.state)}`} className="hover:text-white transition-colors text-white/70 no-underline hover:no-underline">{stateVal}</Link></li>
                    <li className="text-white/40">/</li>
                  </>
                )}
                <li className="text-white font-medium truncate max-w-[250px]">{(language === 'hi' && temple.titleHi) ? temple.titleHi : temple.title}</li>
              </ol>
            </nav>

            {/* Verification badge */}
            <div className="mb-3 reveal-up">
              {temple.verified === 'verified' ? (
                <span className="verified-badge-2030">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('temple.verified')}
                </span>
              ) : (
                <span className="unverified-badge-2030">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('temple.notVerified')}
                </span>
              )}
            </div>

            {/* Temple type overline */}
            {templeTypeValue && (
              <div className="mb-2 reveal-up" style={{ animationDelay: '80ms' }}>
                <span className="font-cinzel text-overline uppercase tracking-[0.2em] text-temple-gold-light">
                  {templeTypeValue}
                </span>
              </div>
            )}

            {/* Temple title */}
            <h1 className="hero-title-grand reveal-up" style={{ animationDelay: '100ms' }}>
              {(language === 'hi' && temple.titleHi) ? temple.titleHi : temple.title}
            </h1>
            {displayLocation && (
              <p className="mt-3 text-body text-sandstone-300 flex items-center gap-2 reveal-up" style={{ animationDelay: '200ms' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {displayLocation}
              </p>
            )}

            {/* Sacred category badges */}
            {sacredCategoryNames.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 reveal-up" style={{ animationDelay: '250ms' }}>
                {sacredCategoryNames.map((cat: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-white/15 text-white/90 backdrop-blur-sm border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-temple-gold-light inline-block" />
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Floating action bar */}
            <div className="mt-6 flex items-center gap-3 flex-wrap reveal-up" style={{ animationDelay: '300ms' }}>
              <div className="floating-bar-2030 flex items-center gap-2 px-2 py-1.5">
                <BookmarkButton
                  item={{ id: temple._id || slug, type: 'temple', title: temple.title, slug, image: temple.imageCard || temple.imageHero || temple.image }}
                />
                <div className="w-px h-6 bg-surface-border" />
                <ShareButtons title={temple.title} />
              </div>
              {temple.bestSeason && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/20">
                  🌸 Best: {temple.bestSeason}
                </span>
              )}
              {temple.averageVisitDuration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/20">
                  ⏱ {temple.averageVisitDuration}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Cinematic scroll indicator */}
        <div className="scroll-cue" aria-hidden="true">
          <div className="scroll-cue-dot" />
          <div className="scroll-cue-line" />
        </div>
      </div>

      {/* Section Quick Nav */}
      <nav className="section-quick-nav" aria-label="Page sections">
        {descriptionText && <a href="#about" className="section-nav-pill">🙏 About</a>}
        {(temple.sacredImportance || temple.sacredImportanceHi) && <a href="#significance" className="section-nav-pill">🕉️ Significance</a>}
        {(temple.history || temple.historyHi) && <a href="#history" className="section-nav-pill">📜 History</a>}
        {(temple.mythology || temple.templeLegend) && <a href="#mythology" className="section-nav-pill">🌟 Mythology</a>}
        {(temple.architectureStyle || temple.builtBy) && <a href="#architecture" className="section-nav-pill">🏛️ Architecture</a>}
        {temple.festivals && temple.festivals.length > 0 && <a href="#festivals" className="section-nav-pill">🎉 Festivals</a>}
        {(temple.dressCode || temple.pilgrimageCircuit) && <a href="#visitor" className="section-nav-pill">🛕 Visitor Guide</a>}
        {(temple.nearestAirport || temple.nearestRailwayStation) && <a href="#travel" className="section-nav-pill">✈️ How to Reach</a>}
        {((temple.imageGallery?.length ?? 0) > 0 || (temple.galleryImages?.length ?? 0) > 0 || (temple.images?.length ?? 0) > 0) && <a href="#gallery" className="section-nav-pill">🖼️ Gallery</a>}
      </nav>

      {/* ── Main Content ── */}
      <main className="temple-content-wrap max-w-page mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-30 pb-16 has-mobile-bar">

        {/* About Section — premium editorial overlapping hero */}
        {descriptionText && (
        <section id="about" className="about-editorial p-10 sm:p-12 md:p-14 mb-10 mt-16 reveal-up">
          <div className="section-heading-2030">
            <h2>{t('temple.about')}</h2>
          </div>
          <div className="space-y-4 max-w-content">
            {descriptionText.split(/\n\n+/).filter(Boolean).map((para: string, idx: number) => (
              <p key={idx} className="text-body text-ink leading-[1.85] whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </section>
        )}

        {/* Quick Facts */}
        {quickFacts.length > 0 && (
          <section className={`mb-10 reveal-up ${!descriptionText ? 'mt-16' : ''}`}>
            <div className="rounded-2xl border border-temple-gold-DEFAULT/20 bg-white/85 shadow-sm p-5 sm:p-6">
              <div className="section-heading-2030 mb-4">
                <h2>Quick Facts</h2>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-xl bg-sandstone-50/80 border border-sandstone-200/70 p-4">
                    <dt className="text-caption font-semibold text-ink-muted uppercase tracking-wider">{fact.label}</dt>
                    <dd className="mt-1 text-body-sm font-semibold text-ink leading-relaxed">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {bentoItems.length > 0 && (
          <section className="mb-10">
            <div className="section-heading-2030 reveal-up">
              <h2>{t('temple.details')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {bentoItems.map((item, idx) => (
                <BentoInfoCard
                  key={idx}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  className={item.span ? 'md:col-span-2 lg:col-span-3' : ''}
                />
              ))}
              {/* Maps link inside bento if available - REMOVED */}
            </div>
          </section>
        )}

        {/* Sacred Categories */}
        {sacredCategoryNames.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="sacred-cat-section">
              <div className="section-heading-2030">
                <h2>{t('temple.sacredCategories')}</h2>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {sacredCategoryNames.map((cat: string, idx: number) => (
                  <span key={idx} className="sacred-tag-2030" style={{ animationDelay: `${idx * 60}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Spiritual Significance */}
        {(temple.sacredImportance || temple.sacredImportanceHi) && (
          <section id="significance" className="mb-10 reveal-up">
            <div className="spiritual-sig-card">
              <div className="section-heading-2030"><h2>Spiritual Significance</h2></div>
              <p className="text-body text-ink leading-[1.9] whitespace-pre-line mt-4" style={{ fontSize: '1.05rem' }}>
                {(language === 'hi' && temple.sacredImportanceHi) ? temple.sacredImportanceHi : temple.sacredImportance}
              </p>
            </div>
          </section>
        )}

        {/* Temple History */}
        {(temple.history || temple.historyHi) && (
          <section id="history" className="mb-10 reveal-up">
            <div className="section-dark-parchment">
              <div className="section-heading-2030"><h2>Temple History</h2></div>
              <div className="parchment-card space-y-4 mt-4">
                {((language === 'hi' && temple.historyHi) ? temple.historyHi : temple.history)!.split(/\n\n+/).filter(Boolean).map((para: string, idx: number) => (
                  <p key={idx} className="text-body leading-[1.9] whitespace-pre-line">{para}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mythology & Legend */}
        {(temple.mythology || temple.templeLegend) && (
          <section id="mythology" className="mb-10 reveal-up">
            <div className="section-mystical">
              <div className="section-heading-2030"><h2>Legends & Mythology</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
                {(temple.mythology || temple.mythologyHi) && (
                  <div className="glass-dark-card">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">📜</span>
                      <h3 className="text-h4 font-serif">Mythology</h3>
                    </div>
                    <div className="sacred-quote-block mt-2">
                      <p className="whitespace-pre-line">
                        {(language === 'hi' && temple.mythologyHi) ? temple.mythologyHi : temple.mythology}
                      </p>
                    </div>
                  </div>
                )}
                {(temple.templeLegend || temple.templeLegendHi) && (
                  <div className="glass-dark-card">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">🌟</span>
                      <h3 className="text-h4 font-serif">Temple Legend</h3>
                    </div>
                    <div className="sacred-quote-block mt-2">
                      <p className="whitespace-pre-line">
                        {(language === 'hi' && temple.templeLegendHi) ? temple.templeLegendHi : temple.templeLegend}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Sacred Mystery */}
        {(temple.sacredMystery || temple.sacredMysteryHi) && (
          <section id="mystery" className="mb-10 reveal-up">
            <div className="sacred-mystery-card">
              <div className="section-heading-2030"><h2>Sacred Mystery</h2></div>
              <div className="flex items-start gap-4 mt-4">
                <span className="text-3xl flex-shrink-0">🔮</span>
                <p className="text-body leading-[1.9] whitespace-pre-line italic">
                  {(language === 'hi' && temple.sacredMysteryHi) ? temple.sacredMysteryHi : temple.sacredMystery}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Architecture */}
        {(temple.architectureStyle || temple.architectureHighlights || temple.builtBy) && (
          <section id="architecture" className="mb-10 reveal-up">
            <div className="section-architecture">
              <div className="section-heading-2030"><h2>Architecture</h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 stagger-children">
                {temple.architectureStyle && (
                  <div className="arch-stat-card"><span className="arch-stat-icon">🏛️</span><div className="arch-stat-value">{temple.architectureStyle}</div><div className="arch-stat-label">Style</div></div>
                )}
                {temple.builtBy && (
                  <div className="arch-stat-card"><span className="arch-stat-icon">👑</span><div className="arch-stat-value">{temple.builtBy}</div><div className="arch-stat-label">Built By</div></div>
                )}
                {temple.dynasty && (
                  <div className="arch-stat-card"><span className="arch-stat-icon">⚔️</span><div className="arch-stat-value">{temple.dynasty}</div><div className="arch-stat-label">Dynasty</div></div>
                )}
                {temple.templeArea && (
                  <div className="arch-stat-card"><span className="arch-stat-icon">📐</span><div className="arch-stat-value">{temple.templeArea}</div><div className="arch-stat-label">Area</div></div>
                )}
                {temple.gopuramCount && (
                  <div className="arch-stat-card"><span className="arch-stat-icon">�</span><div className="arch-stat-value">{temple.gopuramCount}</div><div className="arch-stat-label">Gopurams</div></div>
                )}
                {temple.mandapamDetails && (
                  <div className="arch-stat-card col-span-2"><span className="arch-stat-icon">🏹</span><div className="arch-stat-value">{temple.mandapamDetails}</div><div className="arch-stat-label">Mandapam</div></div>
                )}
              </div>
              {(temple.renovations || temple.architectureHighlights) && (
                <div className="mt-4 p-5 rounded-xl space-y-2" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)' }}>
                  {temple.architectureHighlights && <p className="text-body-sm text-secondary-700 leading-relaxed"><span className="font-semibold">✨ Highlights: </span>{temple.architectureHighlights}</p>}
                  {temple.renovations && <p className="text-body-sm text-secondary-700 leading-relaxed"><span className="font-semibold">🔨 Renovations: </span>{temple.renovations}</p>}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Pilgrimage & Visitor Info */}
        {(temple.dressCode || temple.photographyAllowed || temple.prasadamInfo || temple.specialRituals || temple.templeRules || temple.crowdLevel || temple.pilgrimageCircuit) && (
          <section id="visitor" className="mb-10 reveal-up">
            <div className="section-pilgrimage">
              <div className="section-heading-2030"><h2>Pilgrimage & Visitor Guide</h2></div>
              <div className="flex flex-wrap gap-3 mt-4">
                {temple.dressCode && <span className="visitor-pill">👘 {temple.dressCode}</span>}
                {temple.photographyAllowed && <span className="visitor-pill">📷 {temple.photographyAllowed === 'yes' ? 'Photography Allowed' : temple.photographyAllowed === 'no' ? 'No Photography' : 'Photography Restricted'}</span>}
                {temple.crowdLevel && <span className="visitor-pill">👥 {temple.crowdLevel.charAt(0).toUpperCase() + temple.crowdLevel.slice(1)} Crowd</span>}
                {temple.pilgrimageCircuit && <span className="visitor-pill">🛕 {temple.pilgrimageCircuit}</span>}
                {temple.pilgrimageType && <span className="visitor-pill">🙏 {temple.pilgrimageType}</span>}
                {temple.bestSeason && <span className="visitor-pill">🌸 Best: {temple.bestSeason}</span>}
                {temple.averageVisitDuration && <span className="visitor-pill">⏱ {temple.averageVisitDuration}</span>}
              </div>
              {temple.prasadamInfo && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <p className="text-body-sm font-semibold text-secondary-700 mb-1">🍛 Prasadam</p>
                  <p className="text-body-sm text-ink-muted">{temple.prasadamInfo}</p>
                </div>
              )}
              {temple.specialRituals && (
                <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <p className="text-body-sm font-semibold text-secondary-700 mb-1">🔔 Special Rituals</p>
                  <p className="text-body-sm text-ink-muted">{temple.specialRituals}</p>
                </div>
              )}
              {temple.templeRules && (
                <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <p className="text-body-sm font-semibold text-secondary-700 mb-1">📋 Temple Rules</p>
                  <p className="text-body-sm text-ink-muted">{temple.templeRules}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Nearby Sacred Places */}
        {temple.nearbySacredPlaces && temple.nearbySacredPlaces.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030"><h2>Nearby Sacred Places</h2></div>
            <div className="flex flex-wrap gap-3">
              {temple.nearbySacredPlaces.map((place: string, idx: number) => (
                <span key={idx} className="nearby-place-tag">
                  <span className="text-base">🏛️</span> {place}
                </span>
              ))}
            </div>
          </section>
        )}

        {nearby.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030"><h2>Nearby Temples</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 stagger-children">
              {nearby.map((nt: any) => (
                <TempleSummaryCard
                  key={String(nt._id)}
                  temple={nt}
                  meta={
                    <div className="flex flex-wrap gap-2">
                      {nt.distanceBucket && <span className="text-[11px] px-2 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">{nt.distanceBucket}</span>}
                      {formatDistance(nt.distanceKm) && <span className="text-[11px] px-2 py-1 rounded-full bg-sandstone-100 text-ink-muted">{formatDistance(nt.distanceKm)}</span>}
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {((temple.imageGallery && temple.imageGallery.length > 0) || (temple.galleryImages && temple.galleryImages.length > 0) || (temple.images && temple.images.length > 0)) && (
          <section id="gallery" className="mb-10 reveal-up">
            <div className="gallery-section-premium">
              <div className="section-heading-2030"><h2>Gallery</h2></div>
              <div className="mt-4">
                <TempleImageGallery images={[...(temple.imageGallery || []), ...(temple.galleryImages || []), ...(temple.images || [])]} title={temple.title} />
              </div>
            </div>
          </section>
        )}

        {/* Travel Guide */}
        {(temple.nearestAirport || temple.nearestRailwayStation || temple.nearestBusStand || temple.localTransport || temple.accommodationInfo || temple.parkingAvailable) && (
          <section id="travel" className="mb-10 reveal-up">
            <div className="travel-section-wrap">
              <div className="section-heading-2030"><h2>How to Reach</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 stagger-children">
                {temple.nearestAirport && (
                  <div className="travel-chip">
                    <div className="travel-chip-icon">✈️</div>
                    <div><div className="travel-chip-label">Nearest Airport</div><div className="travel-chip-value">{temple.nearestAirport}</div></div>
                  </div>
                )}
                {temple.nearestRailwayStation && (
                  <div className="travel-chip">
                    <div className="travel-chip-icon">🚂</div>
                    <div><div className="travel-chip-label">Railway Station</div><div className="travel-chip-value">{temple.nearestRailwayStation}</div></div>
                  </div>
                )}
                {temple.nearestBusStand && (
                  <div className="travel-chip">
                    <div className="travel-chip-icon">🚌</div>
                    <div><div className="travel-chip-label">Bus Stand</div><div className="travel-chip-value">{temple.nearestBusStand}</div></div>
                  </div>
                )}
                {temple.parkingAvailable && (
                  <div className="travel-chip">
                    <div className="travel-chip-icon">🅿️</div>
                    <div><div className="travel-chip-label">Parking</div><div className="travel-chip-value">{temple.parkingAvailable}</div></div>
                  </div>
                )}
                {temple.wheelchairAccess && (
                  <div className="travel-chip">
                    <div className="travel-chip-icon">♿</div>
                    <div><div className="travel-chip-label">Accessibility</div><div className="travel-chip-value">{temple.wheelchairAccess}</div></div>
                  </div>
                )}
                {temple.localTransport && (
                  <div className="travel-chip sm:col-span-2">
                    <div className="travel-chip-icon">🛺</div>
                    <div><div className="travel-chip-label">Local Transport</div><div className="travel-chip-value">{temple.localTransport}</div></div>
                  </div>
                )}
                {temple.accommodationInfo && (
                  <div className="travel-chip sm:col-span-2 lg:col-span-3">
                    <div className="travel-chip-icon">🏨</div>
                    <div><div className="travel-chip-label">Accommodation</div><div className="travel-chip-value">{temple.accommodationInfo}</div></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Festivals Section */}
        {temple.festivals && temple.festivals.length > 0 && (
          <section id="festivals" className="mb-10 reveal-up">
            <div className="festival-section-wrap">
              <div className="section-heading-2030">
                <h2>{t('temple.festivals')}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 stagger-children">
                {temple.festivals.map((festival: { name: string; nameHi?: string; description: string; descriptionHi?: string; month?: string; crowdScale?: string }, idx: number) => (
                  <div key={idx} className="festival-aura-card">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">🎉</span>
                      <div className="min-w-0 flex-1">
                        <p className="festival-name">
                          {(language === 'hi' && festival.nameHi) ? festival.nameHi : festival.name}
                        </p>
                        {festival.month && <p className="festival-month">📅 {festival.month}</p>}
                        {(language === 'hi' && festival.descriptionHi ? festival.descriptionHi : festival.description) && (
                          <p className="festival-desc">
                            {(language === 'hi' && festival.descriptionHi) ? festival.descriptionHi : festival.description}
                          </p>
                        )}
                        {festival.crowdScale && <p className="festival-desc mt-1">👥 {festival.crowdScale}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Google Maps Embed */}
        {mapsLink && (
          <section id="map" className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.locationMap')}</h2>
            </div>
            <div className="map-section-premium">
              <div className="relative w-full h-80">
                <iframe
                  src={mapsLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        )}

        {/* Contact Info */}
        {(temple.phone || temple.email || temple.website || temple.contact) && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.contactInfo')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              {temple.phone && (
                <BentoInfoCard icon="📞" label={t('temple.phone')}>
                  <a href={`tel:${temple.phone}`} className="contact-link-2030 mt-1">{temple.phone}</a>
                </BentoInfoCard>
              )}
              {temple.email && (
                <BentoInfoCard icon="📧" label={t('temple.email')}>
                  <a href={`mailto:${temple.email}`} className="contact-link-2030 mt-1">{temple.email}</a>
                </BentoInfoCard>
              )}
              {temple.website && (
                <BentoInfoCard icon="🌐" label={t('temple.website')}>
                  <a href={temple.website.startsWith('http') ? temple.website : `https://${temple.website}`} target="_blank" rel="noopener noreferrer" className="contact-link-2030 mt-1">
                    {t('temple.visitWebsite')}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </BentoInfoCard>
              )}
              {temple.contact && (
                <BentoInfoCard icon="👤" label={t('temple.contactPerson')} value={temple.contact} />
              )}
            </div>
          </section>
        )}

        {/* Social Media */}
        {(temple.facebook || temple.instagram) && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.socialMedia')}</h2>
            </div>
            <div className="flex gap-4 flex-wrap">
              {temple.facebook && (
                <a href={temple.facebook} target="_blank" rel="noopener noreferrer"
                  className="social-btn-2030 bg-blue-600 hover:bg-blue-700 no-underline">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
              {temple.instagram && (
                <a href={temple.instagram} target="_blank" rel="noopener noreferrer"
                  className="social-btn-2030 no-underline" style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </section>
        )}

        {/* Disclaimer for Not Verified Temples */}
        {temple.verified === 'not-verified' && (
          <div className="disclaimer-2030 reveal-up mb-10">
            <div className="bento-icon flex-shrink-0 w-10 h-10 text-base" style={{ background: 'linear-gradient(135deg, rgba(245,127,23,0.15), rgba(245,127,23,0.05))' }}>
              <svg className="w-5 h-5 text-semantic-warning" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-body-sm font-semibold text-ink mb-1">{t('temple.verificationPending')}</p>
              <p className="text-body-sm text-ink-muted leading-relaxed">{t('temple.verificationPendingDesc')}</p>
            </div>
          </div>
        )}

        {/* ── Deity-Smart Devotional Content ── */}
        <DeitySmartContent deity={temple.deity} templeName={temple.title} />

        {/* ── Ratings & Reviews ── */}
        <ReviewSection templeSlug={slug} hideWhenEmpty />

        {/* Claim Temple — visible to temple role users */}
        <ClaimTempleButton templeId={temple._id} templeName={temple.title} />

        {/* Related Temples */}
        {related.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030"><h2>Related Temples</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4 stagger-children">
              {related.map((rt: any) => (
                <TempleSummaryCard key={String(rt._id)} temple={rt} />
              ))}
            </div>
          </section>
        )}

        {internalLinks.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="rounded-2xl border border-sandstone-200 bg-sandstone-50/80 p-5 sm:p-6">
              <div className="section-heading-2030 mb-4"><h2>Explore More</h2></div>
              <div className="flex flex-wrap gap-3">
                {internalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="section-nav-pill no-underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom Share Bar */}
        <div className="share-bar-premium reveal-up">
          <div className="flex items-center gap-3">
            <div className="bento-icon w-10 h-10 text-base pulse-aura">🙏</div>
            <p className="text-body-sm font-medium text-ink">{t('temple.sharePrompt')}</p>
          </div>
          <ShareButtons title={temple.title} />
        </div>
      </main>
      {/* Mobile sticky darshan bar */}
      <div className="mobile-darshan-bar">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(255,153,51,0.18), rgba(201,168,76,0.1))' }}>🛕</div>
          <div className="min-w-0">
            <p className="text-caption font-bold text-ink truncate">{temple.title}</p>
            {displayLocation && <p className="text-caption text-ink-muted truncate">{displayLocation}</p>}
          </div>
        </div>
        {mapsLink ? (
          <a href={`https://maps.google.com/maps?q=${encodeURIComponent(temple.title + ' ' + (displayLocation || ''))}`} target="_blank" rel="noopener noreferrer"
            className="btn-divine flex-shrink-0 text-xs px-4 py-2 no-underline">
            🗺️ Directions
          </a>
        ) : (
          <ShareButtons title={temple.title} />
        )}
      </div>
      <AdminEditBar editHref={`/admin/temples/edit/${temple._id}`} label="Edit Temple" />
    </>
  )
}
