import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Sarvdev Temple Directory',
  description: 'Get in touch with the Sarvdev team for queries, feedback, temple listing requests, or partnerships.',
  openGraph: {
    title: 'Contact Us — Sarvdev',
    description: 'Get in touch with the Sarvdev team for queries, feedback, or temple listing requests.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
