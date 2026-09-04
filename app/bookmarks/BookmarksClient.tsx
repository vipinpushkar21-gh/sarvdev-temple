"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Search, Trash2 } from 'lucide-react'
import { useFavourites, type BookmarkItem } from '../../lib/favourites'

type Tab = 'all' | 'temple' | 'deity' | 'devotional' | 'darshan' | 'event'
type Sort = 'newest' | 'oldest' | 'title'

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'temple', label: 'Temples' }, { key: 'deity', label: 'Deities' },
  { key: 'devotional', label: 'Devotionals' }, { key: 'darshan', label: 'Daily Darshan' }, { key: 'event', label: 'Events' },
]

const labels: Record<BookmarkItem['type'], string> = {
  temple: 'Temple', deity: 'Deity', devotional: 'Devotional', darshan: 'Daily Darshan', event: 'Event', blog: 'Saved item',
}

function href(item: BookmarkItem) {
  if (item.type === 'temple') return `/temples/${item.slug}`
  if (item.type === 'deity') return `/deities/${item.slug}`
  if (item.type === 'devotional') return `/devotionals/${item.slug}`
  if (item.type === 'darshan') return item.slug ? `/daily-darshan/${item.slug}` : '/daily-darshan'
  if (item.type === 'event') return `/events/${item.slug}`
  return item.slug ? `/blog/${item.slug}` : '/blog'
}

export default function BookmarksClient() {
  const { bookmarks, remove, clear, storageError } = useFavourites()
  const [hydrated, setHydrated] = useState(false)
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('newest')
  useEffect(() => setHydrated(true), [])

  const visible = useMemo(() => bookmarks.filter((item) => {
    const matchesTab = tab === 'all' || item.type === tab
    const terms = `${item.title} ${item.subtitle || ''} ${item.location || ''}`.toLowerCase()
    return matchesTab && terms.includes(query.trim().toLowerCase())
  }).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'oldest' ? a.addedAt - b.addedAt : b.addedAt - a.addedAt), [bookmarks, query, sort, tab])

  return <main className="min-h-screen bg-[#faf7f1] pb-20">
    <header className="border-b border-surface-border bg-[#f4ede1]"><div className="page-container py-12 sm:py-16">
      <p className="text-overline font-semibold uppercase tracking-[.16em] text-primary">Personal collection</p>
      <p className="mt-2 font-devanagari text-body text-accent-700">मेरा पवित्र स्थान</p>
      <h1 className="mt-2 font-display text-display-sm text-secondary-800">My Sacred Space</h1>
      <p className="mt-4 max-w-2xl text-body text-ink-muted">A quiet place for the temples, deities, Darshan, devotionals and events you wish to return to.</p>
      <p className="mt-5 text-caption text-ink-faint">Saved on this browser and device.</p>
    </div></header>
    <section className="page-container py-7">
      {storageError && <p role="alert" className="mb-5 border-l-2 border-primary bg-surface-raised px-4 py-3 text-body-sm text-ink-muted">{storageError}</p>}
      <div className="flex gap-2 overflow-x-auto border-b border-surface-border pb-3">{tabs.map((entry) => <button key={entry.key} type="button" onClick={() => setTab(entry.key)} className={`shrink-0 px-1 py-2 text-body-sm font-semibold ${tab === entry.key ? 'border-b-2 border-primary text-secondary-800' : 'text-ink-muted hover:text-secondary-800'}`}>{entry.label}</button>)}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your saved items" className="input min-h-11 pl-10" /></label><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="input min-h-11"><option value="newest">Newest saved</option><option value="oldest">Oldest saved</option><option value="title">Title A–Z</option></select></div>
    </section>
    <section className="page-container pb-12">
      {!hydrated ? <p className="text-body-sm text-ink-muted">Loading your saved items…</p> : bookmarks.length === 0 ? <Empty /> : visible.length === 0 ? <FilteredEmpty onReset={() => { setTab('all'); setQuery(''); setSort('newest') }} /> : <>
        <div className="mb-5 flex items-center justify-between gap-4"><p className="text-body-sm text-ink-muted">{visible.length} saved {visible.length === 1 ? 'item' : 'items'}</p>{bookmarks.length > 1 && <button type="button" onClick={clear} className="text-body-sm font-semibold text-primary-700 hover:text-maroon">Clear all</button>}</div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <SavedCard key={`${item.type}:${item.id}`} item={item} onRemove={remove} />)}</div>
      </>}
    </section>
  </main>
}

function SavedCard({ item, onRemove }: { item: BookmarkItem; onRemove: (item: Pick<BookmarkItem, 'id' | 'type'>) => void }) {
  const image = item.imageCard || item.imageHero || item.image
  return <article className="overflow-hidden border border-surface-border bg-surface-raised"><Link href={href(item)} className="block no-underline hover:no-underline">{image && <img src={image} alt="" className="aspect-[4/3] w-full bg-[#eee7da] object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />}<div className="p-5"><p className="text-overline font-semibold uppercase tracking-[.13em] text-primary">{labels[item.type]}</p><h2 className="mt-2 font-display text-h3 text-secondary-800">{item.title}</h2>{item.subtitle && <p className="mt-2 text-body-sm text-ink-muted">{item.subtitle}</p>}{item.location && <p className="mt-2 text-caption text-ink-faint">{item.location}</p>}</div></Link><div className="border-t border-surface-border px-5 py-3"><button type="button" onClick={() => onRemove(item)} className="inline-flex items-center gap-2 text-caption font-semibold text-primary-700 hover:text-maroon"><Trash2 className="h-3.5 w-3.5" />Remove bookmark</button></div></article>
}

function Empty() { return <div className="border border-surface-border bg-surface-raised p-8 sm:p-10"><Bookmark className="h-7 w-7 text-primary" /><p className="mt-5 font-devanagari text-body text-accent-700">आपका पवित्र स्थान तैयार है</p><h2 className="mt-2 font-display text-h2 text-secondary-800">Your Sacred Space is ready.</h2><p className="mt-3 max-w-xl text-body-sm leading-6 text-ink-muted">Save a temple, deity, devotional, Darshan or event to keep it close for another visit.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/temples" className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">Explore Temples</Link><Link href="/deities" className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">Explore Deities</Link><Link href="/daily-darshan" className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">Daily Darshan</Link></div></div> }
function FilteredEmpty({ onReset }: { onReset: () => void }) { return <div className="border border-surface-border bg-surface-raised p-8 text-center"><h2 className="font-display text-h3 text-secondary-800">No saved items match</h2><p className="mt-2 text-body-sm text-ink-muted">Try another search or return to all saved items.</p><button type="button" onClick={onReset} className="mt-4 text-body-sm font-semibold text-primary-700 hover:text-maroon">Show all saved items</button></div> }
