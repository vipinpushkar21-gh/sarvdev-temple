import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Devotionals — Sarvdev Temple Directory',
  description: 'Listen to and read Aarti, Bhajan, Chalisa, Mantra, Stotra, and other devotional content in Hindi and English.',
  keywords: ['bhajan', 'aarti', 'chalisa', 'mantra', 'stotra', 'devotional music', 'Hindi prayers', 'Sanskrit hymns', 'Sarvdev'],
  alternates: { canonical: 'https://sarvdev.com/devotionals' },
  openGraph: {
    title: 'Devotionals — Sarvdev',
    description: 'Listen to and read Aarti, Bhajan, Chalisa, Mantra, Stotra, and other devotional content.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function DevotionalsLayout({ children }: { children: React.ReactNode }) {
  return children
}
