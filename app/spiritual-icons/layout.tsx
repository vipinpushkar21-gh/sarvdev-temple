import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const BASE = 'https://sarvdev.com'
const OG_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

export const metadata: Metadata = {
  title: 'Spiritual Icons - Katha Vachak, Bhajan Gayak, Pandit & Gurus | Sarvdev',
  description: 'Discover verified Hindu spiritual icons, katha vachaks, bhajan gayaks, pandits, gurus, acharyas, jyotishacharyas, yoga gurus, scholars and kirtan mandalis on Sarvdev.',
  keywords: [
    'Spiritual Icons',
    'Katha Vachak',
    'Bhajan Gayak',
    'Pandit Purohit',
    'Sant Mahatma',
    'Guru Acharya',
    'Jyotishacharya',
    'Yoga Guru',
    'Vedic Scholar',
    'Kirtan Mandali',
    'Dharma Pracharak',
    'Sarvdev',
  ],
  alternates: { canonical: `${BASE}/spiritual-icons` },
  openGraph: {
    title: 'Spiritual Icons on Sarvdev',
    description: 'Explore katha vachaks, devotional singers, pandits, gurus, acharyas, scholars and dharmic leaders.',
    url: `${BASE}/spiritual-icons`,
    type: 'website',
    siteName: 'Sarvdev',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Spiritual Icons on Sarvdev' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spiritual Icons on Sarvdev',
    description: 'Explore verified dharmic leaders, katha vachaks, bhajan gayaks, gurus and scholars.',
    images: [OG_IMAGE],
  },
}

export default function SpiritualIconsLayout({ children }: { children: ReactNode }) {
  return children
}
