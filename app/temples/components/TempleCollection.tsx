import Link from 'next/link'
import Breadcrumbs, { type BreadcrumbItem } from '@/components/Breadcrumbs'
import TempleCard from './TempleCard'
import type { TempleCardRecord } from '@/lib/temple-discovery'

export type FacetGroup = {
  title: string
  links: { href: string; label: string; count?: number }[]
}

export default function TempleCollection({
  breadcrumbs,
  overline,
  title,
  intro,
  temples,
  total,
  page,
  pages,
  pageHref,
  facets = [],
  emptyMessage,
  children,
}: {
  breadcrumbs: BreadcrumbItem[]
  overline: string
  title: string
  intro?: string
  temples: TempleCardRecord[]
  total: number
  page: number
  pages: number
  pageHref: (page: number) => string
  facets?: FacetGroup[]
  emptyMessage?: string
  children?: React.ReactNode
}) {
  return (
    <>
      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 max-w-3xl">
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">{overline}</p>
            <h1 className="mt-2 font-display text-display-sm text-secondary-800">{title}</h1>
            {intro && <p className="mt-4 text-body text-ink-muted">{intro}</p>}
          </div>
        </div>
      </header>

      <main className="page-container py-section-sm">
        {facets.filter((facet) => facet.links.length > 0).map((facet) => (
          <section key={facet.title} className="mb-9">
            <h2 className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">{facet.title}</h2>
            <p className="mt-2.5 text-body-sm leading-loose text-ink-muted">
              {facet.links.map((link, index) => (
                <span key={link.href}>
                  <Link href={link.href} className="text-ink-muted no-underline transition-colors hover:text-primary-700">
                    {link.label}
                  </Link>
                  {typeof link.count === 'number' && <span className="ml-1 text-caption text-ink-faint">{link.count}</span>}
                  {index < facet.links.length - 1 ? <span className="px-2 text-ink-faint">·</span> : null}
                </span>
              ))}
            </p>
          </section>
        ))}

        {temples.length === 0 ? (
          <div className="border border-surface-border bg-surface-raised p-8 text-center">
            <h2 className="font-display text-h3 text-secondary-800">{emptyMessage || 'No temples recorded here yet'}</h2>
            <Link href="/temples" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              Browse the full atlas
            </Link>
          </div>
        ) : (
          <>
            <p className="text-body-sm text-ink-muted">
              {total} {total === 1 ? 'temple' : 'temples'}
              {pages > 1 ? ` · page ${page} of ${pages}` : ''}
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {temples.map((temple) => (
                <TempleCard key={temple._id} temple={temple} />
              ))}
            </div>

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    ← Previous
                  </Link>
                ) : <span />}
                <span className="text-caption text-ink-muted">Page {page} of {pages}</span>
                {page < pages ? (
                  <Link href={pageHref(page + 1)} className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
                    Next →
                  </Link>
                ) : <span />}
              </nav>
            )}
          </>
        )}

        {children}
      </main>
    </>
  )
}
