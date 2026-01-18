import React from 'react'

export type HeroProps = {
  title: string
  subtitle?: React.ReactNode
  className?: string
}

export function Hero({ title, subtitle, className = '' }: HeroProps) {
  return (
    <section className={`relative overflow-hidden bg-background ${className}`}>
      <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
      <div className="container mx-auto px-4 py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-playfair text-5xl md:text-7xl font-extrabold text-primary leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 text-lg md:text-xl text-text max-w-2xl mx-auto drop-shadow-sm font-medium">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Hero
