"use client"

import SmartSearch from '../SmartSearch'
import Link from 'next/link'
import { useTranslation } from '../../lib/translation'

export default function HeroSearch() {
  const { t } = useTranslation()

  return (
    <>
      <div className="mt-8 max-w-xl fade-up delay-3">
        <SmartSearch />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 fade-up delay-4">
        <Link href="/events" className="btn btn-primary btn-lg no-underline hover:no-underline group">
          {t('home.upcomingEvents')}
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
        <Link href="/daily-darshan" className="btn btn-outline btn-lg no-underline hover:no-underline">
          {t('home.virtualDarshan')}
        </Link>
      </div>
    </>
  )
}
