import Link from 'next/link'
import { CalendarDays, Landmark, Music2, Sparkles } from 'lucide-react'
import type { Devotional } from '../types'
import { getDevotionalHref, getRuleBasedRelatedContent } from './devotional-utils'
import { renderBilingualTitle } from '../utils/bilingual'

type Props = {
  devotional: Devotional
  allDevotionals: Devotional[]
}

function iconFor(type: string) {
  if (type === 'festival') return <CalendarDays className="h-4 w-4" />
  if (type === 'temple') return <Landmark className="h-4 w-4" />
  return <Music2 className="h-4 w-4" />
}

export default function DevotionalRelatedContent({ devotional, allDevotionals }: Props) {
  const sameDeity = allDevotionals
    .filter((item) => item._id !== devotional._id && devotional.deity && item.deity === devotional.deity)
    .slice(0, 4)
  const sameCategory = allDevotionals
    .filter((item) => item._id !== devotional._id && devotional.category && item.category === devotional.category)
    .slice(0, 4)
  const ruleBased = getRuleBasedRelatedContent(devotional.deity).slice(0, 6)

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
          <Sparkles className="h-4 w-4" />
          Related Practice
        </p>
        <h2 className="text-xl font-black text-stone-900">Continue the devotional flow</h2>
      </div>

      {sameDeity.length > 0 && (
        <RelatedList title={`More for ${devotional.deity}`} items={sameDeity.map((item) => ({
          title: renderBilingualTitle(item.title).primary,
          subtitle: item.category || item.language,
          href: getDevotionalHref(item),
          type: 'devotional',
        }))} />
      )}

      {sameCategory.length > 0 && (
        <RelatedList title={`Same category`} items={sameCategory.map((item) => ({
          title: renderBilingualTitle(item.title).primary,
          subtitle: item.deity || item.language,
          href: getDevotionalHref(item),
          type: 'devotional',
        }))} />
      )}

      {ruleBased.length > 0 && (
        <RelatedList title="Suggested next" items={ruleBased.map((item) => ({
          title: item.title,
          href: item.href,
          type: item.type,
        }))} />
      )}
    </section>
  )
}

function RelatedList({ title, items }: { title: string; items: { title: string; href: string; subtitle?: string; type: string }[] }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-orange-50/50 p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-stone-800">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.href}-${item.title}`}
            href={item.href}
            className="flex items-center gap-3 rounded-xl border border-transparent bg-white/75 p-3 text-stone-800 no-underline transition hover:border-orange-200 hover:bg-white hover:text-orange-800 hover:shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              {iconFor(item.type)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{item.title}</span>
              {item.subtitle && <span className="block truncate text-xs font-medium text-stone-500">{item.subtitle}</span>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

