"use client"

import { useEffect, useState } from 'react'

type OmParticle = {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export default function FloatingOm({ count = 6 }: { count?: number }) {
  const [particles, setParticles] = useState<OmParticle[]>([])

  useEffect(() => {
    const items: OmParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 16 + Math.random() * 22,
      delay: Math.random() * 8,
      duration: 9 + Math.random() * 8,
      opacity: 0.12 + Math.random() * 0.18,
    }))
    setParticles(items)
  }, [count])

  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className="om-float select-none"
          aria-hidden="true"
          style={{
            left: `${p.x}%`,
            bottom: '0',
            fontSize: `${p.size}px`,
            opacity: 0,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            maxOpacity: p.opacity,
          } as React.CSSProperties}
        >
          ॐ
        </span>
      ))}
    </>
  )
}
