"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface TempleData {
  _id: string
  title: string
  description?: string
  image?: string
  location?: string
  city?: string
  state?: string
  deity?: string
  timings?: string
  contact?: string
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

const TempleDataContext = createContext<TempleDataContextType>({
  temples: [],
  loading: true,
  error: null,
})

export function TempleDataProvider({ children }: { children: ReactNode }) {
  const [temples, setTemples] = useState<TempleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchTemples() {
      const MAX_RETRIES = 3
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(new DOMException('Timeout', 'AbortError')), 10000)
          const res = await fetch('/api/temples', { signal: ctrl.signal })
          clearTimeout(timer)
          if (!res.ok) throw new Error(`API ${res.status}`)
          const data = await res.json()
          if (!cancelled) {
            const approved = data.filter((t: TempleData) => t.status === 'approved' || !t.status)
            setTemples(approved)
          }
          return // success
        } catch (err) {
          const isAbort = err instanceof DOMException && err.name === 'AbortError'
          if (!isAbort) console.error(`TempleDataProvider fetch attempt ${attempt}/${MAX_RETRIES}:`, err)
          if (attempt < MAX_RETRIES && !cancelled) {
            await new Promise(r => setTimeout(r, 1000 * attempt))
          } else if (!cancelled) {
            setError('Failed to load temples')
          }
        }
      }
      if (!cancelled) setLoading(false)
    }
    fetchTemples().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <TempleDataContext.Provider value={{ temples, loading, error }}>
      {children}
    </TempleDataContext.Provider>
  )
}

export function useTempleData() {
  return useContext(TempleDataContext)
}
