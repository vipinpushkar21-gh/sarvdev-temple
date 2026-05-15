import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { notFound } from 'next/navigation'
import RelatedSacredContent from '@/components/RelatedSacredContent'

const BASE = 'https://sarvdev.com'
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

type PilgrimageCluster = {
  slug: string
  title: string
  titleHi: string
  description: string
  longDescription: string
  categoryMatch: string
  deity?: string
  icon: string
  relatedClusters: string[]
}

const CLUSTERS: PilgrimageCluster[] = [
  {
    slug: 'jyotirlinga',
    title: '12 Jyotirlinga Temples of India',
    titleHi: '12 ज्योतिर्लिंग मंदिर',
    description: 'Complete guide to the 12 Jyotirlingas — the most sacred Shiva shrines in India with location, significance, and how to reach.',
    longDescription: 'The 12 Jyotirlingas are the most revered Shiva temples in India. According to the Shiva Purana, these are places where Lord Shiva appeared as a blazing column of light (Jyotirlinga). Pilgrims from across the world visit these sacred shrines to seek blessings and moksha.',
    categoryMatch: 'Dwadash Jyotirlinga (12 Jyotirlingas)',
    deity: 'Shiva',
    icon: '🕉️',
    relatedClusters: ['char-dham', 'panch-kedar', 'pancha-bhoota-stalam'],
  },
  {
    slug: 'char-dham',
    title: 'Char Dham Pilgrimage — Four Sacred Abodes',
    titleHi: 'चार धाम यात्रा',
    description: 'Explore the Char Dham pilgrimage circuit — Badrinath, Dwarka, Puri, and Rameshwaram. Complete guide with significance and temples.',
    longDescription: 'Char Dham (four abodes) is the most important Hindu pilgrimage circuit established by Adi Shankaracharya. The four sacred sites — Badrinath (north), Dwarka (west), Puri (east), and Rameshwaram (south) — represent the spiritual corners of India.',
    categoryMatch: 'Char Dham',
    icon: '🏔️',
    relatedClusters: ['jyotirlinga', 'chota-char-dham', 'sapta-puri'],
  },
  {
    slug: 'shakti-peeth',
    title: '51 Shakti Peethas — Sacred Goddess Temples',
    titleHi: '51 शक्ति पीठ',
    description: 'Discover the 51 Shakti Peethas across India and the world where parts of Goddess Sati fell. Complete list with location and significance.',
    longDescription: 'The 51 Shakti Peethas are among the most sacred shrines of the Hindu Goddess tradition. According to legend, when Lord Shiva carried the body of Goddess Sati, Lord Vishnu\'s Sudarshana Chakra cut her body into 51 pieces, each falling at a sacred location.',
    categoryMatch: 'Shakti Peeth (51 Shakti Peethas)',
    deity: 'Durga',
    icon: '🔱',
    relatedClusters: ['char-dham', 'navagraha'],
  },
  {
    slug: 'chota-char-dham',
    title: 'Chota Char Dham Yatra — Uttarakhand Pilgrimage',
    titleHi: 'छोटा चार धाम यात्रा',
    description: 'Guide to the Chota Char Dham in Uttarakhand — Yamunotri, Gangotri, Kedarnath, and Badrinath. Himalayan spiritual journey.',
    longDescription: 'The Chota Char Dham (Small Four Abodes) is the most popular pilgrimage circuit in the Garhwal Himalayas of Uttarakhand. The four sacred temples — Yamunotri, Gangotri, Kedarnath, and Badrinath — represent the source of India\'s holiest rivers.',
    categoryMatch: 'Chota Char Dham (Uttarakhand)',
    icon: '⛰️',
    relatedClusters: ['char-dham', 'panch-kedar', 'jyotirlinga'],
  },
  {
    slug: 'panch-kedar',
    title: 'Panch Kedar — Five Sacred Shiva Temples of Uttarakhand',
    titleHi: 'पंच केदार',
    description: 'Explore the Panch Kedar — five ancient Shiva temples in the Garhwal Himalayas. Kedarnath, Tungnath, Rudranath, Madhyamaheshwar, and Kalpeshwar.',
    longDescription: 'The Panch Kedar are five Hindu temples dedicated to Lord Shiva in the Garhwal Himalayan region of Uttarakhand. According to the Mahabharata, these temples mark the spots where different parts of Lord Shiva appeared as a bull to the Pandavas.',
    categoryMatch: 'Panch Kedar',
    deity: 'Shiva',
    icon: '🏔️',
    relatedClusters: ['chota-char-dham', 'jyotirlinga', 'pancha-bhoota-stalam'],
  },
  {
    slug: 'divya-desam',
    title: '108 Divya Desam — Sacred Vishnu Temples',
    titleHi: '108 दिव्य देसम',
    description: 'Complete guide to the 108 Divya Desam temples glorified by the Alwars. Sacred Vishnu shrines across India.',
    longDescription: 'The 108 Divya Desams are a group of Hindu Vaishnavite temples glorified in the works of the 12 Alwar poet-saints. Of the 108 temples, 105 are in India, 1 in Nepal, and 2 are considered to be in the celestial realm.',
    categoryMatch: 'Divya Desam (108 Vishnu Temples)',
    deity: 'Vishnu',
    icon: '🪷',
    relatedClusters: ['char-dham', 'sapta-puri'],
  },
  {
    slug: 'ashta-vinayak',
    title: 'Ashta Vinayak — Eight Ganesha Temples of Maharashtra',
    titleHi: 'अष्ट विनायक',
    description: 'Explore the eight sacred Ganesha temples in Maharashtra. Complete Ashta Vinayak pilgrimage guide with directions and significance.',
    longDescription: 'The Ashta Vinayak are eight ancient Hindu temples of Lord Ganesha in the Indian state of Maharashtra. Each temple has its own unique legend and form of Ganesha, making this one of the most popular pilgrimages in western India.',
    categoryMatch: 'Ashta Vinayak',
    deity: 'Ganesha',
    icon: '🐘',
    relatedClusters: ['jyotirlinga', 'shakti-peeth'],
  },
  {
    slug: 'navagraha',
    title: 'Navagraha Temples — Nine Planetary Deity Shrines',
    titleHi: 'नवग्रह मंदिर',
    description: 'Discover the Navagraha temples dedicated to the nine celestial bodies in Hindu astrology. Complete guide to planetary deity worship.',
    longDescription: 'The Navagraha temples are nine Hindu temples, each dedicated to one of the nine major celestial bodies (Navagraha) in Hindu astrology. These temples are primarily located in Tamil Nadu and are believed to have immense spiritual power.',
    categoryMatch: 'Navagraha Temples',
    icon: '🌟',
    relatedClusters: ['divya-desam', 'pancha-bhoota-stalam'],
  },
  {
    slug: 'pancha-bhoota-stalam',
    title: 'Pancha Bhoota Stalam — Five Element Shiva Temples',
    titleHi: 'पंच भूत स्थलम',
    description: 'Guide to the Pancha Bhoota Stalam — five Shiva temples representing earth, water, fire, air, and space.',
    longDescription: 'The Pancha Bhoota Stalam are five Shiva temples in South India, each representing one of the five elements of nature — earth, water, fire, air, and space. These ancient temples are among the most significant Shaiva shrines.',
    categoryMatch: 'Pancha Bhoota Stalam',
    deity: 'Shiva',
    icon: '🔥',
    relatedClusters: ['jyotirlinga', 'panch-kedar', 'divya-desam'],
  },
  {
    slug: 'sapta-puri',
    title: 'Sapta Puri — Seven Sacred Cities of India',
    titleHi: 'सप्त पुरी',
    description: 'Explore the seven holiest cities (Sapta Puri) that grant moksha — Ayodhya, Mathura, Haridwar, Varanasi, Kanchipuram, Ujjain, and Dwarka.',
    longDescription: 'The Sapta Puri (Seven Sacred Cities) are the seven most holy cities in Hinduism that are believed to grant moksha (liberation). Each city is associated with specific deities and has immense spiritual significance in Hindu tradition.',
    categoryMatch: 'Sapta Puri (7 Sacred Cities)',
    icon: '🏛️',
    relatedClusters: ['char-dham', 'jyotirlinga', 'shakti-peeth'],
  },
]

const CLUSTER_MAP = Object.fromEntries(CLUSTERS.map(c => [c.slug, c]))

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const cluster = CLUSTER_MAP[slug]
  if (!cluster) return { title: 'Pilgrimage — Sarvdev' }

  const url = `${BASE}/temples/pilgrimage/${slug}`
  return {
    title: `${cluster.title} — Sarvdev`,
    description: cluster.description,
    keywords: [cluster.title, cluster.titleHi, 'pilgrimage', 'temples', 'India', 'Sarvdev'],
    alternates: { canonical: url },
    openGraph: { title: `${cluster.title} — Sarvdev`, description: cluster.description, url, type: 'website', siteName: 'Sarvdev' },
    twitter: { card: 'summary_large_image', title: `${cluster.title} — Sarvdev`, description: cluster.description },
  }
}

export default async function PilgrimageClusterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cluster = CLUSTER_MAP[slug]
  if (!cluster) notFound()

  let temples: any[] = []
  try {
    await connectDB()
    const all = await Temple.find({ status: 'approved' }, 'title description image city state deity categories').lean() as any[]
    temples = all.filter((t: any) =>
      (t.categories || []).some((c: string) => c === cluster.categoryMatch)
    )
  } catch (e) {
    console.error('Pilgrimage cluster fetch error:', e)
  }

  const states = Array.from(new Set(temples.map((t: any) => t.state).filter(Boolean))).sort() as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.title,
    description: cluster.description,
    url: `${BASE}/temples/pilgrimage/${slug}`,
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
        { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
        { '@type': 'ListItem', position: 3, name: 'Pilgrimage', item: `${BASE}/temples/pilgrimage` },
        { '@type': 'ListItem', position: 4, name: cluster.title, item: `${BASE}/temples/pilgrimage/${slug}` },
      ],
    },
  }

  const relatedClusters = cluster.relatedClusters
    .map(s => CLUSTER_MAP[s])
    .filter(Boolean)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">Pilgrimage</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{cluster.icon}</span>
            <div>
              <h1 className="text-display font-serif text-secondary-800">{cluster.title}</h1>
              <p className="text-body-sm text-ink-faint font-serif">{cluster.titleHi}</p>
            </div>
          </div>
          <p className="text-body text-ink-muted max-w-3xl">{cluster.longDescription}</p>
          <p className="mt-4 text-body-sm text-ink-faint">
            <strong className="text-ink">{temples.length}</strong> temples in this sacred group
            {states.length > 0 && <> across <strong className="text-ink">{states.length}</strong> states</>}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* State quick-links */}
        {states.length > 1 && (
          <section className="mb-10">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Temples by State</h2>
            <div className="flex flex-wrap gap-2">
              {states.map(s => (
                <Link key={s} href={`/temples/state/${slugify(s)}`}
                  className="px-3 py-1.5 rounded-full text-body-sm font-medium border border-surface-border hover:border-primary-300 hover:bg-primary-50 text-ink-muted hover:text-primary-700 transition-all no-underline">
                  {s}
                </Link>
              ))}
            </div>
          </section>
        )}

        {temples.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-h3 font-serif text-ink-muted mb-3">No temples listed in this pilgrimage group yet</p>
            <p className="text-body-sm text-ink-faint mb-6">Help us build the directory — submit temples in this sacred category.</p>
            <div className="flex justify-center gap-3">
              <Link href="/list-temple" className="btn btn-primary no-underline hover:no-underline">Submit Temple</Link>
              <Link href="/temples" className="btn btn-outline no-underline hover:no-underline">Browse All Temples</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((t: any) => (
              <Link key={t._id.toString()} href={`/temples/${slugify(t.title)}`}
                className="group card overflow-hidden hover:shadow-md transition-all duration-300 no-underline">
                <div className="relative h-48 overflow-hidden">
                  <img src={t.image || DEFAULT_IMAGE}
                    alt={`${t.title} — ${cluster.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {t.deity && (
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 text-ink backdrop-blur-sm">{t.deity}</span>
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

        {/* Related Pilgrimage Circuits */}
        {relatedClusters.length > 0 && (
          <section className="mt-16 pt-10 border-t border-surface-border">
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Related Pilgrimage Circuits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedClusters.map(rc => (
                <Link key={rc.slug} href={`/temples/pilgrimage/${rc.slug}`}
                  className="group card p-5 hover:shadow-md transition-all no-underline">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{rc.icon}</span>
                    <div>
                      <h3 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors">{rc.title}</h3>
                      <p className="text-caption text-ink-faint font-serif">{rc.titleHi}</p>
                      <p className="text-caption text-ink-muted mt-1 line-clamp-2">{rc.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedSacredContent
          title="Explore More"
          states={[{ href: '/sacred-categories', label: 'All Sacred Categories' }, { href: '/temples', label: 'All Temples' }, { href: '/events', label: 'Events & Festivals' }]}
          deities={cluster.deity ? [{ href: `/temples/deity/${slugify(cluster.deity)}`, label: `${cluster.deity} Temples` }] : []}
        />
      </main>
    </>
  )
}
