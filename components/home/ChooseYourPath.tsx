import Link from 'next/link'

const paths = [
  { title: 'Temples', detail: 'Find sacred places across India', href: '/temples', icon: 'temple' },
  { title: 'Deities', detail: 'Explore divine forms and traditions', href: '/deities', icon: 'deity' },
  { title: 'Daily Darshan', detail: 'Watch a moment of worship', href: '/daily-darshan', icon: 'darshan' },
  { title: 'Devotionals', detail: 'Listen, read and recite', href: '/devotionals', icon: 'music' },
  { title: 'Festivals', detail: 'Follow sacred observances', href: '/events', icon: 'calendar' },
  { title: 'Panchang', detail: 'Plan today with clarity', href: '/panchang', icon: 'sun' },
] as const

export default function ChooseYourPath() {
  return (
    <section className="bg-surface py-section-sm sm:py-section">
      <div className="page-container">
        <div className="max-w-2xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Begin your journey</p>
          <h2 className="mt-2 font-display text-h1 text-secondary-800">Choose your path</h2>
          <p className="mt-3 text-body text-ink-muted">From a temple visit to a daily ritual, each path opens into Sarvdev&apos;s wider sacred archive.</p>
        </div>

        <div className="mt-9 grid grid-cols-2 border-l border-t border-surface-border sm:mt-12 lg:grid-cols-3">
          {paths.map((path) => (
            <Link key={path.href} href={path.href} className="group min-h-[178px] border-b border-r border-surface-border bg-surface-raised p-5 no-underline transition-colors hover:bg-primary-50/45 hover:no-underline sm:min-h-[192px] sm:p-6">
              <PathIcon kind={path.icon} />
              <h3 className="mt-7 font-display text-h3 text-secondary-800 group-hover:text-primary-700">{path.title}</h3>
              <p className="mt-2 text-body-sm leading-6 text-ink-muted">{path.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-caption font-semibold text-primary-700 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">Explore <Arrow /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PathIcon({ kind }: { kind: (typeof paths)[number]['icon'] }) {
  const shapes = {
    temple: <><path d="M3 21h18M4 10h16M6 8l6-4 6 4M7 10v8m5-8v8m5-8v8" /></>,
    deity: <><circle cx="12" cy="12" r="8" /><path d="M12 6v12M6 12h12" /></>,
    darshan: <><path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    music: <><path d="M9 18V6l10-2v12M9 18a3 3 0 1 1-2-2.83M19 16a3 3 0 1 1-2-2.83" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="1" /><path d="M8 3v4m8-4v4M4 10h16" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-2.9-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m0-14.2 1.4 1.4m11.4 11.4 1.4 1.4" /></>,
  }
  return <svg className="h-6 w-6 text-primary-700" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">{shapes[kind]}</svg>
}

function Arrow() { return <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
