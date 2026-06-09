"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CalendarDays, CheckCircle2, ExternalLink, Globe2, Mail, MapPin, Phone, Sparkles, Star, Users } from 'lucide-react'
import SarvdevImage from '../../../components/SarvdevImage'
import { getSpiritualIconCategory } from '../../../data/spiritual-icon-categories'
import { getStaticSpiritualIconsForSeed, type SpiritualIconRecord } from '../../../lib/spiritual-icons'
import { getTempleCardImage, getTempleHeroImage } from '../../../lib/temple-image'

const HERO_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export default function SpiritualIconDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [icon, setIcon] = useState<SpiritualIconRecord | null>(() => getStaticSpiritualIconsForSeed().find((item) => item.slug === slug) || null)
  const [allIcons, setAllIcons] = useState<SpiritualIconRecord[]>(() => getStaticSpiritualIconsForSeed())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function load() {
      try {
        const [detailRes, listRes] = await Promise.all([
          fetch(`/api/spiritual-icons?slug=${encodeURIComponent(slug)}&limit=1`),
          fetch('/api/spiritual-icons?limit=12'),
        ])
        if (!cancelled && detailRes.ok) {
          const data = await detailRes.json()
          const items = Array.isArray(data) ? data : (data.items || data.data || [])
          if (items[0]) setIcon(items[0])
        }
        if (!cancelled && listRes.ok) {
          const data = await listRes.json()
          const list = Array.isArray(data) ? data : (data.items || data.data || [])
          if (Array.isArray(list) && list.length > 0) setAllIcons(list)
        }
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  const related = useMemo(() => {
    if (!icon) return []
    return allIcons.filter((item) => item.slug !== icon.slug && item.categorySlug === icon.categorySlug).slice(0, 3)
  }, [allIcons, icon])

  if (!icon) {
    return (
      <main className="page-container min-h-screen py-16 text-center">
        <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
          <Users className="mx-auto h-10 w-10 text-stone-400" />
          <h1 className="mt-4 text-3xl font-black text-stone-950">Spiritual icon not found</h1>
          <p className="mt-3 text-stone-600">This profile may be inactive or not available yet.</p>
          <Link href="/spiritual-icons" className="btn btn-primary mt-6">Back to Spiritual Icons</Link>
        </div>
      </main>
    )
  }

  const category = getSpiritualIconCategory(icon.categorySlug)
  const heroImage = getTempleHeroImage({ imageHero: icon.imageHero || icon.imageCard || icon.image || HERO_IMAGE, image: icon.imageHero || icon.imageCard || icon.image || HERO_IMAGE })
  const cardImage = getTempleCardImage({ imageCard: icon.imageCard || icon.image || HERO_IMAGE, image: icon.imageCard || icon.image || HERO_IMAGE })
  const isGroup = icon.categorySlug === 'kirtan-mandali'
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
        { '@type': 'ListItem', position: 2, name: 'Spiritual Icons', item: 'https://sarvdev.com/spiritual-icons' },
        { '@type': 'ListItem', position: 3, name: icon.name, item: `https://sarvdev.com/spiritual-icons/${icon.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': isGroup ? 'Organization' : 'Person',
      name: icon.name,
      alternateName: icon.nameHi || undefined,
      description: icon.shortBio || icon.fullBio || undefined,
      image: cardImage.src,
      url: `https://sarvdev.com/spiritual-icons/${icon.slug}`,
      sameAs: [icon.website, icon.youtube, icon.instagram, icon.facebook, icon.twitter].filter(Boolean),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative min-h-[560px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage image={heroImage} alt={icon.name} className="absolute inset-0 opacity-55" imgClassName="object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/72 to-stone-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />
        <div className="page-container relative z-10 flex min-h-[560px] flex-col justify-end pb-14 pt-24">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-300">
            <Link href="/spiritual-icons" className="text-stone-200 hover:text-amber-200">Spiritual Icons</Link>
            <span>/</span>
            <span>{category?.name || icon.category}</span>
          </nav>

          <div className="grid items-end gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="relative h-44 w-44 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
              {icon.imageCard || icon.image ? (
                <SarvdevImage image={cardImage} alt={icon.name} className="absolute inset-0" imgClassName="object-cover" loading="eager" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-black text-amber-100">{icon.name.charAt(0)}</div>
              )}
            </div>
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {category && <Badge icon={<Sparkles className="h-3.5 w-3.5" />} label={category.name} />}
                {icon.verified && <Badge icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Verified" />}
                {icon.featured && <Badge icon={<Star className="h-3.5 w-3.5" />} label="Featured" />}
              </div>
              <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-black leading-[0.95] tracking-normal text-white drop-shadow-2xl">{icon.name}</h1>
              {icon.nameHi && <p className="mt-3 text-2xl font-semibold text-amber-100">{icon.nameHi}</p>}
              {(icon.title || icon.titleHi) && <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-100">{icon.title || icon.titleHi}</p>}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-surface pb-24">
        <section className="page-container -mt-10 relative z-20">
          <div className="grid gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl md:grid-cols-4">
            <QuickFact icon={<Sparkles className="h-5 w-5" />} label="Category" value={category?.name || icon.category || 'Spiritual Icon'} />
            <QuickFact icon={<MapPin className="h-5 w-5" />} label="Location" value={[icon.city, icon.state].filter(Boolean).join(', ') || icon.location || 'India'} />
            <QuickFact icon={<Globe2 className="h-5 w-5" />} label="Languages" value={(icon.languages || []).join(', ') || 'Hindi'} />
            <QuickFact icon={<CalendarDays className="h-5 w-5" />} label="Years Active" value={icon.yearsActive || 'Traditional service'} />
          </div>
        </section>

        <section className="page-container pt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            <ContentBlock title="Biography">
              <p className="text-lg leading-9 text-stone-700">{icon.fullBio || icon.shortBio || 'Profile details will be added soon.'}</p>
              {icon.fullBioHi && <p className="mt-5 text-lg leading-9 text-stone-700">{icon.fullBioHi}</p>}
            </ContentBlock>

            <ContentBlock title="Specializations">
              <TagList values={icon.specializations || []} />
            </ContentBlock>

            <ContentBlock title="Notable Works">
              <TagList values={icon.notableWorks || []} />
            </ContentBlock>

            {related.length > 0 && (
              <ContentBlock title={`More ${category?.name || 'Spiritual Icons'}`}>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((item) => <RelatedCard key={item.slug} icon={item} />)}
                </div>
              </ContentBlock>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Profile Details</p>
              <dl className="mt-4 space-y-3 text-sm">
                {icon.organization && <DetailRow label="Organization" value={icon.organization} />}
                {icon.sampradaya && <DetailRow label="Sampradaya" value={icon.sampradaya} />}
                {icon.country && <DetailRow label="Country" value={icon.country} />}
              </dl>
            </div>

            {(icon.bookingAvailable || icon.contactPhone || icon.contactEmail || icon.website) && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Contact & Booking</p>
                <div className="mt-4 grid gap-2">
                  {icon.contactPhone && <ContactLink href={`tel:${icon.contactPhone}`} icon={<Phone className="h-4 w-4" />} label={icon.contactPhone} />}
                  {icon.contactEmail && <ContactLink href={`mailto:${icon.contactEmail}`} icon={<Mail className="h-4 w-4" />} label={icon.contactEmail} />}
                  {icon.website && <ContactLink href={icon.website} icon={<ExternalLink className="h-4 w-4" />} label="Website" />}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Social Links</p>
              <div className="mt-4 grid gap-2">
                {[
                  ['YouTube', icon.youtube],
                  ['Instagram', icon.instagram],
                  ['Facebook', icon.facebook],
                  ['Twitter', icon.twitter],
                ].filter(([, url]) => Boolean(url)).map(([label, url]) => (
                  <ContactLink key={label} href={url || '#'} icon={<ExternalLink className="h-4 w-4" />} label={label || ''} />
                ))}
                {![icon.youtube, icon.instagram, icon.facebook, icon.twitter].some(Boolean) && <p className="text-sm text-stone-500">Social links will appear here when added.</p>}
              </div>
            </div>
          </aside>
        </section>

        {loading && <p className="page-container pt-6 text-sm text-stone-400">Refreshing profile...</p>}
      </main>
    </>
  )
}

function Badge({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{icon}{label}</span>
}

function QuickFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-orange-50/70 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-700 shadow-sm">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-wide text-stone-500">{label}</span>
        <span className="block truncate text-sm font-black text-stone-900">{value}</span>
      </span>
    </div>
  )
}

function ContentBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-3xl font-black text-stone-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function TagList({ values }: { values: string[] }) {
  if (!values.length) return <p className="text-stone-500">Details will be added soon.</p>
  return <div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-bold text-stone-700">{value}</span>)}</div>
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-black text-stone-500">{label}</dt><dd className="mt-0.5 font-semibold text-stone-900">{value}</dd></div>
}

function ContactLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-stone-800 no-underline hover:bg-orange-100">{icon}{label}</a>
}

function RelatedCard({ icon }: { icon: SpiritualIconRecord }) {
  const image = getTempleCardImage({ imageCard: icon.imageCard || icon.image || HERO_IMAGE, image: icon.imageCard || icon.image || HERO_IMAGE })
  return (
    <Link href={`/spiritual-icons/${icon.slug}`} className="overflow-hidden rounded-2xl border border-stone-200 bg-white no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-orange-50">
        {icon.imageCard || icon.image ? <SarvdevImage image={image} alt={icon.name} className="absolute inset-0" imgClassName="object-cover" /> : <div className="flex h-full items-center justify-center text-4xl font-black text-orange-700">{icon.name.charAt(0)}</div>}
      </div>
      <div className="p-4">
        <h3 className="font-black text-stone-950">{icon.name}</h3>
        <p className="mt-1 text-xs font-bold text-orange-700">{icon.title || icon.category}</p>
      </div>
    </Link>
  )
}
