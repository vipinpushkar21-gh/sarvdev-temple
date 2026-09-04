import Link from 'next/link'
import SarvdevImage from '@/components/SarvdevImage'
import { getTempleCardImage } from '@/lib/temple-image'

type Temple = {
  _id?: string
  title: string
  slug?: string
  shortDescription?: string
  description?: string
  location?: string
  city?: string
  state?: string
  deity?: string
  speciality?: string
  sacredCategories?: string[]
  categories?: string[]
  verified?: string
  image?: string
  imageCard?: string
  imageHero?: string
  primaryMedia?: any
  cardMedia?: any
  heroMedia?: any
}

export default function TempleDiscovery({ temples }: { temples: Temple[] }) {
  if (!temples.length) return null
  const [lead, ...supporting] = temples

  return (
    <section className="bg-surface py-section-sm sm:py-section">
      <div className="page-container">
        <div className="flex items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Sacred places</p>
            <h2 className="mt-2 font-display text-h1 text-secondary-800">Temple Discovery</h2>
            <p className="mt-3 text-body text-ink-muted">A considered selection from Sarvdev&apos;s growing temple directory.</p>
          </div>
          <Link href="/temples" className="hidden shrink-0 text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon sm:inline-flex">Explore all temples <Arrow /></Link>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1.16fr)_minmax(22rem,0.84fr)] lg:gap-6">
          <TempleFeature temple={lead} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">{supporting.map((temple) => <TempleTile key={String(temple._id || temple.slug || temple.title)} temple={temple} />)}</div>
        </div>
        <Link href="/temples" className="mt-6 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon sm:hidden">Explore all temples <Arrow /></Link>
      </div>
    </section>
  )
}

function TempleFeature({ temple }: { temple: Temple }) {
  const meta = temple.speciality || temple.sacredCategories?.[0] || temple.categories?.[0]
  return <Link href={`/temples/${temple.slug}`} className="group relative min-h-[360px] overflow-hidden bg-secondary-900 no-underline hover:no-underline sm:min-h-[480px]">
    <SarvdevImage image={getTempleCardImage(temple)} alt={temple.title} className="absolute inset-0" imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]" renderMode="auto" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/90 via-[#171411]/35 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
      {temple.verified === 'verified' && <p className="text-overline font-semibold uppercase tracking-[0.13em] text-accent-200">Verified listing</p>}
      <h3 className="mt-2 font-display text-[2rem] leading-tight text-white sm:text-[2.6rem]">{temple.title}</h3>
      <TempleMeta temple={temple} className="mt-3 text-stone-200" />
      {(meta || temple.shortDescription || temple.description) && <p className="mt-3 max-w-xl text-body-sm text-stone-200 line-clamp-2">{meta || temple.shortDescription || temple.description}</p>}
    </div>
  </Link>
}

function TempleTile({ temple }: { temple: Temple }) {
  const meta = temple.speciality || temple.sacredCategories?.[0] || temple.categories?.[0]
  return <Link href={`/temples/${temple.slug}`} className="group min-w-0 border border-surface-border bg-surface-raised no-underline hover:border-primary-300 hover:no-underline">
    <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken"><SarvdevImage image={getTempleCardImage(temple)} alt={temple.title} className="absolute inset-0" imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]" renderMode="auto" /></div>
    <div className="p-4"><h3 className="font-display text-h4 leading-tight text-secondary-800 group-hover:text-primary-700 line-clamp-2">{temple.title}</h3><TempleMeta temple={temple} className="mt-2 text-caption text-ink-muted" />{meta && <p className="mt-2 text-caption text-ink-muted line-clamp-1">{meta}</p>}</div>
  </Link>
}

function TempleMeta({ temple, className }: { temple: Temple; className: string }) {
  const location = temple.location || [temple.city, temple.state].filter(Boolean).join(', ')
  return <p className={className}>{[location, temple.deity].filter(Boolean).join(' · ')}</p>
}
function Arrow() { return <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
