"use client"

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../lib/translation'
import LanguageSwitcher from './LanguageSwitcher'

const navItems = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.temples', href: '/temples' },
  { label: 'nav.dailyDarshan', href: '/daily-darshan' },
  { label: 'nav.events', href: '/events' },
  { label: 'nav.booking', href: '/booking' },
  { label: 'nav.devotionals', href: '/devotionals' },
  { label: 'nav.blog', href: '/blog' },
  { label: 'nav.listTemple', href: '/list-temple' },
  { label: 'nav.login', href: '/login' },
]

export default function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      window.addEventListener('keydown', onKey)
      window.addEventListener('click', onClick)
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-emerald-700">Sarvdev Temple</Link>

        <nav className="hidden md:flex space-x-4 items-center" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-700 hover:text-emerald-600">{t(item.label)}</Link>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden" ref={menuRef}>
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            onKeyDown={(e) => e.key === 'Enter' && setOpen((s) => !s)}
            className="p-2 rounded-md text-slate-700 bg-white/60 hover:bg-white"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              {open ? (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Dropdown/drawer */}
          <div
            role="dialog"
            aria-modal="false"
            className={`absolute right-4 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all origin-top-right z-[60] ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
          >
            <div className="py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
              <div className="px-4 py-2 border-t">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
