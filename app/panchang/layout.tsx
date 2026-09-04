import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Panchang | Sarvdev',
  description: 'Explore Panchang information by date and supported Indian locations when verified calculations are available.',
  keywords: ['panchang', 'Hindu calendar', 'tithi', 'nakshatra'],
  alternates: { canonical: 'https://sarvdev.com/panchang' },
  openGraph: {
    title: 'Panchang | Sarvdev',
    description: 'Panchang information by date and supported Indian locations.',
    images: [{ url: OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [OG] },
}

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'Panchang', item: 'https://sarvdev.com/panchang' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  )
}
