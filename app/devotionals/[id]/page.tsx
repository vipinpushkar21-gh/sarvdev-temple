"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, Clock, Headphones, Languages, Music2, Share2, Sparkles } from 'lucide-react'
import AdminEditBar from '../../../components/AdminEditBar'
import BookmarkButton from '../../../components/BookmarkButton'
import SarvdevImage from '../../../components/SarvdevImage'
import { getDevotionalHeroImage } from '../../../lib/devotional-image'
import { useTranslation } from '../../../lib/translation'
import DevotionalAudioPlayer from '../components/DevotionalAudioPlayer'
import DevotionalLyricsReader from '../components/DevotionalLyricsReader'
import DevotionalRelatedContent from '../components/DevotionalRelatedContent'
import { categoryToSlug, getDevotionalHref } from '../components/devotional-utils'
import type { Devotional } from '../types'
import { renderBilingualTitle } from '../utils/bilingual'

function detectSpeechLang(devotional: Devotional) {
  const language = (devotional.language || '').toLowerCase()
  if (language.includes('hi') || language.includes('hindi') || language.includes('sanskrit')) return 'hi-IN'
  return 'en-IN'
}

export default function DevotionalDetailPage() {
  const params = useParams()
  const { language } = useTranslation()
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [allDevotionals, setAllDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)
  const slug = params.id as string

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Use the /[id] route directly — supports both ObjectId and slug
        const [detailRes, relatedRes] = await Promise.all([
          fetch(`/api/devotionals/${encodeURIComponent(slug)}`, { cache: 'no-store' }),
          fetch('/api/devotionals?page=1&limit=24', { cache: 'no-store' }),
        ])
        if (!cancelled && relatedRes.ok) {
          const payload = await relatedRes.json()
          const list = Array.isArray(payload) ? payload : (payload.items || payload.data || [])
          const approved = list.filter((item: Devotional) => item.status === 'approved' || !item.status)
          setAllDevotionals(approved)
        }
        if (!detailRes.ok) return
        const fullData = await detailRes.json()
        if (!cancelled) setDevotional(fullData)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (slug) load()
    return () => { cancelled = true }
  }, [slug])

  const title = useMemo(
    () => renderBilingualTitle(devotional?.title || '', devotional?.titleHi, language),
    [devotional?.title, devotional?.titleHi, language]
  )

  async function sharePage() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: title.primary, url })
        return
      } catch {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && url) await navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="h-[460px] animate-pulse bg-stone-900" />
        <div className="page-container py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="h-96 rounded-2xl bg-stone-100" />
            <div className="h-96 rounded-2xl bg-stone-100" />
          </div>
        </div>
      </main>
    )
  }

  if (!devotional) {
    return (
      <main className="page-container min-h-screen py-16 text-center">
        <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
          <BookOpen className="mx-auto h-10 w-10 text-stone-400" />
          <h1 className="mt-4 text-3xl font-black text-stone-950">Devotional not found</h1>
          <p className="mt-3 text-stone-600">This devotional may have moved or is not available yet.</p>
          <Link href="/devotionals" className="btn btn-primary mt-6">Back to Devotionals</Link>
        </div>
      </main>
    )
  }

  const heroImage = getDevotionalHeroImage(devotional)
  const speechLang = detectSpeechLang(devotional)
  // Prefer canonical content field; fall back to lyrics
  const readingText = devotional.content || devotional.lyrics || devotional.description || devotional.title || ''
  const description = language === 'hi' && devotional.descriptionHi ? devotional.descriptionHi : devotional.description
  const pageUrl = `https://sarvdev.com${getDevotionalHref(devotional)}`

  const creativeWorkLd = {
    '@context': 'https://schema.org',
    '@type': devotional.audio || devotional.audioUrl ? 'MusicComposition' : 'CreativeWork',
    name: devotional.title,
    description: description || undefined,
    inLanguage: devotional.language || speechLang,
    url: pageUrl,
    image: heroImage.src,
    genre: devotional.category || 'Devotional',
    about: devotional.deity || undefined,
    ...(devotional.artist ? { byArtist: { '@type': 'Person', name: devotional.artist } } : {}),
    ...(devotional.audio || devotional.audioUrl ? {
      associatedMedia: {
        '@type': 'AudioObject',
        contentUrl: devotional.audioUrl || devotional.audio,
        encodingFormat: 'audio/mpeg',
      },
    } : {}),
    publisher: { '@type': 'Organization', name: 'Sarvdev', url: 'https://sarvdev.com' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'Devotionals', item: 'https://sarvdev.com/devotionals' },
      ...(devotional.category ? [{
        '@type': 'ListItem',
        position: 3,
        name: devotional.category,
        item: `https://sarvdev.com/devotionals/category/${devotional.categorySlug || categoryToSlug(devotional.category)}`,
      }] : []),
      { '@type': 'ListItem', position: devotional.category ? 4 : 3, name: devotional.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="relative min-h-[560px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage image={heroImage} alt={title.primary || devotional.title} className="absolute inset-0" imgClassName="object-cover" loading="eager" renderMode="auto" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/62 to-stone-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[560px] flex-col justify-end pb-12 pt-20">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-300">
            <Link href="/devotionals" className="text-stone-200 hover:text-amber-200">Devotionals</Link>
            {devotional.category && (
              <>
                <span>/</span>
                <Link href={`/devotionals/category/${devotional.categorySlug || categoryToSlug(devotional.category)}`} className="text-stone-200 hover:text-amber-200">{devotional.category}</Link>
              </>
            )}
          </nav>

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap gap-2">
              {devotional.category && <Badge icon={<Music2 className="h-3.5 w-3.5" />} label={devotional.category} />}
              {devotional.deity && <Badge icon={<Sparkles className="h-3.5 w-3.5" />} label={devotional.deity} />}
              {devotional.language && <Badge icon={<Languages className="h-3.5 w-3.5" />} label={devotional.language} />}
            </div>

            <h1 className="text-[clamp(2.5rem,7vw,5.8rem)] font-black leading-[0.95] tracking-normal text-white drop-shadow-2xl">
              {title.primary}
            </h1>
            {title.secondary && <p className="mt-4 max-w-3xl text-2xl font-semibold leading-snug text-amber-100">{title.secondary}</p>}
            {description && <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-100">{description}</p>}

            <div className="mt-7 flex flex-wrap gap-3">
              <BookmarkButton item={{ id: devotional._id, type: 'devotional', title: title.primary, slug }} className="bg-white/90 shadow-lg backdrop-blur hover:bg-white" />
              <button type="button" onClick={sharePage} className="btn border border-white/15 bg-white/12 text-white backdrop-blur hover:bg-white/20">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-surface pb-20">
        <div className="page-container -mt-8 relative z-20">
          <div className="grid gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
            <QuickFact icon={<Music2 className="h-5 w-5" />} label="Category" value={devotional.category || 'Devotional'} />
            <QuickFact icon={<Sparkles className="h-5 w-5" />} label="Deity" value={devotional.deity || 'Universal'} />
            <QuickFact icon={<Languages className="h-5 w-5" />} label="Language" value={devotional.language || 'Hindi'} />
            <QuickFact icon={<Clock className="h-5 w-5" />} label="Duration" value={devotional.duration || (devotional.audio || devotional.audioUrl ? 'Audio available' : 'TTS ready')} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-8">
              {description && (
                <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">About this devotional</p>
                  <h2 className="mt-1 text-3xl font-black text-stone-950">{title.primary}</h2>
                  <p className="mt-4 text-lg leading-9 text-stone-700">{description}</p>
                </section>
              )}

              <DevotionalLyricsReader
                title={title.primary || devotional.title}
                lyrics={devotional.content || devotional.lyrics}
                language={devotional.language}
                names={devotional.names}
              />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <DevotionalAudioPlayer
                title={title.primary || devotional.title}
                text={readingText}
                audio={devotional.audioUrl || devotional.audio}
                lang={speechLang}
              />

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-orange-700">Quick Actions</p>
                <div className="grid gap-2">
                  {devotional.category && (
                    <Link href={`/devotionals/category/${devotional.categorySlug || categoryToSlug(devotional.category)}`} className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-stone-800 no-underline hover:bg-orange-100">
                      More {devotional.category}
                    </Link>
                  )}
                  {devotional.deity && (
                    <Link href={`/devotionals/deity/${devotional.deitySlug || encodeURIComponent(devotional.deity)}`} className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-stone-800 no-underline hover:bg-orange-100">
                      More for {devotional.deity}
                    </Link>
                  )}
                </div>
              </div>

              <DevotionalRelatedContent devotional={devotional} allDevotionals={allDevotionals} />
            </aside>
          </div>
        </div>
      </main>

      <AdminEditBar editHref={`/admin/devotionals/${devotional._id}/edit`} label="Edit Devotional" />
    </>
  )
}

function Badge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
      {icon}
      {label}
    </span>
  )
}

function QuickFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-orange-50/70 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-700 shadow-sm">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-wide text-stone-500">{label}</span>
        <span className="block truncate text-sm font-black text-stone-900">{value}</span>
      </span>
    </div>
  )
}