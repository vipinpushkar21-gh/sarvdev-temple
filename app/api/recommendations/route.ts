import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import Devotional from '@/models/Devotional'
import Blog from '@/models/Blog'
import Event from '@/models/Event'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * GET /api/recommendations?type=temple&deity=Shiva&state=Uttarakhand&city=Varanasi&limit=6
 *
 * Returns smart cross-content recommendations based on:
 *  - Same deity
 *  - Same state/city
 *  - Same categories
 *  - Related devotionals
 *  - Related blog posts
 *
 * Free-tier friendly: pure DB query logic, no external API.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const deity = searchParams.get('deity') || ''
  const state = searchParams.get('state') || ''
  const city = searchParams.get('city') || ''
  const excludeId = searchParams.get('exclude') || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 20)

  try {
    await connectDB()

    const results: { type: string; title: string; href: string; subtitle?: string; image?: string }[] = []

    // Related temples: same deity → same state → same city
    if (deity || state || city) {
      const query: any = { status: 'approved' }
      if (deity) query.deity = { $regex: new RegExp(deity, 'i') }

      let temples = await Temple.find(query, 'title image city state deity')
        .limit(limit * 3).lean() as any[]

      if (excludeId) {
        temples = temples.filter((t: any) => t._id.toString() !== excludeId)
      }

      // Score and sort: same city > same state > same deity
      const scored = temples.map((t: any) => {
        let score = 0
        if (city && t.city && slugify(t.city) === slugify(city)) score += 3
        if (state && t.state && slugify(t.state) === slugify(state)) score += 2
        if (deity && t.deity && t.deity.toLowerCase().includes(deity.toLowerCase())) score += 1
        return { ...t, score }
      }).sort((a: any, b: any) => b.score - a.score)

      for (const t of scored.slice(0, Math.ceil(limit * 0.5))) {
        results.push({
          type: 'temple',
          title: t.title,
          href: `/temples/${slugify(t.title)}`,
          subtitle: [t.city, t.state].filter(Boolean).join(', '),
          image: t.image,
        })
      }
    }

    // Related devotionals: same deity
    if (deity) {
      const devotionals = await Devotional.find(
        { status: 'approved', deity: { $regex: new RegExp(deity, 'i') } },
        'title deity category'
      ).limit(Math.ceil(limit * 0.3)).lean() as any[]

      for (const d of devotionals) {
        results.push({
          type: 'devotional',
          title: d.title,
          href: `/devotionals/${d._id.toString()}`,
          subtitle: d.category || d.deity,
        })
      }
    }

    // Related blog posts (keyword match in title)
    const blogKeywords = [deity, state, city].filter(Boolean)
    if (blogKeywords.length > 0) {
      const blogQuery = {
        $or: blogKeywords.map(k => ({ title: { $regex: new RegExp(k, 'i') } })),
      }
      const blogs = await Blog.find(blogQuery, 'title slug image excerpt')
        .limit(Math.ceil(limit * 0.2)).lean() as any[]

      for (const b of blogs) {
        results.push({
          type: 'blog',
          title: b.title,
          href: `/blog/${b.slug || b._id.toString()}`,
          subtitle: b.excerpt?.slice(0, 60),
          image: b.image,
        })
      }
    }

    // Related festivals/events (keyword match)
    const eventKeywords = [deity, city].filter(Boolean)
    if (eventKeywords.length > 0) {
      const eventQuery = {
        status: 'approved',
        $or: eventKeywords.map(k => ({ title: { $regex: new RegExp(k, 'i') } })),
      }
      const events = await Event.find(eventQuery, 'title slug description date')
        .limit(Math.ceil(limit * 0.15)).lean() as any[]

      for (const e of events) {
        results.push({
          type: 'festival',
          title: e.title,
          href: `/events/${e.slug || e._id.toString()}`,
          subtitle: e.date ? new Date(e.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' }) : undefined,
        })
      }
    }

    // Pilgrimage cluster suggestions based on deity
    const pilgrimageMap: Record<string, { slug: string; title: string }[]> = {
      shiva: [
        { slug: 'jyotirlinga', title: '12 Jyotirlinga Temples' },
        { slug: 'panch-kedar', title: 'Panch Kedar' },
        { slug: '108-shiva-temples', title: '108 Shiva Temples' },
      ],
      krishna: [
        { slug: 'iskcon', title: 'ISKCON Temples' },
        { slug: 'divya-desam', title: '108 Divya Desam' },
      ],
      rama: [
        { slug: 'ramayana-circuit', title: 'Ramayana Circuit' },
        { slug: 'sapta-puri', title: 'Sapta Puri' },
      ],
      vishnu: [
        { slug: 'divya-desam', title: '108 Divya Desam' },
        { slug: 'char-dham', title: 'Char Dham' },
      ],
      durga: [
        { slug: 'shakti-peeth', title: '52 Shakti Peethas' },
      ],
      ganesha: [
        { slug: 'ashta-vinayak', title: 'Ashta Vinayak' },
      ],
      murugan: [
        { slug: 'arupadai-veedu', title: 'Arupadai Veedu' },
      ],
    }
    if (deity) {
      const key = deity.toLowerCase().replace(/lord\s*/i, '')
      const clusters = pilgrimageMap[key] || []
      for (const c of clusters) {
        results.push({
          type: 'pilgrimage',
          title: c.title,
          href: `/temples/pilgrimage/${c.slug}`,
          subtitle: 'Pilgrimage Circuit',
        })
      }
    }

    return NextResponse.json({
      recommendations: results.slice(0, limit),
      meta: { deity, state, city, total: results.length },
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json({ recommendations: [], meta: {} }, { status: 500 })
  }
}
