"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type BookmarkItem = {
  id: string
  type: 'temple' | 'devotional'
  title: string
  slug: string
  image?: string
  addedAt: number
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

function loadBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
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
