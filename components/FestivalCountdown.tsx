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
    <section className="bg-white border-y border-gray-100" aria-label={t('countdown.label')}>
      <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Festival Info */}
        <div className="border-l-4 border-primary pl-4">
          <p className="text-overline uppercase tracking-[0.12em] text-gray-400 mb-1">
            {language === 'hi' ? 'आगामी त्योहार' : 'Next Festival'}
          </p>
          <h3 className="text-h3 font-serif text-gray-900">
            {language === 'hi' ? festival.titleHi : festival.title}
          </h3>
          <p className="text-body-sm text-gray-400 mt-0.5">
            {new Date(festival.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Countdown Boxes */}
        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((u, i) => (
            <div key={u.label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && <span className="text-gray-200 text-h3 font-light">:</span>}
              <div className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 min-w-[3.5rem]">
                <span className="text-h2 font-sans font-bold tabular-nums text-gray-900">
                  {String(u.value).padStart(2, '0')}
                </span>
                <span className="text-overline text-gray-400 mt-0.5 uppercase tracking-wider">{u.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/events#${festival.slug}`}
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-gray-900 border-b-2 border-gray-900 hover:border-primary hover:text-primary transition-colors duration-200 no-underline hover:no-underline whitespace-nowrap"
        >
          {language === 'hi' ? 'विवरण देखें' : 'View Details'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>
    </section>
  )
}
