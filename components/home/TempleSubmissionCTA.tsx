"use client"

import Link from 'next/link'

export default function TempleSubmissionCTA() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-container">
        <div className="sacred-hero rounded-3xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] right-[15%] w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-[15%] left-[10%] w-40 h-40 bg-temple-gold-DEFAULT/10 rounded-full blur-[60px]" />
          </div>

          <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Icon */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-4xl md:text-5xl flex-shrink-0 sacred-glow">
              🛕
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <span className="font-cinzel text-overline uppercase tracking-[0.15em] text-temple-gold-light">
                Contribute to Sarvdev
              </span>
              <h2 className="text-h1 font-display text-white mt-2 text-shadow-sm">
                Know a Temple Not Listed?
              </h2>
              <p className="text-body text-sandstone-300 mt-2 max-w-xl">
                Help us build India&apos;s most comprehensive temple directory. Submit temple details and help devotees discover sacred places.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/list-temple" className="btn-divine no-underline hover:no-underline text-center">
                Submit a Temple
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </Link>
              <span className="text-caption text-sandstone-400 text-center">Free &bull; Takes 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
