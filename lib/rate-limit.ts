// lib/rate-limit.ts — In-memory sliding-window rate limiter
// Suitable for single-instance deployments (Vercel serverless, self-hosted)

import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_API_LIMIT   = 100     // requests per window
const PUBLIC_API_WINDOW  = 60_000  // 1 minute

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/**
 * Check if a request is within rate limits.
 * @param key   Unique identifier (e.g. `login:${ip}`)
 * @param limit Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 * @returns { ok: true } if allowed, { ok: false } if blocked
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count }
}

/**
 * Extract client IP from request headers (works behind proxies).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

// Periodic cleanup: remove expired buckets every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of buckets) {
      if (now > entry.resetAt) buckets.delete(key)
    }
  }, 300_000)
}

/**
 * Extract client IP from a NextRequest (works behind Vercel/Cloudflare/nginx proxies).
 */
export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('cf-connecting-ip')?.trim() ||
    'unknown'
  )
}

/**
 * Apply public API rate limiting (100 req/min per IP).
 * Returns null if allowed, or a 429 NextResponse if blocked.
 *
 * Usage:
 *   const limited = applyRateLimit(req)
 *   if (limited) return limited
 */
export function applyRateLimit(req: NextRequest, prefix = 'api'): NextResponse | null {
  const ip = getIP(req)
  const result = checkRateLimit(`${prefix}:${ip}`, PUBLIC_API_LIMIT, PUBLIC_API_WINDOW)
  if (result.ok) return null

  return NextResponse.json(
    { error: 'Too many requests. Max 100 requests/minute per IP.' },
    {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': String(PUBLIC_API_LIMIT),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}
