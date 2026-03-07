import React from 'react';

export type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'default' | 'lg';
};

/**
 * 2026 Search Bar — glassmorphic container, animated search icon,
 * clear button, focus ring glow.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder, className = '', size = 'default' }) => {
  const isLg = size === 'lg';
  return (
    <div className={`search-glass flex items-center gap-3 transition-all duration-300 ${isLg ? 'px-6 py-4' : 'px-4 py-3'} ${className}`}>
      {/* Search icon */}
      <svg
        className={`flex-shrink-0 text-ink-faint transition-colors duration-200 ${isLg ? 'w-6 h-6' : 'w-5 h-5'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <label htmlFor="devotional-search" className="sr-only">Search Devotionals</label>
      <input
        id="devotional-search"
        type="search"
        className={`flex-1 bg-transparent border-none outline-none text-ink placeholder:text-ink-faint ${isLg ? 'text-body' : 'text-body-sm'}`}
        placeholder={placeholder || 'Search by name, deity, or category...'}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search Devotionals"
        autoComplete="off"
      />
      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="flex-shrink-0 p-1 rounded-full text-ink-faint hover:text-ink hover:bg-surface-sunken transition-colors duration-200"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
