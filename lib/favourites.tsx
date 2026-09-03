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
  isBookmarked: (item: Pick<BookmarkItem, 'id' | 'type'>) => boolean
  toggle: (item: Omit<BookmarkItem, 'addedAt'>) => void
  remove: (item: Pick<BookmarkItem, 'id' | 'type'>) => void
  clear: () => void
  storageError: string | null
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

const STORAGE_KEY = 'sarvdev_bookmarks'
const VALID_TYPES = ['temple', 'deity', 'devotional', 'event', 'blog', 'darshan'] as const

function isValidBookmarkType(value: unknown): value is BookmarkItem['type'] {
  return typeof value === 'string' && (VALID_TYPES as readonly string[]).includes(value)
}

export function bookmarkIdentity(item: Pick<BookmarkItem, 'id' | 'type'>) {
  return `${item.type}:${item.id}`
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
    return true
  } catch {
    return false
  }
}

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    setBookmarks(loadBookmarks())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setStorageError(saveBookmarks(bookmarks) ? null : 'Your bookmarks could not be saved on this device.')
    }
  }, [bookmarks, mounted])

  const isBookmarked = useCallback(
    (item: Pick<BookmarkItem, 'id' | 'type'>) => bookmarks.some((bookmark) => bookmarkIdentity(bookmark) === bookmarkIdentity(item)),
    [bookmarks]
  )

  const toggle = useCallback(
    (item: Omit<BookmarkItem, 'addedAt'>) => {
      setBookmarks((prev) => {
        const identity = bookmarkIdentity(item)
        const exists = prev.find((bookmark) => bookmarkIdentity(bookmark) === identity)
        if (exists) return prev.filter((bookmark) => bookmarkIdentity(bookmark) !== identity)
        return [{ ...item, addedAt: Date.now() }, ...prev]
      })
    },
    []
  )

  const remove = useCallback(
    (item: Pick<BookmarkItem, 'id' | 'type'>) => setBookmarks((prev) => prev.filter((bookmark) => bookmarkIdentity(bookmark) !== bookmarkIdentity(item))),
    []
  )

  const clear = useCallback(() => setBookmarks([]), [])

  return (
    <FavouritesContext.Provider value={{ bookmarks, isBookmarked, toggle, remove, clear, storageError }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider')
  return ctx
}
