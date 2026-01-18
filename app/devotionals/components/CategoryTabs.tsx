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
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border border-accent bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 hover:bg-accent/10 ${activeCategory === cat.id ? 'ring-2 ring-primary-400 font-bold' : ''}`}
        onClick={() => onSelect(cat.id)}
        aria-pressed={activeCategory === cat.id}
        aria-label={cat.label}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.04 }}
        type="button"
      >
        <span className="text-xl" aria-hidden="true">{cat.icon}</span>
        <span className="text-text flex flex-col leading-tight">
          <span>{cat.label}</span>
          {cat.hindi && <span className="text-[11px] text-text/70">{cat.hindi}</span>}
        </span>
        {typeof cat.count === 'number' && (
          <span className="ml-2 text-xs bg-accent text-text rounded-full px-2 py-0.5">{cat.count}</span>
        )}
      </motion.button>
    ))}
  </nav>
);
