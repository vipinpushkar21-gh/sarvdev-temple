import Link from 'next/link'
import SarvdevImage from '@/components/SarvdevImage'
import { getDeityCardImage } from '@/lib/temple-image'
import { hasUsableDeityMedia } from '@/lib/deity-media'
import { compactText } from '@/lib/text-formatting'
import type { SarvdevMediaAsset } from '@/lib/media-asset'
import BookmarkButton from '@/components/BookmarkButton'

export type DeityCardRecord = {
  _id?: string
  slug: string
  name: string
  nameHi?: string
  description?: string
  descriptionHi?: string
  categoryName?: string
  attributes?: string[]
  primaryMedia?: SarvdevMediaAsset
  cardMedia?: SarvdevMediaAsset
  heroMedia?: SarvdevMediaAsset
}

export default function DeityCard({ deity }: { deity: DeityCardRecord }) {
  const illustrated = hasUsableDeityMedia(deity as Record<string, unknown>)
  const summary = compactText(deity.description || deity.descriptionHi || '')
  const attributes = (deity.attributes || []).filter(Boolean).slice(0, 3)

  return (
    <article className="flex h-full flex-col border-b border-surface-border pb-6">
      <Link href={`/deities/${deity.slug}`} className="group no-underline hover:no-underline">
        {illustrated && (
          <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-surface-border bg-surface-sunken">
            <SarvdevImage
              image={getDeityCardImage(deity)}
              alt={deity.name}
              className="absolute inset-0"
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              renderMode="auto"
            />
          </div>
        )}
        <h3 className="font-display text-h3 leading-tight text-secondary-800 transition-colors group-hover:text-primary-700">
          {deity.name}
        </h3>
        {deity.nameHi && <p className="mt-1 font-devanagari text-body-sm text-ink-muted">{deity.nameHi}</p>}
      </Link>

      {deity.categoryName && (
        <p className="mt-2 text-caption uppercase tracking-[0.12em] text-primary">{deity.categoryName}</p>
      )}

      {summary && <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-ink-muted">{summary}</p>}

      {attributes.length > 0 && (
        <p className="mt-3 text-caption text-ink-muted">{attributes.join(' · ')}</p>
      )}
      {deity._id && <div className="mt-4"><BookmarkButton item={{ id: String(deity._id), type: 'deity', title: deity.name, slug: deity.slug, subtitle: deity.categoryName, image: illustrated ? getDeityCardImage(deity).src : undefined }} size="sm" /></div>}
    </article>
  )
}
