import Link from 'next/link'
import SarvdevImage from '@/components/SarvdevImage'
import { getTempleCardImage } from '@/lib/temple-image'
import { hasUsableTempleMedia } from '@/lib/temple-media'
import { compactText } from '@/lib/text-formatting'
import { templeHref, templePlace, type TempleCardRecord } from '@/lib/temple-discovery'
import BookmarkButton from '@/components/BookmarkButton'

export default function TempleCard({ temple }: { temple: TempleCardRecord }) {
  const illustrated = hasUsableTempleMedia(temple as unknown as Record<string, unknown>)
  const place = templePlace(temple)
  const summary = compactText(temple.shortDescription || temple.description || temple.descriptionHi || '')
  const category = (temple.sacredCategories || temple.categories || []).filter(Boolean)[0]

  return (
    <article className="flex h-full flex-col border-b border-surface-border pb-6">
      <Link href={templeHref(temple)} className="group no-underline hover:no-underline">
        <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-surface-border bg-surface-sunken">
          <SarvdevImage image={getTempleCardImage(temple)} alt={temple.title} className="absolute inset-0" imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]" renderMode="auto" />
        </div>
        {place && (
          <p className="text-caption uppercase tracking-[0.14em] text-primary">{place}</p>
        )}
        <h3 className="mt-1.5 font-display text-h3 leading-tight text-secondary-800 transition-colors group-hover:text-primary-700">
          {temple.title}
        </h3>
        {temple.titleHi && (
          <p className="mt-1 font-devanagari text-body-sm text-ink-muted">{temple.titleHi}</p>
        )}
      </Link>

      {temple.deity && (
        <p className="mt-2 text-body-sm text-ink-muted">
          <span className="text-ink-faint">Presiding deity · </span>
          {compactText(temple.deity).slice(0, 90)}
        </p>
      )}

      {summary && <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-ink-muted">{summary}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted">
        {category && <span>{category}</span>}
        {temple.timings && <span>{compactText(temple.timings).slice(0, 60)}</span>}
      </div>
      <div className="mt-4">
        <BookmarkButton item={{ id: String(temple._id), type: 'temple', title: temple.title, slug: temple.slug || '', subtitle: temple.deity, location: place, image: illustrated ? getTempleCardImage(temple).src : undefined }} size="sm" />
      </div>
    </article>
  )
}
