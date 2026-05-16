"use client"

import Link from 'next/link'

const deities = [
  { name: 'Lord Shiva', slug: 'shiva', emoji: '🔱', color: 'from-indigo-500/90 to-purple-600/90', desc: 'Mahadev, the supreme destroyer' },
  { name: 'Lord Krishna', slug: 'krishna', emoji: '🪈', color: 'from-blue-500/90 to-cyan-600/90', desc: 'The divine lover & protector' },
  { name: 'Lord Ram', slug: 'ram', emoji: '🏹', color: 'from-sky-500/90 to-blue-600/90', desc: 'Maryada Purushottam' },
  { name: 'Hanuman Ji', slug: 'hanuman', emoji: '🐒', color: 'from-orange-500/90 to-red-600/90', desc: 'Sankat Mochan, the mighty' },
  { name: 'Lord Ganesh', slug: 'ganesh', emoji: '🙏', color: 'from-amber-500/90 to-orange-600/90', desc: 'Vighnaharta, remover of obstacles' },
  { name: 'Maa Durga', slug: 'durga', emoji: '🪷', color: 'from-rose-500/90 to-pink-600/90', desc: 'Shakti, the divine mother' },
  { name: 'Lord Vishnu', slug: 'vishnu', emoji: '🔵', color: 'from-emerald-500/90 to-teal-600/90', desc: 'The preserver of the universe' },
  { name: 'Maa Lakshmi', slug: 'lakshmi', emoji: '✨', color: 'from-yellow-500/90 to-amber-600/90', desc: 'Goddess of wealth & prosperity' },
]

export default function DeityExplorer() {
  return (
    <section className="py-16 md:py-24 bg-divine-gradient bg-sacred-pattern relative overflow-hidden">
      <div className="page-container relative z-10">
        {/* Section title */}
        <div className="text-center mb-12">
          <span className="font-cinzel text-overline uppercase tracking-[0.2em] text-temple-gold-DEFAULT">
            Sacred Deities
          </span>
          <h2 className="text-h1 md:text-display font-display text-secondary-800 mt-2">
            Explore by Deity
          </h2>
          <p className="text-body text-ink-muted mt-3 max-w-lg mx-auto">
            Discover temples, devotionals, and sacred traditions dedicated to the divine
          </p>
        </div>

        {/* Deity grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {deities.map((d) => (
            <Link
              key={d.slug}
              href={`/temples/deity/${d.slug}`}
              className="group card-divine p-5 md:p-6 flex flex-col items-center text-center no-underline hover:no-underline"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${d.color} flex items-center justify-center text-2xl md:text-3xl shadow-divine group-hover:scale-110 group-hover:shadow-divine-lg transition-all duration-500`}>
                {d.emoji}
              </div>
              <h3 className="text-body font-semibold text-secondary-700 mt-3 group-hover:text-primary-700 transition-colors">
                {d.name}
              </h3>
              <p className="text-caption text-ink-muted mt-1 line-clamp-1">{d.desc}</p>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link href="/deities" className="btn-divine no-underline hover:no-underline">
            View All Deities
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
