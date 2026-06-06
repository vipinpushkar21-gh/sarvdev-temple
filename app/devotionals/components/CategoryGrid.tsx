import React from 'react'
import Link from 'next/link'

export type CategoryGridItem = {
  id: string
  label: string
  hindi?: string
  emoji?: string
  count?: number
  description?: string
}

export type CategoryGridProps = {
  categories: CategoryGridItem[]
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
    {categories.filter((cat) => cat.count && cat.count > 0).map((cat) => {
      const slug = cat.id.toLowerCase().replace(/\s+/g, '-')
      const href = cat.id === 'all' ? '/devotionals' : `/devotionals/category/${slug}`
      return (
        <Link
          key={cat.id}
          href={href}
          className="group flex flex-col gap-2 rounded-2xl border border-amber-100 bg-white p-4 no-underline shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          aria-label={`${cat.label}${cat.hindi ? ` — ${cat.hindi}` : ''}${cat.count ? `, ${cat.count} items` : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl transition group-hover:scale-110 group-hover:bg-orange-100" aria-hidden="true">
              {cat.emoji || '📿'}
            </span>
            {typeof cat.count === 'number' && cat.count > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-orange-800">
                {cat.count}
              </span>
            )}
          </div>
          <div>
            <span className="block text-sm font-black text-stone-900 group-hover:text-orange-800 transition-colors">
              {cat.label}
            </span>
            {cat.hindi && (
              <span className="block text-xs text-stone-400 font-devanagari leading-snug">
                {cat.hindi}
              </span>
            )}
          </div>
          <span className="mt-auto text-[11px] font-bold text-orange-600 opacity-0 transition group-hover:opacity-100">
            Explore →
          </span>
        </Link>
      )
    })}
  </div>
)

