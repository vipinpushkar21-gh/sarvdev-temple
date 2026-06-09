import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search — Sarvdev',
  description: 'Search temples, deities, devotionals, blogs and events on Sarvdev.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://sarvdev.com/temples' },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
