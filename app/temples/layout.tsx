import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Temples of India | Sacred Hindu Temple Directory | Sarvdev',
  description: 'Explore sacred temples, Jyotirlingas, Shakti Peethas, Char Dham, Divya Desam, Ashta Vinayak and spiritual pilgrimage places across India.',
  keywords: ['Hindu temples', 'mandir', 'temple directory India', 'Char Dham', 'Jyotirlinga', 'Shakti Peeth', 'Divya Desam', 'Ashta Vinayak', 'temple timings', 'darshan', 'pilgrimage'],
  alternates: { canonical: 'https://sarvdev.com/temples' },
  openGraph: {
    title: 'Temples of India | Sacred Hindu Temple Directory | Sarvdev',
    description: 'Explore sacred temples, Jyotirlingas, Shakti Peethas, Char Dham, Divya Desam, Ashta Vinayak and spiritual pilgrimage places across India.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function TemplesLayout({ children }: { children: React.ReactNode }) {
  return children
}
