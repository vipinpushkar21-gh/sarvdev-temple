import type { Metadata } from 'next'
import { getEventBySlug, hinduEvents } from '@/data/events'

const BASE = 'https://sarvdev.com'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    return { title: 'Event — Sarvdev', description: 'Discover Hindu festivals and events on Sarvdev.' }
  }

  const title = `${event.title} ${event.year} — ${event.titleHi} | Sarvdev`
  const description = event.description.slice(0, 155)
  const url = `${BASE}/events/${slug}`
  const keywords = [
    event.title,
    event.titleHi,
    event.category,
    event.location,
    event.state,
    `${event.title} ${event.year}`,
    'Hindu festival',
    'Sarvdev',
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Sarvdev',
      ...(event.image && { images: [{ url: event.image, width: 1200, height: 630, alt: event.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(event.image && { images: [event.image] }),
    },
  }
}

export default async function EventSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  const jsonLdArray: object[] = []

  if (event) {
    // Event schema
    jsonLdArray.push({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.description,
      startDate: event.date,
      ...(event.endDate && { endDate: event.endDate }),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: event.location,
        address: {
          '@type': 'PostalAddress',
          addressRegion: event.state,
          addressCountry: 'IN',
        },
      },
      ...(event.image && { image: event.image }),
      organizer: {
        '@type': 'Organization',
        name: 'Sarvdev',
        url: BASE,
      },
    })

    // BreadcrumbList schema
    jsonLdArray.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Events', item: `${BASE}/events` },
        { '@type': 'ListItem', position: 3, name: event.title, item: `${BASE}/events/${slug}` },
      ],
    })

    // FAQPage schema from rituals and significance
    const faqItems = [
      { q: `What is ${event.title}?`, a: event.description },
      { q: `What is the spiritual significance of ${event.title}?`, a: event.significance },
      { q: `When is ${event.title} ${event.year}?`, a: `${event.title} ${event.year} is on ${new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}${event.endDate ? ` to ${new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.` },
      { q: `What are the key rituals of ${event.title}?`, a: event.rituals.join(', ') + '.' },
      { q: `Where is ${event.title} celebrated?`, a: `${event.title} is celebrated in ${event.location}, ${event.state}.` },
    ]

    jsonLdArray.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    // HowTo schema from rituals
    if (event.rituals && event.rituals.length > 0) {
      jsonLdArray.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to celebrate ${event.title}`,
        description: `Step-by-step guide to the rituals and celebrations of ${event.title}.`,
        step: event.rituals.map((ritual: string, idx: number) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: ritual,
          text: ritual,
        })),
      })
    }
  }

  return (
    <>
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {children}
    </>
  )
}
