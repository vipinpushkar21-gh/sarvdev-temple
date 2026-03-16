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
    <section className="bg-secondary-800 text-white" aria-label={t('countdown.label')}>
      <div className="page-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Festival Info */}
        <div className="text-center sm:text-left">
          <p className="text-overline uppercase tracking-wider text-secondary-400 mb-1">
            {language === 'hi' ? 'आगामी त्योहार' : 'Next Festival'}
          </p>
          <h3 className="text-h3 font-serif text-white">
            {language === 'hi' ? festival.titleHi : festival.title}
          </h3>
          <p className="text-body-sm text-secondary-200 mt-0.5">
            {new Date(festival.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Countdown Boxes */}
        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center bg-secondary-700 rounded-btn px-3 py-2 min-w-[3.5rem]"
            >
              <span className="text-h3 font-sans font-bold tabular-nums text-accent">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="text-caption text-secondary-300 mt-0.5">{u.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/events#${festival.slug}`}
          className="btn btn-primary btn-sm no-underline hover:no-underline whitespace-nowrap"
        >
          {language === 'hi' ? 'विवरण देखें' : 'View Details'}
        </Link>
      </div>
    </section>
  )
}
