import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import BookmarkButton from '@/components/BookmarkButton'
import AdminEditBar from '@/components/AdminEditBar'
import SarvdevImage from '@/components/SarvdevImage'
import { renderTextParagraphs } from '@/components/TextParagraphs'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'
import { normalizeDeityForRead } from '@/lib/deity-normalization'
import { getDeityHeroImage, getGalleryImage } from '@/lib/temple-image'
import { hasUsableDeityMedia, getDeityGalleryMedia } from '@/lib/deity-media'
import { compactText } from '@/lib/text-formatting'
import { findDevotionalsForDeity, type RelatedDevotional } from '@/lib/deity-relations'
import type { SarvdevMediaAsset, SarvdevMediaInput } from '@/lib/media-asset'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'

type DeityRecord = {
  _id: string
  slug: string
  name: string
  nameHi?: string
  description?: string
  descriptionHi?: string
  mantra?: string
  attributes?: string[]
  aliases?: string[]
  slugAliases?: string[]
  categoryName?: string
  categoryNameHi?: string
  categorySlug?: string
  galleryMedia?: SarvdevMediaInput[]
  primaryMedia?: SarvdevMediaAsset
  cardMedia?: SarvdevMediaAsset
  heroMedia?: SarvdevMediaAsset
}

async function loadDeity(slug: string): Promise<DeityRecord | null> {
  await connectDB()
  const row = await Deity.findOne({
    status: { $ne: 'rejected' },
    $or: [{ slug }, { staticSlug: slug }, { slugAliases: slug }],
  }).lean()
  if (!row) return null
  return JSON.parse(JSON.stringify(normalizeDeityForRead(row))) as DeityRecord
}

export default async function DeityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let loaded: DeityRecord | null = null
  let loadFailed = false
  try {
    loaded = await loadDeity(slug)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <main className="page-container py-section-sm">
        <div className="border border-surface-border bg-surface-raised p-8 text-center">
          <h1 className="font-display text-h2 text-secondary-800">This sacred profile is unavailable right now</h1>
          <p className="mt-2 text-body-sm text-ink-muted">We could not reach the deity library. Please refresh in a moment.</p>
          <Link href="/deities" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
            Back to all deities
          </Link>
        </div>
      </main>
    )
  }

  const deity = loaded
  if (!deity) notFound()

  let devotionals: RelatedDevotional[] = []
  let relatedForms: { slug: string; name: string; nameHi?: string }[] = []
  try {
    const [devotionalRows, formRows] = await Promise.all([
      findDevotionalsForDeity(deity, 8),
      deity.categorySlug
        ? Deity.find(
            { status: { $ne: 'rejected' }, categorySlug: deity.categorySlug, slug: { $ne: deity.slug } },
            'slug name nameHi',
          ).sort({ order: 1, name: 1 }).limit(8).lean()
        : Promise.resolve([]),
    ])
    devotionals = devotionalRows
    relatedForms = JSON.parse(JSON.stringify(formRows)) as { slug: string; name: string; nameHi?: string }[]
  } catch {
    devotionals = []
    relatedForms = []
  }

  const gallery = getDeityGalleryMedia(deity as Record<string, unknown>)
  const illustrated = hasUsableDeityMedia(deity as Record<string, unknown>)
  const about = deity.description || deity.descriptionHi || ''
  const intro = compactText(about).slice(0, 240)
  const attributes = (deity.attributes || []).filter(Boolean)
  const pageUrl = `${BASE_URL}/deities/${deity.slug}`
  const templeSearchHref = `/temples?search=${encodeURIComponent(deity.name)}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Deities', item: `${BASE_URL}/deities` },
      { '@type': 'ListItem', position: 3, name: deity.name, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="page-container py-section-sm">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Deities', href: '/deities' }, { label: deity.name }]} />
        <AdminEditBar editHref={`/admin/deities?edit=${deity._id}`} label="Edit deity" />

        <header className="grid gap-8 border-b border-surface-border pb-9 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div>
            {deity.categoryName && (
              <Link
                href={`/deities?category=${encodeURIComponent(deity.categorySlug || '')}`}
                className="text-overline font-semibold uppercase tracking-[0.14em] text-primary no-underline hover:text-maroon"
              >
                {deity.categoryName}
              </Link>
            )}
            <h1 className="mt-2 font-display text-display-sm leading-tight text-secondary-800">{deity.name}</h1>
            {deity.nameHi && <p className="mt-1 font-devanagari text-h3 text-ink-muted">{deity.nameHi}</p>}
            {intro && <p className="mt-4 max-w-2xl text-body text-ink-muted">{intro}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <BookmarkButton item={{ id: String(deity._id), type: 'deity', title: deity.name, slug: deity.slug, subtitle: deity.categoryName, image: illustrated ? getDeityHeroImage(deity).src : undefined }} />
              <ShareButtons title={deity.name} url={pageUrl} />
            </div>
          </div>

          {illustrated && (
            <div className="relative aspect-[4/5] overflow-hidden border border-surface-border bg-surface-sunken">
              <SarvdevImage
                image={getDeityHeroImage(deity)}
                alt={deity.name}
                className="absolute inset-0"
                imgClassName="object-cover"
                renderMode="auto"
              />
            </div>
          )}
        </header>

        <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
          <div className="space-y-12">
            {about && (
              <section>
                <h2 className="font-display text-h2 text-secondary-800">About {deity.name}</h2>
                <div className="mt-4 space-y-4 text-body leading-relaxed text-ink-muted">
                  {renderTextParagraphs(about)}
                </div>
              </section>
            )}

            {deity.mantra && (
              <section>
                <h2 className="font-display text-h2 text-secondary-800">Mantra</h2>
                <blockquote className="mt-4 border-l-2 border-gold bg-surface-raised px-6 py-6">
                  <p className="whitespace-pre-line font-devanagari text-h3 leading-loose text-secondary-800">
                    {deity.mantra}
                  </p>
                </blockquote>
              </section>
            )}

            {attributes.length > 0 && (
              <section>
                <h2 className="font-display text-h2 text-secondary-800">Sacred attributes</h2>
                <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {attributes.map((attribute) => (
                    <li key={attribute} className="border-b border-surface-border py-2 text-body-sm text-ink-muted">
                      {attribute}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {devotionals.length > 0 && (
              <section>
                <h2 className="font-display text-h2 text-secondary-800">Devotionals</h2>
                <p className="mt-1 text-body-sm text-ink-muted">Bhajans, aartis and mantras recorded under this name.</p>
                <ul className="mt-5 divide-y divide-surface-border border-y border-surface-border">
                  {devotionals.map((devotional) => (
                    <li key={devotional._id}>
                      <Link
                        href={`/devotionals/${devotional.slug || devotional._id}`}
                        className="flex items-baseline justify-between gap-4 py-3.5 no-underline transition-colors hover:text-primary-700"
                      >
                        <span>
                          <span className="block text-body text-secondary-800">{devotional.title}</span>
                          {devotional.titleHi && (
                            <span className="mt-0.5 block font-devanagari text-body-sm text-ink-muted">{devotional.titleHi}</span>
                          )}
                        </span>
                        {devotional.category && (
                          <span className="shrink-0 text-caption uppercase tracking-[0.12em] text-ink-muted">
                            {devotional.category}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-h2 text-secondary-800">Temples to explore</h2>
              <p className="mt-2 max-w-2xl text-body-sm text-ink-muted">
                Temple records name their presiding deity in their own words, so we do not claim an exact list here.
                Search the directory for temples that mention {deity.name}.
              </p>
              <Link
                href={templeSearchHref}
                className="mt-4 inline-flex border border-primary px-5 py-2.5 text-body-sm font-semibold text-primary-700 no-underline transition hover:bg-primary hover:text-white"
              >
                Search temples for {deity.name}
              </Link>
            </section>

            {gallery.length > 0 && (
              <section>
                <h2 className="font-display text-h2 text-secondary-800">Gallery</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((media, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden border border-surface-border bg-surface-sunken">
                      <SarvdevImage
                        image={getGalleryImage(media as string)}
                        alt={`${deity.name} — image ${index + 1}`}
                        className="absolute inset-0"
                        imgClassName="object-cover"
                        renderMode="auto"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {relatedForms.length > 0 && (
              <section>
                <h2 className="font-display text-h3 text-secondary-800">Explore related divine forms</h2>
                <p className="mt-1 text-caption text-ink-muted">
                  Other deities recorded under {deity.categoryName || 'this tradition'}.
                </p>
                <ul className="mt-4 divide-y divide-surface-border border-y border-surface-border">
                  {relatedForms.map((form) => (
                    <li key={form.slug}>
                      <Link href={`/deities/${form.slug}`} className="block py-2.5 text-body-sm text-secondary-800 no-underline transition-colors hover:text-primary-700">
                        {form.name}
                        {form.nameHi && <span className="ml-2 font-devanagari text-ink-muted">{form.nameHi}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Link href="/deities" className="inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
              ← All deities
            </Link>
          </aside>
        </div>
      </main>
    </>
  )
}
