"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../lib/translation'
import LanguageSwitcher from './LanguageSwitcher'
import { useTheme } from '../lib/theme'

const navItems = [
  { label: 'nav.home', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { label: 'nav.deities', href: '/deities', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { label: 'nav.temples', href: '/temples', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4' },
  { label: 'nav.devotionals', href: '/devotionals', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z' },
  { label: 'nav.spiritualIcons', href: '/spiritual-icons', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: 'nav.dailyDarshan', href: '/daily-darshan', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { label: 'nav.events', href: '/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'nav.blog', href: '/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { label: 'nav.panchang', href: '/panchang', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { label: 'nav.bookmarks', href: '/bookmarks', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
  { label: 'nav.listTemple', href: '/list-temple', icon: 'M12 4v16m8-8H4' },
]

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
  const menuRef = useRef<HTMLDivElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const { theme, toggle } = useTheme()
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
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary opacity-80" />

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
              <span className="text-[9px] font-medium text-secondary-400 tracking-[0.15em] uppercase leading-none -mt-0.5 hidden sm:block">
                Temple & Devotional Hub
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center" aria-label="Main navigation">
            <div className="flex items-center gap-px bg-white/[0.06] rounded-2xl px-1 py-0.5 border border-white/[0.08] max-w-[calc(100vw-320px)] overflow-x-auto scrollbar-none">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-2 py-1.5 rounded-lg text-[10.5px] font-semibold no-underline hover:no-underline whitespace-nowrap transition-all duration-300 ${
                      active
                        ? 'text-secondary-900 bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/30'
                        : 'text-secondary-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {t(item.label)}
                  </Link>
                )
              })}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-orange-100/70 hover:text-white hover:bg-white/[0.10] transition-all duration-300 ml-1"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              )}
            </button>

            {/* User menu or Login link */}
            <div className="flex items-center gap-1.5 ml-1 shrink-0">
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
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 text-left px-4 py-3 text-body-sm text-semantic-error hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                      Logout
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
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-orange-100/70 hover:text-white hover:bg-white/[0.10] transition-all duration-300"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              )}
            </button>
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
              <span className="text-h4 font-serif font-bold text-secondary-800">Menu</span>
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
                  {t(item.label)}
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
