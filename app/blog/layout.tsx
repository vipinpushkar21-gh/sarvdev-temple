import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Blog — Sarvdev Temple Directory',
  description: 'Read articles about Hindu temples, spiritual traditions, festivals, and devotional practices on Sarvdev blog.',
  keywords: ['Hindu temple blog', 'spirituality articles', 'festival guide', 'temple stories', 'devotional', 'Sarvdev blog'],
  alternates: { canonical: 'https://sarvdev.com/blog' },
  openGraph: {
    title: 'Blog — Sarvdev Temple Directory',
    description: 'Read articles about Hindu temples, spiritual traditions, festivals, and devotional practices.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
