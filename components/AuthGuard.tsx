"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Allow access to maintenance page
    if (pathname === '/maintenance') {
      return
    }

    // Skip maintenance mode on localhost for development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return
    }

    // Temporarily redirect all traffic to maintenance page (production only)
    router.push('/maintenance')
  }, [pathname, router])

  return null
}