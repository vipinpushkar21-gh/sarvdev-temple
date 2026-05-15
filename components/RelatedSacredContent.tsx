import Link from 'next/link'

type LinkItem = { href: string; label: string; sub?: string }

interface Props {
  title?: string
  temples?: LinkItem[]
  devotionals?: LinkItem[]
  festivals?: LinkItem[]
  states?: LinkItem[]
  deities?: LinkItem[]
  blogs?: LinkItem[]
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Reusable "Related Sacred Content" block for internal linking.
 * Renders grouped links to temples, devotionals, festivals, state hubs,
 * deity hubs, and blogs to improve crawl depth and topical authority.
 */
export default function RelatedSacredContent({
  title = 'Related Sacred Content',
  temples = [],
  devotionals = [],
  festivals = [],
  states = [],
  deities = [],
  blogs = [],
}: Props) {
  const sections = [
    { heading: 'Temples', items: temples, icon: '🛕' },
    { heading: 'Devotionals', items: devotionals, icon: '🎵' },
    { heading: 'Festivals & Events', items: festivals, icon: '🪔' },
    { heading: 'Explore by State', items: states, icon: '📍' },
    { heading: 'Explore by Deity', items: deities, icon: '🙏' },
    { heading: 'Blog Articles', items: blogs, icon: '📖' },
  ].filter(s => s.items.length > 0)

  if (sections.length === 0) return null

  return (
    <section className="mt-12 pt-10 border-t border-surface-border">
      <h2 className="text-h3 font-serif text-secondary-700 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(sec => (
          <div key={sec.heading}>
            <h3 className="text-body font-semibold text-ink mb-3 flex items-center gap-2">
              <span>{sec.icon}</span> {sec.heading}
            </h3>
            <ul className="space-y-1.5">
              {sec.items.slice(0, 6).map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-primary-600 hover:text-primary-800 transition-colors no-underline hover:underline"
                  >
                    {item.label}
                  </Link>
                  {item.sub && (
                    <span className="text-caption text-ink-faint ml-1">· {item.sub}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Helper: Build RelatedSacredContent props from raw data arrays.
 * Useful in SSR pages to auto-generate internal links.
 */
export function buildRelatedLinks(data: {
  temples?: { title: string; city?: string; state?: string }[]
  devotionals?: { title: string; _id: string; category?: string }[]
  states?: string[]
  deities?: string[]
  blogs?: { title: string; _id: string }[]
  festivals?: { title: string; slug: string; year: number }[]
}) {
  const result: Partial<Props> = {}

  if (data.temples?.length) {
    result.temples = data.temples.slice(0, 6).map(t => ({
      href: `/temples/${slugify(t.title)}`,
      label: t.title,
      sub: [t.city, t.state].filter(Boolean).join(', '),
    }))
  }

  if (data.devotionals?.length) {
    result.devotionals = data.devotionals.slice(0, 6).map(d => ({
      href: `/devotionals/${d._id}`,
      label: d.title,
      sub: d.category,
    }))
  }

  if (data.states?.length) {
    result.states = data.states.slice(0, 8).map(s => ({
      href: `/temples/state/${slugify(s)}`,
      label: `Temples in ${s}`,
    }))
  }

  if (data.deities?.length) {
    result.deities = data.deities.slice(0, 8).map(d => ({
      href: `/temples/deity/${slugify(d)}`,
      label: `${d} Temples`,
    }))
  }

  if (data.blogs?.length) {
    result.blogs = data.blogs.slice(0, 4).map(b => ({
      href: `/blog/${b._id}`,
      label: b.title,
    }))
  }

  if (data.festivals?.length) {
    result.festivals = data.festivals.slice(0, 6).map(f => ({
      href: `/events/${f.slug}`,
      label: f.title,
      sub: String(f.year),
    }))
  }

  return result
}
