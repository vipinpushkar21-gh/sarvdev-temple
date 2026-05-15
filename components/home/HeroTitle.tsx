"use client"

import { useTranslation } from '../../lib/translation'

export default function HeroTitle() {
  const { t, language } = useTranslation()

  // Only overlay translated text for non-English languages.
  // The server-rendered English h1 remains in the DOM for SEO.
  if (language === 'en') return null

  return (
    <>
      <h1 className="text-display-lg font-serif text-secondary-800 leading-tight fade-up delay-1">
        {t('home.title')}
      </h1>
      <p className="mt-5 text-body text-ink-muted max-w-xl leading-relaxed fade-up delay-2">
        {t('home.subtitle')}
      </p>
    </>
  )
}
