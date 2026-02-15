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
  { label: 'nav.panchang', href: '/panchang' },
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
    <header className="sticky top-0 z-50 bg-secondary-800 border-b border-secondary-700">
      <div className="page-container py-3 flex items-center justify-between">
        <Link href="/" className="text-h4 font-serif font-bold text-white no-underline hover:text-accent hover:no-underline transition-colors">
          Sarvdev
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-btn text-body-sm text-secondary-200 no-underline hover:text-white hover:bg-secondary-700 hover:no-underline transition-colors"
            >
              {t(item.label)}
            </Link>
          ))}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden" ref={menuRef}>
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-btn text-secondary-200 hover:text-white hover:bg-secondary-700 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              {open ? (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Dropdown */}
          <div
            role="dialog"
            aria-modal="false"
            className={`absolute right-4 mt-2 w-56 card shadow-dropdown transform transition-all origin-top-right z-[60] ${
              open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            }`}
          >
            <div className="py-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-body-sm text-ink no-underline hover:bg-surface-sunken hover:no-underline transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
              <div className="px-4 py-2.5 border-t border-surface-border">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
