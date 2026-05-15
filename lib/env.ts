// lib/env.ts — Centralized environment variable validation
// Import this in API routes to ensure required vars are present at runtime

function required(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required environment variable: ${name}`)
  return val
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback
}

export const env = {
  // Required — app will not function without these
  MONGODB_URI: required('MONGODB_URI'),
  AUTH_TOKEN: required('AUTH_TOKEN'),

  // Optional — features degrade gracefully
  OPENAI_API_KEY: optional('OPENAI_API_KEY'),
  AZURE_TTS_KEY: optional('AZURE_TTS_KEY'),
  AZURE_TTS_REGION: optional('AZURE_TTS_REGION'),
  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET'),
  VAPID_PUBLIC_KEY: optional('VAPID_PUBLIC_KEY'),
  VAPID_PRIVATE_KEY: optional('VAPID_PRIVATE_KEY'),
  NEXT_PUBLIC_GA_ID: optional('NEXT_PUBLIC_GA_ID'),
}
