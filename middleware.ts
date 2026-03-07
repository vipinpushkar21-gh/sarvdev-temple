import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lightweight HMAC verification for Edge runtime (mirrors lib/auth.ts logic)
const TOKEN_SECRET = process.env.AUTH_TOKEN || 'sarvdev_secure_token_2025'

function verifyTokenEdge(token: string): boolean {
  try {
    // Old-style static token (backwards compat)
    if (token === process.env.AUTH_TOKEN) return true

    // New signed token: base64url(payload).signature
    const [encoded, sig] = token.split('.')
    if (!encoded || !sig) return false

    // HMAC-SHA256 via Node.js crypto (available in Next.js Edge)
    const crypto = require('crypto')
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')
    if (sig !== expected) return false

    // Check expiry
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'))
    if (payload.exp < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Maintenance mode: optionally route all traffic to /maintenance
  const maintenance = process.env.MAINTENANCE_MODE === 'true'
  if (maintenance) {
    const path = request.nextUrl.pathname
    const isApi = path.startsWith('/api/')
    const isStatic = path.startsWith('/_next/') || path.includes('.')
    const isMaintenance = path === '/maintenance'
    const isLogin = path === '/login'
    if (!isApi && !isStatic && !isMaintenance && !isLogin) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }
  // Allow local development (localhost/127.0.0.1) to access the site without the auth gate.
  // Use the request host so this works at runtime in the Edge middleware environment.
  const host = request.headers.get('host') || request.nextUrl.hostname || ''
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return NextResponse.next()
  }
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authCookie = request.cookies.get('auth_token')
  const isAuthenticated = authCookie?.value ? verifyTokenEdge(authCookie.value) : false

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}