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

      {/* ─── Hero Section — Premium Sacred ─── */}
      <section className="sacred-hero min-h-[85vh] md:min-h-[90vh] flex items-center relative">
        {/* Animated sacred orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] right-[8%] w-80 h-80 bg-primary/[0.08] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-64 h-64 bg-accent/[0.06] rounded-full blur-[80px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-temple-gold-DEFAULT/[0.03] rounded-full blur-[120px]" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%221%22%20fill%3D%22%23C9A84C%22%2F%3E%3C%2Fsvg%3E')]" />
          </div>
          {/* Top saffron accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        </div>

        <div className="sacred-hero-content page-container py-24 md:py-36 w-full">
          <div className="max-w-3xl">
            {/* Cinzel overline */}
            <div className="flex items-center gap-3 mb-6 fade-up">
              <span className="font-cinzel text-overline uppercase tracking-[0.2em] text-temple-gold-light">
                Temple Directory &amp; Devotional Hub
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-temple-gold-DEFAULT/40 to-transparent max-w-[100px]" />
            </div>

            {/* SSR h1 — visible to crawlers in raw HTML */}
            <h1 className="font-display text-display-lg text-white leading-[1.08] tracking-tight text-shadow-divine fade-up delay-1">
              Discover Sacred Temples.<br />
              <span className="text-gradient bg-gradient-to-r from-primary-300 via-accent-300 to-temple-gold-light bg-clip-text text-transparent">
                Deepen Your Devotion.
              </span>
            </h1>

            <p className="mt-6 text-body text-sandstone-300 max-w-xl leading-relaxed fade-up delay-2">
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

        {/* Bottom sacred gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent z-20 pointer-events-none" />
      </section>

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
