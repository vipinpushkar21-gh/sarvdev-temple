"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard() {
  const router = useRouter()
  const pathname = usePathname()

  // Respect build-time public flag so maintenance can be toggled without editing code
  const isMaintenance =
    process.env.NEXT_PUBLIC_MAINTENANCE === '1' ||
    process.env.NEXT_PUBLIC_MAINTENANCE === 'true'

  useEffect(() => {
    // If maintenance mode is not enabled, do nothing
    if (!isMaintenance) return

    // Allow access to maintenance page
    if (pathname === '/maintenance') return

    // Skip maintenance mode on localhost for development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return

    // Redirect all traffic to maintenance page (production only when enabled)
    router.push('/maintenance')
  }, [pathname, router])

  return null
}