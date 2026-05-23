import type { Metadata } from 'next'
import ListTempleClient from './ListTempleClient'

const PAGE_URL = 'https://sarvdev.com/list-temple'

const faqs = [
  {
    question: 'Is listing a temple on Sarvdev free?',
    answer: 'Yes. Public temple submissions are free and reviewed before publication.',
  },
  {
    question: 'How long does temple review take?',
    answer: 'Most submissions are reviewed within 2 to 3 business days when the required information is complete.',
  },
  {
    question: 'Can I submit a temple if I am not part of the temple committee?',
    answer: 'Yes. Devotees can submit public information, but Sarvdev may contact the temple or submitter for verification.',
  },
  {
    question: 'What happens after I submit the form?',
    answer: 'The temple enters the admin review queue with pending status. It is published only after verification.',
  },
]

export const metadata: Metadata = {
  title: 'Submit Your Temple to Sarvdev',
  description: 'List a temple on Sarvdev for free. Share temple details, location, darshan timings, festivals, images, and contact information for review before publication.',
  alternates: {
    canonical: '/list-temple',
  },
  openGraph: {
    title: 'Submit Your Temple to Sarvdev',
    description: 'Help devotees discover temples by submitting verified temple details for Sarvdev review.',
    url: PAGE_URL,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Submit your temple to Sarvdev' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Your Temple to Sarvdev',
    description: 'Share temple details with Sarvdev for review and publication.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarvdev.com' },
      { '@type': 'ListItem', position: 2, name: 'List Temple', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
]

export default function ListTemplePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ListTempleClient faqs={faqs} />
    </>
  )
}
