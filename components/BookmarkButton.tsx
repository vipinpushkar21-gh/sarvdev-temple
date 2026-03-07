"use client"

import { useFavourites, BookmarkItem } from '../lib/favourites'

type Props = {
  item: Omit<BookmarkItem, 'addedAt'>
  className?: string
  size?: 'sm' | 'md'
}

export default function BookmarkButton({ item, className = '', size = 'md' }: Props) {
  const { isBookmarked, toggle } = useFavourites()
  const active = isBookmarked(item.id)
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(item)
      }}
      aria-label={active ? 'Remove from bookmarks' : 'Add to bookmarks'}
      aria-pressed={active}
      className={`inline-flex items-center justify-center rounded-btn transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
        size === 'sm' ? 'p-1.5' : 'p-2'
      } ${
        active
          ? 'text-primary bg-primary-50 hover:bg-primary-100'
          : 'text-ink-muted bg-surface-sunken hover:bg-surface-border hover:text-ink'
      } ${className}`}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  )
}
