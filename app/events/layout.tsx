import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Festivals — Sarvdev Temple Directory',
  description: 'Discover upcoming Hindu festivals, yatras, religious events and cultural celebrations across India.',
  openGraph: {
    title: 'Events & Festivals — Sarvdev',
    description: 'Discover upcoming Hindu festivals, yatras, religious events and cultural celebrations across India.',
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
