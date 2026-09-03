import Link from 'next/link'

export function buildDevotionalPageHref(basePath: string, params: Record<string, string>, page: number) {
  const search = new URLSearchParams(params)
  if (page > 1) search.set('page', String(page))
  else search.delete('page')
  const query = search.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default function DevotionalPagination({
  basePath,
  params,
  page,
  pages,
}: {
  basePath: string
  params: Record<string, string>
  page: number
  pages: number
}) {
  if (pages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
      {page > 1 ? (
        <Link
          href={buildDevotionalPageHref(basePath, params, page - 1)}
          className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
        >
          ← Previous
        </Link>
      ) : <span />}
      <span className="text-caption text-ink-muted">Page {page} of {pages}</span>
      {page < pages ? (
        <Link
          href={buildDevotionalPageHref(basePath, params, page + 1)}
          className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
        >
          Next →
        </Link>
      ) : <span />}
    </nav>
  )
}
