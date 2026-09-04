"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '../lib/translation'
import { getCalendarDateInTimeZone, type PanchangApiResponse } from '../lib/panchang/providers/types'

export default function PanchangToday() {
  const { language } = useTranslation()
  const [response, setResponse] = useState<PanchangApiResponse | null>(null)

  useEffect(() => {
    const params = new URLSearchParams({ date: getCalendarDateInTimeZone('Asia/Kolkata'), lat: '28.6139', lon: '77.2090', tz: 'Asia/Kolkata', lang: language, city: 'Delhi' })
    fetch(`/api/panchang?${params.toString()}`, { cache: 'no-store' })
      .then(async (result) => setResponse(await result.json() as PanchangApiResponse))
      .catch(() => setResponse({ status: 'unavailable', message: 'Panchang calculations are temporarily unavailable.' }))
  }, [language])

  if (!response) return null
  if (response.status !== 'success') return <section className="section-sm"><div className="page-container"><div className="rounded-2xl border border-amber-100 bg-white p-5 text-body-sm text-gray-600"><p className="font-semibold text-gray-900">{language === 'hi' ? 'पंचांग गणना अस्थायी रूप से उपलब्ध नहीं है।' : 'Panchang calculations are temporarily unavailable.'}</p><Link href="/panchang" className="mt-2 inline-block text-body-sm font-semibold text-primary no-underline hover:underline">{language === 'hi' ? 'पंचांग देखें' : 'Visit Panchang'}</Link></div></div></section>

  const data = response.data
  const items = [['Tithi', data.tithi], ['Nakshatra', data.nakshatra], ['Sunrise', data.sunrise], ['Sunset', data.sunset]].filter((item): item is [string, string] => Boolean(item[1]?.trim()))
  return <section className="section-sm"><div className="page-container"><div className="rounded-2xl border border-gray-100 p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="text-overline uppercase tracking-[0.12em] text-gray-400">{data.date} · {data.location.label || 'Delhi'}</p><h2 className="mt-1 text-h2 font-serif text-gray-900">{language === 'hi' ? 'आज का पंचांग' : "Today's Panchang"}</h2></div><Link href="/panchang" className="text-body-sm font-semibold text-primary no-underline hover:underline">{language === 'hi' ? 'पूरा पंचांग' : 'Full Panchang'}</Link></div>{items.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map(([label, value]) => <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"><p className="text-overline text-gray-400">{label}</p><p className="mt-1 text-body-sm font-semibold text-gray-900">{value}</p></div>)}</div> : null}</div></div></section>
}
