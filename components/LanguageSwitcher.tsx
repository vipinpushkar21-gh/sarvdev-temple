"use client"

import { useTranslation } from '../lib/translation'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center gap-0.5 rounded-btn border border-surface-border bg-surface-raised p-0.5" suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded text-caption font-medium transition-colors ${
          language === 'en'
            ? 'bg-primary text-white'
            : 'text-ink-muted hover:bg-surface-sunken'
        }`}
        suppressHydrationWarning
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded text-caption font-medium transition-colors font-devanagari ${
          language === 'hi'
            ? 'bg-primary text-white'
            : 'text-ink-muted hover:bg-surface-sunken'
        }`}
        suppressHydrationWarning
      >
        हि
      </button>
    </div>
  )
}
