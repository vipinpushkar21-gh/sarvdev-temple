import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Daily Darshan — Sarvdev Temple Directory',
  description: 'Watch live and recorded daily darshan from famous Hindu temples across India.',
  keywords: ['daily darshan', 'live darshan', 'temple darshan online', 'virtual darshan', 'Hindu temple live'],
  alternates: { canonical: 'https://sarvdev.com/daily-darshan' },
  openGraph: {
    title: 'Daily Darshan — Sarvdev',
    description: 'Watch live and recorded daily darshan from famous Hindu temples across India.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function DailyDarshanLayout({ children }: { children: React.ReactNode }) {
  return children
}
