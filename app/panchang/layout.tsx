import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Panchang — Sarvdev Temple Directory',
  description: 'Check today\'s Hindu Panchang — Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset for any Indian city.',
  openGraph: {
    title: 'Daily Panchang — Sarvdev',
    description: 'Check today\'s Hindu Panchang — Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset.',
  },
}

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  return children
}
