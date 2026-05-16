"use client"

import Link from 'next/link'

const stories = [
  { slug: 'top-shiva-temples-in-india', title: 'Top Shiva Temples', emoji: '🔱', color: 'from-indigo-100 to-purple-100' },
  { slug: 'best-krishna-temples-in-india', title: 'Krishna Temples', emoji: '🪈', color: 'from-blue-100 to-cyan-100' },
  { slug: 'most-powerful-hanuman-temples', title: 'Hanuman Temples', emoji: '🐒', color: 'from-orange-100 to-amber-100' },
  { slug: 'jyotirlinga-temples', title: '12 Jyotirlinga', emoji: '✨', color: 'from-yellow-100 to-amber-100' },
  { slug: 'shakti-peeth-temples', title: 'Shakti Peethas', emoji: '🙏', color: 'from-pink-100 to-rose-100' },
  { slug: 'ancient-temples-of-south-india', title: 'South India', emoji: '🛕', color: 'from-emerald-100 to-teal-100' },
  { slug: 'temples-in-rajasthan', title: 'Rajasthan', emoji: '🏜️', color: 'from-amber-100 to-yellow-100' },
  { slug: 'holy-temples-of-varanasi', title: 'Varanasi', emoji: '🕉️', color: 'from-orange-100 to-red-100' },
]

export default function StoriesTeaser() {
  return (
    <section className="py-14 md:py-18 bg-gradient-to-b from-surface to-surface-sunken/50">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h2 font-serif text-secondary-800">Sacred Stories</h2>
            <p className="text-body-sm text-ink-muted mt-1">Curated temple collections by theme</p>
          </div>
          <Link href="/stories" className="btn btn-outline btn-sm no-underline hover:no-underline">
            All Stories
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible">
          {stories.map((s) => (
            <Link
              key={s.slug}
              href={`/stories/${s.slug}`}
              className="group flex-shrink-0 w-28 md:w-auto flex flex-col items-center gap-2 p-4 rounded-2xl border border-surface-border bg-surface-raised hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 no-underline hover:no-underline"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                {s.emoji}
              </div>
              <span className="text-caption font-semibold text-ink text-center leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors">
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
