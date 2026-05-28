import { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import { hinduEvents } from '@/data/events'

// Client islands — interactive parts that need browser APIs
import SacredEcosystemHero from '@/components/SacredEcosystemHero'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import FestivalCountdown from '../components/FestivalCountdown'
import PanchangToday from '../components/PanchangToday'
import TempleSlider from '../components/TempleSlider'
import HomeCategoryShowcase from '../components/HomeCategoryShowcase'
import TempleGalleryMosaic from '../components/TempleGalleryMosaic'
import DevotionalTeaser from '../components/DevotionalTeaser'
import NearbyTemples from '../components/NearbyTemples'
import PilgrimageCircuits from '../components/home/PilgrimageCircuits'
import SpiritualQuotes from '../components/home/SpiritualQuotes'
import BlogHighlights from '../components/home/BlogHighlights'
import StoriesTeaser from '../components/home/StoriesTeaser'
import RegionalExplorer from '../components/home/RegionalExplorer'
import DeityExplorer from '../components/home/DeityExplorer'
import TempleSubmissionCTA from '../components/home/TempleSubmissionCTA'

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

export default async function HomePage() {
  // ─── Server-side data fetches — all content visible to crawlers ───
  let stats = { temples: 0, devotionals: 0, categories: 0 }
  let templeList: any[] = []
  let devotionalList: any[] = []

  try {
    await connectDB()
    const [templeCount, devotionalCount, categoryResult, temples, devotionals] = await Promise.all([
      Temple.countDocuments({ status: 'approved' }),
      Devotional.countDocuments({ status: 'approved' }),
      Temple.distinct('categories', { status: 'approved' }),
      Temple.find({ status: 'approved' })
        .select('title description image location city state deity categories slug speciality latitude longitude')
        .limit(50)
        .lean(),
      Devotional.find({ status: 'approved', audio: { $exists: true, $ne: '' } })
        .select('title description category deity audio language')
        .limit(8)
        .lean(),
    ])
    stats = { temples: templeCount, devotionals: devotionalCount, categories: categoryResult.length }
    templeList = JSON.parse(JSON.stringify(temples))
    devotionalList = JSON.parse(JSON.stringify(devotionals.slice(0, 4)))
  } catch (e) {
    console.error('Homepage data fetch error:', e)
  }

  const nextFestival = getNextFestival()

  // ─── Structured Data: ItemList for rich results ───
  const templeItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sacred Temples of India',
    description: 'A curated directory of Hindu temples across India and the world.',
    numberOfItems: stats.temples,
    itemListElement: templeList.slice(0, 10).map((t: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'HinduTemple',
        name: t.title,
        description: t.description?.slice(0, 160),
        address: t.location || [t.city, t.state].filter(Boolean).join(', '),
        url: `https://sarvdev.com/temples/${t.slug || t.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
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

      {/* ─── Hero Section — Interactive Sacred Ecosystem ─── */}
      <SacredEcosystemHero stats={stats} />
      {/* ─── Sacred Divider ─── */}
      <div className="sacred-divider" />

      {/* ─── Festival Countdown (server-computed festival data) ─── */}
      <FestivalCountdown initialFestival={nextFestival} />

      {/* ─── Today's Panchang ─── */}
      <PanchangToday />

      {/* ─── Sacred Divider ─── */}
      <div className="sacred-divider" />

      {/* ─── Deity Explorer — Premium ─── */}
      <DeityExplorer />

      {/* ─── Temple Slider (server-fetched temples) ─── */}
      <TempleSlider initialTemples={templeList} />

      {/* ─── Sacred Category Showcase (server-fetched temples) ─── */}
      <HomeCategoryShowcase initialTemples={templeList} />

      {/* ─── Highlighted Temples Mosaic (server-fetched temples) ─── */}
      <TempleGalleryMosaic initialTemples={templeList} />

      {/* ─── Devotional Music Teaser (server-fetched devotionals) ─── */}
      <DevotionalTeaser initialItems={devotionalList} />

      {/* ─── Pilgrimage Circuits ─── */}
      <PilgrimageCircuits />

      {/* ─── Sacred Stories Teaser ─── */}
      <StoriesTeaser />

      {/* ─── Regional Explorer ─── */}
      <RegionalExplorer />

      {/* ─── Spiritual Quotes Slider ─── */}
      <SpiritualQuotes />

      {/* ─── Nearby Temples — Geolocation (inherently client-side) ─── */}
      <NearbyTemples />

      {/* ─── Blog Highlights ─── */}
      <BlogHighlights />

      {/* ─── Sacred Divider ─── */}
      <div className="sacred-divider" />

      {/* ─── Temple Submission CTA ─── */}
      <TempleSubmissionCTA />

      {/* ─── Features Section (client — needs translation) ─── */}
      <FeaturesGrid />
    </div>
  )
}
