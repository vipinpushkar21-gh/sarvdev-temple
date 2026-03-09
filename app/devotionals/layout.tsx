import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devotionals — Sarvdev Temple Directory',
  description: 'Listen to and read Aarti, Bhajan, Chalisa, Mantra, Stotra, and other devotional content in Hindi and English.',
  openGraph: {
    title: 'Devotionals — Sarvdev',
    description: 'Listen to and read Aarti, Bhajan, Chalisa, Mantra, Stotra, and other devotional content.',
  },
}

export default function DevotionalsLayout({ children }: { children: React.ReactNode }) {
  return children
}
