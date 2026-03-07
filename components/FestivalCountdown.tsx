"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import { hinduEvents } from '../data/events'

/** Return the next upcoming festival from the static events list. */
function getNextFestival() {
  const now = new Date()
  const upcoming = hinduEvents
    .filter(e => e.category === 'festival' && new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] ?? null
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function FestivalCountdown() {
  const { t, language } = useTranslation()
  const [festival, setFestival] = useState<ReturnType<typeof getNextFestival> | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const next = getNextFestival()
    setFestival(next)
    if (next) setTimeLeft(calcTimeLeft(new Date(next.date)))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!festival) return
    const target = new Date(festival.date)
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [festival])

  if (!mounted || !festival) return null

  const units = [
    { label: language === 'hi' ? 'दिन' : 'Days', value: timeLeft.days },
    { label: language === 'hi' ? 'घंटे' : 'Hours', value: timeLeft.hours },
    { label: language === 'hi' ? 'मिनट' : 'Min', value: timeLeft.minutes },
    { label: language === 'hi' ? 'सेकंड' : 'Sec', value: timeLeft.seconds },
  ]

  return (
    <section className="relative bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 text-white overflow-hidden" aria-label={t('countdown.label')}>
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="page-container py-7 flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
        {/* Festival Info */}
        <div className="text-center sm:text-left">
          <p className="inline-flex items-center gap-1.5 text-overline uppercase tracking-wider text-accent/80 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {language === 'hi' ? 'आगामी त्योहार' : 'Next Festival'}
          </p>
          <h3 className="text-h3 font-serif text-white">
            {language === 'hi' ? festival.titleHi : festival.title}
          </h3>
          <p className="text-body-sm text-secondary-300 mt-0.5">
            {new Date(festival.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Countdown Boxes */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center bg-white/[0.07] backdrop-blur-sm rounded-xl px-3.5 py-2.5 min-w-[4rem] border border-white/[0.08]"
            >
              <span className="text-h2 font-sans font-bold tabular-nums bg-gradient-to-b from-accent to-primary bg-clip-text text-transparent">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="text-caption text-secondary-400 mt-0.5">{u.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/events#${festival.slug}`}
          className="btn btn-primary btn-sm no-underline hover:no-underline whitespace-nowrap group"
        >
          {language === 'hi' ? 'विवरण देखें' : 'View Details'}
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>
    </section>
  )
}
