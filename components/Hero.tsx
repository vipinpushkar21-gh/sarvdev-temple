import React from 'react'

export type HeroProps = {
  title: string
  subtitle?: React.ReactNode
  overline?: string
  className?: string
}

/**
 * PageHeader — premium sacred hero with dark bg, Cinzel overline, Playfair title.
 */
export function Hero({ title, subtitle, overline, className = '' }: HeroProps) {
  return (
    <div className={`sacred-hero relative ${className}`}>
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-primary/[0.06] rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] left-[15%] w-48 h-48 bg-accent/[0.05] rounded-full blur-[60px]" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      </div>
      <div className="sacred-hero-content page-container py-14 md:py-20">
        {overline && (
          <div className="flex items-center gap-3 mb-4">
            <span className="font-cinzel text-overline uppercase tracking-[0.2em] text-temple-gold-light">
              {overline}
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-temple-gold-DEFAULT/40 to-transparent max-w-[80px]" />
          </div>
        )}
        <h1 className="text-display-lg font-display text-white leading-tight text-shadow-divine">{title}</h1>
        {subtitle ? <p className="mt-3 text-body text-sandstone-300 max-w-2xl">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default Hero
