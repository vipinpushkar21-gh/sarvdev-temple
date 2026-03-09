import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Temples — Sarvdev Temple Directory',
  description: 'Explore thousands of Hindu temples across India and the world. Find temple timings, location, deity information and more.',
  openGraph: {
    title: 'Temples — Sarvdev Temple Directory',
    description: 'Explore thousands of Hindu temples across India and the world.',
  },
}

export default function TemplesLayout({ children }: { children: React.ReactNode }) {
  return children
}
