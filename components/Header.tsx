"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../lib/translation'
import { MAIN_NAV_ITEMS } from '../lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'

const navItems = MAIN_NAV_ITEMS

const megaMenuData = {
  temples: {
    columns: [
      {
        title: 'By Region',
        links: [
          { label: 'North India', href: '/temples/region/north-india' },
          { label: 'South India', href: '/temples/region/south-india' },
          { label: 'West India', href: '/temples/region/west-india' },
          { label: 'East India', href: '/temples/region/east-india' },
        ],
      },
      {
        title: 'By Deity',
        links: [
          { label: 'Shiva Temples', href: '/temples/deity/shiva' },
          { label: 'Krishna Temples', href: '/temples/deity/krishna' },
          { label: 'Hanuman Temples', href: '/temples/deity/hanuman' },
          { label: 'Ganesh Temples', href: '/temples/deity/ganesh' },
        ],
      },
      {
        title: 'Pilgrimages',
        links: [
          { label: 'Char Dham', href: '/temples/pilgrimage/char-dham' },
          { label: '12 Jyotirlinga', href: '/temples/pilgrimage/jyotirlinga' },
          { label: 'Shakti Peeth', href: '/temples/pilgrimage/shakti-peeth' },
          { label: 'All Pilgrimages', href: '/temples/pilgrimage' },
        ],
      },
      {
        title: 'Popular States',
        links: [
          { label: 'Uttar Pradesh', href: '/temples/state/uttar-pradesh' },
          { label: 'Rajasthan', href: '/temples/state/rajasthan' },
          { label: 'Tamil Nadu', href: '/temples/state/tamil-nadu' },
          { label: 'Maharashtra', href: '/temples/state/maharashtra' },
        ],
      },
    ],
  },
}

interface AuthUser {
  name: string
  email: string
  role: 'guest' | 'admin'
}

export default function Header() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  // Track scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setUserMenuOpen(false) }
    }

    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (open || userMenuOpen) {
      window.addEventListener('keydown', onKey)
      window.addEventListener('click', onClick)
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open, userMenuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserMenuOpen(false)
    window.location.href = '/login'
  }

  // User initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-secondary-900/80 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.15)]'
            : 'bg-secondary-900/95 backdrop-blur-xl'
        }`}
      >
        {/* Sacred gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-temple-gold-DEFAULT to-transparent opacity-70" />

        <div className="page-container py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 no-underline hover:no-underline shrink-0">
            <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-600 to-accent shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/50 transition-all duration-500 group-hover:scale-105">
              <span className="text-white font-serif font-bold text-xl leading-none drop-shadow-sm">S</span>
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </span>
            <div className="flex flex-col">
              <span className="text-[1.1rem] font-serif font-bold text-white tracking-tight group-hover:text-accent transition-colors duration-300">
                Sarvdev
              </span>
                <span className="text-[9px] font-cinzel text-temple-gold-light/70 tracking-[0.18em] uppercase leading-none -mt-0.5 hidden sm:block">
                {t('common.templeDevotionalHub')}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center" aria-label="Main navigation">
            <div className="flex items-center gap-px bg-white/[0.06] rounded-2xl px-1 py-0.5 border border-white/[0.08] max-w-[calc(100vw-320px)]">
              {navItems.map((item) => {
                const active = isActive(item.href)
                const hasMega = !!(item as any).mega
                const megaKey = (item as any).mega as string | undefined

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (megaKey) {
                        if (megaTimerRef.current) clearTimeout(megaTimerRef.current)
                        setMegaOpen(megaKey)
                      }
                    }}
                    onMouseLeave={() => {
                      if (megaKey) {
                        megaTimerRef.current = setTimeout(() => setMegaOpen(null), 200)
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`relative px-2 py-1.5 rounded-lg text-[10.5px] font-semibold no-underline hover:no-underline whitespace-nowrap transition-all duration-300 flex items-center gap-0.5 ${
                        active
                          ? 'text-secondary-900 bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/30'
                          : 'text-secondary-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {t(item.labelKey)}
                      {hasMega && (
                        <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${megaOpen === megaKey ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {megaKey && megaOpen === megaKey && megaMenuData[megaKey as keyof typeof megaMenuData] && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-surface-raised rounded-2xl border border-surface-border shadow-elevated overflow-hidden z-[70] fade-up"
                        onMouseEnter={() => {
                          if (megaTimerRef.current) clearTimeout(megaTimerRef.current)
                        }}
                        onMouseLeave={() => {
                          megaTimerRef.current = setTimeout(() => setMegaOpen(null), 150)
                        }}
                      >
                        <div className="grid grid-cols-4 gap-0 p-4">
                          {megaMenuData[megaKey as keyof typeof megaMenuData].columns.map((col) => (
                            <div key={col.title}>
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-2 px-2">{t(col.title === 'By Region' ? 'common.byRegion' : col.title === 'By Deity' ? 'common.byDeity' : col.title === 'Pilgrimages' ? 'common.pilgrimages' : 'common.popularStates')}</h4>
                              <ul className="space-y-0.5">
                                {col.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="block px-2 py-1.5 rounded-lg text-[11px] font-medium text-ink no-underline hover:no-underline hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                      onClick={() => setMegaOpen(null)}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2.5 bg-surface-sunken border-t border-surface-border flex items-center justify-between">
                          <span className="text-[10px] text-ink-muted">{t('common.exploreTemples')}</span>
                          <Link href="/temples" className="text-[10px] font-bold text-primary-600 no-underline hover:no-underline hover:text-primary-800" onClick={() => setMegaOpen(null)}>
                            {t('common.browseAll')} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* User menu or Login link */}
            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(s => !s)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-secondary-300 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                    aria-label="User menu"
                  >
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary/25 ring-2 ring-white/10">
                      {initials}
                    </span>
                    <span className="hidden xl:inline font-semibold text-[11px]">{user.name.split(' ')[0]}</span>
                    <svg className={`w-3 h-3 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`absolute right-0 mt-3 w-56 bg-surface-raised rounded-2xl border border-surface-border shadow-elevated overflow-hidden transition-all duration-300 origin-top-right z-[60] ${
                    userMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="px-4 py-3.5 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-surface-border">
                      <p className="text-body-sm font-semibold text-ink truncate">{user.name}</p>
                      <p className="text-caption text-ink-muted truncate">{user.email}</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold">{user.role}</span>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-3 text-body-sm text-ink no-underline hover:bg-surface-sunken hover:no-underline transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {t('common.adminDashboard')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 text-left px-4 py-3 text-body-sm text-semantic-error hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-xl text-[11px] font-bold bg-gradient-to-r from-primary to-accent text-secondary-900 no-underline hover:no-underline shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
                >
                  {t('nav.login')}
                </Link>
              )}

            </div>
          </nav>

          {/* Mobile controls */}
          <div className="xl:hidden flex items-center gap-2" ref={menuRef}>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="relative p-2.5 rounded-xl text-secondary-300 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center gap-[5px]">
                <span className={`block h-[2px] w-5 bg-current rounded-full transition-all duration-400 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] w-5 bg-current rounded-full transition-all duration-400 ${open ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[2px] w-5 bg-current rounded-full transition-all duration-400 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full screen overlay */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-400 ${
          open ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-secondary-900/70 backdrop-blur-md transition-opacity duration-400 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-[min(85vw,340px)] bg-surface-raised shadow-[−20px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-y-auto ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-gradient-to-r from-primary-50/80 to-accent-50/50">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
                <span className="text-white font-serif font-bold text-sm">S</span>
              </span>
              <span className="text-h4 font-serif font-bold text-secondary-800">{t('common.menu')}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-surface-sunken transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <div className="py-2 px-2">
            {navItems.map((item, idx) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium no-underline hover:no-underline transition-all duration-200 mb-0.5 ${
                    active
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50/50 text-primary-700 font-semibold'
                      : 'text-ink hover:bg-surface-sunken hover:text-primary-700'
                  }`}
                  onClick={() => setOpen(false)}
                  style={open ? { animation: `slideInRight 400ms cubic-bezier(0.32,0.72,0,1) ${idx * 40 + 100}ms both` } : undefined}
                >
                  <svg className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : 'text-ink-muted'}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                  {t(item.labelKey)}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User section */}
          <div className="border-t border-surface-border mx-4 mt-1" />
          <div className="py-3 px-2">
            {user ? (
              <>
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-primary-100">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-ink truncate">{user.name}</p>
                    <p className="text-caption text-ink-muted truncate">{user.email}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-body-sm font-medium text-ink no-underline hover:bg-surface-sunken hover:text-primary-700 hover:no-underline transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <svg className="w-[18px] h-[18px] text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 mx-2 rounded-xl text-body-sm font-medium text-semantic-error hover:bg-red-50 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="px-3 py-3">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-body-sm font-bold bg-gradient-to-r from-primary to-accent text-secondary-900 no-underline hover:no-underline shadow-lg shadow-primary/20 hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all duration-300"
                  onClick={() => setOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed language switcher — bottom-right corner */}
      <LanguageSwitcher />
    </>
  )
}
