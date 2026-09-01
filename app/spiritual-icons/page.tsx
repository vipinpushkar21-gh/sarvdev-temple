"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { BookOpen, CheckCircle2, Filter, MapPin, Search, Sparkles, Star, Users } from 'lucide-react'
import SarvdevImage from '../../components/SarvdevImage'
import { SPIRITUAL_ICON_CATEGORIES } from '../../data/spiritual-icon-categories'
import { filterSpiritualIcons, getStaticSpiritualIconsForSeed, type SpiritualIconRecord } from '../../lib/spiritual-icons'
import { getTempleCardImage, getTempleHeroImage, getSpiritualIconCardImage } from '../../lib/temple-image'
import { useTranslation } from '../../lib/translation'

const HERO_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export default function SpiritualIconsPage() {
  const { t, language } = useTranslation()
  const [icons, setIcons] = useState<SpiritualIconRecord[]>(() => getStaticSpiritualIconsForSeed())
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadIcons() {
      try {
        const res = await fetch('/api/spiritual-icons?limit=50')
        if (!res.ok) return
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        if (!cancelled && Array.isArray(items) && items.length > 0) setIcons(items)
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadIcons()
    return () => { cancelled = true }
  }, [])

  const states = useMemo(() => Array.from(new Set(icons.map((icon) => icon.state).filter(Boolean) as string[])).sort(), [icons])
  const languages = useMemo(() => Array.from(new Set(icons.flatMap((icon) => icon.languages || []).filter(Boolean))).sort(), [icons])
  const featured = useMemo(() => {
    const explicit = icons.filter((icon) => icon.featured)
    return (explicit.length ? explicit : icons.slice(0, 6)).slice(0, 6)
  }, [icons])

  const filtered = useMemo(() => {
    const params = new URLSearchParams()
    if (activeCategory !== 'all') params.set('category', activeCategory)
    if (search) params.set('search', search)
    if (stateFilter) params.set('state', stateFilter)
    if (languageFilter) params.set('language', languageFilter)
    return filterSpiritualIcons(icons, params)
  }, [activeCategory, icons, languageFilter, search, stateFilter])

  const jsonLd = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
        { '@type': 'ListItem', position: 2, name: 'Spiritual Icons', item: 'https://sarvdev.com/spiritual-icons' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Spiritual Icons on Sarvdev',
      itemListElement: icons.slice(0, 24).map((icon, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: icon.name,
        url: `https://sarvdev.com/spiritual-icons/${icon.slug}`,
      })),
    },
  ], [icons])

  const heroImage = getTempleHeroImage(HERO_IMAGE)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative min-h-[380px] overflow-hidden bg-stone-950 text-white sm:min-h-[560px]">
        <SarvdevImage image={heroImage} alt="Spiritual Icons sacred background" className="absolute inset-0 opacity-45" imgClassName="object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[380px] flex-col justify-end pb-14 pt-24 sm:min-h-[560px]">
          <div className="max-w-5xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-300/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t('common.spiritualLineages')}
            </span>
            <h1 className="mt-5 text-[clamp(3rem,8vw,6.6rem)] font-black leading-[0.92] tracking-normal text-white drop-shadow-2xl">
              {t('common.spiritualIconsTitle')}
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-stone-100">
              {t('common.spiritualIconsDescription')}
            </p>
            <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
              <HeroStat icon={<Users className="h-5 w-5" />} label={t('common.profiles')} value={icons.length} />
              <HeroStat icon={<Filter className="h-5 w-5" />} label={t('common.categories')} value={SPIRITUAL_ICON_CATEGORIES.length} />
              <HeroStat icon={<MapPin className="h-5 w-5" />} label={t('common.states')} value={states.length} />
            </div>
          </div>
        </div>
      </section>

      <main className="bg-surface pb-24">
        <section className="page-container -mt-10 relative z-20">
          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-xl">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('common.searchByName')} className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-orange-400" />
              </div>
              <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm font-semibold">
                <option value="">{t('common.allStates')}</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
              <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm font-semibold">
                <option value="">{t('common.allLanguages')}</option>
                {languages.map((language) => <option key={language} value={language}>{language}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="page-container pt-10">
          <SectionHeader eyebrow={t('common.allCategories')} title={t('common.exploreServicePaths')} description={language === 'hi' ? 'हर श्रेणी दिखाई देती है, भले ही उसमें रिकॉर्ड जोड़े जा रहे हों।' : 'Every category stays visible, even when records are still being added.'} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <button type="button" onClick={() => setActiveCategory('all')} className={`rounded-2xl border p-5 text-left transition ${activeCategory === 'all' ? 'border-stone-900 bg-stone-950 text-white shadow-xl' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
              <span className="text-2xl">✨</span>
              <h3 className="mt-3 text-lg font-black">{t('common.allIcons')}</h3>
              <p className={`mt-1 text-sm ${activeCategory === 'all' ? 'text-stone-200' : 'text-stone-500'}`}>{icons.length} {t('common.profiles')}</p>
            </button>
            {SPIRITUAL_ICON_CATEGORIES.map((category) => {
              const count = icons.filter((icon) => icon.categorySlug === category.slug).length
              const active = activeCategory === category.slug
              return (
                <button key={category.slug} type="button" onClick={() => setActiveCategory(category.slug)} className={`rounded-2xl border p-5 text-left transition ${active ? 'border-stone-900 bg-stone-950 text-white shadow-xl' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="mt-3 text-lg font-black">{category.name}</h3>
                      <p className={`mt-1 text-sm ${active ? 'text-stone-200' : 'text-stone-500'}`}>{count} {t('common.profiles')}</p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="page-container pt-14">
          <SectionHeader eyebrow={t('common.featured')} title={t('common.featuredIcons')} description={t('common.featuredIconsDescription')} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((icon) => <IconCard key={icon.slug} icon={icon} featured />)}
          </div>
        </section>

        <section className="page-container pt-14">
          <SectionHeader eyebrow={t('common.directory')} title={t('common.searchResults')} description={`${filtered.length} ${t('common.matchingProfiles')}`} />
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((icon) => <IconCard key={icon.slug} icon={icon} />)}
            </div>
          ) : (
            <EmptyState title={t('common.noMatchingIcons')} description={t('common.clearFiltersExplore')} />
          )}
        </section>

        <section className="page-container pt-14 space-y-12">
          {SPIRITUAL_ICON_CATEGORIES.map((category) => {
            const categoryIcons = icons.filter((icon) => icon.categorySlug === category.slug).slice(0, 6)
            return (
              <section key={category.slug}>
                <SectionHeader eyebrow={category.nameHi} title={language === 'hi' ? category.nameHi : category.name} description={language === 'hi' ? category.descriptionHi : category.description} />
                {categoryIcons.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryIcons.map((icon) => <IconCard key={icon.slug} icon={icon} />)}
                  </div>
                ) : (
                  <EmptyState title={`${language === 'hi' ? category.nameHi : category.name} ${t('common.profilesComingSoon')}`} description={t('common.categoryReady')} />
                )}
              </section>
            )
          })}
        </section>

        {loading && <p className="page-container pt-6 text-sm text-stone-400">{t('common.refreshingIcons')}</p>}
      </main>
    </>
  )
}

function IconCard({ icon, featured = false }: { icon: SpiritualIconRecord; featured?: boolean }) {
  const image = getSpiritualIconCardImage({ cardMedia: icon.cardMedia, primaryMedia: icon.primaryMedia, imageCard: icon.imageCard || icon.image || '', image: icon.imageCard || icon.image || '' })
  return (
    <Link href={`/spiritual-icons/${icon.slug}`} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm no-underline transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-orange-50">
        {icon.imageCard || icon.image ? (
          <SarvdevImage image={image} alt={icon.name} className="absolute inset-0" imgClassName="object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-black text-orange-700 shadow-sm">{icon.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {featured && <Badge icon={<Star className="h-3.5 w-3.5" />} label="Featured" />}
          {icon.verified && <Badge icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Verified" />}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">{icon.category}</p>
        <h3 className="mt-2 text-2xl font-black leading-tight text-stone-950 group-hover:text-orange-700">{icon.name}</h3>
        {icon.nameHi && <p className="mt-1 font-semibold text-stone-500">{icon.nameHi}</p>}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{icon.shortBio || icon.fullBio || icon.title}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(icon.specializations || []).slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-600">{tag}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-stone-500">
          {icon.state && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{icon.state}</span>}
          {(icon.languages || []).slice(0, 2).map((language) => <span key={language}>{language}</span>)}
        </div>
      </div>
    </Link>
  )
}

function HeroStat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <span className="flex items-center gap-2 text-amber-100">{icon}<span className="text-sm font-bold">{label}</span></span>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-stone-950 md:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-stone-600">{description}</p>
    </div>
  )
}

function Badge({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-black text-stone-900 shadow-sm">{icon}{label}</span>
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-8 text-center">
      <BookOpen className="mx-auto h-9 w-9 text-amber-700" />
      <h3 className="mt-3 text-xl font-black text-stone-950">{title}</h3>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
    </div>
  )
}
