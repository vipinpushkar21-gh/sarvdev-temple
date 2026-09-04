import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_SECRET = process.env.AUTH_TOKEN ?? ''
type TokenPayload = { role?: string; status?: string; exp?: number }

async function getTokenPayload(token: string): Promise<TokenPayload | null> {
  try {
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1 || !TOKEN_SECRET) return null
    const encoded = token.slice(0, dotIdx)
    const signature = token.slice(dotIdx + 1)
    if (!encoded || !signature) return null
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(TOKEN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(encoded))
    const expected = btoa(String.fromCharCode(...new Uint8Array(signed))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    if (signature !== expected) return null
    const payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))) as TokenPayload
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000) || payload.status !== 'approved') return null
    return payload
  } catch { return null }
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
  const path = request.nextUrl.pathname
  // Sarvdev public content remains public. Only account and administration areas
  // require a signed, approved account token.
  const protectedRoute = path.startsWith('/admin') || path.startsWith('/user/dashboard') || path.startsWith('/temple-portal') || path.startsWith('/pandit-portal')
  if (!protectedRoute) return NextResponse.next()

  const token = request.cookies.get('auth_token')?.value
  const payload = token ? await getTokenPayload(token) : null
  if (!payload) return NextResponse.redirect(new URL('/login', request.url))
  if (path.startsWith('/admin') && payload.role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
  if (path.startsWith('/temple-portal') && payload.role !== 'temple') return NextResponse.redirect(new URL('/', request.url))
  if (path.startsWith('/pandit-portal') && payload.role !== 'pandit') return NextResponse.redirect(new URL('/', request.url))
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
