"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type BookmarkItem = {
  id: string
  type: 'temple' | 'deity' | 'devotional' | 'event' | 'blog' | 'darshan'
  title: string
  slug: string
  image?: string
  imageCard?: string
  imageHero?: string
  addedAt: number
  subtitle?: string
  location?: string
  category?: string
}

type FavouritesContextType = {
  bookmarks: BookmarkItem[]
  isBookmarked: (id: string) => boolean
  toggle: (item: Omit<BookmarkItem, 'addedAt'>) => void
  remove: (id: string) => void
  clear: () => void
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

const STORAGE_KEY = 'sarvdev_bookmarks'
const VALID_TYPES = ['temple', 'deity', 'devotional', 'event', 'blog', 'darshan'] as const

function isValidBookmarkType(value: unknown): value is BookmarkItem['type'] {
  return typeof value === 'string' && (VALID_TYPES as readonly string[]).includes(value)
}

function normalizeBookmark(value: unknown, index: number): BookmarkItem | null {
  if (typeof value === 'string' && value.trim()) {
    const id = value.trim()
    return {
      id,
      type: 'temple',
      title: id.replace(/[-_]+/g, ' '),
      slug: id,
      addedAt: Date.now() - index,
    }
  }

  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<BookmarkItem> & Record<string, unknown>
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : ''
  if (!id) return null

  const title =
    typeof raw.title === 'string' && raw.title.trim()
      ? raw.title.trim()
      : id.replace(/[-_]+/g, ' ')

  return {
    id,
    type: isValidBookmarkType(raw.type) ? raw.type : 'temple',
    title,
    slug: typeof raw.slug === 'string' && raw.slug.trim() ? raw.slug.trim() : id,
    image: typeof raw.image === 'string' ? raw.image : undefined,
    imageCard: typeof raw.imageCard === 'string' ? raw.imageCard : undefined,
    imageHero: typeof raw.imageHero === 'string' ? raw.imageHero : undefined,
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : undefined,
    location: typeof raw.location === 'string' ? raw.location : undefined,
    category: typeof raw.category === 'string' ? raw.category : undefined,
    addedAt: typeof raw.addedAt === 'number' && Number.isFinite(raw.addedAt) ? raw.addedAt : Date.now() - index,
  }
}

function loadBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item, index) => normalizeBookmark(item, index))
      .filter((item): item is BookmarkItem => Boolean(item))
  } catch {
    return []
  }
}

function saveBookmarks(items: BookmarkItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* quota exceeded — ignore */ }
}

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBookmarks(loadBookmarks())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveBookmarks(bookmarks)
  }, [bookmarks, mounted])

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  )

  const toggle = useCallback(
    (item: Omit<BookmarkItem, 'addedAt'>) => {
      setBookmarks((prev) => {
        const exists = prev.find((b) => b.id === item.id)
        if (exists) return prev.filter((b) => b.id !== item.id)
        return [{ ...item, addedAt: Date.now() }, ...prev]
      })
    },
    []
  )

  const remove = useCallback(
    (id: string) => setBookmarks((prev) => prev.filter((b) => b.id !== id)),
    []
  )

  const clear = useCallback(() => setBookmarks([]), [])

  return (
    <FavouritesContext.Provider value={{ bookmarks, isBookmarked, toggle, remove, clear }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider')
  return ctx
}
