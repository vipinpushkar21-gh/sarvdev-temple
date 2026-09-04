import Link from 'next/link'

const offerings = [
  ['Temple directory', 'Discover published temple records through place, deity and sacred-collection paths.'],
  ['Devotional study', 'Listen to and read the devotional records available in Sarvdev.'],
  ['Living calendar', 'Explore Daily Darshan, events and Panchang where data is available.'],
]

export default function AboutPage() {
  return (
    <main className="bg-surface pb-20">
      <div className="page-container py-12 sm:py-16">
        <header className="max-w-3xl border-l-2 border-primary-700 pl-5">
          <p className="text-overline font-semibold uppercase tracking-[.18em] text-primary-700">About Sarvdev</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">A place to encounter Hindu sacred traditions with care.</h1>
          <p className="mt-5 text-lg leading-8 text-ink-muted">Sarvdev brings together a growing temple directory and devotional resources for people exploring living traditions, places of worship and cultural memory.</p>
        </header>

        <section className="mt-14 max-w-4xl border-y border-surface-border py-10">
          <p className="max-w-3xl text-xl leading-9 text-ink">We make room for discovery without claiming to be a complete record of every temple, practice or tradition. Information is presented from the records currently available on Sarvdev and should be confirmed with a temple before travel or worship.</p>
        </section>

        <section className="mt-14 max-w-5xl">
          <p className="text-overline font-semibold uppercase tracking-[.16em] text-primary-700">On Sarvdev</p>
          <div className="mt-5 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {offerings.map(([title, description], index) => (
              <article key={title} className="border-t border-surface-border pt-4">
                <p className="font-serif text-sm text-primary-700">0{index + 1}</p>
                <h2 className="mt-2 font-serif text-2xl text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 flex max-w-4xl flex-col gap-5 border-t border-surface-border pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="font-serif text-3xl text-ink">Help shape the directory.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">Know of a temple that should be represented? You can share its details for review.</p></div>
          <div className="flex gap-4"><Link href="/temples" className="btn btn-outline no-underline">Explore temples</Link><Link href="/list-temple" className="btn btn-primary no-underline">List a temple</Link></div>
        </section>
      </div>
    </main>
  )
}
