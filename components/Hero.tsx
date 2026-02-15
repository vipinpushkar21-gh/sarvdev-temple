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
    <div className={`page-header ${className}`}>
      <div className="page-header-inner">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default Hero
