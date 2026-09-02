import Link from 'next/link'
import SarvdevImage from '@/components/SarvdevImage'
import { getDeityCardImage } from '@/lib/temple-image'

type Deity = { _id?: string; name: string; nameHi?: string; slug: string; description?: string; categoryName?: string; image?: string; imageCard?: string; primaryMedia?: any; cardMedia?: any }

export default function DivineForms({ deities }: { deities: Deity[] }) {
  if (!deities.length) return null
  return (
    <section className="border-y border-surface-border bg-surface-raised py-section-sm sm:py-section">
      <div className="page-container">
        <div className="max-w-2xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Divine traditions</p>
          <h2 className="mt-2 font-display text-h1 text-secondary-800">Divine Forms</h2>
          <p className="mt-3 text-body text-ink-muted">Explore the deities, stories and sacred places that shape living worship.</p>
        </div>
        <div className="mt-9 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 lg:grid-cols-8">
          {deities.map((deity) => <Link key={String(deity._id || deity.slug)} href={`/deities/${deity.slug}`} className="group w-[44vw] shrink-0 snap-start no-underline hover:no-underline sm:w-auto">
            <div className="aspect-[4/5] overflow-hidden border border-surface-border bg-surface-sunken"><SarvdevImage image={getDeityCardImage(deity)} alt={deity.name} className="absolute inset-0" imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]" renderMode="auto" /></div>
            <h3 className="mt-3 font-display text-h4 leading-tight text-secondary-800 group-hover:text-primary-700">{deity.name}</h3>
            {deity.nameHi && <p className="mt-1 font-devanagari text-caption text-ink-muted">{deity.nameHi}</p>}
            {!deity.nameHi && deity.categoryName && <p className="mt-1 text-caption text-ink-muted">{deity.categoryName}</p>}
          </Link>)}
        </div>
        <Link href="/deities" className="mt-7 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">Explore all deities <Arrow /></Link>
      </div>
    </section>
  )
}
function Arrow() { return <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
