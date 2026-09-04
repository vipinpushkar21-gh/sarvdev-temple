import Link from 'next/link'
import { slugifyTemple } from '@/lib/temple-normalization'
import type { PlaceCount } from '@/lib/temple-discovery'

export default function PlaceDiscovery({ states }: { states: PlaceCount[] }) {
  if (states.length === 0) return null
  const lead = states.slice(0, 6)
  const rest = states.slice(6, 30)

  return (
    <section className="border-t border-surface-border py-section-sm">
      <div className="page-container">
        <div className="max-w-2xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">Explore by place</p>
          <h2 className="mt-2 font-display text-h1 text-secondary-800">Bharat, state by state</h2>
          <p className="mt-3 text-body text-ink-muted">
            Every temple in this collection is recorded with its city, district and state. Begin with a state and
            move inward to a district or town.
          </p>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {lead.map((state) => (
            <Link
              key={state.name}
              href={`/temples/state/${slugifyTemple(state.name)}`}
              className="group border-b border-surface-border pb-4 no-underline hover:no-underline"
            >
              <span className="block font-display text-h3 text-secondary-800 transition-colors group-hover:text-primary-700">
                {state.name}
              </span>
              <span className="mt-1 block text-caption uppercase tracking-[0.12em] text-ink-muted">
                {state.count} {state.count === 1 ? 'temple' : 'temples'}
              </span>
            </Link>
          ))}
        </div>

        {rest.length > 0 && (
          <p className="mt-7 text-body-sm leading-loose text-ink-muted">
            {rest.map((state, index) => (
              <span key={state.name}>
                <Link
                  href={`/temples/state/${slugifyTemple(state.name)}`}
                  className="text-ink-muted no-underline transition-colors hover:text-primary-700"
                >
                  {state.name}
                </Link>
                {index < rest.length - 1 ? <span className="px-2 text-ink-faint">·</span> : null}
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  )
}
