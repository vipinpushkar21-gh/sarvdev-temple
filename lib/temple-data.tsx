"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export interface TempleData {
  _id: string
  title: string
  description?: string
  image?: string
  imageCard?: string
  imageHero?: string
  imageGallery?: string[]
  heroImage?: string
  location?: string
  city?: string
  state?: string
  deity?: string
  timings?: string
  type?: string
  status?: string
  categories?: string[]
  slug?: string
  speciality?: string
  latitude?: number
  longitude?: number
}

interface TempleDataContextType {
  temples: TempleData[]
  loading: boolean
  error: string | null
}

const TEMPLE_DATA_ENDPOINT = '/api/temples?limit=100&fields=card'

async function getTempleApiError(res: Response) {
  try {
    const payload = await res.json()
    if (payload?.error) return `Temple API ${res.status}: ${payload.error}`
  } catch {
    // Non-JSON error body; keep the compact status message below.
  }
  return `Temple API ${res.status}`
}

const TempleDataContext = createContext<TempleDataContextType>({
  temples: [],
  loading: true,
  error: null,
})

export function TempleDataProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [temples, setTemples] = useState<TempleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // The homepage uses purpose-built server queries. Do not ship the directory
    // dataset there merely to support sections that are not rendered.
    if (pathname === '/') {
      setLoading(false)
      return
    }
    let cancelled = false
    async function fetchTemples() {
      const MAX_RETRIES = 3
      let lastError = 'Failed to load temples'
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(new DOMException('Timeout', 'AbortError')), 10000)
        try {
          const res = await fetch(TEMPLE_DATA_ENDPOINT, {
            signal: ctrl.signal,
            headers: { Accept: 'application/json' },
          })
          if (!res.ok) {
            lastError = await getTempleApiError(res)
            if (attempt < MAX_RETRIES && !cancelled) {
              await new Promise(r => setTimeout(r, 1000 * attempt))
              continue
            }
            break
          }
          const payload = await res.json()
          const data = Array.isArray(payload) ? payload : (payload.data || payload.items || [])
          if (!cancelled) {
            const approved = data.filter((t: TempleData) => t.status === 'approved' || !t.status)
            setTemples(approved)
            setError(null)
          }
          return // success
        } catch (err) {
          const isAbort = err instanceof DOMException && err.name === 'AbortError'
          lastError = isAbort ? 'Temple request timed out' : 'Temple request failed'
          if (attempt < MAX_RETRIES && !cancelled) {
            await new Promise(r => setTimeout(r, 1000 * attempt))
          } else if (!cancelled) {
            setError(lastError)
          }
        } finally {
          clearTimeout(timer)
        }
      }
      if (!cancelled) {
        setTemples([])
        setError(lastError)
      }
      if (!cancelled) setLoading(false)
    }
    fetchTemples().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pathname])

  return (
    <TempleDataContext.Provider value={{ temples, loading, error }}>
      {children}
    </TempleDataContext.Provider>
  )
}

export function useTempleData() {
  return useContext(TempleDataContext)
}
