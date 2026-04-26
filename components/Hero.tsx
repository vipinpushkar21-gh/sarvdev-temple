import React from 'react'

export type HeroProps = {
  title: string
  subtitle?: React.ReactNode
  className?: string
}

/**
 * PageHeader — a clean, typographic page header.
 * Uses `surface-sunken` background with a bottom border.
 * No gradients, no shadows, no decorative overlays.
 */
export function Hero({ title, subtitle, className = '' }: HeroProps) {
  return (
    <div className={`relative overflow-hidden border-b border-surface-border ${className}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dc2qg7bwr/image/upload/v1774363519/hero-bg.jpg.jpg')` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Warm saffron tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-transparent to-primary/20" />
      <div className="page-container py-12 md:py-16 relative z-10">
        <h1 className="text-display-lg font-serif text-white leading-tight">{title}</h1>
        {subtitle ? <p className="mt-3 text-body text-white/75 max-w-2xl">{subtitle}</p> : null}
        <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </div>
  )
}

export default Hero
