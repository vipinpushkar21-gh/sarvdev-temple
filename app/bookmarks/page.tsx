import type { Metadata } from 'next'
import BookmarksClient from './BookmarksClient'

const PAGE_URL = 'https://sarvdev.com/bookmarks'

export const metadata: Metadata = {
  title: 'My Sacred Space',
  description: 'Your locally saved Sarvdev temples, deities, devotionals, Darshan, and events.',
  alternates: {
    canonical: '/bookmarks',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'My Sacred Space',
    description: 'A local collection of saved Sarvdev content on this device.',
    url: PAGE_URL,
    type: 'website',
  },
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
    { '@type': 'ListItem', position: 2, name: 'Bookmarks', item: PAGE_URL },
  ],
}

export default function BookmarksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BookmarksClient />
    </>
  )
}
