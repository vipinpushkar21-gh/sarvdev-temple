import type { Metadata } from 'next'

const OG = 'https://sarvdev.com/opengraph-image'

export const metadata: Metadata = {
  title: 'Daily Panchang Today - Tithi, Nakshatra, Muhurta by City | Sarvdev',
  description: 'View today\'s Panchang dashboard for Indian cities with sunrise, sunset, moonrise, tithi, nakshatra, yoga, karana, Rahu Kaal and Abhijit Muhurta demo fallback.',
  keywords: ['panchang today', 'Hindu panchang', 'tithi', 'nakshatra', 'yoga', 'karana', 'sunrise sunset', 'rahu kaal', 'abhijit muhurta', 'muhurta'],
  alternates: { canonical: 'https://sarvdev.com/panchang' },
  openGraph: {
    title: 'Daily Panchang Today - Sarvdev',
    description: 'A sacred daily Panchang dashboard with city search, tithi, nakshatra, muhurta, sunrise and moon timings.',
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
