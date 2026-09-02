"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import { FOOTER_QUICK_LINKS } from '../lib/navigation'

const popularStates = [
  { label: 'Uttar Pradesh', href: '/temples/state/uttar-pradesh' },
  { label: 'Rajasthan', href: '/temples/state/rajasthan' },
  { label: 'Tamil Nadu', href: '/temples/state/tamil-nadu' },
  { label: 'Maharashtra', href: '/temples/state/maharashtra' },
  { label: 'Uttarakhand', href: '/temples/state/uttarakhand' },
  { label: 'Karnataka', href: '/temples/state/karnataka' },
  { label: 'Gujarat', href: '/temples/state/gujarat' },
  { label: 'Kerala', href: '/temples/state/kerala' },
]

const popularDeities = [
  { label: 'Shiva', href: '/temples/deity/shiva' },
  { label: 'Krishna', href: '/temples/deity/krishna' },
  { label: 'Hanuman', href: '/temples/deity/hanuman' },
  { label: 'Ganesh', href: '/temples/deity/ganesh' },
  { label: 'Ram', href: '/temples/deity/ram' },
  { label: 'Durga', href: '/temples/deity/durga' },
  { label: 'Vishnu', href: '/temples/deity/vishnu' },
  { label: 'Lakshmi', href: '/temples/deity/lakshmi' },
]

const pilgrimageLinks = [
  { label: 'Char Dham', href: '/temples/pilgrimage/char-dham' },
  { label: '12 Jyotirlinga', href: '/temples/pilgrimage/jyotirlinga' },
  { label: 'Shakti Peeth', href: '/temples/pilgrimage/shakti-peeth' },
  { label: 'ISKCON Temples', href: '/temples/pilgrimage/iskcon' },
  { label: 'Divya Desam', href: '/temples/pilgrimage/divya-desam' },
  { label: 'Panch Kedar', href: '/temples/pilgrimage/panch-kedar' },
]

const quickLinks = FOOTER_QUICK_LINKS

const legalLinks = [
  { label: 'About Sarvdev', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Contributors', href: '/contributors' },
]

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subMsg, setSubMsg] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      const data = await res.json()
      setSubStatus('success')
      setSubMsg(data.message || 'Subscribed!')
      setEmail('')
    } catch {
      setSubStatus('error')
      setSubMsg(t('common.newsletterError'))
    }
  }

  return (
    <footer className="relative overflow-hidden bg-secondary-900 pb-20 text-secondary-100 xl:pb-0">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-temple-gold-DEFAULT/50 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/[0.03] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Main footer content */}
      <div className="page-container relative z-10 pt-10 pb-7 sm:pt-16 sm:pb-10 md:pt-20 md:pb-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-6 md:gap-6">

          {/* Brand column — spans 2 on desktop */}
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3 no-underline hover:no-underline">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                <span className="text-secondary-900 font-serif font-bold text-xl leading-none">S</span>
              </span>
              <div className="flex flex-col">
                <span className="text-h3 font-serif font-bold text-white group-hover:text-accent transition-colors duration-200">
                  Sarvdev
                </span>
                <span className="text-[9px] font-cinzel text-temple-gold-light/60 tracking-[0.18em] uppercase -mt-0.5">
                  {t('common.templeDevotionalHub')}
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed text-secondary-300">
              India&apos;s most comprehensive sacred temple directory. Explore temples, listen to devotional music, track festivals, and deepen your spiritual journey.
            </p>

            <blockquote className="mt-4 border-l-2 border-accent/50 py-1 pl-4 text-body-sm italic text-secondary-300 sm:mt-6">
              <span className="font-devanagari text-accent-200 text-[15px]">&ldquo;सर्वे भवन्तु सुखिनः&rdquo;</span>
              <span className="text-caption not-italic text-secondary-400 mt-1 block">
                May all beings be happy.
              </span>
            </blockquote>

            {/* Social / CTA */}
            <div className="mt-4 flex items-center gap-3 sm:mt-6">
              <Link href="/list-temple" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-caption font-bold bg-gradient-to-r from-primary to-primary-600 text-white shadow-md shadow-primary/20 hover:shadow-lg hover:brightness-110 transition-all duration-300 no-underline hover:no-underline">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t('common.submitTemple')}
              </Link>
              <Link href="/bookmarks" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-caption font-semibold bg-white/[0.06] text-secondary-300 border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-all duration-300 no-underline hover:no-underline">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {t('common.bookmarks')}
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-overline font-cinzel uppercase tracking-wider text-temple-gold-DEFAULT/70 mb-4">{t('common.explore')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-secondary-300 no-underline hover:text-white hover:no-underline transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* States */}
          <nav aria-label="Popular states">
            <h3 className="text-overline font-cinzel uppercase tracking-wider text-temple-gold-DEFAULT/70 mb-4">{t('common.popularStates')}</h3>
            <ul className="space-y-2.5">
              {popularStates.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-secondary-300 no-underline hover:text-white hover:no-underline transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Deities */}
          <nav aria-label="Popular deities">
            <h3 className="text-overline font-cinzel uppercase tracking-wider text-temple-gold-DEFAULT/70 mb-4">{t('nav.deities')}</h3>
            <ul className="space-y-2.5">
              {popularDeities.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-secondary-300 no-underline hover:text-white hover:no-underline transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pilgrimages */}
          <nav aria-label="Pilgrimage circuits">
            <h3 className="text-overline font-cinzel uppercase tracking-wider text-temple-gold-DEFAULT/70 mb-4">{t('common.pilgrimages')}</h3>
            <ul className="space-y-2.5">
              {pilgrimageLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-secondary-300 no-underline hover:text-white hover:no-underline transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-overline font-cinzel uppercase tracking-wider text-temple-gold-DEFAULT/70 mb-3">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.slice(0, 4).map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-caption text-secondary-400 no-underline hover:text-secondary-200 hover:no-underline transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="border-t border-secondary-800/60 relative z-10">
        <div className="page-container py-6 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-cinzel text-overline uppercase tracking-[0.18em] text-temple-gold-light/70 mb-2">{t('common.newsletterTitle')}</h3>
            <p className="text-lg font-serif font-bold text-white mb-1">{t('common.newsletterJoin')}</p>
            <p className="text-body-sm text-secondary-400 mb-5">{t('common.newsletterDescription')}</p>
            {subStatus === 'success' ? (
              <p className="text-sm font-semibold text-emerald-400">{subMsg}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-secondary-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #FF9933, #E67E22)', boxShadow: '0 4px 14px rgba(255,153,51,0.3)' }}
                >
                  {subStatus === 'loading' ? t('common.subscribing') : t('common.subscribe')}
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="text-xs text-red-400 mt-2">{subMsg}</p>}
          </div>
        </div>
      </div>

      {/* SEO footer — internal link bar */}
      <div className="border-t border-secondary-800/80 relative z-10">
        <div className="page-container py-4 sm:py-5">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
            {[
              { label: 'Temples in Delhi', href: '/temples/city/delhi' },
              { label: 'Temples in Mumbai', href: '/temples/city/mumbai' },
              { label: 'Temples in Varanasi', href: '/temples/city/varanasi' },
              { label: 'Temples in Haridwar', href: '/temples/city/haridwar' },
              { label: 'North India Temples', href: '/temples/region/north-india' },
              { label: 'South India Temples', href: '/temples/region/south-india' },
              { label: 'Hanuman Chalisa', href: '/devotionals' },
              { label: 'Aarti Sangrah', href: '/devotionals' },
              { label: 'Hindu Calendar 2026', href: '/panchang' },
            ].map(link => (
              <Link key={link.label} href={link.href} className="text-[11px] text-secondary-500 no-underline hover:text-secondary-300 hover:no-underline transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-800/50 relative z-10">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-4 sm:flex-row sm:py-5">
          <p className="text-caption text-secondary-400">
            &copy; {new Date().getFullYear()} Sarvdev. {t('footer.rights')}
          </p>
          <p className="text-caption text-secondary-500 flex items-center gap-1.5">
            {t('common.builtForCommunity')}
            <span className="inline-block text-primary animate-pulse">&#9829;</span>
            {t('common.reverenceDevotion')}
          </p>
        </div>
      </div>
    </footer>
  )
}
