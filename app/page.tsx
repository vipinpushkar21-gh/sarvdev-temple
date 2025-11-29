import React from 'react'
import SmartSearch from '../components/SmartSearch'

const navItems = [
  'Home',
  'Temples',
  'Daily Darshan',
  'Upcoming Events',
  'Online Booking',
  'Devotionals',
  'Blog',
  'List Temple',
  'Donation',
  'Login',
]

export default function Page() {
  return (
    <div suppressHydrationWarning>
      <section className="hero-bg relative overflow-hidden">`
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 to-amber-50/60 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-orange-800 leading-tight drop-shadow-sm fade-in">Discover temples. Deepen devotion.</h1>
              <p className="mt-6 text-lg text-slate-700 max-w-2xl">Sarvdev connects seekers with temples, live darshan, and devotional resources — thoughtfully curated and accessible.</p>

              <div className="mt-8 relative">
                <div className="absolute left-0 right-0 mx-auto w-full max-w-2xl search-float">
                  <SmartSearch />
                </div>
              </div>

              <div className="mt-32 flex gap-4">
                <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white shadow hover:scale-105 transition-transform">📅 Upcoming Events</a>
                <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/80 shadow hover:scale-105 transition-transform">✨ Virtual Darshan</a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden shadow-xl transform hover:scale-102 transition-transform float-anim">
                <div className="w-full h-64 md:h-80 bg-cover bg-center" style={{backgroundImage: "linear-gradient(180deg, rgba(2,6,23,0.04), rgba(2,6,23,0.02)), url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1400&q=60')"}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <h2 className="font-playfair text-3xl mb-6">Explore features</h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Temples Near You', desc: 'Find nearby temples and their timings.' },
            { title: 'Live Darshan', desc: 'Watch live rituals and ceremonies.' },
            { title: 'Book Online', desc: 'Reserve slots for darshan or rituals.' },
            { title: 'Community', desc: 'Join groups and devotional communities.' },
          ].map((card) => (
            <article key={card.title} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              <a href="#" className="mt-4 inline-block text-orange-600 font-medium">Explore →</a>
            </article>
          ))}
        </section>
      </main>

      <footer className="bg-orange-900 text-orange-100 mt-12">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-semibold text-white">Sarvdev</h4>
            <p className="mt-3 text-gray-200">A temple directory and devotional hub connecting worshippers with temples, events, and online darshan experiences.</p>

            <div className="mt-4 flex space-x-3">
              <a href="#" aria-label="Instagram" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">📷</a>
              <a href="#" aria-label="YouTube" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">📺</a>
              <a href="#" aria-label="X" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded">🐦</a>
            </div>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-white">Quick Links</h5>
            <ul className="mt-4 space-y-2 text-gray-200">
              <li><a href="#" className="hover:underline">🏛️ Temples</a></li>
              <li><a href="#" className="hover:underline">🙏 Devotionals</a></li>
              <li><a href="#" className="hover:underline">🎉 Festivals</a></li>
              <li><a href="#" className="hover:underline">✨ Virtual Darshan</a></li>
              <li><a href="#" className="hover:underline">➕ List Your Temple</a></li>
              <li><a href="#" className="hover:underline">📅 Online Booking</a></li>
              <li><a href="#" className="hover:underline">💝 Donations</a></li>
              <li><a href="#" className="hover:underline">🕉️ Poojas</a></li>
              <li><a href="#" className="hover:underline">📧 Contact Us</a></li>
              <li><a href="#" className="hover:underline">❓ Help Center</a></li>
              <li><a href="#" className="hover:underline">🔒 Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">📜 Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-white">About the Directory</h5>
            <p className="mt-3 text-gray-200">Search and discover temples across regions, read about traditions, and find ways to participate in rituals and events. Sarvdev aims to make spiritual resources accessible to everyone.</p>

            <div className="mt-6 text-gray-200">
              <blockquote className="italic">"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</blockquote>
              <p className="mt-2">May all be happy, may all be free from disease — a traditional Sanskrit benediction for universal well-being.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-4 text-sm text-gray-300">© {new Date().getFullYear()} Sarvdev. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
