import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Sarvdev',
  description: 'Learn about Sarvdev’s growing temple directory and devotional resources.',
  keywords: ['about Sarvdev', 'Hindu temple directory', 'spiritual platform India', 'temple app'],
  alternates: { canonical: 'https://sarvdev.com/about' },
  openGraph: { title: 'About — Sarvdev', description: 'Learn about Sarvdev’s growing temple directory and devotional resources.' },
  twitter: { card: 'summary' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
