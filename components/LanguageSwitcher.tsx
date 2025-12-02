"use client"

import { useTranslation } from '../lib/translation'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-1 border border-orange-200">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          language === 'en' 
            ? 'bg-orange-600 text-white' 
            : 'text-slate-700 hover:bg-orange-50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          language === 'hi' 
            ? 'bg-orange-600 text-white' 
            : 'text-slate-700 hover:bg-orange-50'
        }`}
      >
        हि
      </button>
    </div>
  )
}
