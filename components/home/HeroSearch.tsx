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
        <Link href="/events" className="btn-divine btn-lg no-underline hover:no-underline group">
          {t('home.upcomingEvents')}
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
        <Link href="/daily-darshan" className="btn btn-lg no-underline hover:no-underline border-2 border-sandstone-400/40 text-sandstone-200 hover:bg-white/10 hover:border-sandstone-300">
          {t('home.virtualDarshan')}
        </Link>
      </div>

      {/* Quick deity access */}
      <div className="mt-8 flex flex-wrap gap-2 fade-up delay-5">
        {[
          { label: 'Shiva', href: '/temples/deity/shiva', emoji: '🔱' },
          { label: 'Krishna', href: '/temples/deity/krishna', emoji: '🪈' },
          { label: 'Hanuman', href: '/temples/deity/hanuman', emoji: '🐒' },
          { label: 'Ganesh', href: '/temples/deity/ganesh', emoji: '🙏' },
          { label: 'Durga', href: '/temples/deity/durga', emoji: '🪷' },
        ].map(d => (
          <Link
            key={d.label}
            href={d.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium text-sandstone-300 border border-white/10 hover:border-primary/40 hover:bg-white/5 hover:text-primary-300 transition-all duration-300 no-underline hover:no-underline"
          >
            <span>{d.emoji}</span>
            {d.label}
          </Link>
        ))}
      </div>
    </>
  )
}
