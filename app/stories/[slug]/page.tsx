import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { notFound } from 'next/navigation'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Story definitions — auto-generated collection pages.
 * Each story is a query against the temple database.
 */
const STORIES: Record<string, { title: string; description: string; query: (t: any) => boolean; sort?: (a: any, b: any) => number }> = {
  'top-shiva-temples-in-india': {
    title: 'Top Shiva Temples in India',
    description: 'Explore the most sacred and powerful Lord Shiva temples across India. From the 12 Jyotirlingas to ancient Mahadev shrines.',
    query: (t) => /shiva|mahadev|mahadeva/i.test(t.deity || ''),
  },
  'best-krishna-temples-in-india': {
    title: 'Best Krishna Temples in India',
    description: 'Discover the most revered Lord Krishna temples in India. From Vrindavan to Dwarka, explore divine Krishna shrines.',
    query: (t) => /krishna|kanha|govind/i.test(t.deity || ''),
  },
  'most-powerful-hanuman-temples': {
    title: 'Most Powerful Hanuman Temples',
    description: 'Visit the most powerful Hanuman temples in India. Explore Bajrangbali shrines known for spiritual energy and miracles.',
    query: (t) => /hanuman|bajrang/i.test(t.deity || ''),
  },
  'famous-durga-devi-temples': {
    title: 'Famous Durga & Devi Temples',
    description: 'Explore famous Shakti Peeth and Durga temples across India. Discover the divine feminine power at these sacred shrines.',
    query: (t) => /durga|devi|kali|shakti|parvati|lakshmi|saraswati/i.test(t.deity || ''),
  },
  'ancient-temples-of-south-india': {
    title: 'Ancient Temples of South India',
    description: 'Discover the magnificent ancient temples of South India. From Dravidian masterpieces in Tamil Nadu to Karnataka\'s heritage sites.',
    query: (t) => /tamil nadu|karnataka|kerala|andhra pradesh|telangana/i.test(t.state || ''),
  },
  'sacred-temples-of-uttarakhand': {
    title: 'Sacred Temples of Uttarakhand',
    description: 'Explore the divine temples of Uttarakhand — the Dev Bhoomi. From Char Dham to Panch Kedar, discover Himalayan spiritual heritage.',
    query: (t) => /uttarakhand/i.test(t.state || ''),
  },
  'holy-temples-of-varanasi': {
    title: 'Holy Temples of Varanasi',
    description: 'Discover the ancient temples of Varanasi (Kashi), the spiritual capital of India. Explore Kashi Vishwanath and sacred ghats.',
    query: (t) => /varanasi|kashi|banaras/i.test([t.city, t.location].filter(Boolean).join(' ')),
  },
  'ganesh-temples-in-india': {
    title: 'Ganesh Temples in India',
    description: 'Explore temples dedicated to Lord Ganesha across India. From Ashtavinayak in Maharashtra to Siddhivinayak in Mumbai.',
    query: (t) => /ganesh|ganesha|ganapati|vinayak/i.test(t.deity || ''),
  },
  'ram-temples-in-india': {
    title: 'Ram Temples in India',
    description: 'Visit the most sacred Lord Ram temples across India. From Ayodhya Ram Mandir to ancient Rama shrines.',
    query: (t) => /ram|rama/i.test(t.deity || '') && !/saraswati|lakshmi/i.test(t.deity || ''),
  },
  'jyotirlinga-temples': {
    title: '12 Jyotirlinga Temples of India',
    description: 'Explore the 12 Jyotirlinga temples — the most sacred Shiva shrines in India. Complete guide with location and significance.',
    query: (t) => (t.categories || []).some((c: string) => /jyotirlinga/i.test(c)),
  },
  'iskcon-temples-in-india': {
    title: 'ISKCON Temples in India',
    description: 'Explore ISKCON (International Society for Krishna Consciousness) temples across India. Find Hare Krishna temples with timings and directions.',
    query: (t) => /iskcon/i.test(t.templeType || '') || /iskcon/i.test(t.title || ''),
  },
  'shakti-peeth-temples': {
    title: '51 Shakti Peethas Across India',
    description: 'Discover the 51 Shakti Peethas — sacred Goddess temples where parts of Goddess Sati fell. Complete pilgrimage guide.',
    query: (t) => (t.categories || []).some((c: string) => /shakti.*peeth/i.test(c)),
  },
  'temples-in-rajasthan': {
    title: 'Famous Temples in Rajasthan',
    description: 'Explore the grand temples of Rajasthan — from Dilwara in Mount Abu to Brahma Temple in Pushkar and Karni Mata in Deshnoke.',
    query: (t) => /rajasthan/i.test(t.state || ''),
  },
  'temples-in-maharashtra': {
    title: 'Sacred Temples of Maharashtra',
    description: 'Discover the sacred temples of Maharashtra — Ashtavinayak, Shirdi Sai Baba, Trimbakeshwar, Pandharpur Vitthal, and more.',
    query: (t) => /maharashtra/i.test(t.state || ''),
  },
  'temples-near-rivers': {
    title: 'Temples on Sacred Rivers of India',
    description: 'Explore temples located on the banks of India\'s holiest rivers — Ganga, Yamuna, Narmada, Godavari, and Kaveri.',
    query: (t) => /ghat|river|ganga|yamuna|narmada|godavari|kaveri|sangam|prayag/i.test([t.description || '', t.location || '', t.title || ''].join(' ')),
  },
}

const STORY_SLUGS = Object.keys(STORIES)

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const story = STORIES[slug]
  if (!story) return { title: 'Story — Sarvdev' }

  const url = `${BASE}/stories/${slug}`
  return {
    title: `${story.title} — Sarvdev`,
    description: story.description,
    keywords: [story.title, 'temples', 'India', 'Sarvdev', 'Hindu temples'],
    alternates: { canonical: url },
    openGraph: { title: `${story.title} — Sarvdev`, description: story.description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title: `${story.title} — Sarvdev`, description: story.description },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = STORIES[slug]
  if (!story) notFound()

  let temples: any[] = []
  try {
    await connectDB()
    const all = await Temple.find({ status: 'approved' }, 'title description image city state deity categories').lean() as any[]
    temples = all.filter(story.query)
    if (story.sort) temples.sort(story.sort)
  } catch (e) {
    console.error('Story page fetch error:', e)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: story.title,
    description: story.description,
    url: `${BASE}/stories/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: temples.length,
      itemListElement: temples.slice(0, 50).map((t: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: `${BASE}/temples/${slugify(t.title)}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Stories', item: `${BASE}/stories` },
        { '@type': 'ListItem', position: 3, name: story.title, item: `${BASE}/stories/${slug}` },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/stories" className="hover:text-primary-600 transition-colors no-underline">Stories</Link>
            <span>/</span>
            <span className="text-ink font-medium">{story.title}</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">{story.title}</h1>
          <p className="text-body text-ink-muted max-w-2xl">{story.description}</p>
          <p className="mt-4 text-body-sm text-ink-faint">
            <strong className="text-ink">{temples.length}</strong> temples in this collection
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples found for this collection</p>
            <Link href="/temples" className="btn btn-primary no-underline hover:no-underline">Browse All Temples</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((t: any) => (
              <Link
                key={t._id.toString()}
                href={`/temples/${slugify(t.title)}`}
                className="group card overflow-hidden hover:shadow-md transition-all duration-300 no-underline"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={t.image || DEFAULT_IMAGE}
                    alt={`${t.title} temple${t.city ? ` in ${t.city}` : ''}${t.state ? `, ${t.state}` : ''}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {t.deity && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">
                      {t.deity}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{t.title}</h3>
                  <p className="text-caption text-ink-muted mt-1">{[t.city, t.state].filter(Boolean).join(', ')}</p>
                  {t.description && (
                    <p className="text-caption text-ink-faint mt-2 line-clamp-2">{t.description.replace(/<[^>]+>/g, '').slice(0, 120)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* More stories */}
        <section className="mt-16 pt-10 border-t border-surface-border">
          <h2 className="text-h3 font-serif text-secondary-700 mb-4">Explore More Stories</h2>
          <div className="flex flex-wrap gap-2">
            {STORY_SLUGS.filter(s => s !== slug).slice(0, 6).map(s => (
              <Link key={s} href={`/stories/${s}`} className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">
                {STORIES[s].title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
