import { motion, AnimatePresence } from 'framer-motion';
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
  <nav className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap md:flex-wrap" aria-label="Devotional Categories">
    {categories.map((cat) => (
      <motion.button
        key={cat.id}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 ${activeCategory === cat.id ? 'ring-2 ring-primary-400 font-bold' : ''}`}
        onClick={() => onSelect(cat.id)}
        aria-pressed={activeCategory === cat.id}
        aria-label={cat.label}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.04 }}
        type="button"
      >
        <span className="text-xl" aria-hidden="true">{cat.icon}</span>
        <span className="text-neutral-900 dark:text-white flex flex-col leading-tight">
          <span>{cat.label}</span>
          {cat.hindi && <span className="text-[11px] text-neutral-600 dark:text-neutral-300">{cat.hindi}</span>}
        </span>
        {typeof cat.count === 'number' && (
          <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 rounded-full px-2 py-0.5">{cat.count}</span>
        )}
      </motion.button>
    ))}
  </nav>
);
