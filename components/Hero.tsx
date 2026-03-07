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
    <div className={`relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/15 border-b border-surface-border ${className}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-[20%] w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-36 h-36 bg-accent/[0.04] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-[0.02]" />
      </div>
      <div className="page-container py-12 md:py-16 relative z-10">
        <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">{title}</h1>
        {subtitle ? <p className="mt-3 text-body text-ink-muted max-w-2xl">{subtitle}</p> : null}
        <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </div>
  )
}

export default Hero
