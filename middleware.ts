import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lightweight HMAC verification for Edge runtime (mirrors lib/auth.ts logic)
const TOKEN_SECRET = process.env.AUTH_TOKEN || 'sarvdev_secure_token_2025'

/* ── Web Crypto HMAC-SHA256 (Edge Runtime compatible) ── */
async function getTokenPayload(token: string): Promise<Record<string, any> | null> {
  try {
    if (token === process.env.AUTH_TOKEN) return { role: 'admin' }
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1) return null
    const encoded = token.slice(0, dotIdx)
    const sig = token.slice(dotIdx + 1)
    if (!encoded || !sig) return null
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(TOKEN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(encoded))
    const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    if (sig !== expected) return null
    const payloadJson = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch { return null }
}

async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    // Old-style static token (backwards compat)
    if (token === process.env.AUTH_TOKEN) return true

    // New signed token: base64url(payload).signature
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1) return false
    const encoded = token.slice(0, dotIdx)
    const sig = token.slice(dotIdx + 1)
    if (!encoded || !sig) return false

    // Import key using Web Crypto API
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(TOKEN_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Sign and convert to base64url
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(encoded))
    const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

    if (sig !== expected) return false

    // Decode payload and check expiry
    const payloadJson = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    if (payload.exp < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
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
  const host = request.headers.get('host') || request.nextUrl.hostname || ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const path = request.nextUrl.pathname

  // Admin routes — always require admin token (even on localhost)
  if (isAdminRoute) {
    const authCookie = request.cookies.get('auth_token')
    const payload = authCookie?.value ? await getTokenPayload(authCookie.value) : null
    if (!payload) return NextResponse.redirect(new URL('/login', request.url))
    if (payload.role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }

  // Portal routes — always require specific role (even on localhost)
  if (path.startsWith('/temple-portal') || path.startsWith('/pandit-portal') || path.startsWith('/user/dashboard')) {
    const authCookie = request.cookies.get('auth_token')
    const payload = authCookie?.value ? await getTokenPayload(authCookie.value) : null
    if (!payload) return NextResponse.redirect(new URL('/login', request.url))
    if (path.startsWith('/temple-portal') && payload.role !== 'temple') return NextResponse.redirect(new URL('/', request.url))
    if (path.startsWith('/pandit-portal') && payload.role !== 'pandit') return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }

  // Allow local development to bypass auth for non-protected routes
  if (isLocalhost) {
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
  const isAuthenticated = authCookie?.value ? await verifyTokenEdge(authCookie.value) : false

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