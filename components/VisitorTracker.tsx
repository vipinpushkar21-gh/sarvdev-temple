"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        })
      } catch (error) {
        console.error('Failed to track visitor:', error)
      }
    }

    trackVisitor()
  }, [pathname])

  return null
}