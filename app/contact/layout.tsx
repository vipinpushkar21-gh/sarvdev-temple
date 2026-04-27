import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Contact Us — Sarvdev Temple Directory',
  description: 'Get in touch with the Sarvdev team for queries, feedback, temple listing requests, or partnerships.',
  keywords: ['contact Sarvdev', 'list temple', 'temple submission', 'feedback'],
  alternates: { canonical: 'https://sarvdev.com/contact' },
  openGraph: {
    title: 'Contact Us — Sarvdev',
    description: 'Get in touch with the Sarvdev team for queries, feedback, or temple listing requests.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
