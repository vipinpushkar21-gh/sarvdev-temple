"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  },
  {
    href: '/temples',
    label: 'Temples',
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4',
  },
  {
    href: '/devotionals',
    label: 'Bhajans',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
  },
  {
    href: '/events',
    label: 'Festivals',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    href: '/bookmarks',
    label: 'Saved',
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 xl:hidden"
      aria-label="Mobile navigation"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-surface-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" />

      <div className="relative flex items-center justify-around px-2 py-1.5 safe-area-pb">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 no-underline hover:no-underline min-w-[56px] ${
                active
                  ? 'text-primary-600'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform duration-300`}>
                {active && (
                  <div className="absolute -inset-1.5 rounded-full bg-primary-100/60 animate-pulse" />
                )}
                <svg
                  className={`relative w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
