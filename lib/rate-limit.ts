// lib/rate-limit.ts — In-memory sliding-window rate limiter
// Suitable for single-instance deployments (Vercel serverless, self-hosted)

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
