"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  Bell,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Filter,
  Flame,
  Heart,
  Landmark,
  Moon,
  Play,
  Radio,
  Search,
  Sparkles,
  SunMedium,
  Video,
} from 'lucide-react'
import BookmarkButton from '../../components/BookmarkButton'
import SarvdevImage from '../../components/SarvdevImage'
import { getTempleCardImage, getTempleHeroImage } from '../../lib/temple-image'
import type { SarvdevMediaAsset } from '../../lib/media-asset'

const HERO_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'
const PAGE_URL = 'https://sarvdev.com/daily-darshan'

type DarshanKind = 'live' | 'recorded' | 'upcoming'

type Darshan = {
  _id: string
  title: string
  titleHi?: string
  description?: string
  descriptionHi?: string
  time?: string
  date?: string
  darshanDate?: string
  startTime?: string
  endTime?: string
  video?: string
  videoUrl?: string
  youtubeUrl?: string
  youtubeId?: string
  media?: string
  thumbnail?: string
  image?: string
  imageCard?: string
  imageHero?: string
  primaryMedia?: SarvdevMediaAsset
  cardMedia?: SarvdevMediaAsset
  heroMedia?: SarvdevMediaAsset
  ogImage?: string
  isLive?: boolean
  temple?: string
  templeName?: string
  templeNameHi?: string
  templeHref?: string
  templeSlug?: string
  deity?: string
  deityHi?: string
  deitySlug?: string
  location?: string
  city?: string
  state?: string
  type?: DarshanKind
  darshanType?: DarshanKind
  status?: string
  featured?: boolean
  isFeatured?: boolean
  priority?: number
  schedule?: string
  repeatDays?: string[]
  timezone?: string
  festivalTag?: string
  relatedDevotionalSlug?: string
  externalUrl?: string
  tags?: string[]
}

type FilterKey =
  | 'all'
  | 'live'
  | 'recorded'
  | 'upcoming'
  | 'shiva'
  | 'vishnu'
  | 'krishna'
  | 'hanuman'
  | 'ganesh'
  | 'shakti'
  | 'sai'
  | 'jyotirlinga'
  | 'north'
  | 'south'

const FEATURED_DARSHAN: Darshan[] = [
  {
    _id: 'featured-morning-darshan',
    title: 'Daily Morning Darshan',
    description: 'A serene daily darshan stream for beginning the day with prayer and remembrance.',
    youtubeId: 'Publ3XPOCpQ',
    temple: 'Sarvdev Featured Darshan',
    templeName: 'Sarvdev Featured Darshan',
    deity: 'Vishnu',
    location: 'India',
    type: 'recorded',
    featured: true,
    priority: 1,
    tags: ['vishnu', 'north'],
  },
  {
    _id: 'featured-vitthal-pandharpur',
    title: 'Shri Vitthal Darshan Pandharpur',
    description: 'Sacred darshan from the beloved Vithoba temple at Pandharpur.',
    youtubeId: 'OHF9DiR60G8',
    temple: 'Vitthal Temple Pandharpur',
    templeName: 'Vitthal Temple Pandharpur',
    templeHref: '/temples/vitthal-temple-pandharpur',
    deity: 'Vishnu',
    location: 'Pandharpur, Maharashtra',
    type: 'recorded',
    featured: true,
    priority: 2,
    tags: ['vishnu', 'krishna', 'west'],
  },
  {
    _id: 'featured-mahakaleshwar',
    title: 'Mahakaleshwar Jyotirlinga Temple',
    description: 'Darshan from Ujjain, one of the most revered Jyotirlinga temples of Lord Shiva.',
    youtubeId: 'AWzzP7_ZsQY',
    temple: 'Mahakaleshwar Jyotirlinga Temple',
    templeName: 'Mahakaleshwar Jyotirlinga Temple',
    templeHref: '/temples/mahakaleshwar-jyotirlinga-temple-ujjain',
    deity: 'Shiva',
    location: 'Ujjain, Madhya Pradesh',
    type: 'recorded',
    featured: true,
    priority: 3,
    tags: ['shiva', 'jyotirlinga', 'central'],
  },
  {
    _id: 'featured-kashi-vishwanath',
    title: 'Kashi Vishwanath Temple',
    description: 'Kashi Vishwanath darshan from Varanasi, the eternal city of Lord Shiva.',
    youtubeId: 'djAqGUJEvuc',
    temple: 'Kashi Vishwanath Temple',
    templeName: 'Kashi Vishwanath Temple',
    templeHref: '/temples/kashi-vishwanath-temple-varanasi',
    deity: 'Shiva',
    location: 'Varanasi, Uttar Pradesh',
    type: 'recorded',
    featured: true,
    priority: 4,
    tags: ['shiva', 'jyotirlinga', 'north'],
  },
  {
    _id: 'featured-shirdi-sai',
    title: 'Shirdi Sai Baba Darshan',
    description: 'Peaceful Sai Baba darshan from Shirdi for daily prayer and gratitude.',
    youtubeId: 'SezNZqScc0Y',
    temple: 'Shirdi Sai Baba Temple',
    templeName: 'Shirdi Sai Baba Temple',
    templeHref: '/temples/shirdi-sai-baba-temple',
    deity: 'Sai',
    location: 'Shirdi, Maharashtra',
    type: 'recorded',
    featured: true,
    priority: 5,
    tags: ['sai', 'west'],
  },
  {
    _id: 'featured-siddhivinayak',
    title: 'Siddhivinayak Live Darshan',
    description: 'Ganapati darshan from Siddhivinayak Mandir, Mumbai.',
    youtubeId: 'q5zTnhvPBHQ',
    temple: 'Siddhivinayak Temple Mumbai',
    templeName: 'Siddhivinayak Temple Mumbai',
    templeHref: '/temples/siddhivinayak-temple-mumbai',
    deity: 'Ganesh',
    location: 'Mumbai, Maharashtra',
    type: 'live',
    isLive: true,
    featured: true,
    priority: 6,
    tags: ['ganesh', 'west'],
  },
  {
    _id: 'featured-salangpur-hanuman',
    title: 'Salangpur Hanumanji Darshan',
    description: 'Darshan from Shree Kashtabhanjan Hanumanji Mandir, Salangpur.',
    youtubeId: 'SrDCZCWmz1U',
    temple: 'Kashtabhanjan Hanuman Mandir Salangpur',
    templeName: 'Kashtabhanjan Hanuman Mandir Salangpur',
    templeHref: '/temples/kasthbhanjan-hanuman-mandir-salangpur',
    deity: 'Hanuman',
    location: 'Salangpur, Gujarat',
    type: 'recorded',
    featured: true,
    priority: 7,
    tags: ['hanuman', 'west'],
  },
  {
    _id: 'featured-salasar-balaji',
    title: 'Salasar Balaji Live Darshan',
    description: 'Hanuman ji darshan from Salasar Balaji Temple.',
    youtubeId: 'wIScZcVMgYk',
    temple: 'Salasar Balaji Temple',
    templeName: 'Salasar Balaji Temple',
    templeHref: '/temples/salasar-balaji-temple',
    deity: 'Hanuman',
    location: 'Salasar, Rajasthan',
    type: 'live',
    isLive: true,
    featured: true,
    priority: 8,
    tags: ['hanuman', 'north'],
  },
  {
    _id: 'featured-banke-bihari',
    title: 'Banke Bihari Temple Darshan',
    description: 'Krishna darshan from Shri Banke Bihari Mandir, Vrindavan.',
    youtubeId: '_TreAwpnfyI',
    temple: 'Banke Bihari Temple Vrindavan',
    templeName: 'Banke Bihari Temple Vrindavan',
    templeHref: '/temples/banke-bihari-temple-vrindavan',
    deity: 'Krishna',
    location: 'Vrindavan, Uttar Pradesh',
    type: 'recorded',
    featured: true,
    priority: 9,
    tags: ['krishna', 'vishnu', 'north'],
  },
  {
    _id: 'featured-daily-darshan',
    title: 'Daily Darshan',
    description: 'A curated daily darshan video for spiritual reflection.',
    youtubeId: 'mhazhZtzzoI',
    temple: 'Sarvdev Darshan Collection',
    templeName: 'Sarvdev Darshan Collection',
    deity: 'Shakti',
    location: 'India',
    type: 'recorded',
    featured: true,
    priority: 10,
    tags: ['shakti', 'north'],
  },
]

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'recorded', label: 'Recorded' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'shiva', label: 'Shiva' },
  { key: 'vishnu', label: 'Vishnu' },
  { key: 'krishna', label: 'Krishna' },
  { key: 'hanuman', label: 'Hanuman' },
  { key: 'ganesh', label: 'Ganesh' },
  { key: 'shakti', label: 'Shakti' },
  { key: 'sai', label: 'Sai' },
  { key: 'jyotirlinga', label: 'Jyotirlinga' },
  { key: 'north', label: 'North India' },
  { key: 'south', label: 'South India' },
]

const WEEKDAY_ROUTINES: Record<number, { deity: string; secondary: string; mantra: string; aarti: string; templeQuery: string }> = {
  0: { deity: 'Surya', secondary: 'Vishnu', mantra: 'Surya Mantra', aarti: 'Vishnu Aarti', templeQuery: 'Surya temples' },
  1: { deity: 'Shiva', secondary: 'Shiva', mantra: 'Mahamrityunjaya Mantra', aarti: 'Shiv Aarti', templeQuery: 'Shiva temples' },
  2: { deity: 'Hanuman', secondary: 'Ganesh', mantra: 'Hanuman Mantra', aarti: 'Ganesh Aarti', templeQuery: 'Hanuman temples' },
  3: { deity: 'Ganesh', secondary: 'Vishnu', mantra: 'Ganesh Mantra', aarti: 'Vishnu Aarti', templeQuery: 'Ganesh temples' },
  4: { deity: 'Vishnu', secondary: 'Sai', mantra: 'Vishnu Mantra', aarti: 'Sai Aarti', templeQuery: 'Vishnu temples' },
  5: { deity: 'Lakshmi', secondary: 'Durga', mantra: 'Lakshmi Mantra', aarti: 'Durga Aarti', templeQuery: 'Lakshmi temples' },
  6: { deity: 'Shani', secondary: 'Hanuman', mantra: 'Shani Mantra', aarti: 'Hanuman Aarti', templeQuery: 'Hanuman temples' },
}

type TodayInfo = {
  dateLabel: string
  weekdayLabel: string
  weekdayIndex: number
}

export default function DailyDarshanPage() {
  const [items, setItems] = useState<Darshan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [today, setToday] = useState<TodayInfo | null>(null)

  useEffect(() => {
    setToday(getTodayInfo(new Date()))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchDarshan() {
      try {
        const res = await fetch('/api/darshan?limit=50')
        if (!res.ok) return
        const data = await res.json()
        const items = Array.isArray(data) ? data : (data.items || data.data || [])
        const approved = items.filter((d: Darshan) => isPublicActive(d))
        if (!cancelled) setItems(approved)
      } catch (error) {
        console.error('Failed to fetch darshan:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDarshan()
    return () => { cancelled = true }
  }, [])

  const allDarshan = useMemo(() => mergeDarshan(items, FEATURED_DARSHAN), [items])
  const featuredDarshan = useMemo(
    () => mergeDarshan(items.filter((item) => isManagedFeatured(item)), FEATURED_DARSHAN),
    [items]
  )
  const filteredDarshan = useMemo(
    () => featuredDarshan.filter((item) => matchesFilter(item, activeFilter)),
    [activeFilter, featuredDarshan]
  )
  const visibleDarshan = filteredDarshan.length > 0 ? filteredDarshan : featuredDarshan
  const primaryDarshan = visibleDarshan[0] || FEATURED_DARSHAN[0]
  const liveCount = allDarshan.filter((item) => getDarshanKind(item) === 'live').length
  const todayRoutine = WEEKDAY_ROUTINES[today?.weekdayIndex ?? 1]
  const dbDailyItems = items.filter((item) => isPublicActive(item))
  const dailyUploads = dbDailyItems.filter((item) => matchesFilter(item, activeFilter))
  const jsonLd = useMemo(() => buildJsonLd(allDarshan), [allDarshan])
  const heroImage = getDarshanHeroImage(primaryDarshan)

  if (loading) {
    return <DailyDarshanSkeleton />
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        className="relative min-h-[620px] overflow-hidden bg-stone-950 text-white"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 92%, rgba(251, 191, 36, 0.24), transparent 34%), linear-gradient(135deg, #120f0d 0%, #2a1511 45%, #111827 100%)',
        }}
      >
        <SarvdevImage image={heroImage} alt="Daily Darshan sacred temple background" className="absolute inset-0 opacity-45" imgClassName="object-cover" loading="eager" renderMode="auto" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[620px] flex-col justify-end pb-14 pt-24">
          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-300/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Virtual Darshan
              </span>
              {allDarshan.length > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-200/25 bg-red-500/20 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-red-100 backdrop-blur">
                  <Radio className="h-3.5 w-3.5" />
                  {liveCount > 0 ? `${liveCount} Live Now` : 'Featured Darshan Ready'}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-stone-100 backdrop-blur">
                <CalendarDays className="h-3.5 w-3.5" />
                {today ? `${today.weekdayLabel}, ${today.dateLabel}` : 'Today'}
              </span>
            </div>

            <p className="text-lg font-semibold text-amber-100">आज का दिव्य दर्शन</p>
            <h1 className="mt-2 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.92] tracking-normal text-white drop-shadow-2xl">
              Daily Darshan
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-stone-100">
              Start your day with sacred darshan, live temple streams, mantras, aarti, and panchang in one calm daily ritual.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#featured-darshan" className="btn btn-primary rounded-xl px-5 py-3 text-sm font-black no-underline hover:no-underline">
                <Play className="h-4 w-4" />
                Watch Featured Darshan
              </Link>
              <Link href="/temples" className="btn rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur hover:bg-white/20">
                <Landmark className="h-4 w-4" />
                Browse Temples
              </Link>
              <Link href="/panchang" className="btn rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur hover:bg-white/20">
                <CalendarDays className="h-4 w-4" />
                Panchang Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-surface pb-24">
        <section className="page-container -mt-10 relative z-20">
          <div className="grid gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl md:grid-cols-4">
            <StatCard icon={<Video className="h-5 w-5" />} label="Featured streams" value={`${FEATURED_DARSHAN.length}`} />
            <StatCard icon={<Radio className="h-5 w-5" />} label="Live now" value={`${liveCount}`} />
            <StatCard icon={<SunMedium className="h-5 w-5" />} label="Today's deity" value={todayRoutine.deity} />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Daily rhythm" value="Morning to evening" />
          </div>
        </section>

        <section className="page-container pt-8">
          <div className="flex gap-2 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition ${
                  activeFilter === filter.key
                    ? 'border-stone-900 bg-stone-950 text-white shadow-lg'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section id="featured-darshan" className="page-container pt-8">
          <SectionHeader
            eyebrow="Featured Darshan"
            title="Live temple darshan hub"
            description="Watch the main darshan first, then continue with curated temple streams from Sarvdev's featured collection."
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <FeaturedVideo item={primaryDarshan} />

            <aside className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Today's Practice</p>
                <h3 className="mt-2 text-2xl font-black text-stone-950">{todayRoutine.deity} focus</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Begin with {todayRoutine.mantra}, continue with {todayRoutine.aarti}, and close the day with evening darshan.
                </p>
                <div className="mt-4 grid gap-2">
                  <Link href={`/devotionals?search=${encodeURIComponent(todayRoutine.mantra)}`} className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-black text-stone-800 no-underline hover:bg-orange-100">
                    Morning Mantra
                  </Link>
                  <Link href={`/devotionals?search=${encodeURIComponent(todayRoutine.aarti)}`} className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-black text-stone-800 no-underline hover:bg-orange-100">
                    Today&apos;s Aarti
                  </Link>
                  <Link href="/panchang" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-black text-stone-800 no-underline hover:bg-emerald-100">
                    Panchang Today
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Personalize</p>
                <h3 className="mt-2 text-xl font-black text-stone-950">Login to personalize your daily darshan</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Save favorite temples, revisit recent darshan, and keep deity-based recommendations ready.
                </p>
                <Link href="/login" className="btn btn-outline mt-4 w-full rounded-xl text-sm no-underline hover:no-underline">
                  <Heart className="h-4 w-4" />
                  Personalize
                </Link>
              </div>
            </aside>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleDarshan.slice(1, 9).map((item) => (
              <DarshanCard key={item._id} item={item} compact />
            ))}
          </div>

          {filteredDarshan.length === 0 && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">
              No darshan matched this filter yet. Showing the full featured collection so the page never feels empty.
            </div>
          )}
        </section>

        <section className="page-container pt-14">
          <SectionHeader
            eyebrow="Today's Spiritual Routine"
            title="A complete daily habit"
            description="A simple morning-to-evening flow for darshan, chanting, panchang, and devotional listening."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getRoutineCards(todayRoutine, primaryDarshan).map((card) => (
              <RoutineCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="page-container pt-14">
          <SectionHeader
            eyebrow="Daily Darshan"
            title="Temple updates for today"
            description="Approved daily darshan posts from the temple network appear here when available."
          />

          {dailyUploads.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dailyUploads.map((item) => (
                <DarshanCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <PremiumEmptyState featured={visibleDarshan.slice(0, 4)} />
          )}
        </section>

        <section className="page-container pt-14">
          <div className="grid gap-4 lg:grid-cols-3">
            <PersonalizationCard
              icon={<Bookmark className="h-5 w-5" />}
              title="My Bookmarked Temples"
              description="Keep your regular morning and evening darshan temples close."
              href="/bookmarks"
            />
            <PersonalizationCard
              icon={<Clock className="h-5 w-5" />}
              title="Recently Viewed Temples"
              description="Return quickly to temples you visited during recent sessions."
              href="/temples"
            />
            <PersonalizationCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Favorite Deities"
              description="Tune the page around Shiva, Vishnu, Krishna, Hanuman, Ganesh, Shakti, or Sai."
              href="/login"
            />
          </div>
        </section>

        <section className="page-container pt-14">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Sarvdev Daily Darshan</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Live darshan, recorded temple videos, and daily practice in one place</h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-stone-700">
              Watch live and recorded darshan from sacred Hindu temples, follow a weekday-based devotional routine, open today&apos;s panchang, and continue into mantras, aarti, festivals, and temple discovery.
            </p>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <Link href="#featured-darshan" className="flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-5 py-4 text-sm font-black text-white shadow-2xl no-underline hover:no-underline">
          <Play className="h-4 w-4" />
          Watch Darshan
        </Link>
      </div>
    </>
  )
}

function DailyDarshanSkeleton() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="h-[620px] animate-pulse bg-stone-900" />
      <div className="page-container -mt-10 space-y-8 pb-16">
        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-xl md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-stone-100" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="aspect-video rounded-2xl bg-stone-100" />
          <div className="h-80 rounded-2xl bg-stone-100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 rounded-2xl bg-stone-100" />
          ))}
        </div>
      </div>
    </main>
  )
}

function FeaturedVideo({ item }: { item: Darshan }) {
  const youtubeId = getYoutubeId(item)
  const videoSrc = item.videoUrl || item.video || item.media
  const watchUrl = getWatchUrl(item)
  const kind = getDarshanKind(item)
  const templeName = getTempleName(item)
  const practice = getPracticeLink(item)

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
      <div className="relative aspect-video bg-stone-950">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : videoSrc ? (
          <video controls src={videoSrc} className="absolute inset-0 h-full w-full bg-black object-cover" />
        ) : (
          <DarshanThumbnail item={item} featured />
        )}
        <span className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white ${kind === 'live' ? 'bg-red-600' : 'bg-stone-950/80'}`}>
          {kind === 'live' && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
          {kind === 'live' ? 'Live' : 'Recorded'}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Featured now</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-stone-950">{item.title}</h2>
            {item.description && <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">{item.description}</p>}
          </div>
          <BookmarkButton
            item={{ id: item._id, type: 'darshan', title: item.title, slug: item._id, subtitle: templeName }}
            size="sm"
            className="bg-orange-50 hover:bg-orange-100"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {templeName && <InfoPill icon={<Landmark className="h-3.5 w-3.5" />} label={templeName} />}
          {item.deity && <InfoPill icon={<Sparkles className="h-3.5 w-3.5" />} label={item.deity} />}
          {item.location && <InfoPill icon={<Compass className="h-3.5 w-3.5" />} label={item.location} />}
          {(item.schedule || item.time) && <InfoPill icon={<Clock className="h-3.5 w-3.5" />} label={item.schedule || item.time || ''} />}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {watchUrl && (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-xl px-5 py-3 text-sm no-underline hover:no-underline">
              <ExternalLink className="h-4 w-4" />
              Open YouTube
            </a>
          )}
          {getTempleHref(item) && (
            <Link href={getTempleHref(item)} className="btn btn-outline rounded-xl px-5 py-3 text-sm no-underline hover:no-underline">
              <Landmark className="h-4 w-4" />
              Temple Page
            </Link>
          )}
          <Link href={practice.href} className="btn rounded-xl bg-amber-50 px-5 py-3 text-sm font-black text-stone-900 hover:bg-amber-100">
            <Flame className="h-4 w-4" />
            {practice.label}
          </Link>
        </div>
      </div>
    </article>
  )
}

function DarshanCard({ item, compact = false }: { item: Darshan; compact?: boolean }) {
  const kind = getDarshanKind(item)
  const watchUrl = getWatchUrl(item)
  const templeName = getTempleName(item)
  const practice = getPracticeLink(item)

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden bg-stone-950">
        <DarshanThumbnail item={item} />
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white ${kind === 'live' ? 'bg-red-600' : 'bg-stone-950/80'}`}>
          {kind === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
          {kind === 'live' ? 'Live' : 'Recorded'}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-stone-950/5 opacity-0 transition group-hover:bg-stone-950/25 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-950 shadow-xl">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>
      </div>

      <div className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start justify-between gap-3">
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-black leading-tight text-stone-950 group-hover:text-orange-700`}>
            {item.title}
          </h3>
          <BookmarkButton
            item={{ id: item._id, type: 'darshan', title: item.title, slug: item._id, subtitle: templeName }}
            size="sm"
            className="shrink-0 bg-orange-50 hover:bg-orange-100"
          />
        </div>
        {item.description && !compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{item.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.deity && <InfoPill icon={<Sparkles className="h-3.5 w-3.5" />} label={item.deity} compact />}
          {templeName && <InfoPill icon={<Landmark className="h-3.5 w-3.5" />} label={templeName} compact />}
          {item.location && !compact && <InfoPill icon={<Compass className="h-3.5 w-3.5" />} label={item.location} compact />}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {watchUrl && (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-4 py-2 text-xs font-black text-white no-underline hover:bg-stone-800">
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch
            </a>
          )}
          <Link href={practice.href} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-black text-stone-800 no-underline hover:bg-amber-100">
            <Flame className="h-3.5 w-3.5" />
            {practice.shortLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}

function DarshanThumbnail({ item, featured = false }: { item: Darshan; featured?: boolean }) {
  const image = getDarshanCardImage(item)
  return (
    <>
      <SarvdevImage
        image={image}
        alt={`${item.title} thumbnail`}
        className="absolute inset-0"
        imgClassName={`object-cover transition duration-700 ${featured ? '' : 'group-hover:scale-105'}`}
        renderMode="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-stone-950/5 to-transparent" />
    </>
  )
}

function PremiumEmptyState({ featured }: { featured: Darshan[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Explore Featured Live Darshan</p>
          <h3 className="mt-2 text-3xl font-black text-stone-950">No daily uploads yet, but darshan is ready</h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Continue with featured temple videos, submit a temple live darshan, browse sacred temples, or bookmark favorites for your next visit.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/darshan/new" className="btn btn-primary rounded-xl text-sm no-underline hover:no-underline">
            <Bell className="h-4 w-4" />
            Submit Darshan
          </Link>
          <Link href="/temples" className="btn btn-outline rounded-xl text-sm no-underline hover:no-underline">
            <Landmark className="h-4 w-4" />
            Browse Temples
          </Link>
          <Link href="/bookmarks" className="btn btn-outline rounded-xl text-sm no-underline hover:no-underline">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((item) => (
          <DarshanCard key={item._id} item={item} compact />
        ))}
      </div>
    </div>
  )
}

function RoutineCard({
  icon,
  title,
  description,
  href,
  tone,
}: {
  icon: ReactNode
  title: string
  description: string
  href: string
  tone: string
}) {
  return (
    <Link href={href} className={`group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm no-underline transition duration-300 hover:-translate-y-1 hover:shadow-xl ${tone}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-stone-950 shadow-sm">
        {icon}
      </span>
      <h3 className="mt-4 text-xl font-black text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-orange-700">
        Open
        <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

function PersonalizationCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">{icon}</span>
      <h3 className="mt-4 text-xl font-black text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-orange-700 no-underline hover:text-orange-800">
        Login to personalize your daily darshan
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
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

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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

function InfoPill({ icon, label, compact = false }: { icon: ReactNode; label: string; compact?: boolean }) {
  if (!label) return null
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full bg-stone-100 font-bold text-stone-600 ${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'}`}>
      {icon}
      <span className="truncate">{label}</span>
    </span>
  )
}

function getTodayInfo(date: Date): TodayInfo {
  return {
    dateLabel: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
    weekdayLabel: new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date),
    weekdayIndex: date.getDay(),
  }
}

function getRoutineCards(rule: typeof WEEKDAY_ROUTINES[number], primaryDarshan: Darshan) {
  const eveningQuery = primaryDarshan.deity || rule.deity
  return [
    {
      icon: <SunMedium className="h-5 w-5" />,
      title: 'Morning Mantra',
      description: `Begin with ${rule.mantra} and a few minutes of quiet remembrance.`,
      href: `/devotionals?search=${encodeURIComponent(rule.mantra)}`,
      tone: 'hover:border-amber-300 bg-gradient-to-br from-amber-50 to-white',
    },
    {
      icon: <Flame className="h-5 w-5" />,
      title: "Today's Aarti",
      description: `Offer the day with ${rule.aarti} and family prayer.`,
      href: `/devotionals?search=${encodeURIComponent(rule.aarti)}`,
      tone: 'hover:border-orange-300 bg-gradient-to-br from-orange-50 to-white',
    },
    {
      icon: <CalendarDays className="h-5 w-5" />,
      title: 'Panchang Today',
      description: 'Check tithi, nakshatra, sunrise, sunset, and auspicious timing.',
      href: '/panchang',
      tone: 'hover:border-emerald-300 bg-gradient-to-br from-emerald-50 to-white',
    },
    {
      icon: <Moon className="h-5 w-5" />,
      title: 'Evening Darshan',
      description: `Close with ${eveningQuery} darshan and a short gratitude pause.`,
      href: '#featured-darshan',
      tone: 'hover:border-indigo-300 bg-gradient-to-br from-indigo-50 to-white',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: 'Festival / Vrat',
      description: 'See upcoming Hindu festivals, vrat dates, and special temple observances.',
      href: '/events',
      tone: 'hover:border-rose-300 bg-gradient-to-br from-rose-50 to-white',
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: 'Recommended Devotional',
      description: `Continue with ${rule.deity} and ${rule.secondary} devotionals curated for today.`,
      href: `/devotionals?search=${encodeURIComponent(rule.deity)}`,
      tone: 'hover:border-sky-300 bg-gradient-to-br from-sky-50 to-white',
    },
  ]
}

function mergeDarshan(dbItems: Darshan[], featured: Darshan[]) {
  const merged = new Map<string, Darshan>()

  for (const item of [...dbItems, ...featured]) {
    const key = getDarshanKey(item)
    if (!merged.has(key)) {
      merged.set(key, normalizeDarshan(item))
    }
  }

  return Array.from(merged.values()).sort((a, b) => {
    const liveDelta = Number(getDarshanKind(b) === 'live') - Number(getDarshanKind(a) === 'live')
    if (liveDelta) return liveDelta
    const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDelta) return featuredDelta
    return (a.priority || 999) - (b.priority || 999)
  })
}

function normalizeDarshan(item: Darshan): Darshan {
  const youtubeId = getYoutubeId(item)
  return {
    ...item,
    _id: item._id || youtubeId || slugify(item.title),
    templeName: item.templeName || item.temple,
    darshanType: item.darshanType || item.type || (item.isLive ? 'live' : isFutureDarshan(item) ? 'upcoming' : 'recorded'),
    type: item.type || item.darshanType || (item.isLive ? 'live' : isFutureDarshan(item) ? 'upcoming' : 'recorded'),
    isFeatured: Boolean(item.isFeatured ?? item.featured),
    featured: Boolean(item.isFeatured ?? item.featured),
    tags: Array.from(new Set([...(item.tags || []), ...inferTags(item)])),
  }
}

function getDarshanKey(item: Darshan) {
  return getYoutubeId(item) || `${slugify(item.title)}-${slugify(getTempleName(item))}`
}

function matchesFilter(item: Darshan, filter: FilterKey) {
  if (filter === 'all') return true
  if (filter === 'live') return getDarshanKind(item) === 'live'
  if (filter === 'recorded') return getDarshanKind(item) === 'recorded'
  if (filter === 'upcoming') return getDarshanKind(item) === 'upcoming'
  return getSearchText(item).includes(filter) || (item.tags || []).some((tag) => normalize(tag) === filter)
}

function getDarshanKind(item: Darshan): DarshanKind {
  if (item.isLive || item.darshanType === 'live' || item.type === 'live') return 'live'
  if (item.darshanType === 'upcoming' || item.type === 'upcoming' || isFutureDarshan(item)) return 'upcoming'
  return 'recorded'
}

function getTempleName(item: Darshan) {
  return item.templeName || item.temple || ''
}

function getTempleHref(item: Darshan) {
  if (item.templeHref) return item.templeHref
  if (item.templeSlug) return `/temples/${item.templeSlug}`
  return ''
}

function getPracticeLink(item: Darshan) {
  if (item.relatedDevotionalSlug) {
    return {
      label: 'Related Devotional',
      shortLabel: 'Practice',
      href: `/devotionals/${item.relatedDevotionalSlug}`,
    }
  }
  const deity = item.deity || inferPrimaryDeity(item) || 'Devotional'
  const search = deity === 'Sai' ? 'Sai Aarti' : `${deity} Mantra`
  return {
    label: `${deity} Mantra / Aarti`,
    shortLabel: deity,
    href: `/devotionals?search=${encodeURIComponent(search)}`,
  }
}

function getYoutubeId(item: Darshan) {
  if (item.youtubeId) return item.youtubeId
  const url = item.youtubeUrl || item.videoUrl || item.video || item.media || item.externalUrl || ''
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/)
  return match?.[1] || ''
}

function getWatchUrl(item: Darshan) {
  const youtubeId = getYoutubeId(item)
  if (youtubeId) return `https://www.youtube.com/watch?v=${youtubeId}`
  return item.externalUrl || item.youtubeUrl || item.videoUrl || item.video || item.media || ''
}

function getDarshanCardImage(item: Darshan) {
  return getTempleCardImage({
    cardMedia: item.cardMedia,
    primaryMedia: item.primaryMedia,
    imageCard: item.imageCard || item.thumbnail || item.image || HERO_IMAGE,
    image: item.imageCard || item.thumbnail || item.image || HERO_IMAGE,
  })
}

function getDarshanHeroImage(item: Darshan) {
  return getTempleHeroImage({
    heroMedia: item.heroMedia,
    primaryMedia: item.primaryMedia,
    cardMedia: item.cardMedia,
    imageHero: item.imageHero || item.imageCard || item.thumbnail || item.image || HERO_IMAGE,
    imageCard: item.imageCard || item.thumbnail || item.image || HERO_IMAGE,
    image: item.imageHero || item.imageCard || item.thumbnail || item.image || HERO_IMAGE,
  })
}

function isManagedFeatured(item: Darshan) {
  return isPublicActive(item) && Boolean(item.isFeatured ?? item.featured)
}

function isPublicActive(item: Darshan) {
  return item.status === 'active' || item.status === 'approved' || !item.status
}

function isFutureDarshan(item: Darshan) {
  const date = item.darshanDate || item.date
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return false
  return new Date(`${date}T23:59:59`).getTime() > Date.now()
}

function inferPrimaryDeity(item: Darshan) {
  const text = getSearchText(item)
  if (text.includes('shiva') || text.includes('mahakal') || text.includes('vishwanath') || text.includes('jyotirlinga')) return 'Shiva'
  if (text.includes('vishnu') || text.includes('vitthal') || text.includes('vithoba')) return 'Vishnu'
  if (text.includes('krishna') || text.includes('banke') || text.includes('vrindavan')) return 'Krishna'
  if (text.includes('hanuman') || text.includes('balaji') || text.includes('salangpur')) return 'Hanuman'
  if (text.includes('ganesh') || text.includes('ganapati') || text.includes('siddhivinayak')) return 'Ganesh'
  if (text.includes('durga') || text.includes('devi') || text.includes('shakti')) return 'Shakti'
  if (text.includes('sai')) return 'Sai'
  return ''
}

function inferTags(item: Darshan) {
  const text = getSearchText(item)
  const tags: string[] = []
  const pushIf = (tag: string, terms: string[]) => {
    if (terms.some((term) => text.includes(term))) tags.push(tag)
  }

  pushIf('shiva', ['shiva', 'mahakal', 'vishwanath', 'jyotirlinga'])
  pushIf('vishnu', ['vishnu', 'vitthal', 'vithoba', 'narayan'])
  pushIf('krishna', ['krishna', 'banke', 'bihari', 'vrindavan'])
  pushIf('hanuman', ['hanuman', 'balaji', 'salangpur', 'kashtabhanjan'])
  pushIf('ganesh', ['ganesh', 'ganapati', 'siddhivinayak'])
  pushIf('shakti', ['durga', 'devi', 'shakti', 'mata'])
  pushIf('sai', ['sai', 'shirdi'])
  pushIf('jyotirlinga', ['jyotirlinga', 'mahakaleshwar', 'vishwanath'])
  pushIf('north', ['varanasi', 'uttar pradesh', 'rajasthan', 'salasar', 'vrindavan', 'kashi', 'north'])
  pushIf('south', ['tamil nadu', 'andhra', 'telangana', 'kerala', 'karnataka', 'rameshwaram', 'tirupati', 'madurai', 'south'])

  return tags
}

function getSearchText(item: Darshan) {
  return normalize([
    item.title,
    item.description,
    item.temple,
    item.templeName,
    item.templeNameHi,
    item.deity,
    item.deityHi,
    item.location,
    item.city,
    item.state,
    item.type,
    item.darshanType,
    item.festivalTag,
    ...(item.tags || []),
  ].filter(Boolean).join(' '))
}

function normalize(text: string) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function slugify(text: string) {
  return normalize(text).replace(/\s+/g, '-')
}

function buildJsonLd(items: Darshan[]) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'Daily Darshan', item: PAGE_URL },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Daily Darshan',
    itemListElement: items.slice(0, 12).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: getWatchUrl(item) || PAGE_URL,
    })),
  }

  const videoLd = items
    .filter((item) => getYoutubeId(item) || item.videoUrl || item.video || item.media)
    .slice(0, 8)
    .map((item) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: item.title,
      description: item.description || `Daily darshan from ${getTempleName(item) || 'Sarvdev'}`,
      thumbnailUrl: getDarshanCardImage(item).src,
      embedUrl: getYoutubeId(item) ? `https://www.youtube.com/embed/${getYoutubeId(item)}` : undefined,
      contentUrl: getWatchUrl(item) || undefined,
      uploadDate: isIsoDate(item.darshanDate || item.date) ? (item.darshanDate || item.date) : undefined,
    }))

  return [breadcrumbLd, itemListLd, ...videoLd]
}

function isIsoDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}
