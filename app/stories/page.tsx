import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sacred Stories — Sarvdev Temple Directory',
  description: 'Explore curated collections of Hindu temples across India. Top Shiva temples, best Krishna temples, ancient South Indian temples, and more.',
  alternates: { canonical: 'https://sarvdev.com/stories' },
  openGraph: {
    title: 'Sacred Stories — Sarvdev',
    description: 'Curated collections of Hindu temples across India.',
  },
}

const STORIES = [
  { slug: 'top-shiva-temples-in-india', title: 'Top Shiva Temples in India', desc: 'The most sacred Lord Shiva temples across India' },
  { slug: 'best-krishna-temples-in-india', title: 'Best Krishna Temples in India', desc: 'The most revered Lord Krishna temples' },
  { slug: 'most-powerful-hanuman-temples', title: 'Most Powerful Hanuman Temples', desc: 'Bajrangbali shrines known for spiritual energy' },
  { slug: 'famous-durga-devi-temples', title: 'Famous Durga & Devi Temples', desc: 'Shakti Peeth and Durga temples across India' },
  { slug: 'ancient-temples-of-south-india', title: 'Ancient Temples of South India', desc: 'Dravidian masterpieces and heritage sites' },
  { slug: 'sacred-temples-of-uttarakhand', title: 'Sacred Temples of Uttarakhand', desc: 'Dev Bhoomi temples in the Himalayas' },
  { slug: 'holy-temples-of-varanasi', title: 'Holy Temples of Varanasi', desc: 'Ancient temples of Kashi, the spiritual capital' },
  { slug: 'ganesh-temples-in-india', title: 'Ganesh Temples in India', desc: 'Temples dedicated to Lord Ganesha' },
  { slug: 'ram-temples-in-india', title: 'Ram Temples in India', desc: 'Sacred Lord Ram temples from Ayodhya and beyond' },
  { slug: 'jyotirlinga-temples', title: '12 Jyotirlinga Temples', desc: 'The most sacred Shiva shrines in India' },
  { slug: 'iskcon-temples-in-india', title: 'ISKCON Temples in India', desc: 'Hare Krishna temples across India' },
  { slug: 'shakti-peeth-temples', title: '52 Shakti Peethas', desc: 'Sacred Goddess temples across India' },
  { slug: 'temples-in-rajasthan', title: 'Temples in Rajasthan', desc: 'Grand temples of the desert state' },
  { slug: 'temples-in-maharashtra', title: 'Temples of Maharashtra', desc: 'Ashtavinayak, Shirdi, and more' },
  { slug: 'temples-near-rivers', title: 'Temples on Sacred Rivers', desc: 'Ganga, Yamuna, Narmada, Godavari' },
]

export default function StoriesIndexPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-display font-serif text-secondary-800 mb-3">Sacred Stories</h1>
          <p className="text-body text-ink-muted max-w-2xl">
            Curated collections of Hindu temples across India. Explore by deity, region, or sacred tradition.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map(story => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group card p-6 hover:shadow-md transition-all duration-300 no-underline"
            >
              <h2 className="text-h4 font-serif text-secondary-800 group-hover:text-primary-700 transition-colors mb-2">
                {story.title}
              </h2>
              <p className="text-body-sm text-ink-muted">{story.desc}</p>
              <span className="mt-4 inline-block text-caption text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                Explore Collection →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
