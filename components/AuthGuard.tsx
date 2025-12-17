"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page and API routes
    if (pathname === '/login' || pathname.startsWith('/api/')) {
      return
    }

    // Check if auth token exists
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (!authToken) {
      router.push('/login')
    }
  }, [pathname, router])

  return null
}