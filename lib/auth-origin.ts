import type { NextRequest } from 'next/server'

/** Reject cross-site browser mutations while allowing ordinary same-origin requests. */
export function hasTrustedAuthOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (origin) return origin === request.nextUrl.origin
  const fetchSite = request.headers.get('sec-fetch-site')
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'none'
}
