'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/translation'
import { getCalendarDateInTimeZone, type PanchangApiResponse } from '@/lib/panchang/providers/types'

type Darshan = { title?: string; templeName?: string; temple?: string; deity?: string; isLive?: boolean; darshanType?: string; type?: string }
type Event = { title?: string; titleHi?: string; slug?: string; startDate?: string; date?: string; festivalName?: string }

export default function TodayAtSarvdev({ darshan, event }: { darshan?: Darshan | null; event?: Event | null }) {
  const { language } = useTranslation()
  const [panchang, setPanchang] = useState<PanchangApiResponse | null>(null)
  const timeZone = useMemo(() => 'Asia/Kolkata', [])

  useEffect(() => {
    const date = getCalendarDateInTimeZone(timeZone)
    const params = new URLSearchParams({ date, lat: '28.6139', lon: '77.2090', tz: timeZone, lang: language, city: 'Delhi' })
    fetch(`/api/panchang?${params}`, { cache: 'no-store' })
      .then(async (response) => setPanchang(await response.json() as PanchangApiResponse))
      .catch(() => setPanchang({ status: 'unavailable', message: 'Panchang calculations are temporarily unavailable.' }))
  }, [language, timeZone])

  const date = event?.startDate || event?.date
  const eventDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' }) : null
  const darshanLabel = darshan?.isLive || darshan?.darshanType === 'live' || darshan?.type === 'live' ? 'Live now' : 'Daily viewing'

  return (
    <section className="border-b border-surface-border bg-surface-raised" aria-label="Today at Sarvdev">
      <div className="page-container py-7 sm:py-8">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Daily practice</p>
            <h2 className="mt-1 font-display text-h2 text-secondary-800">Today at Sarvdev</h2>
          </div>
          <p className="hidden text-caption text-ink-muted sm:block">A quiet guide for today&apos;s sacred rhythm</p>
        </div>

        <div className="grid divide-y divide-surface-border border-y border-surface-border md:grid-cols-3 md:divide-x md:divide-y-0">
          <Link href="/panchang" className="group px-0 py-5 no-underline hover:no-underline md:px-6 md:first:pl-0">
            <p className="text-overline font-semibold uppercase tracking-[0.12em] text-ink-muted">Today&apos;s Panchang</p>
            <p className="mt-2 font-display text-h3 text-secondary-800">{panchang?.status === 'success' ? panchang.data.tithi || 'Daily Panchang' : 'Panchang unavailable'}</p>
            <p className="mt-1 text-body-sm text-ink-muted">{panchang?.status === 'success' ? [panchang.data.nakshatra, panchang.data.sunrise && `Sunrise ${panchang.data.sunrise}`].filter(Boolean).join(' · ') || 'Verified calculations' : 'Calculations are temporarily unavailable'}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary-700 group-hover:text-maroon">View Panchang <Arrow /></span>
          </Link>

          <Link href="/daily-darshan" className="group px-0 py-5 no-underline hover:no-underline md:px-6">
            <p className="text-overline font-semibold uppercase tracking-[0.12em] text-ink-muted">{darshanLabel}</p>
            <p className="mt-2 font-display text-h3 text-secondary-800">{darshan?.title || 'Today\'s Darshan'}</p>
            <p className="mt-1 text-body-sm text-ink-muted">{[darshan?.templeName || darshan?.temple, darshan?.deity].filter(Boolean).join(' · ') || 'Begin with a moment of darshan'}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary-700 group-hover:text-maroon">Watch Darshan <Arrow /></span>
          </Link>

          <Link href={event?.slug ? `/events/${event.slug}` : '/events'} className="group px-0 py-5 no-underline hover:no-underline md:px-6 md:pr-0">
            <p className="text-overline font-semibold uppercase tracking-[0.12em] text-ink-muted">Upcoming observance</p>
            <p className="mt-2 font-display text-h3 text-secondary-800">{language === 'hi' ? event?.titleHi || event?.title || 'Festival Calendar' : event?.title || event?.festivalName || 'Festival Calendar'}</p>
            <p className="mt-1 text-body-sm text-ink-muted">{eventDate ? `${eventDate} · ` : ''}Explore festivals and temple events</p>
            <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary-700 group-hover:text-maroon">View Events <Arrow /></span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Arrow() { return <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
