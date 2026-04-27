import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Daily Panchang — Sarvdev Temple Directory',
  description: 'Check today\'s Hindu Panchang — Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset for any Indian city.',
  keywords: ['panchang today', 'Hindu panchang', 'tithi', 'nakshatra', 'yoga', 'karana', 'sunrise sunset', 'auspicious time', 'muhurta', 'rashifal'],
  alternates: { canonical: 'https://sarvdev.com/panchang' },
  openGraph: {
    title: 'Daily Panchang — Sarvdev',
    description: 'Check today\'s Hindu Panchang — Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  return children
}
