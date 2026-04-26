'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '../../../lib/translation'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../../../lib/temple-image'
import BookmarkButton from '../../../components/BookmarkButton'
import Breadcrumbs from '../../../components/Breadcrumbs'
import ShareButtons from '../../../components/ShareButtons'
import { DetailPageSkeleton } from '../../../components/Skeleton'
import ReviewSection from '../../../components/ReviewSection'

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

/** Small helper so we can use useState for the onError fallback */
function TempleDetailImage({ image, alt }: { image?: string; alt: string }) {
  const [src, setSrc] = useState(getTempleImage({ image }))
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setSrc(TEMPLE_PLACEHOLDER)}
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

export default function TemplePage({ params }: Props) {
  const { t, language } = useTranslation()
  const [temple, setTemple] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')
  const [heroScale, setHeroScale] = useState(1)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    
    async function fetchTemple() {
      try {
        const res = await fetch(`/api/temples?t=${Date.now()}`, { 
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
        const temples = await res.json()
        const found = temples.find((t: any) => slugify(t.title) === slug)
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

  // Parallax zoom effect on hero image
  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height))
      setHeroScale(1 + scrollProgress * 0.15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Extract Google Maps link from mapsLink field or location field
  const mapsLink = temple.mapsLink || 
    (temple.location?.match(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/)?.[1]) || null
  const displayLocation = temple.location?.replace(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/g, '').trim()

  // Collect bento items
  const bentoItems: { icon: string; label: string; value: string; span?: boolean }[] = []
  const deityValue = temple.deity
    ? (language === 'hi' ? (DEITY_HI[temple.deity] || temple.deity) : temple.deity)
    : null
  if (deityValue) bentoItems.push({ icon: '🕉️', label: t('temple.deity'), value: deityValue })
  if (temple.city && temple.state && !temple.city.includes('http'))
    bentoItems.push({ icon: '📍', label: t('temple.location'), value: `${temple.city}, ${temple.state}${temple.pincode ? ` — ${temple.pincode}` : ''}` })
  const templeTypeValue = temple.templeType
    ? (language === 'hi' ? (TEMPLE_TYPE_HI[temple.templeType] || temple.templeType) : temple.templeType)
    : null
  if (templeTypeValue) bentoItems.push({ icon: '🏛️', label: t('temple.templeType'), value: templeTypeValue })
  if (temple.establishedYear) bentoItems.push({ icon: '📅', label: t('temple.established'), value: temple.establishedYear })
  const timingValue = temple.timingSlots?.length > 0
    ? temple.timingSlots.join('\n')
    : temple.timings
  if (timingValue) bentoItems.push({ icon: '⏰', label: t('temple.timings'), value: timingValue })
  if (temple.speciality) bentoItems.push({ icon: '✨', label: t('temple.speciality'), value: temple.speciality, span: true })

  return (
    <>
      {/* ── Immersive Hero Section ── */}
      <div ref={heroRef} className="temple-hero-2030">
        <div
          className="absolute inset-0 parallax-zoom"
          style={{ transform: `scale(${heroScale})`, transformOrigin: 'center center' }}
        >
          <TempleDetailImage image={temple.image} alt={temple.title} />
        </div>

        {/* Hero overlay content */}
        <div className="temple-hero-content">
          <div className="max-w-page mx-auto">
            {/* Breadcrumb over hero */}
            <nav className="mb-4 fade-in">
              <ol className="flex items-center gap-1.5 text-body-sm text-white/70 flex-wrap">
                <li><Link href="/" className="hover:text-white transition-colors text-white/70">{t('nav.home')}</Link></li>
                <li className="text-white/40">/</li>
                <li><Link href="/temples" className="hover:text-white transition-colors text-white/70">{t('nav.temples')}</Link></li>
                <li className="text-white/40">/</li>
                <li className="text-white font-medium truncate max-w-[250px]">{temple.title}</li>
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

            {/* Temple title */}
            <h1 className="text-display-lg text-white font-serif reveal-up" style={{ animationDelay: '100ms', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              {temple.title}
            </h1>
            {displayLocation && (
              <p className="mt-3 text-body text-white/80 flex items-center gap-2 reveal-up" style={{ animationDelay: '200ms' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {displayLocation}
              </p>
            )}

            {/* Floating action bar */}
            <div className="mt-6 flex items-center gap-3 flex-wrap reveal-up" style={{ animationDelay: '300ms' }}>
              <div className="floating-bar-2030 flex items-center gap-2 px-2 py-1.5">
                <BookmarkButton
                  item={{ id: temple._id || slug, type: 'temple', title: temple.title, slug, image: temple.image }}
                />
                <div className="w-px h-6 bg-surface-border" />
                <ShareButtons title={temple.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-30 pb-16">

        {/* About Section — Glass card overlapping hero */}
        <section className="glass-card-2030 p-10 sm:p-12 md:p-14 mb-10 mt-16 reveal-up">
          <div className="section-heading-2030">
            <h2>{t('temple.about')}</h2>
          </div>
          <div className="space-y-4 max-w-content">
            {(language === 'hi' && temple.descriptionHi
              ? temple.descriptionHi
              : temple.description || t('temple.noDescription')
            ).split(/\n\n+/).filter(Boolean).map((para: string, idx: number) => (
              <p key={idx} className="text-body text-ink leading-[1.85] whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Bento Grid — Temple Info */}
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
        {temple.categories && temple.categories.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.sacredCategories')}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {temple.categories.map((cat: string, idx: number) => (
                <span key={idx} className="sacred-tag-2030" style={{ animationDelay: `${idx * 60}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  {cat}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Festivals Section */}
        {temple.festivals && temple.festivals.length > 0 && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.festivals')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {temple.festivals.map((festival: { name: string; description: string }, idx: number) => (
                <div key={idx} className="bento-card gradient-shimmer p-6">
                  <div className="flex items-start gap-3">
                    <div className="bento-icon flex-shrink-0">
                      <span className="text-xl">🎉</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-semibold text-ink mb-1">{festival.name}</p>
                      {festival.description && (
                        <p className="text-body-sm text-ink-muted leading-relaxed">{festival.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Google Maps Embed */}
        {mapsLink && (
          <section className="mb-10 reveal-up">
            <div className="section-heading-2030">
              <h2>{t('temple.locationMap')}</h2>
            </div>
            <div className="bento-card p-6">
              <div className="relative w-full h-80 rounded-xl overflow-hidden">
                <iframe
                  src={mapsLink.includes('maps.app.goo.gl') ? 
                    `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3727.604395007016!2d70.4012569!3d20.8879899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bfd329f0417cb75%3A0x2f5a510de9857963!2sShree%20Somnath%20Temple!5e0!3m2!1sen!2sin!4v1773769840240!5m2!1sen!2sin` :
                    mapsLink.includes('google.com/maps/embed') ? mapsLink :
                    `https://www.google.com/maps/embed?pb=${mapsLink}`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
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
                  <a href={temple.website} target="_blank" rel="noopener noreferrer" className="contact-link-2030 mt-1">
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

        {/* ── Ratings & Reviews ── */}
        <ReviewSection templeSlug={slug} />

        {/* Bottom Share Bar */}
        <div className="bento-card p-5 flex items-center justify-between flex-wrap gap-4 reveal-up">
          <div className="flex items-center gap-3">
            <div className="bento-icon w-10 h-10 text-base">🙏</div>
            <p className="text-body-sm font-medium text-ink">{t('temple.sharePrompt')}</p>
          </div>
          <ShareButtons title={temple.title} />
        </div>
      </main>
    </>
  )
}
