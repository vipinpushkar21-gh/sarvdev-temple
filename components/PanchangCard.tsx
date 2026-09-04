import type { PanchangData } from '@/lib/panchang/providers/types'

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm"><p className="text-caption uppercase tracking-[0.12em] text-gray-400">{label}</p><p className="mt-2 text-h3 font-serif text-gray-900">{value}</p></div>
}

export default function PanchangCard({ data }: { data: PanchangData }) {
  const fields = [
    ['Vara', data.vara], ['Hindu Month', data.hinduMonth], ['Paksha', data.paksha], ['Tithi', data.tithi],
    ['Nakshatra', data.nakshatra], ['Yoga', data.yoga], ['Karana', data.karana], ['Sunrise', data.sunrise],
    ['Sunset', data.sunset], ['Moonrise', data.moonrise], ['Moonset', data.moonset], ['Rahu Kaal', data.rahuKaal],
    ['Yamaganda', data.yamaganda], ['Gulika', data.gulika], ['Abhijit Muhurta', data.abhijitMuhurta], ['Brahma Muhurta', data.brahmaMuhurta],
  ].filter((field): field is [string, string] => Boolean(field[1]?.trim()))

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-overline uppercase tracking-[0.16em] text-amber-700">Calculated Panchang</p><h2 className="mt-1 text-h2 font-serif text-gray-900">{data.location.label || 'Selected location'}</h2><p className="mt-1 text-body-sm text-gray-500">{data.date} · {data.location.timezone}</p></div><p className="text-caption text-gray-500">Source: {data.source}</p></div>
      {fields.length > 0 ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{fields.map(([label, value]) => <InfoCard key={label} label={label} value={value} />)}</div> : <p className="rounded-2xl border border-amber-100 bg-white p-5 text-body-sm text-gray-600">The active provider did not return calculated Panchang fields for this date and location.</p>}
      {data.observances?.length ? <section className="rounded-2xl border border-amber-100 bg-white p-5"><p className="text-overline uppercase tracking-[0.16em] text-amber-700">Observances</p><ul className="mt-3 space-y-2 text-body-sm text-gray-700">{data.observances.map((observance) => <li key={observance}>{observance}</li>)}</ul></section> : null}
    </section>
  )
}
