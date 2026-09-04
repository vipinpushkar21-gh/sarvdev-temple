import { slugifyTemple } from './temple-normalization'

export const DARSHAN_PROVIDERS = ['youtube', 'direct', 'other'] as const
export type DarshanProvider = typeof DARSHAN_PROVIDERS[number]

export function extractYoutubeId(value: unknown): string {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) return ''
  if (/^[A-Za-z0-9_-]{6,}$/.test(text)) return text
  try {
    const url = new URL(text)
    if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || ''
    if (/(^|\.)youtube\.com$/.test(url.hostname)) return url.searchParams.get('v') || url.pathname.match(/\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{6,})/)?.[1] || ''
  } catch { /* legacy free-form values are handled below */ }
  return text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/))([A-Za-z0-9_-]{6,})/)?.[1] || ''
}

export function isYoutubeUrl(value: unknown) { return Boolean(extractYoutubeId(value)) }
export function getCanonicalProvider(input: Record<string, unknown>): DarshanProvider {
  const provider = typeof input.provider === 'string' ? input.provider.trim().toLowerCase() : ''
  if (DARSHAN_PROVIDERS.includes(provider as DarshanProvider)) return provider as DarshanProvider
  return extractYoutubeId(input.youtubeId) || isYoutubeUrl(input.youtubeUrl) || isYoutubeUrl(input.videoUrl) ? 'youtube' : input.videoUrl ? 'direct' : 'other'
}
export function getYoutubeEmbedUrl(input: Record<string, unknown>) { const id = extractYoutubeId(input.youtubeId) || extractYoutubeId(input.youtubeUrl) || extractYoutubeId(input.videoUrl); return id ? `https://www.youtube-nocookie.com/embed/${id}` : '' }
export function getPlayableDarshanSource(input: Record<string, unknown>) { const provider = getCanonicalProvider(input); const youtubeId = extractYoutubeId(input.youtubeId) || extractYoutubeId(input.youtubeUrl) || extractYoutubeId(input.videoUrl); return provider === 'youtube' && youtubeId ? { provider, youtubeId, url: getYoutubeEmbedUrl(input) } : { provider, youtubeId: '', url: stringValue(input.videoUrl) || stringValue(input.externalUrl) || stringValue(input.youtubeUrl) } }
export function normalizeDarshanSlug(value: unknown) { return slugifyTemple(value) }
export function normalizeDarshanRelationSlug(value: unknown) { return slugifyTemple(value) }
function stringValue(value: unknown) { return typeof value === 'string' ? value.trim() : '' }
