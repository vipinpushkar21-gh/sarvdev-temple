import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Temple from '@/models/Temple'
import Review from '@/models/Review'

const BASE = 'https://sarvdev.com'

export const revalidate = 3600

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const { id } = await params
    await connectDB()
    const user = await User.findById(id, 'name city state').lean() as any
    if (!user) return { title: 'Contributor — Sarvdev' }
    const name = user.name || 'Contributor'
    const location = [user.city, user.state].filter(Boolean).join(', ')
    return {
      title: `${name} — Sarvdev Contributor`,
      description: `${name} is a verified contributor on Sarvdev${location ? ` from ${location}` : ''}. View their temple submissions and community contributions.`,
      alternates: { canonical: `${BASE}/contributors/${id}` },
    }
  } catch {
    return { title: 'Contributor — Sarvdev' }
  }
}

export default async function ContributorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let user: any = null
  let temples: any[] = []
  let reviewCount = 0

  try {
    await connectDB()
    user = await User.findById(id, 'name email city state role status createdAt').lean() as any
    if (user) {
      temples = await Temple.find(
        { submittedBy: user.email || user._id.toString(), status: 'approved' },
        'title image city state deity'
      ).lean() as any[]
      reviewCount = await Review.countDocuments({ userId: user._id })
    }
  } catch (e) {
    console.error('Contributor profile error:', e)
  }

  if (!user) {
    return (
      <main className="page-container section-sm text-center py-20">
        <p className="text-h3 font-serif text-ink-muted mb-4">Contributor not found</p>
        <Link href="/contributors" className="btn btn-primary no-underline hover:no-underline">All Contributors</Link>
      </main>
    )
  }

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const location = [user.city, user.state].filter(Boolean).join(', ')
  const roleLabel = user.role === 'temple' ? 'Temple Manager' : user.role === 'pandit' ? 'Pandit' : user.role === 'admin' ? 'Admin' : 'Devotee'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: user.name,
      ...(location && { address: { '@type': 'PostalAddress', addressLocality: user.city, addressRegion: user.state } }),
      memberOf: { '@type': 'Organization', name: 'Sarvdev', url: BASE },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-primary-50 via-surface to-accent-50/30 border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-body-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors no-underline">Home</Link>
            <span>/</span>
            <Link href="/contributors" className="hover:text-primary-600 transition-colors no-underline">Contributors</Link>
            <span>/</span>
            <span className="text-ink font-medium">{user.name}</span>
          </nav>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-h2 font-serif text-secondary-800">{user.name}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">{roleLabel}</span>
                {user.status === 'approved' && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Verified</span>
                )}
                {location && <span className="text-caption text-ink-muted">{location}</span>}
              </div>
              <p className="text-caption text-ink-faint mt-1">Member since {memberSince}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Temples Submitted', value: temples.length, icon: '🛕' },
            { label: 'Reviews Written', value: reviewCount, icon: '⭐' },
            { label: 'Role', value: roleLabel, icon: '🏷️' },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-h3 font-serif text-ink mt-2">{s.value}</p>
              <p className="text-caption text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Temple submissions */}
        {temples.length > 0 && (
          <section>
            <h2 className="text-h3 font-serif text-secondary-700 mb-4">Temple Contributions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {temples.map((t: any) => (
                <Link key={t._id.toString()} href={`/temples/${slugify(t.title)}`}
                  className="group card p-4 flex items-center gap-4 hover:shadow-md transition-all no-underline">
                  {t.image && (
                    <img src={t.image} alt={t.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-body-sm font-semibold text-ink group-hover:text-primary-700 transition-colors line-clamp-1">{t.title}</h3>
                    <p className="text-caption text-ink-muted">{[t.city, t.state].filter(Boolean).join(', ')}</p>
                    {t.deity && <span className="text-[10px] text-ink-faint">{t.deity}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {temples.length === 0 && (
          <div className="text-center py-10">
            <p className="text-body text-ink-muted">No public temple submissions yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
