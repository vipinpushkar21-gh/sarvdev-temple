import React from 'react';
import Link from 'next/link';

export type CategoryGridItem = {
  id: string;
  label: string;
  hindi?: string;
  emoji?: string;
  count?: number;
};

export type CategoryGridProps = {
  categories: CategoryGridItem[];
};

/**
 * 2026 category grid — glassmorphic cards with animated emoji,
 * gradient hover accents, count badges, and staggered entrance.
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
    {categories.map((cat) => {
      const slug = cat.id.toLowerCase().replace(/\s+/g, '-');
      const href = cat.id === 'all' ? '/devotionals' : `/devotionals/category/${slug}`;
      return (
        <Link
          key={cat.id}
          href={href}
          className="category-card group focus:outline-none"
          aria-label={`${cat.label}${cat.hindi ? ` (${cat.hindi})` : ''}${cat.count ? ` — ${cat.count} items` : ''}`}
        >
          {/* Emoji icon with gradient ring */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 via-surface to-accent-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl" role="img" aria-hidden="true">
              {cat.emoji || '📿'}
            </span>
            {/* Count badge */}
            {typeof cat.count === 'number' && cat.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-r from-primary to-primary-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md tabular-nums">
                {cat.count}
              </span>
            )}
          </div>
          {/* Label */}
          <div className="text-center leading-tight mt-1">
            <span className="block text-body-sm font-semibold text-secondary-700 group-hover:text-primary-700 transition-colors duration-200">
              {cat.label}
            </span>
            {cat.hindi && (
              <span className="block text-caption text-ink-muted font-devanagari mt-0.5">
                {cat.hindi}
              </span>
            )}
          </div>
        </Link>
      );
    })}
  </div>
);
