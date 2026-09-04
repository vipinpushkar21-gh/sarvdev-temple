import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const BASE = 'https://sarvdev.com'

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
  },
  twitter: {
    card: 'summary',
    title: 'Spiritual Icons on Sarvdev',
    description: 'Explore verified dharmic leaders, katha vachaks, bhajan gayaks, gurus and scholars.',
  },
}

export default function SpiritualIconsLayout({ children }: { children: ReactNode }) {
  return children
}
