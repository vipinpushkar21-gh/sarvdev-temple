import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Sarvdev Temple Directory',
  description: 'Get in touch with the Sarvdev team for queries, feedback, temple listing requests, or partnerships.',
  keywords: ['contact Sarvdev', 'list temple', 'temple submission', 'feedback'],
  alternates: { canonical: 'https://sarvdev.com/contact' },
  openGraph: { title: 'Contact Us — Sarvdev', description: 'Get in touch with Sarvdev for queries, feedback or temple submissions.' },
  twitter: { card: 'summary' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
