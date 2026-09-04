import { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Darshan from '@/models/Darshan'
import Deity from '@/models/Deity'
import Event from '@/models/Event'
import Devotional from '@/models/Devotional'
import { hinduEvents } from '@/data/events'
import SacredArrival from '@/components/home/SacredArrival'
import TodayAtSarvdev from '@/components/home/TodayAtSarvdev'
import ChooseYourPath from '@/components/home/ChooseYourPath'
import FeaturedDarshan from '@/components/home/FeaturedDarshan'
import TempleDiscovery from '@/components/home/TempleDiscovery'
import DivineForms from '@/components/home/DivineForms'
import SacredJourneys from '@/components/home/SacredJourneys'
import DevotionalLibrary from '@/components/home/DevotionalLibrary'
import FestivalHorizon from '@/components/home/FestivalHorizon'
import { sanitizeImageUrl } from '@/lib/imageGuard'
import { resolveMediaOriginal, type SarvdevMediaInput } from '@/lib/media-asset'

// Homepage editorial slots are populated from managed records at request time.
// This avoids baking an empty directory snapshot into a static deployment.
export const dynamic = 'force-dynamic'

// ─── Homepage SEO Metadata ───
export const metadata: Metadata = {
  title: 'Sarvdev — Discover Sacred Temples & Devotional Music Across India',
  description:
    'Explore 1000+ Hindu temples across India, listen to bhajans, aartis and mantras, track festivals and daily panchang. Your complete spiritual companion.',
  keywords: [
    'temple directory India', 'Hindu temples', 'mandir darshan', 'bhajan online',
    'aarti lyrics', 'panchang today', 'festival calendar 2026', 'Jyotirlinga',
    'Shakti Peeth', 'Char Dham', 'devotional music', 'spiritual platform',
  ],
  alternates: { canonical: 'https://sarvdev.com' },
}

// ─── Compute next festival from static data (server-side) ───
function getNextFestival() {
  const now = new Date()
  const upcoming = hinduEvents
    .filter((e) => e.category === 'festival' && new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] ?? null
}

/** Homepage curation must never rely on a display fallback as if it were content. */
function hasUsableManagedMedia(record: Record<string, unknown>) {
  return [record.primaryMedia, record.cardMedia]
    .some((media) => Boolean(sanitizeImageUrl(resolveMediaOriginal(media as SarvdevMediaInput), '')))
}

function isHomepageDevotional(record: Record<string, unknown>) {
  const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0
  return text(record.slug) && text(record.title) && (
    text(record.description) || text(record.category) || text(record.deity) ||
    text(record.audio) || text(record.audioUrl)
  )
}

function isHomepageEvent(record: Record<string, unknown>) {
  const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0
  return text(record.slug) && text(record.title) && text(record.startDate || record.date) && (
    text(record.festivalName) || text(record.shortDescription) || text(record.description)
  )
}

export default async function HomePage() {
  let templeCount = 0
  let heroTemple: any = null
  let seoTemples: any[] = []
  let featuredDarshan: any = null
  let discoveryTemples: any[] = []
  let featuredDeities: any[] = []
  let upcomingEvent: any = null
  let featuredDevotionals: any[] = []
  let upcomingEvents: any[] = []

  try {
    await connectDB()
    const now = new Date().toISOString().slice(0, 10)
    const [count, temples, darshan, discovery, deities, devotionals, events] = await Promise.all([
      Temple.countDocuments({ status: 'approved' }),
      Temple.find({ status: 'approved' })
        .select('title description location city state slug')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(10)
        .lean(),
      Darshan.findOne({
        $and: [
          { $or: [{ status: { $in: ['active', 'approved'] } }, { status: { $exists: false } }, { status: '' }] },
          { $or: [{ heroMedia: { $exists: true, $ne: null } }, { primaryMedia: { $exists: true, $ne: null } }, { imageHero: { $exists: true, $ne: '' } }, { image: { $exists: true, $ne: '' } }, { thumbnail: { $exists: true, $ne: '' } }] },
        ],
      })
        .select('title description temple templeName templeSlug deity location city state isLive darshanType type priority featured isFeatured image imageCard imageHero thumbnail primaryMedia cardMedia heroMedia')
        .sort({ isLive: -1, isFeatured: -1, featured: -1, priority: 1, createdAt: -1 })
        .lean(),
      Temple.find({ status: 'approved' })
        .select('title slug shortDescription description location city state deity speciality sacredCategories categories verified image imageCard imageHero primaryMedia cardMedia heroMedia')
        .sort({ verified: -1, updatedAt: -1, createdAt: -1 })
        .limit(8)
        .lean(),
      Deity.find({
        status: 'approved',
        slug: { $not: /^smoke-test-/i },
        $or: [{ primaryMedia: { $exists: true, $ne: null } }, { cardMedia: { $exists: true, $ne: null } }],
      })
        .select('name nameHi slug description categoryName image imageCard primaryMedia cardMedia order updatedAt')
        .sort({ order: 1, updatedAt: -1 })
        .limit(16)
        .lean(),
      Devotional.find({ status: 'approved' })
        .select('title titleHi slug description category deity language audio audioUrl duration featured createdAt updatedAt')
        .sort({ featured: -1, updatedAt: -1, createdAt: -1 })
        .limit(8)
        .lean(),
      Event.find({
        $and: [
          { status: 'published' },
          { verified: true },
          { slug: { $exists: true, $ne: '' } },
          { $or: [{ startDate: { $gte: now } }, { date: { $gte: now } }] },
        ],
      })
        .select('title titleHi slug description shortDescription startDate date endDate festivalName deityName templeName temple location city state image imageCard imageHero primaryMedia cardMedia heroMedia featured priority verified status')
        .sort({ startDate: 1, date: 1, featured: -1, priority: -1 })
        .limit(8)
        .lean(),
    ])
    templeCount = count
    // Temple media has no stored homepage-curation or heritage-suitability signal.
    // Do not elevate generic Temple image fields into a global homepage identity.
    heroTemple = null
    seoTemples = JSON.parse(JSON.stringify(temples))
    featuredDarshan = JSON.parse(JSON.stringify(darshan))
    discoveryTemples = JSON.parse(JSON.stringify(discovery))
    featuredDeities = JSON.parse(JSON.stringify(deities.filter((deity: any) => hasUsableManagedMedia(deity)).slice(0, 8)))
    featuredDevotionals = JSON.parse(JSON.stringify(devotionals.filter((devotional: any) => isHomepageDevotional(devotional)).slice(0, 4)))
    upcomingEvents = JSON.parse(JSON.stringify(events.filter((event: any) => isHomepageEvent(event)).slice(0, 4)))
    upcomingEvent = upcomingEvents[0] || null
  } catch (e) {
    console.error('Homepage data fetch error:', e)
  }

  const nextFestival = getNextFestival()
  const event = upcomingEvent || (nextFestival ? {
    title: nextFestival.title,
    titleHi: nextFestival.titleHi,
    slug: nextFestival.slug,
    date: nextFestival.date,
    festivalName: nextFestival.title,
  } : null)

  // ─── Structured Data: ItemList for rich results ───
  const templeItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sacred Temples of India',
    description: 'A curated directory of Hindu temples across India and the world.',
    numberOfItems: templeCount,
    itemListElement: seoTemples.map((temple: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'HinduTemple',
        name: temple.title,
        description: temple.description?.slice(0, 160),
        address: temple.location || [temple.city, temple.state].filter(Boolean).join(', '),
        url: `https://sarvdev.com/temples/${temple.slug || temple.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
      },
    })),
  }

  return (
    <div>
      {/* Structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(templeItemList) }}
      />

      <SacredArrival temple={heroTemple} />
      <TodayAtSarvdev darshan={featuredDarshan} event={event} />
      <ChooseYourPath />
      <FeaturedDarshan darshan={featuredDarshan} />
      <TempleDiscovery temples={discoveryTemples} />
      <DivineForms deities={featuredDeities} />
      <SacredJourneys />
      <DevotionalLibrary devotionals={featuredDevotionals} />
      <FestivalHorizon events={upcomingEvents} />
    </div>
  )
}
