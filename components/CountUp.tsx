"use client"

import { useEffect, useRef, useState } from 'react'

type Props = {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function CountUp({ target, duration = 1800, suffix = '', prefix = '', className = '' }: Props) {
  const [value, setValue] = useState(0)
  const [pulsing, setPulsing] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          observer.unobserve(el)

          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
            else {
              setValue(target)
              setPulsing(true)
              setTimeout(() => setPulsing(false), 350)
            }
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span
      ref={ref}
      className={`${className} ${pulsing ? 'count-pulse' : ''} inline-block tabular-nums`}
    >
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </span>
  )
}
