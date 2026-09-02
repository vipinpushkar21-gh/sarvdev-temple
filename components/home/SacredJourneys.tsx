import Link from 'next/link'
import { SACRED_CATEGORIES } from '@/lib/sacred-categories'

const journeySlugs = ['char-dham', 'jyotirlinga', 'shakti-peeth', 'divya-desam', 'panch-kedar']

export default function SacredJourneys() {
  const journeys = journeySlugs.map((slug) => SACRED_CATEGORIES.find((category) => category.slug === slug)).filter(Boolean)
  if (!journeys.length) return null

  return <section className="bg-surface-raised py-14 sm:py-20">
    <div className="page-container">
      <div className="flex items-end justify-between gap-5">
        <div className="max-w-2xl"><p className="text-overline font-semibold uppercase tracking-[.14em] text-primary">Pilgrimage traditions</p><h2 className="mt-2 font-display text-h1 text-secondary-800">Sacred Journeys</h2><p className="mt-3 text-body text-ink-muted">Follow India&apos;s living pilgrimage traditions through their places, stories and worship.</p></div>
        <Link href="/temples/pilgrimage" className="hidden text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon sm:inline-flex">View all journeys <Arrow /></Link>
      </div>
      <div className="mt-9 border-y border-surface-border py-2 sm:py-3">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 sm:hidden">
          {journeys.map((journey, index) => journey && <Journey key={journey.slug} journey={journey} index={index} mobile />)}
        </div>
        <div className="hidden lg:grid lg:grid-cols-[minmax(15rem,.78fr)_minmax(0,1.22fr)] lg:gap-12">
          {journeys[0] && <Journey journey={journeys[0]} index={0} lead />}
          <div className="grid grid-cols-2 border-l border-surface-border">
            {journeys.slice(1).map((journey, index) => journey && <Journey key={journey.slug} journey={journey} index={index + 1} />)}
          </div>
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:hidden">
          {journeys.map((journey, index) => journey && <Journey key={journey.slug} journey={journey} index={index} />)}
        </div>
      </div>
      <Link href="/temples/pilgrimage" className="mt-6 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon sm:hidden">View all journeys <Arrow /></Link>
    </div>
  </section>
}

function Journey({ journey, index, lead, mobile }: { journey: NonNullable<ReturnType<typeof SACRED_CATEGORIES.find>>; index: number; lead?: boolean; mobile?: boolean }) {
  return <Link href={`/temples/pilgrimage/${journey.slug}`} className={`group relative no-underline ${mobile ? 'min-w-[78vw] snap-start border-r border-surface-border pr-6' : 'px-5 py-5 even:border-l even:border-surface-border lg:px-7 lg:py-4'} ${lead ? 'border-r border-surface-border pl-0 lg:py-6' : ''}`}>
    <div className="flex items-start gap-4"><span className="font-display text-[2rem] leading-none text-accent-700/80">{String(index + 1).padStart(2, '0')}</span><span className="mt-3 h-px flex-1 bg-accent-700/30" /></div>
    <p className="mt-4 font-devanagari text-caption text-accent-700/80">{journey.nameHi}</p><h3 className={`${lead ? 'mt-2 text-[2rem]' : 'mt-1 text-h4'} font-display leading-tight text-secondary-800 group-hover:text-primary-700`}>{journey.name}</h3><p className="mt-2 max-w-md text-caption leading-5 text-ink-muted line-clamp-2">{journey.description}</p><span className="mt-4 inline-flex text-caption font-semibold text-primary-700">Explore <Arrow /></span>
  </Link>
}

function Arrow() { return <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
