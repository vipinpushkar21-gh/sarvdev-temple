"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../lib/translation'
import { MAIN_NAV_ITEMS } from '../lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import GlobalSearchPanel from './GlobalSearchPanel'

const navItems = MAIN_NAV_ITEMS

// Curated primary nav for the desktop header — a focused subset of MAIN_NAV_ITEMS.
// The mobile slide-in menu still lists every item so all sections stay reachable.
const PRIMARY_NAV_IDS = ['temples', 'deities', 'devotionals', 'daily-darshan']
const EXPLORE_NAV_ITEMS = ['spiritual-icons', 'panchang', 'events']
const primaryNavItems = PRIMARY_NAV_IDS
  .map((id) => navItems.find((item) => item.id === id))
  .filter((item): item is NonNullable<typeof item> => Boolean(item))
const exploreNavItems = EXPLORE_NAV_ITEMS
  .map((id) => navItems.find((item) => item.id === id))
  .filter((item): item is NonNullable<typeof item> => Boolean(item))

const BOOKMARKS_ICON = navItems.find((item) => item.id === 'bookmarks')?.icon ?? ''

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
  const [searchOpen, setSearchOpen] = useState(false)
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

  // Track scroll for glass -> solid transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "More" button in the mobile bottom nav opens this same slide-in menu.
  useEffect(() => {
    const onOpenMenu = () => setOpen(true)
    window.addEventListener('sarvdev:open-menu', onOpenMenu)
    return () => window.removeEventListener('sarvdev:open-menu', onOpenMenu)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setUserMenuOpen(false); setMegaOpen(null) }
      // Cmd/Ctrl+K opens the command-style search panel (kept separate from SmartSearch's '/' shortcut)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    if (open || userMenuOpen) {
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
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? 'bg-surface/95 backdrop-blur-xl shadow-card border-surface-border'
            : 'bg-surface/75 backdrop-blur-xl border-surface-border/50'
        }`}
      >
        {/* Sacred accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        <div className="page-container py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 no-underline hover:no-underline shrink-0">
            <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary-600 to-accent shadow-sacred transition-transform duration-500 group-hover:scale-105">
              <span className="font-display text-lg font-bold leading-none text-white">S</span>
            </span>
            <div className="flex flex-col">
              <span className="font-display text-[1.15rem] font-bold leading-tight text-secondary transition-colors duration-300 group-hover:text-primary">
                Sarvdev
              </span>
              <span className="hidden text-[9px] uppercase leading-none tracking-[0.18em] text-ink-faint sm:block">
                {t('common.templeDevotionalHub')}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">
            <div className="flex items-center gap-0.5">
              {primaryNavItems.map((item) => {
                const active = isActive(item.href)
                const hasMega = !!item.mega
                const megaKey = item.mega

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
                      aria-haspopup={hasMega ? 'true' : undefined}
                      aria-expanded={hasMega ? megaOpen === megaKey : undefined}
                      onFocus={() => { if (megaKey) setMegaOpen(megaKey) }}
                      className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-body-sm font-medium no-underline transition-all duration-200 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        active
                          ? 'bg-primary-50 font-semibold text-primary-700'
                          : 'text-ink hover:bg-surface-sunken hover:text-primary'
                      }`}
                    >
                      {t(item.labelKey)}
                      {hasMega && (
                        <svg className={`h-3 w-3 transition-transform duration-200 ${megaOpen === megaKey ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {megaKey && megaOpen === megaKey && megaMenuData[megaKey as keyof typeof megaMenuData] && (
                      <div
                        role="menu"
                        className="absolute left-1/2 top-full z-[70] mt-2 w-[520px] -translate-x-1/2 overflow-hidden rounded-2xl border shadow-elevated fade-up"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
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
                        <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-sunken)' }}>
                          <span className="text-[10px] text-ink-muted">{t('common.exploreTemples')}</span>
                          <Link href="/temples" className="text-[10px] font-bold text-primary no-underline hover:no-underline hover:text-maroon" onClick={() => setMegaOpen(null)}>
                            {t('common.browseAll')} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="relative" onMouseEnter={() => setMegaOpen('explore')} onMouseLeave={() => setMegaOpen(null)}>
                <button type="button" aria-haspopup="true" aria-expanded={megaOpen === 'explore'} onClick={() => setMegaOpen(megaOpen === 'explore' ? null : 'explore')} onFocus={() => setMegaOpen('explore')} className="flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-body-sm font-medium text-ink transition-colors hover:bg-surface-sunken hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Explore
                  <svg className={`h-3 w-3 transition-transform ${megaOpen === 'explore' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
                </button>
                {megaOpen === 'explore' && <div role="menu" className="absolute left-0 top-full z-[70] mt-2 w-48 border bg-surface p-2 shadow-elevated" style={{ borderColor: 'var(--color-border)' }}>
                  {exploreNavItems.map((item) => <Link key={item.href} href={item.href} role="menuitem" onClick={() => setMegaOpen(null)} className="block rounded-lg px-3 py-2 text-body-sm text-ink no-underline hover:bg-surface-sunken hover:text-primary">{t(item.labelKey)}</Link>)}
                </div>}
              </div>
            </div>

            {/* Right cluster: search, language, bookmarks, profile */}
            <div className="ml-2 flex shrink-0 items-center gap-0.5 border-l pl-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label={t('nav.search')}
                className="flex items-center gap-1.5 rounded-btn px-2.5 py-2 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <kbd className="rounded border px-1.5 py-0.5 text-[10px] font-bold text-ink-faint" style={{ borderColor: 'var(--color-border)' }}>⌘K</kbd>
              </button>

              <LanguageSwitcher variant="inline" />

              <Link
                href="/bookmarks"
                aria-label={t('nav.bookmarks')}
                className="rounded-btn p-2 text-ink-muted no-underline transition-colors hover:bg-surface-sunken hover:text-ink hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={BOOKMARKS_ICON} />
                </svg>
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(s => !s)}
                    className="flex items-center gap-2 rounded-btn px-1.5 py-1.5 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white">
                      {initials}
                    </span>
                    <svg className={`h-3 w-3 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-elevated overflow-hidden transition-all duration-300 origin-top-right z-[60] ${
                    userMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
                  }`} style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-sunken)' }}>
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
                  className="ml-1 rounded-btn border px-3.5 py-1.5 text-body-sm font-semibold text-ink no-underline transition-colors hover:border-primary hover:text-primary hover:no-underline"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile controls: search + menu */}
          <div className="flex items-center gap-1 xl:hidden" ref={menuRef}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
              className="rounded-btn p-2.5 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="relative rounded-btn p-2.5 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
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
          className={`absolute inset-0 bg-dark-sacred/60 backdrop-blur-md transition-opacity duration-400 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-[min(85vw,340px)] shadow-elevated transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-y-auto ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-sunken)' }}>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent shadow-sacred">
                <span className="font-display text-white font-bold text-sm">S</span>
              </span>
              <span className="text-h4 font-display font-bold text-secondary">{t('common.menu')}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-surface-border/40 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Language — mobile access lives here instead of a floating pill */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-caption font-semibold text-ink-muted">🌐 भाषा / Language</span>
            <LanguageSwitcher variant="inline" />
          </div>

          {/* Nav links — full list so every section stays reachable */}
          <div className="py-2 px-2">
            {navItems.map((item, idx) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium no-underline hover:no-underline transition-all duration-200 mb-0.5 ${
                    active
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-ink hover:bg-surface-sunken hover:text-primary'
                  }`}
                  onClick={() => setOpen(false)}
                  style={open ? { animation: `slideInRight 400ms cubic-bezier(0.32,0.72,0,1) ${idx * 40 + 100}ms both` } : undefined}
                >
                  <svg className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : 'text-ink-muted'}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                  {t(item.labelKey)}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User section */}
          <div className="border-t mx-4 mt-1" style={{ borderColor: 'var(--color-border)' }} />
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
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-body-sm font-bold text-white no-underline hover:no-underline shadow-sacred hover:brightness-105 active:scale-[0.98] transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
                  onClick={() => setOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Command-style global search panel */}
      <GlobalSearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
