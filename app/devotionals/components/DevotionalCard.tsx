import Link from 'next/link'
import BookmarkButton from '@/components/BookmarkButton'
import SarvdevImage from '@/components/SarvdevImage'
import { getDevotionalCardImage } from '@/lib/devotional-image'
import { hasUsableDevotionalMedia } from '@/lib/devotional-media'
import { compactText } from '@/lib/text-formatting'
import {
  devotionalHasAudio,
  devotionalHref,
  type DevotionalCardRecord,
} from '@/lib/devotional-discovery'

export default function DevotionalCard({ devotional }: { devotional: DevotionalCardRecord }) {
  const illustrated = hasUsableDevotionalMedia(devotional as unknown as Record<string, unknown>)
  const href = devotionalHref(devotional)
  const summary = compactText(devotional.description || devotional.descriptionHi || '')
  const meta = [devotional.category, devotional.subcategory, devotional.language].filter(Boolean)

  return (
    <article className="relative flex h-full flex-col border-b border-surface-border pb-6">
      <Link href={href} className="group no-underline hover:no-underline">
        {illustrated && (
          <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-surface-border bg-surface-sunken">
            <SarvdevImage
              image={getDevotionalCardImage(devotional)}
              alt={devotional.title}
              className="absolute inset-0"
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              renderMode="auto"
            />
          </div>
        )}

        {devotional.deity && (
          <p className="text-caption uppercase tracking-[0.14em] text-primary">
            {compactText(devotional.deity).slice(0, 60)}
          </p>
        )}

        <h3 className="mt-1.5 pr-10 font-display text-h3 leading-tight text-secondary-800 transition-colors group-hover:text-primary-700">
          {devotional.title}
        </h3>
        {devotional.titleHi && devotional.titleHi !== devotional.title && (
          <p className="mt-1 font-devanagari text-body-sm text-ink-muted">{devotional.titleHi}</p>
        )}
      </Link>

      {summary && <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-ink-muted">{summary}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted">
        {meta.map((item) => (
          <span key={item as string}>{item}</span>
        ))}
        {devotionalHasAudio(devotional) && <span className="text-primary-700">Audio</span>}
      </div>

      <div className="absolute right-0 top-0">
        <BookmarkButton
          item={{
            id: devotional._id,
            type: 'devotional',
            title: devotional.title,
            slug: devotional.slug || devotional._id,
          }}
          size="sm"
        />
      </div>
    </article>
  )
}
