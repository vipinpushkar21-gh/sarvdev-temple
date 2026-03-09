import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Darshan — Sarvdev Temple Directory',
  description: 'Watch live and recorded daily darshan from famous Hindu temples across India.',
  openGraph: {
    title: 'Daily Darshan — Sarvdev',
    description: 'Watch live and recorded daily darshan from famous Hindu temples across India.',
  },
}

export default function DailyDarshanLayout({ children }: { children: React.ReactNode }) {
  return children
}
