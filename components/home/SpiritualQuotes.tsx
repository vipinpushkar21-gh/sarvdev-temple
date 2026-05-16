"use client"

import { useState, useEffect } from 'react'

const quotes = [
  { text: 'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः', translation: 'Where there is Krishna, the lord of yoga, and Arjuna the archer, there will be prosperity and victory.', source: 'Bhagavad Gita 18.78' },
  { text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', translation: 'You have the right to perform your duties, but not to the fruits of your actions.', source: 'Bhagavad Gita 2.47' },
  { text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', translation: 'Abandon all varieties of dharma and surrender unto Me alone.', source: 'Bhagavad Gita 18.66' },
  { text: 'अहिंसा परमो धर्मः', translation: 'Non-violence is the highest dharma.', source: 'Mahabharata' },
  { text: 'वसुधैव कुटुम्बकम्', translation: 'The whole world is one family.', source: 'Maha Upanishad' },
  { text: 'ॐ सह नाववतु सह नौ भुनक्तु', translation: 'May we be protected together, may we be nourished together.', source: 'Taittiriya Upanishad' },
  { text: 'असतो मा सद्गमय तमसो मा ज्योतिर्गमय', translation: 'Lead me from untruth to truth, from darkness to light.', source: 'Brihadaranyaka Upanishad' },
  { text: 'योगः कर्मसु कौशलम्', translation: 'Yoga is skill in action.', source: 'Bhagavad Gita 2.50' },
]

export default function SpiritualQuotes() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    // Rotate quote every 8 seconds
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % quotes.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const quote = quotes[idx]

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900" />
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E')]" />
      </div>

      <div className="page-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Sanskrit text */}
          <div className="min-h-[4rem] flex items-center justify-center">
            <p
              key={idx}
              className="font-devanagari text-h2 md:text-display text-accent-200 leading-relaxed fade-up"
            >
              &ldquo;{quote.text}&rdquo;
            </p>
          </div>

          {/* Translation */}
          <div className="min-h-[3rem] flex items-center justify-center mt-4">
            <p
              key={`t-${idx}`}
              className="text-body text-secondary-300 max-w-lg mx-auto fade-up delay-1"
            >
              {quote.translation}
            </p>
          </div>

          {/* Source */}
          <p className="mt-4 text-caption text-secondary-400 font-semibold uppercase tracking-wider">
            — {quote.source}
          </p>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === idx ? 'bg-accent w-6' : 'bg-secondary-600 hover:bg-secondary-500'
                }`}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
