'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export type LibraryOption = { value: string; label: string; count?: number }

export type LibraryFilterState = {
  q: string
  category: string
  deity: string
  language: string
  sort: string
}

function buildHref(
  basePath: string,
  next: LibraryFilterState,
  extra: Record<string, string> = {},
  lockedCategory = false,
) {
  const params = new URLSearchParams(extra)
  if (next.q.trim()) params.set('q', next.q.trim())
  if (next.category && !lockedCategory) params.set('category', next.category)
  if (next.deity) params.set('deity', next.deity)
  if (next.language) params.set('language', next.language)
  if (next.sort && next.sort !== 'featured') params.set('sort', next.sort)
  const search = params.toString()
  return search ? `${basePath}?${search}` : basePath
}

export default function DevotionalLibraryControls({
  basePath = '/devotionals',
  filters,
  categories,
  deities,
  languages,
  lockedCategory = false,
  extraParams,
  searchPlaceholder = 'Search by name, deity or category',
}: {
  basePath?: string
  filters: LibraryFilterState
  categories: LibraryOption[]
  deities: LibraryOption[]
  languages: LibraryOption[]
  lockedCategory?: boolean
  extraParams?: Record<string, string>
  searchPlaceholder?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(filters.q)

  function go(next: Partial<LibraryFilterState>) {
    router.push(buildHref(basePath, { ...filters, q: value, ...next }, extraParams, lockedCategory))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    go({})
  }

  const hasFilters = Boolean(
    filters.q || (!lockedCategory && filters.category) || filters.deity || filters.language ||
    (filters.sort && filters.sort !== 'featured')
  )

  return (
    <div className="border-y border-surface-border bg-surface-raised">
      <div className="page-container py-5">
        <form onSubmit={onSubmit} role="search" className="flex flex-wrap items-center gap-3">
          <label htmlFor="devotional-search" className="sr-only">Search devotionals</label>
          <input
            id="devotional-search"
            name="q"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 border border-surface-border bg-surface px-4 py-2.5 text-body-sm text-ink outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            className="border border-primary bg-primary px-5 py-2.5 text-body-sm font-semibold text-white transition hover:bg-maroon"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!lockedCategory && (
            <Select
              label="Form"
              value={filters.category}
              placeholder="All forms"
              options={categories}
              onChange={(category) => go({ category })}
            />
          )}
          <Select
            label="Deity"
            value={filters.deity}
            placeholder="All deities"
            options={deities}
            onChange={(deity) => go({ deity })}
          />
          <Select
            label="Language"
            value={filters.language}
            placeholder="All languages"
            options={languages}
            onChange={(language) => go({ language })}
          />
          <Select
            label="Order"
            value={filters.sort}
            options={[
              { value: 'featured', label: 'Curated first' },
              { value: 'title', label: 'A – Z' },
              { value: 'newest', label: 'Recently added' },
              { value: 'oldest', label: 'Oldest first' },
            ]}
            onChange={(sort) => go({ sort })}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setValue('')
                router.push(basePath)
              }}
              className="text-body-sm font-medium text-ink-muted underline-offset-4 hover:text-primary-700 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  options: LibraryOption[]
  onChange: (value: string) => void
}) {
  if (options.length === 0) return null

  return (
    <label className="flex items-center gap-2 text-caption uppercase tracking-[0.12em] text-ink-muted">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-[16rem] border border-surface-border bg-surface px-3 py-2 text-body-sm normal-case tracking-normal text-ink outline-none transition focus:border-primary"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
    </label>
  )
}
