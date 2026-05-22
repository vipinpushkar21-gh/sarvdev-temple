import type { Metadata } from 'next'

const OG_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg'

export const metadata: Metadata = {
  title: 'Hindu Deities - Devi Devta Encyclopedia | Sarvdev',
  description: 'Explore Hindu deities, 33 Koti Devta categories, mantras, attributes, stories, related temples and devotionals on Sarvdev.',
  alternates: { canonical: 'https://sarvdev.com/deities' },
  openGraph: {
    title: 'Hindu Deities - Devi Devta Encyclopedia | Sarvdev',
    description: 'Explore Hindu deities, sacred categories, mantras, related temples and devotionals.',
    url: 'https://sarvdev.com/deities',
    siteName: 'Sarvdev',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Hindu Deities on Sarvdev' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hindu Deities - Devi Devta Encyclopedia | Sarvdev',
    description: 'Explore Hindu deities, sacred categories, mantras, related temples and devotionals.',
    images: [OG_IMAGE],
  },
}

export default function DeitiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
