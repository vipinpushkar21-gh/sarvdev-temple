import { hinduEvents, type HinduEvent } from '@/data/events'
import { getContentPlaceholder } from './imageGuard'

export const EVENT_FALLBACK_IMAGE = getContentPlaceholder('event')

export function slugifyEvent(title: string, date?: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return date ? `${base}-${date.slice(0, 4)}` : base
}

export function normalizeEventStatus(status?: string) {
  if (status === 'approved') return 'published'
  if (status === 'pending') return 'draft'
  if (status === 'rejected') return 'archived'
  return status || 'draft'
}

export function eventToPlain(event: any) {
  const startDate = event.startDate || event.date
  const endDate = event.endDate || event.startDate || event.date
  return {
    ...event,
    _id: event._id?.toString?.() || event._id,
    slug: event.slug || slugifyEvent(event.title || 'event', startDate),
    status: normalizeEventStatus(event.status),
    startDate,
    endDate,
    date: startDate,
    titleHi: event.titleHi || '',
    shortDescription: event.shortDescription || event.description?.slice?.(0, 180) || '',
    locationName: event.locationName || event.location || event.templeName || '',
    city: event.city || '',
    state: event.state || '',
    category: event.category || 'festival',
    eventType: event.eventType || event.category || 'festival',
    image: event.image || '',
    imageCard: event.imageCard || event.image || '',
    imageHero: event.imageHero || event.imageCard || event.image || '',
    rituals: Array.isArray(event.rituals) ? event.rituals : [],
    highlights: Array.isArray(event.highlights) ? event.highlights : [],
  }
}

export function staticEventToDb(event: HinduEvent) {
  return {
    title: event.title,
    titleHi: event.titleHi,
    slug: event.slug,
    description: event.description,
    shortDescription: event.description.slice(0, 180),
    category: event.category,
    eventType: event.category === 'festival' ? 'Festival' : event.category,
    date: event.date,
    startDate: event.date,
    endDate: event.endDate || event.date,
    timezone: 'Asia/Kolkata',
    isAllDay: true,
    month: event.month,
    year: event.year,
    location: event.location,
    locationName: event.location,
    state: event.state,
    country: 'India',
    image: event.image || '',
    imageCard: event.image || '',
    imageHero: event.image || '',
    status: 'published',
    featured: ['Maha Shivratri', 'Diwali', 'Ram Navami', 'Janmashtami', 'Ganesh Chaturthi'].some((name) => event.title.includes(name)),
    priority: event.category === 'festival' ? 10 : 0,
    verified: true,
    source: 'static-import',
    festivalName: event.title,
    festivalNameHi: event.titleHi,
    rituals: event.rituals || [],
    significance: event.significance,
    highlights: event.highlights || [],
    metaTitle: `${event.title} - ${event.year} | Sarvdev Events`,
    metaDescription: event.description.slice(0, 155),
    metaKeywords: [event.title, event.category, event.state, 'Hindu event', 'Sarvdev'].filter(Boolean).join(', '),
  }
}

export const existingPublicEvents = hinduEvents
