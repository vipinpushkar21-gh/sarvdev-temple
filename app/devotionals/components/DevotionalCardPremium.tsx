import Link from 'next/link'
import type { ReactNode } from 'react'
import { Clock, Headphones, Languages, Music2, Sparkles } from 'lucide-react'
import BookmarkButton from '../../../components/BookmarkButton'
import SarvdevImage from '../../../components/SarvdevImage'
import { getDevotionalCardImage } from '../../../lib/devotional-image'
import type { Devotional } from '../types'
import { renderBilingualTitle } from '../utils/bilingual'
import { getDevotionalHref } from './devotional-utils'

type Props = {
  devotional: Devotional
  featured?: boolean
  compact?: boolean
  highlight?: ReactNode
}

export default function DevotionalCardPremium({ devotional, featured, compact, highlight }: Props) {
  const title = renderBilingualTitle(devotional.title || '')
  const image = getDevotionalCardImage(devotional)
  const href = getDevotionalHref(devotional)

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-[0_14px_40px_rgba(92,64,51,0.08)] transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_18px_52px_rgba(255,153,51,0.18)]">
      <Link href={href} className="block h-full text-inherit no-underline hover:no-underline">
        <div className="relative aspect-[16/9] overflow-hidden bg-stone-950">
          <SarvdevImage image={image} alt={title.primary || devotional.title} className="absolute inset-0" imgClassName="object-cover transition duration-700 group-hover:scale-105" renderMode="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-sm">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
            {devotional.audio && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/95 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm">
                <Headphones className="h-3 w-3" />
                Audio
              </span>
            )}
          </div>
          {devotional.duration && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <Clock className="h-3 w-3" />
              {devotional.duration}
            </span>
          )}
        </div>

        <div className={`${compact ? 'p-4' : 'p-5'} flex flex-col`}>
          <div className="mb-3 flex flex-wrap gap-2">
            {devotional.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-800">
                <Music2 className="h-3 w-3" />
                {devotional.category}
              </span>
            )}
            {devotional.language && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-700">
                <Languages className="h-3 w-3" />
                {devotional.language}
              </span>
            )}
          </div>

          <h3 className="text-[1.1rem] font-bold leading-snug text-stone-900 transition group-hover:text-orange-800">
            {highlight || title.primary}
          </h3>
          {title.secondary && (
            <p className="mt-1 text-sm font-medium leading-snug text-stone-500">{title.secondary}</p>
          )}
          {devotional.deity && (
            <p className="mt-3 text-sm font-semibold text-orange-700">{devotional.deity}</p>
          )}
          {devotional.description && !compact && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">{devotional.description}</p>
          )}
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <BookmarkButton
          item={{
            id: devotional._id,
            type: 'devotional',
            title: title.primary,
            slug: getDevotionalHref(devotional).replace('/devotionals/', ''),
          }}
          size="sm"
          className="bg-white/85 shadow-sm backdrop-blur hover:bg-white"
        />
      </div>
    </article>
  )
}
