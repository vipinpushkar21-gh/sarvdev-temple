'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export type FilterOption = { value: string; label: string; count?: number }

export type TempleFilterState = {
  q: string
  state: string
  category: string
  sort: string
}

function buildHref(next: TempleFilterState) {
  const params = new URLSearchParams()
  if (next.q.trim()) params.set('q', next.q.trim())
  if (next.state) params.set('state', next.state)
  if (next.category) params.set('category', next.category)
  if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
  const search = params.toString()
  return search ? `/temples?${search}` : '/temples'
}

export default function TempleSearchControls({
  filters,
  states,
  categories,
}: {
  filters: TempleFilterState
  states: FilterOption[]
  categories: FilterOption[]
}) {
  const router = useRouter()
  const [value, setValue] = useState(filters.q)

  function go(next: Partial<TempleFilterState>) {
    router.push(buildHref({ ...filters, q: value, ...next }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    go({})
  }

  const hasFilters = Boolean(filters.q || filters.state || filters.category || (filters.sort && filters.sort !== 'newest'))

  return (
    <div className="border-y border-surface-border bg-surface-raised">
      <div className="page-container py-5">
        <form onSubmit={onSubmit} role="search" className="flex flex-wrap items-center gap-3">
          <label htmlFor="temple-search" className="sr-only">Search temples</label>
          <input
            id="temple-search"
            name="q"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search by temple, city, state or deity"
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
          <Select
            label="State"
            value={filters.state}
            placeholder="All states"
            options={states}
            onChange={(state) => go({ state })}
          />
          <Select
            label="Sacred collection"
            value={filters.category}
            placeholder="All collections"
            options={categories}
            onChange={(category) => go({ category })}
          />
          <Select
            label="Order"
            value={filters.sort}
            options={[
              { value: 'newest', label: 'Recently added' },
              { value: 'title', label: 'A – Z' },
              { value: 'place', label: 'By place' },
              { value: 'oldest', label: 'Oldest first' },
            ]}
            onChange={(sort) => go({ sort })}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => { setValue(''); router.push('/temples') }}
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
  options: FilterOption[]
  onChange: (value: string) => void
}) {
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
