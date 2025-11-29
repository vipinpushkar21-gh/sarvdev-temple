"use client"

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Temples', href: '/temples' },
  { label: 'Daily Darshan', href: '/daily-darshan' },
  { label: 'Upcoming Events', href: '/events' },
  { label: 'Online Booking', href: '/booking' },
  { label: 'Devotionals', href: '/devotionals' },
  { label: 'Blog', href: '/blog' },
  { label: 'List Temple', href: '/list-temple' },
  { label: 'Donation', href: '/donation' },
  { label: 'Login', href: '/login' },
]

export default function Header() {
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
    <header className="bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-emerald-700">Sarvdev Temple</Link>

        <nav className="hidden md:flex space-x-4 items-center" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-700 hover:text-emerald-600">{item.label}</Link>
          ))}
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
            className={`absolute right-4 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all origin-top-right ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
          >
            <div className="py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
