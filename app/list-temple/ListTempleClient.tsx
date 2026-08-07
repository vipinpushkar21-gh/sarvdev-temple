"use client"

import TempleForm from '../../components/temples/TempleForm'
import { useTranslation } from '../../lib/translation'

export default function ListTempleClient({ faqs: _faqs }: { faqs?: Array<{ question: string; answer: string }> }) {
  const { language } = useTranslation()
  const hi = language === 'hi'
  return (
    <main className="bg-surface py-10 md:py-14">
      <div className="page-container max-w-5xl">
        <div className="mb-8">
          <h1 className="text-display-sm font-serif text-secondary-900">{hi ? 'मंदिर सूचीबद्ध करें' : 'List a Temple'}</h1>
          <p className="mt-3 max-w-2xl text-body text-ink-muted">{hi ? 'Sarvdev समीक्षा के लिए मंदिर की सटीक जानकारी साझा करें। स्वीकृति तक मंदिर लंबित रहेगा।' : 'Share accurate temple details for Sarvdev review. Submitted temples remain pending until approved.'}</p>
        </div>
        <TempleForm mode="public" />
      </div>
    </main>
  )
}
