import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Daily Darshan - Live Temple Darshan Online | Sarvdev',
  description: 'Watch live and recorded darshan from sacred Hindu temples, daily spiritual routine, mantras, aarti and panchang.',
  keywords: ['daily darshan', 'live darshan', 'temple darshan online', 'virtual darshan', 'Hindu temple live', 'aarti', 'mantra', 'panchang today'],
  alternates: { canonical: 'https://sarvdev.com/daily-darshan' },
  openGraph: {
    title: 'Daily Darshan - Live Temple Darshan Online | Sarvdev',
    description: 'Watch live and recorded darshan from sacred Hindu temples, daily spiritual routine, mantras, aarti and panchang.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function DailyDarshanLayout({ children }: { children: React.ReactNode }) {
  return children
}
