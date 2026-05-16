"use client"

import Link from 'next/link'

const regions = [
  { slug: 'north-india', title: 'North India', subtitle: 'Varanasi, Haridwar, Kedarnath', emoji: '🏔️', gradient: 'from-sky-500/90 to-indigo-600/90' },
  { slug: 'south-india', title: 'South India', subtitle: 'Meenakshi, Tirupati, Rameshwaram', emoji: '🛕', gradient: 'from-emerald-500/90 to-teal-600/90' },
  { slug: 'west-india', title: 'West India', subtitle: 'Somnath, Siddhivinayak, Shirdi', emoji: '🌅', gradient: 'from-orange-500/90 to-amber-600/90' },
  { slug: 'east-india', title: 'East India', subtitle: 'Jagannath, Kamakhya, Bodh Gaya', emoji: '🪷', gradient: 'from-rose-500/90 to-pink-600/90' },
]

export default function RegionalExplorer() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="text-h2 font-serif text-secondary-800">Explore by Region</h2>
          <p className="text-body-sm text-ink-muted mt-2">Discover temples across India&apos;s sacred geography</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {regions.map((r) => (
            <Link
              key={r.slug}
              href={`/temples/region/${r.slug}`}
              className="group relative overflow-hidden rounded-2xl h-44 md:h-56 no-underline hover:no-underline"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} transition-all duration-500 group-hover:scale-105`} />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E')]" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white z-10">
                <span className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {r.emoji}
                </span>
                <h3 className="text-body font-bold">{r.title}</h3>
                <p className="text-caption text-white/70 mt-1">{r.subtitle}</p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
