import Link from 'next/link'
import DevotionalListenButton from './DevotionalListenButton'

type Devotional = { _id?: string; title: string; titleHi?: string; slug?: string; description?: string; category?: string; deity?: string; language?: string; audio?: string; audioUrl?: string; duration?: string; featured?: boolean }

export default function DevotionalLibrary({ devotionals }: { devotionals: Devotional[] }) {
  if (!devotionals.length) return null
  const [featured, ...supporting] = devotionals
  const audio = featured.audioUrl || featured.audio
  return <section className="bg-[#f1eadf] py-section-sm sm:py-section">
    <div className="page-container"><div className="max-w-2xl"><p className="text-overline font-semibold uppercase tracking-[.14em] text-primary">Prayer, reading and listening</p><h2 className="mt-2 font-display text-h1 text-secondary-800">Devotional Library</h2></div>
      <div className="mt-9 grid border-y border-surface-border lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)]">
        <div className="py-7 pr-0 sm:py-9 lg:pr-10"><p className="text-overline font-semibold uppercase tracking-[.14em] text-accent-700">Featured devotional</p><h3 className="mt-3 font-display text-[2rem] leading-tight text-secondary-800">{featured.title}</h3>{featured.titleHi && <p className="mt-2 font-devanagari text-body text-ink-muted">{featured.titleHi}</p>}{featured.description && <p className="mt-4 max-w-xl text-body-sm leading-6 text-ink-muted line-clamp-3">{featured.description}</p>}<Meta item={featured} /><div className="mt-7 flex flex-wrap gap-3"><DevotionalListenButton id={String(featured._id || featured.slug || featured.title)} title={featured.title} deity={featured.deity} audio={audio} /><Link href={`/devotionals/${featured.slug}`} className="btn border border-secondary-300 bg-transparent text-secondary-800 no-underline hover:bg-surface">Read devotional</Link></div></div>
        <div className="border-t border-surface-border py-3 lg:border-l lg:border-t-0 lg:py-5 lg:pl-8">{supporting.map((item) => <Link key={String(item._id || item.slug || item.title)} href={`/devotionals/${item.slug}`} className="group block border-b border-surface-border py-4 last:border-0 no-underline"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-h4 text-secondary-800 group-hover:text-primary-700">{item.title}</h3><Meta item={item} compact /></div><span className="shrink-0 text-caption font-semibold text-primary-700">Open</span></div></Link>)}</div>
      </div><Link href="/devotionals" className="mt-7 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">Explore devotionals <Arrow /></Link>
    </div>
  </section>
}
function Meta({ item, compact }: { item: Devotional; compact?: boolean }) { const values = [item.deity, item.category, item.language, item.duration].filter(Boolean); return values.length ? <p className={`text-caption text-ink-muted ${compact ? 'mt-2' : 'mt-4'}`}>{values.join(' · ')}</p> : null }
function Arrow() { return <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
