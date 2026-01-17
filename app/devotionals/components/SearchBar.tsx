import React from 'react';

export type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <div className="mb-6">
    <label htmlFor="devotional-search" className="sr-only">Search Devotionals</label>
    <input
      id="devotional-search"
      type="search"
      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors shadow-sm"
      placeholder={placeholder || 'Search devotionals...'}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Search Devotionals"
      autoComplete="off"
    />
  </div>
);
