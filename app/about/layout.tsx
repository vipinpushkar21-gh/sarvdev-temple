import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Sarvdev Temple Directory',
  description: 'Learn about Sarvdev — a temple directory and devotional hub connecting worshippers with temples and spiritual traditions worldwide.',
  openGraph: {
    title: 'About — Sarvdev',
    description: 'Learn about Sarvdev — a temple directory and devotional hub connecting worshippers with temples worldwide.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
