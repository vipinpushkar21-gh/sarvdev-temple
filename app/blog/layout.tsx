import type { Metadata } from 'next'

const BASE = 'https://sarvdev.com'

export const metadata: Metadata = {
  title: 'Sacred Stories | Sarvdev',
  description: 'Editorial stories connecting temples, deities, pilgrimage, traditions, festivals and devotion.',
  keywords: ['Hindu dharma blog', 'temple guides', 'spiritual articles', 'Sanatan Dharma', 'aarti', 'panchang', 'pilgrimage', 'Sarvdev blog'],
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'Sacred Stories | Sarvdev',
    description: 'Editorial stories from Sarvdev.',
    url: `${BASE}/blog`,
    siteName: 'Sarvdev',
  },
  twitter: { card: 'summary', title: 'Sacred Stories | Sarvdev', description: 'Editorial stories from Sarvdev.' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
