import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Events & Festivals — Sarvdev Temple Directory',
  description: 'Discover upcoming Hindu festivals, yatras, religious events and cultural celebrations across India.',
  keywords: ['Hindu festivals', 'religious events India', 'yatra', 'temple festival', 'puja', 'festival calendar 2025', 'Navratri', 'Diwali', 'Mahashivratri'],
  alternates: { canonical: 'https://sarvdev.com/events' },
  openGraph: {
    title: 'Events & Festivals — Sarvdev',
    description: 'Discover upcoming Hindu festivals, yatras, religious events and cultural celebrations across India.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
