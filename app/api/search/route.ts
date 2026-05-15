import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'
import Darshan from '@/models/Darshan'

const MAX_PER_GROUP = 6

/**
 * GET /api/search?q=<query>
 *
 * Server-side unified search across temples, devotionals, blogs, events, darshan.
 * Replaces the client-side pattern of fetching all data from 5 APIs.
 * Uses MongoDB $text search where indexes exist, regex fallback otherwise.
 */
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ temples: [], devotionals: [], blogs: [], events: [], darshan: [] })
  }

  try {
    await connectDB()

    // Escape special regex characters for safe regex search
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')

    const [temples, devotionals, blogs, events, darshan] = await Promise.all([
      // Temples — try text search first (uses text index), fall back to regex
      Temple.find(
        { $text: { $search: q } },
        { title: 1, description: 1, location: 1, city: 1, state: 1, deity: 1, slug: 1, image: 1, score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(MAX_PER_GROUP)
        .lean()
        .catch(() =>
          Temple.find(
            { $or: [{ title: regex }, { deity: regex }, { city: regex }, { state: regex }] },
            { title: 1, description: 1, location: 1, city: 1, state: 1, deity: 1, slug: 1, image: 1 }
          ).limit(MAX_PER_GROUP).lean()
        ),

      // Devotionals — try text search, fall back to regex
      Devotional.find(
        { $text: { $search: q }, status: 'approved' },
        { title: 1, description: 1, category: 1, deity: 1, audio: 1, score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(MAX_PER_GROUP)
        .lean()
        .catch(() =>
          Devotional.find(
            { status: 'approved', $or: [{ title: regex }, { deity: regex }, { category: regex }] },
            { title: 1, description: 1, category: 1, deity: 1, audio: 1 }
          ).limit(MAX_PER_GROUP).lean()
        ),

      // Blogs — regex on title/excerpt
      Blog.find(
        { status: 'published', $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] },
        { title: 1, excerpt: 1, slug: 1, image: 1 }
      ).limit(MAX_PER_GROUP).lean(),

      // Events — regex on title/description
      Event.find(
        { status: 'approved', $or: [{ title: regex }, { description: regex }, { location: regex }] },
        { title: 1, description: 1, date: 1, location: 1 }
      ).limit(MAX_PER_GROUP).lean(),

      // Darshan — regex on title
      Darshan.find(
        { status: 'approved', $or: [{ title: regex }, { temple: regex }] },
        { title: 1, description: 1, temple: 1 }
      ).limit(MAX_PER_GROUP).lean(),
    ])

    return NextResponse.json({ temples, devotionals, blogs, events, darshan })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ temples: [], devotionals: [], blogs: [], events: [], darshan: [] })
  }
}
