"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DeityContent {
  devotionals: string[]
  mantras: string[]
  relatedTempleLink: string
  festivals: string[]
  pilgrimageLink?: string
}

const DEITY_MAP: Record<string, DeityContent> = {
  shiva: {
    devotionals: ['Shiv Chalisa', 'Shiv Aarti', 'Rudrashtakam', 'Shiv Tandav Stotram', 'Lingashtakam'],
    mantras: ['Om Namah Shivaya', 'Mahamrityunjaya Mantra', 'Shiva Gayatri Mantra'],
    relatedTempleLink: '/temples/deity/shiva',
    festivals: ['Mahashivratri', 'Shravan Month', 'Pradosh Vrat'],
    pilgrimageLink: '/temples/pilgrimage/jyotirlinga',
  },
  krishna: {
    devotionals: ['Krishna Chalisa', 'Krishna Aarti', 'Achyutam Keshavam', 'Govind Bolo', 'Hare Krishna Mahamantra'],
    mantras: ['Hare Krishna Maha Mantra', 'Om Namo Bhagavate Vasudevaya', 'Krishna Gayatri'],
    relatedTempleLink: '/temples/deity/krishna',
    festivals: ['Janmashtami', 'Holi', 'Govardhan Puja', 'Dahi Handi'],
  },
  ram: {
    devotionals: ['Ram Chalisa', 'Ram Aarti', 'Ram Raksha Stotra', 'Ramcharitmanas', 'Ram Stuti'],
    mantras: ['Sri Ram Jai Ram Jai Jai Ram', 'Ram Gayatri Mantra', 'Om Shri Ramaya Namah'],
    relatedTempleLink: '/temples/deity/ram',
    festivals: ['Ram Navami', 'Diwali', 'Vivah Panchami'],
  },
  hanuman: {
    devotionals: ['Hanuman Chalisa', 'Hanuman Aarti', 'Bajrang Baan', 'Sankat Mochan', 'Hanuman Ashtak'],
    mantras: ['Om Hanumate Namah', 'Hanuman Gayatri Mantra', 'Anjaneya Mantra'],
    relatedTempleLink: '/temples/deity/hanuman',
    festivals: ['Hanuman Jayanti', 'Tuesday Vrat'],
  },
  ganesh: {
    devotionals: ['Ganesh Chalisa', 'Ganesh Aarti', 'Ganesh Stotram', 'Vakratunda Mahakaya', 'Ganapati Atharvashirsha'],
    mantras: ['Om Gan Ganapataye Namah', 'Ganesh Gayatri', 'Vakratunda Mantra'],
    relatedTempleLink: '/temples/deity/ganesh',
    festivals: ['Ganesh Chaturthi', 'Sankashti Chaturthi'],
  },
  durga: {
    devotionals: ['Durga Chalisa', 'Durga Aarti', 'Durga Saptashati', 'Mahishasura Mardini Stotram', 'Nav Durga Stuti'],
    mantras: ['Om Dum Durgaye Namah', 'Durga Gayatri', 'Sarva Mangala Mangalye'],
    relatedTempleLink: '/temples/deity/durga',
    festivals: ['Navratri', 'Durga Puja', 'Vijayadashami'],
    pilgrimageLink: '/temples/pilgrimage/shakti-peeth',
  },
  vishnu: {
    devotionals: ['Vishnu Chalisa', 'Vishnu Sahasranamam', 'Vishnu Aarti', 'Narayana Stotram'],
    mantras: ['Om Namo Narayanaya', 'Vishnu Gayatri Mantra', 'Om Namo Bhagavate Vasudevaya'],
    relatedTempleLink: '/temples/deity/vishnu',
    festivals: ['Ekadashi', 'Dev Uthani Ekadashi', 'Kartik Purnima'],
    pilgrimageLink: '/temples/pilgrimage/divya-desam',
  },
  lakshmi: {
    devotionals: ['Lakshmi Chalisa', 'Lakshmi Aarti', 'Sri Suktam', 'Kanakadhara Stotram', 'Ashtalakshmi Stotram'],
    mantras: ['Om Shreem Mahalakshmiyei Namah', 'Lakshmi Gayatri', 'Om Hreem Shreem Kleem'],
    relatedTempleLink: '/temples/deity/lakshmi',
    festivals: ['Diwali', 'Sharad Purnima', 'Varalakshmi Vrat'],
  },
}

function matchDeity(deityName: string): DeityContent | null {
  if (!deityName) return null
  const lower = deityName.toLowerCase()
  for (const [key, content] of Object.entries(DEITY_MAP)) {
    if (lower.includes(key)) return content
  }
  // Extended alias matching
  if (/mahadev|shiv|shankar|bholenath|mahadeva|neelkanth/i.test(lower)) return DEITY_MAP.shiva
  if (/gopal|govind|kanha|radha.*krishn/i.test(lower)) return DEITY_MAP.krishna
  if (/sita|raghunath|raghu/i.test(lower)) return DEITY_MAP.ram
  if (/bajrang|maruti|anjaneya|pawanputra/i.test(lower)) return DEITY_MAP.hanuman
  if (/ganapati|vinayak|vighn/i.test(lower)) return DEITY_MAP.ganesh
  if (/parvati|kali|chamunda|vaishno|devi|mata|shakti|amba|jagdamba/i.test(lower)) return DEITY_MAP.durga
  if (/narayan|venkatesh|balaji|tirupati|perumal/i.test(lower)) return DEITY_MAP.vishnu
  return null
}

interface Props {
  deity?: string
  templeName?: string
}

export default function DeitySmartContent({ deity, templeName }: Props) {
  const [devotionals, setDevotionals] = useState<any[]>([])
  const content = matchDeity(deity || '')

  useEffect(() => {
    if (!content) return
    // Fetch devotionals matching this deity
    const deityKey = Object.entries(DEITY_MAP).find(([, v]) => v === content)?.[0] || ''
    if (!deityKey) return
    fetch(`/api/devotionals?deity=${encodeURIComponent(deityKey)}&limit=4`)
      .then(r => r.ok ? r.json() : { devotionals: [] })
      .then(data => setDevotionals((data.devotionals || []).slice(0, 4)))
      .catch(() => {})
  }, [content])

  if (!content) return null

  return (
    <section className="bento-card p-6 reveal-up">
      <div className="section-heading-2030 mb-0">
        <h2 className="!text-h3">Devotional Content for {deity}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {/* Mantras & Prayers */}
        <div>
          <h3 className="text-body-sm font-bold text-secondary-700 flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-sm">🙏</span>
            Sacred Mantras
          </h3>
          <ul className="space-y-2">
            {content.mantras.map(m => (
              <li key={m} className="text-body-sm text-ink-muted flex items-start gap-2">
                <span className="text-primary mt-0.5 text-xs">●</span>
                <span className="font-medium">{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Devotional Music */}
        <div>
          <h3 className="text-body-sm font-bold text-secondary-700 flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-accent-50 flex items-center justify-center text-sm">🎵</span>
            Bhajans & Chalisa
          </h3>
          <ul className="space-y-2">
            {content.devotionals.slice(0, 5).map(d => (
              <li key={d} className="text-body-sm text-ink-muted flex items-start gap-2">
                <span className="text-accent-500 mt-0.5 text-xs">●</span>
                <Link href="/devotionals" className="font-medium text-ink hover:text-primary-700 transition-colors no-underline hover:no-underline">{d}</Link>
              </li>
            ))}
          </ul>
          {devotionals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-border">
              <p className="text-caption font-semibold text-ink mb-2">Listen Now</p>
              {devotionals.map((d: any) => (
                <Link
                  key={d._id}
                  href={`/devotionals/${d._id}`}
                  className="block text-caption text-primary-600 font-medium py-0.5 no-underline hover:no-underline hover:text-primary-800 transition-colors"
                >
                  ▸ {d.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Festivals & Explore */}
        <div>
          <h3 className="text-body-sm font-bold text-secondary-700 flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-sm">🪔</span>
            Related Festivals
          </h3>
          <ul className="space-y-2 mb-4">
            {content.festivals.map(f => (
              <li key={f} className="text-body-sm text-ink-muted flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 text-xs">●</span>
                <span className="font-medium">{f}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            <Link
              href={content.relatedTempleLink}
              className="btn btn-sm btn-outline no-underline hover:no-underline"
            >
              More {deity} Temples →
            </Link>
            {content.pilgrimageLink && (
              <Link
                href={content.pilgrimageLink}
                className="btn btn-sm btn-ghost no-underline hover:no-underline"
              >
                Pilgrimage Circuit →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
