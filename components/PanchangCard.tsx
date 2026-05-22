"use client"

import Link from 'next/link'

type PanchangData = {
  date: string
  location: { city?: string; lat: number; lon: number; tz: string }
  sun: { sunrise: string; sunset: string }
  moon?: { moonrise?: string; moonset?: string }
  tithi?: string
  nakshatra?: string
  yoga?: string
  karana?: string
  rahuKaal?: string
  abhijitMuhurta?: string
  source?: string
}

const guidanceByDay = [
  {
    deity: 'Surya',
    mantra: 'Om Suryaya Namah',
    color: 'Saffron',
    devotionalHref: '/devotionals',
    templeHref: '/deities/surya',
  },
  {
    deity: 'Shiva',
    mantra: 'Om Namah Shivaya',
    color: 'White',
    devotionalHref: '/devotionals?category=Mantra',
    templeHref: '/deities/shiva',
  },
  {
    deity: 'Hanuman',
    mantra: 'Om Hanumate Namah',
    color: 'Red',
    devotionalHref: '/devotionals?category=Chalisa',
    templeHref: '/deities/hanuman',
  },
  {
    deity: 'Ganesha',
    mantra: 'Om Gan Ganapataye Namah',
    color: 'Green',
    devotionalHref: '/devotionals?category=Mantra',
    templeHref: '/deities/ganesha',
  },
  {
    deity: 'Vishnu',
    mantra: 'Om Namo Bhagavate Vasudevaya',
    color: 'Yellow',
    devotionalHref: '/devotionals?category=Stotra',
    templeHref: '/deities/vishnu',
  },
  {
    deity: 'Lakshmi',
    mantra: 'Om Shreem Mahalakshmyai Namah',
    color: 'Pink',
    devotionalHref: '/devotionals?category=Aarti',
    templeHref: '/deities/lakshmi',
  },
  {
    deity: 'Shani',
    mantra: 'Om Sham Shanicharaya Namah',
    color: 'Indigo',
    devotionalHref: '/devotionals?category=Mantra',
    templeHref: '/deities/shani',
  },
]

function valueOrDash(value?: string) {
  return value?.trim() || '-'
}

function dayGuidance(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay()
  return guidanceByDay[day] || guidanceByDay[0]
}

function InfoCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-5 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <p className="text-caption uppercase tracking-[0.12em] text-gray-400">{label}</p>
      <p className="mt-2 text-h3 font-serif text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-body-sm text-gray-500">{sub}</p>}
    </div>
  )
}

export default function PanchangCard({ data, language }: { data: PanchangData, language: 'en' | 'hi' }) {
  const guidance = dayGuidance(data.date)
  const timeline = [
    { label: 'Brahma Muhurta', value: 'Before sunrise', note: 'Placeholder' },
    { label: 'Sunrise', value: valueOrDash(data.sun?.sunrise) },
    { label: 'Rahu Kaal', value: valueOrDash(data.rahuKaal) },
    { label: 'Abhijit', value: valueOrDash(data.abhijitMuhurta) },
    { label: 'Sunset', value: valueOrDash(data.sun?.sunset) },
    { label: 'Moonrise', value: valueOrDash(data.moon?.moonrise) },
  ]

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <InfoCard label="Sunrise" value={valueOrDash(data.sun?.sunrise)} sub={`Sunset ${valueOrDash(data.sun?.sunset)}`} accent="bg-amber-400" />
        <InfoCard label="Moonrise" value={valueOrDash(data.moon?.moonrise)} sub={`Moonset ${valueOrDash(data.moon?.moonset)}`} accent="bg-indigo-300" />
        <InfoCard label="Tithi" value={valueOrDash(data.tithi)} sub="Lunar day" accent="bg-rose-300" />
        <InfoCard label="Nakshatra" value={valueOrDash(data.nakshatra)} sub="Lunar mansion" accent="bg-sky-300" />
        <InfoCard label="Yoga" value={valueOrDash(data.yoga)} sub="Daily yoga" accent="bg-emerald-300" />
        <InfoCard label="Karana" value={valueOrDash(data.karana)} sub="Half tithi" accent="bg-violet-300" />
        <InfoCard label="Rahu Kaal" value={valueOrDash(data.rahuKaal)} sub="Avoid auspicious starts" accent="bg-slate-500" />
        <InfoCard label="Abhijit Muhurta" value={valueOrDash(data.abhijitMuhurta)} sub="Auspicious window" accent="bg-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-6">
        <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
          <p className="text-overline uppercase tracking-[0.16em] text-amber-600 mb-2">Today&apos;s Spiritual Guidance</p>
          <h2 className="text-h2 font-serif text-gray-900">{guidance.deity}</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-caption text-gray-400 uppercase tracking-[0.12em]">Recommended Mantra</p>
              <p className="text-body font-semibold text-gray-900">{guidance.mantra}</p>
            </div>
            <div>
              <p className="text-caption text-gray-400 uppercase tracking-[0.12em]">Recommended Color</p>
              <p className="text-body font-semibold text-gray-900">{guidance.color}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={guidance.devotionalHref} className="btn btn-primary btn-sm no-underline hover:no-underline">
              Devotional
            </Link>
            <Link href={guidance.templeHref} className="btn btn-outline btn-sm no-underline hover:no-underline">
              Deity Guide
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-overline uppercase tracking-[0.16em] text-gray-400">Daily Timeline</p>
              <h2 className="text-h3 font-serif text-gray-900">
                {data.location.city || 'Delhi'} · {data.location.tz}
              </h2>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-caption font-semibold text-gray-600">
              {data.date}
            </span>
          </div>
          <div className="space-y-3">
            {timeline.map((item, index) => (
              <div key={item.label} className="grid grid-cols-[1rem_1fr_auto] gap-3 items-center">
                <span className="h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                <div>
                  <p className="text-body-sm font-semibold text-gray-900">{item.label}</p>
                  {item.note && <p className="text-caption text-gray-400">{item.note}</p>}
                </div>
                <p className="text-body-sm font-semibold text-gray-700">{item.value}</p>
                {index < timeline.length - 1 && <span className="col-start-1 mx-auto h-6 w-px bg-amber-100" />}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-body-sm text-amber-900">
        <p className="font-semibold">
          Panchang timings may vary by location. Verify with local priest/panchang for rituals.
        </p>
        {data.source && (
          <p className="mt-2 text-caption text-amber-800">
            Source: {data.source}. {language === 'hi' ? 'यह डेमो/फॉलबैक डेटा है।' : 'This is demo/fallback data.'}
          </p>
        )}
      </div>
    </section>
  )
}
