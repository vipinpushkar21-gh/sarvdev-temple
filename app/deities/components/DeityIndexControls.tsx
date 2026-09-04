'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export type DeityCategoryOption = {
  slug: string
  name: string
  nameHi?: string
  count: number
}

function buildHref(query: string, category: string) {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (category) params.set('category', category)
  const search = params.toString()
  return search ? `/deities?${search}` : '/deities'
}

export default function DeityIndexControls({
  query,
  category,
  categories,
}: {
  query: string
  category: string
  categories: DeityCategoryOption[]
}) {
  const router = useRouter()
  const [value, setValue] = useState(query)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push(buildHref(value, category))
  }

  return (
    <div className="border-y border-surface-border bg-surface-raised">
      <div className="page-container py-5">
        <form onSubmit={onSubmit} role="search" className="flex flex-wrap items-center gap-3">
          <label htmlFor="deity-search" className="sr-only">Search deities</label>
          <input
            id="deity-search"
            name="q"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search by name, Hindi name or alias"
            className="min-w-0 flex-1 border border-surface-border bg-surface px-4 py-2.5 text-body-sm text-ink outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            className="border border-primary bg-primary px-5 py-2.5 text-body-sm font-semibold text-white transition hover:bg-maroon"
          >
            Search
          </button>
          {(query || category) && (
            <button
              type="button"
              onClick={() => { setValue(''); router.push('/deities') }}
              className="text-body-sm font-medium text-ink-muted underline-offset-4 hover:text-primary-700 hover:underline"
            >
              Clear
            </button>
          )}
        </form>

        {categories.length > 0 && (
          <nav aria-label="Deity categories" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <CategoryLink href={buildHref(value, '')} active={!category} label="All" />
            {categories.map((option) => (
              <CategoryLink
                key={option.slug}
                href={buildHref(value, option.slug)}
                active={category === option.slug}
                label={option.name}
                count={option.count}
              />
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}

function CategoryLink({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-current={active ? 'true' : undefined}
      className={`text-body-sm transition ${
        active
          ? 'font-semibold text-primary-700 underline underline-offset-4'
          : 'text-ink-muted hover:text-secondary-800'
      }`}
    >
      {label}
      {typeof count === 'number' && <span className="ml-1 text-caption text-ink-muted">{count}</span>}
    </button>
  )
}
