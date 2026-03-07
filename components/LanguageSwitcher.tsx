"use client"

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../lib/translation'
import { LANGUAGES } from '../lib/translation'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="fixed bottom-20 right-4 z-50" suppressHydrationWarning>
      {/* Dropdown Menu (opens upward) */}
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-surface rounded-xl shadow-xl shadow-black/15 border border-surface-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-2 border-b border-surface-border bg-surface-sunken/50">
            <p className="text-caption font-semibold text-ink-muted">🌐 भाषा / Language</p>
          </div>
          <div className="max-h-72 overflow-y-auto scrollbar-none py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  language === lang.code
                    ? 'bg-primary-50 text-primary-800 font-semibold'
                    : 'text-ink hover:bg-surface-sunken/60'
                }`}
              >
                <span className="text-base w-6 text-center">{lang.flag}</span>
                <span className="text-body-sm">{lang.label}</span>
                <span className="text-caption text-ink-muted ml-auto">{lang.labelEn}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary-800/90 backdrop-blur-lg text-white shadow-lg shadow-black/20 border border-white/10 hover:bg-secondary-700 hover:shadow-xl active:scale-95 transition-all duration-300"
        aria-label="Switch language"
        suppressHydrationWarning
      >
        <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-xs font-bold" suppressHydrationWarning>
          {current.label}
        </span>
        <svg className={`w-3 h-3 text-primary-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
