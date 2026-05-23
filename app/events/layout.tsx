import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Hindu Events, Festivals & Temple Calendar | Sarvdev',
  description: 'Discover Hindu festivals, temple events, yatras, vrats, online pravachans and spiritual gatherings across India on Sarvdev.',
  keywords: ['Hindu festivals', 'temple events', 'religious events India', 'yatra', 'vrat', 'festival calendar', 'Navratri', 'Diwali', 'Mahashivratri'],
  alternates: { canonical: 'https://sarvdev.com/events' },
  openGraph: {
    title: 'Hindu Events & Festivals - Sarvdev',
    description: 'A premium Hindu festival calendar and temple events hub across India.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://sarvdev.com/events' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {children}
    </>
  )
}
