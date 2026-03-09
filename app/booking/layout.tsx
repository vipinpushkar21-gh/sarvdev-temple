import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online Booking — Sarvdev Temple Directory',
  description: 'Reserve pooja and darshan slots at temples across India. Book online for a hassle-free spiritual experience.',
  openGraph: {
    title: 'Online Booking — Sarvdev',
    description: 'Reserve pooja and darshan slots at temples across India.',
  },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children
}
