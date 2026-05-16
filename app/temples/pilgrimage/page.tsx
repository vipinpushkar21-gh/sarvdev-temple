import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://sarvdev.com'

export const metadata: Metadata = {
  title: 'Pilgrimage Circuits — Sacred Temple Routes of India',
  description: 'Explore 15 major Hindu pilgrimage circuits across India — Jyotirlinga, Char Dham, Shakti Peeth, ISKCON, Ramayana Circuit, and more. Complete guides with temples, significance, and directions.',
  keywords: ['pilgrimage India', 'Hindu pilgrimage', 'Jyotirlinga', 'Char Dham', 'Shakti Peeth', 'ISKCON', 'Ramayana Circuit', 'temple circuits', 'Sarvdev'],
  alternates: {
    canonical: `${BASE}/temples/pilgrimage`,
    languages: { 'en-IN': `${BASE}/temples/pilgrimage`, 'hi-IN': `${BASE}/temples/pilgrimage`, 'x-default': `${BASE}/temples/pilgrimage` },
  },
  openGraph: { title: 'Pilgrimage Circuits — Sarvdev', description: 'Explore 15 major Hindu pilgrimage circuits across India.', url: `${BASE}/temples/pilgrimage`, type: 'website', siteName: 'Sarvdev' },
}

const CLUSTERS = [
  { slug: 'jyotirlinga', title: '12 Jyotirlinga', titleHi: '12 ज्योतिर्लिंग', icon: '🕉️', deity: 'Shiva', desc: 'The 12 most sacred Shiva shrines where Lord Shiva appeared as blazing light.' },
  { slug: 'char-dham', title: 'Char Dham', titleHi: 'चार धाम', icon: '🏔️', deity: 'Multi', desc: 'Four sacred abodes — Badrinath, Dwarka, Puri, and Rameshwaram.' },
  { slug: 'shakti-peeth', title: '51 Shakti Peethas', titleHi: '51 शक्ति पीठ', icon: '🔱', deity: 'Durga', desc: 'Sacred Goddess temples where parts of Goddess Sati fell.' },
  { slug: 'chota-char-dham', title: 'Chota Char Dham', titleHi: 'छोटा चार धाम', icon: '⛰️', deity: 'Multi', desc: 'Yamunotri, Gangotri, Kedarnath, Badrinath — Uttarakhand pilgrimage.' },
  { slug: 'panch-kedar', title: 'Panch Kedar', titleHi: 'पंच केदार', icon: '🏔️', deity: 'Shiva', desc: 'Five sacred Shiva temples in the Garhwal Himalayas.' },
  { slug: 'divya-desam', title: '108 Divya Desam', titleHi: '108 दिव्य देसम', icon: '🪷', deity: 'Vishnu', desc: 'Sacred Vishnu temples glorified by the Alwar poet-saints.' },
  { slug: 'ashta-vinayak', title: 'Ashta Vinayak', titleHi: 'अष्ट विनायक', icon: '🐘', deity: 'Ganesha', desc: 'Eight ancient Ganesha temples of Maharashtra.' },
  { slug: 'navagraha', title: 'Navagraha Temples', titleHi: 'नवग्रह मंदिर', icon: '🌟', deity: 'Multi', desc: 'Nine planetary deity shrines in Tamil Nadu.' },
  { slug: 'pancha-bhoota-stalam', title: 'Pancha Bhoota Stalam', titleHi: 'पंच भूत स्थलम', icon: '🔥', deity: 'Shiva', desc: 'Five Shiva temples representing earth, water, fire, air, space.' },
  { slug: 'sapta-puri', title: 'Sapta Puri', titleHi: 'सप्त पुरी', icon: '🏛️', deity: 'Multi', desc: 'Seven holiest cities that grant moksha.' },
  { slug: 'iskcon', title: 'ISKCON Temples', titleHi: 'इस्कॉन मंदिर', icon: '🪷', deity: 'Krishna', desc: 'International Krishna Consciousness temples worldwide.' },
  { slug: 'ramayana-circuit', title: 'Ramayana Circuit', titleHi: 'रामायण सर्किट', icon: '🏹', deity: 'Rama', desc: 'Sacred sites of Lord Ram from Ayodhya to Lanka.' },
  { slug: 'panch-prayag', title: 'Panch Prayag', titleHi: 'पंच प्रयाग', icon: '🌊', deity: 'Multi', desc: 'Five sacred river confluences in Uttarakhand.' },
  { slug: 'arupadai-veedu', title: 'Arupadai Veedu', titleHi: 'अरुपदै वीडू', icon: '🦚', deity: 'Murugan', desc: 'Six abodes of Lord Murugan in Tamil Nadu.' },
  { slug: '108-shiva-temples', title: '108 Shiva Temples', titleHi: '108 शिव मंदिर', icon: '🔱', deity: 'Shiva', desc: 'Sacred shrines of Mahadeva across India.' },
]

export default function PilgrimageIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Pilgrimage Circuits of India',
    description: 'Complete guide to 15 major Hindu pilgrimage circuits across India.',
    url: `${BASE}/temples/pilgrimage`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CLUSTERS.length,
      itemListElement: CLUSTERS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `${BASE}/temples/pilgrimage/${c.slug}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Temples', item: `${BASE}/temples` },
        { '@type': 'ListItem', position: 3, name: 'Pilgrimage Circuits', item: `${BASE}/temples/pilgrimage` },
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
            <Link href="/temples" className="hover:text-primary-600 transition-colors no-underline">Temples</Link>
            <span>/</span>
            <span className="text-ink font-medium">Pilgrimage Circuits</span>
          </nav>
          <h1 className="text-display font-serif text-secondary-800 mb-3">
            Pilgrimage Circuits of India
          </h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Explore <strong className="text-ink">{CLUSTERS.length}</strong> sacred pilgrimage circuits — from the 12 Jyotirlingas to the Ramayana Circuit. Complete guides with temples, significance, and travel directions.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLUSTERS.map((c) => (
            <Link key={c.slug} href={`/temples/pilgrimage/${c.slug}`}
              className="group card p-6 hover:shadow-md transition-all duration-300 no-underline">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-body font-semibold text-ink group-hover:text-primary-700 transition-colors">{c.title}</h2>
                  <p className="text-caption text-ink-muted mt-0.5">{c.titleHi}</p>
                  <p className="text-caption text-ink-faint mt-2 line-clamp-2">{c.desc}</p>
                  <span className="inline-block mt-3 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{c.deity}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/temples" className="btn btn-outline no-underline hover:no-underline">Browse All Temples</Link>
        </div>
      </main>
    </>
  )
}
