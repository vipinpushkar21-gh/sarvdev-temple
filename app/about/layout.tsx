import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'About — Sarvdev Temple Directory',
  description: 'Learn about Sarvdev — a temple directory and devotional hub connecting worshippers with temples and spiritual traditions worldwide.',
  keywords: ['about Sarvdev', 'Hindu temple directory', 'spiritual platform India', 'temple app'],
  alternates: { canonical: 'https://sarvdev.com/about' },
  openGraph: {
    title: 'About — Sarvdev',
    description: 'Learn about Sarvdev — a temple directory and devotional hub connecting worshippers with temples worldwide.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
