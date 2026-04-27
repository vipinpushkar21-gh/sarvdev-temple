import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Temples — Sarvdev Temple Directory',
  description: 'Explore thousands of Hindu temples across India and the world. Find temple timings, location, deity information and more.',
  keywords: ['Hindu temples', 'mandir', 'temple directory India', 'Char Dham', 'Jyotirlinga', 'Shakti Peeth', 'temple timings', 'darshan'],
  alternates: { canonical: 'https://sarvdev.com/temples' },
  openGraph: {
    title: 'Temples — Sarvdev Temple Directory',
    description: 'Explore thousands of Hindu temples across India and the world.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function TemplesLayout({ children }: { children: React.ReactNode }) {
  return children
}
