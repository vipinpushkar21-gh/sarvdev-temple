import React from 'react';

export type Category = {
  id: string;
  label: string;
  hindi?: string;
  icon?: string;
  count?: number;
};

export type CategoryTabsProps = {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onSelect }) => (
  <nav className="flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap md:flex-wrap pb-2" aria-label="Devotional Categories">
    {categories.map((cat) => {
      const isActive = activeCategory === cat.id;
      return (
        <button
          key={cat.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
            isActive
              ? 'bg-primary-100 text-primary-800 border-primary-400 font-semibold shadow-card-hover'
              : 'bg-surface-raised text-ink border-surface-border hover:shadow-card'
          }`}
          onClick={() => onSelect(cat.id)}
          aria-pressed={isActive}
          aria-label={cat.label}
          type="button"
        >
          <span className="flex flex-col leading-tight">
            <span className="text-body-sm">{cat.label}</span>
            {cat.hindi && <span className="text-caption text-ink-muted">{cat.hindi}</span>}
          </span>
          {typeof cat.count === 'number' && (
            <span className={`ml-1 badge ${isActive ? 'badge-primary' : ''}`}>{cat.count}</span>
          )}
        </button>
      );
    })}
  </nav>
);
