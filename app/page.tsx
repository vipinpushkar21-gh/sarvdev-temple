import { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import { hinduEvents } from '@/data/events'

// Client islands — interactive parts that need browser APIs
import HeroSearch from '@/components/home/HeroSearch'
import HeroTitle from '@/components/home/HeroTitle'
import HomeStats from '@/components/home/HomeStats'
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

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/20 border-b border-surface-border">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-accent/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-dots opacity-[0.03]" />
        </div>

        <div className="page-container py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-primary-100/80 text-primary-800 text-caption font-semibold mb-6 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Temple Directory &amp; Devotional Hub
            </div>

            {/* SSR h1 + subtitle — visible to crawlers in raw HTML */}
            <h1 className="text-display-lg font-serif text-secondary-800 leading-tight fade-up delay-1">
              Discover Sacred Temples. Deepen Your Devotion.
            </h1>
            <p className="mt-5 text-body text-ink-muted max-w-xl leading-relaxed fade-up delay-2">
              Explore temples across India, listen to devotional music, track festivals and panchang, and connect with sacred traditions through Sarvdev.
            </p>

            {/* Client island: overlays translated title for non-English users */}
            <HeroTitle />

            {/* Client island: search bar + CTA buttons */}
            <HeroSearch />

            {/* Stats — server-rendered numbers for SEO */}
            <HomeStats initial={stats} />
          </div>
        </div>
      </section>

      {/* ─── Festival Countdown (server-computed festival data) ─── */}
      <FestivalCountdown initialFestival={nextFestival} />

      {/* ─── Today's Panchang ─── */}
      <PanchangToday />

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

      {/* ─── Features Section (client — needs translation) ─── */}
      <FeaturesGrid />
    </div>
  )
}
