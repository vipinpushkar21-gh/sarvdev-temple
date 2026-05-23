import type { Metadata } from 'next'

const BASE = 'https://sarvdev.com'
const OG = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export const metadata: Metadata = {
  title: 'Sarvdev Blog - Hindu Dharma, Temples, Rituals and Spiritual Guides',
  description: 'Read Sarvdev spiritual articles on Hindu dharma, temples, darshan, aarti, panchang, pilgrimage, festivals, mantras and devotional living.',
  keywords: ['Hindu dharma blog', 'temple guides', 'spiritual articles', 'Sanatan Dharma', 'aarti', 'panchang', 'pilgrimage', 'Sarvdev blog'],
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'Sarvdev Blog - Spiritual Knowledge and Temple Guides',
    description: 'A premium Hindu dharma learning hub for temple travel, worship, festivals, rituals and daily devotion.',
    url: `${BASE}/blog`,
    siteName: 'Sarvdev',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Sarvdev Blog', description: 'Spiritual knowledge, temple guides and devotional learning.', images: [OG] },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
