"use client"

import Link from 'next/link'

const circuits = [
  { slug: 'char-dham', title: 'Char Dham Yatra', emoji: '🏔️', desc: 'Badrinath, Kedarnath, Gangotri, Yamunotri', color: 'from-blue-50 to-cyan-50' },
  { slug: 'jyotirlinga', title: '12 Jyotirlinga', emoji: '🔱', desc: 'Most sacred Shiva temples across India', color: 'from-purple-50 to-indigo-50' },
  { slug: 'shakti-peeth', title: 'Shakti Peeth', emoji: '🙏', desc: '51 sacred Goddess temples', color: 'from-pink-50 to-rose-50' },
  { slug: 'divya-desam', title: 'Divya Desam', emoji: '🪷', desc: '108 Vishnu temples of Tamil hymns', color: 'from-amber-50 to-yellow-50' },
  { slug: 'iskcon', title: 'ISKCON Temples', emoji: '🙏', desc: 'Hare Krishna temples worldwide', color: 'from-orange-50 to-amber-50' },
  { slug: 'panch-kedar', title: 'Panch Kedar', emoji: '⛰️', desc: 'Five sacred Shiva shrines in Uttarakhand', color: 'from-emerald-50 to-green-50' },
]

export default function PilgrimageCircuits() {
  return (
    <section className="section-mesh py-16 md:py-20">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-h2 font-serif text-secondary-800">Pilgrimage Circuits</h2>
            <p className="text-body-sm text-ink-muted mt-1">Sacred journeys across India</p>
          </div>
          <Link href="/temples/pilgrimage" className="btn btn-outline btn-sm no-underline hover:no-underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {circuits.map((c) => (
            <Link
              key={c.slug}
              href={`/temples/pilgrimage/${c.slug}`}
              className="group card-interactive p-5 text-center no-underline hover:no-underline"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {c.emoji}
              </div>
              <h3 className="text-body-sm font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{c.title}</h3>
              <p className="text-caption text-ink-muted mt-1 line-clamp-2">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
