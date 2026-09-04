"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOBILE_BOTTOM_NAV_ITEMS } from '../lib/navigation'
import { useTranslation } from '../lib/translation'

const navItems = MOBILE_BOTTOM_NAV_ITEMS
const MORE_ICON = 'M4 6h16M4 12h16M4 18h16'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 xl:hidden"
      aria-label="Mobile navigation"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-surface/85 backdrop-blur-xl border-t border-surface-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" />

      <div className="relative flex items-center justify-around px-2 py-1.5 safe-area-pb">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 no-underline hover:no-underline min-w-[56px] ${
                active
                  ? 'text-primary'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform duration-300`}>
                {active && (
                  <div className="absolute -inset-1.5 rounded-full bg-primary-100/60" />
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
              <span className={`max-w-[64px] text-center text-[9px] font-medium leading-[1.05] ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* "More" opens the full slide-in menu so every section stays reachable */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('sarvdev:open-menu'))}
          className="flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-ink-muted transition-all duration-300 hover:text-ink"
        >
          <svg className="relative w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d={MORE_ICON} />
          </svg>
          <span className="max-w-[64px] text-center text-[9px] font-medium leading-[1.05]">
            {t('nav.more')}
          </span>
        </button>
      </div>
    </nav>
  )
}
