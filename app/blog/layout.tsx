import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Sarvdev Temple Directory',
  description: 'Read articles about Hindu temples, spiritual traditions, festivals, and devotional practices on Sarvdev blog.',
  openGraph: {
    title: 'Blog — Sarvdev Temple Directory',
    description: 'Read articles about Hindu temples, spiritual traditions, festivals, and devotional practices.',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
