// lib/auth.ts
// Lightweight auth helpers — zero extra dependencies.
// Password hashing  : Node.js crypto.scrypt  (API routes only)
// Signed tokens     : HMAC-SHA256 via Web Crypto (works in Edge middleware too)

import crypto from 'crypto'

const TOKEN_SECRET = process.env.AUTH_TOKEN || 'sarvdev_secure_token_2025'
const TOKEN_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// ─── Password hashing (scrypt) ────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(crypto.timingSafeEqual(new Uint8Array(Buffer.from(key, 'hex')), new Uint8Array(derivedKey)))
    })
  })
}

// ─── Signed token (HMAC-SHA256) ───────────────────────
// Format: base64url(payload).signature
// Payload: { id, name, email, role, exp }

interface TokenPayload {
  id: string
  name: string
  email: string
  role: 'guest' | 'admin'
  exp: number
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function fromBase64url(b64: string): string {
  return Buffer.from(b64, 'base64url').toString('utf-8')
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
}

export function createToken(user: { _id: string; name: string; email: string; role: string }): string {
  const payload: TokenPayload = {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role as 'guest' | 'admin',
    exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE,
  }
  const encoded = base64url(JSON.stringify(payload))
  const sig = hmac(encoded)
  return `${encoded}.${sig}`
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [encoded, sig] = token.split('.')
    if (!encoded || !sig) return null
    const expected = hmac(encoded)
    if (sig !== expected) return null
    const payload: TokenPayload = JSON.parse(fromBase64url(encoded))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// Cookie helpers used in API route handlers
export const AUTH_COOKIE_NAME = 'auth_token'
export const AUTH_COOKIE_OPTIONS = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_MAX_AGE}`
