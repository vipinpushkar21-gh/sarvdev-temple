import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminEditBar from '@/components/AdminEditBar'
import BookmarkButton from '@/components/BookmarkButton'
import SarvdevImage from '@/components/SarvdevImage'
import ShareButtons from '@/components/ShareButtons'
import {
  devotionalCategoryHref,
  devotionalHasAudio,
  devotionalHref,
  devotionalSacredText,
  findDevotionalByRoute,
  findRelatedDevotionals,
  resolveDeityProfile,
  slugifyDevotionalText,
} from '@/lib/devotional-discovery'
import { splitTextParagraphs } from '@/lib/text-formatting'
import { getDevotionalCardImage } from '@/lib/devotional-image'
import { getDevotionalSupportingMedia } from '@/lib/devotional-media'
import DevotionalListen from '../components/DevotionalListen'
import SacredTextReader from '../components/SacredTextReader'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'

export default async function DevotionalReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const devotional = await findDevotionalByRoute(id)
  if (!devotional) notFound()

  const [related, deityProfile] = await Promise.all([
    findRelatedDevotionals(devotional),
    resolveDeityProfile(devotional.deitySlug),
  ])

  const sacredText = devotionalSacredText(devotional)
  // The lead paragraph appears in the header, so About only carries what is not already shown.
  const about = splitTextParagraphs(devotional.description).slice(1)
  const aboutHi = splitTextParagraphs(devotional.descriptionHi)
  const audioSrc = (devotional.audioUrl || devotional.audio || '').trim()
  const deityCollectionSlug = devotional.deitySlug || slugifyDevotionalText(devotional.deity || '')
  const speechLang = /hindi|sanskrit|हिन्दी|संस्कृत/i.test(devotional.language || 'Hindi') ? 'hi-IN' : 'en-IN'
  const canonicalPath = devotionalHref(devotional)
  const meta = [
    devotional.category,
    devotional.subcategory,
    devotional.language,
  ].filter(Boolean) as string[]
  const supportingMedia = getDevotionalSupportingMedia(devotional)
  const supportingImage = getDevotionalCardImage(supportingMedia)

  return (
    <main className="pb-section-sm">
      <AdminEditBar editHref={`/admin/devotionals/${devotional._id}/edit`} label="Edit Devotional" />
      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-caption text-ink-muted">
            <Link href="/devotionals" className="no-underline hover:text-primary-700">Bhakti Library</Link>
            {devotional.category && (
              <>
                <span className="px-2">/</span>
                <Link href={devotionalCategoryHref(devotional)} className="no-underline hover:text-primary-700">
                  {devotional.category}
                </Link>
              </>
            )}
          </nav>

          {devotional.deity && (
            <p className="mt-5 text-caption uppercase tracking-[0.14em] text-primary">{devotional.deity}</p>
          )}
          <h1 className="mt-2 font-display text-display-sm text-secondary-800">{devotional.title}</h1>
          {devotional.titleHi && devotional.titleHi !== devotional.title && (
            <p className="mt-2 font-devanagari text-h2 text-ink-muted">{devotional.titleHi}</p>
          )}

          {meta.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-muted">
              {meta.map((item) => <span key={item}>{item}</span>)}
            </p>
          )}

          {devotional.description && (
            <p className="mt-5 text-body leading-relaxed text-ink-muted">{devotional.description}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <BookmarkButton
              item={{
                id: devotional._id,
                type: 'devotional',
                title: devotional.title,
                slug: devotional.slug || devotional._id,
              }}
            />
            <ShareButtons title={devotional.title} url={`${BASE_URL}${canonicalPath}`} />
          </div>
        </div>
      </header>

      <div className="page-container max-w-3xl">
        <div className="mt-8 max-w-md overflow-hidden border border-surface-border bg-surface-sunken">
          <SarvdevImage
            image={supportingImage}
            alt={supportingMedia ? `${devotional.title} artwork` : 'Devotional artwork placeholder'}
            className="aspect-video"
            imgClassName="object-contain"
            renderMode="safe-contain"
          />
        </div>

        {(about.length > 0 || aboutHi.length > 0) && (
          <section className="border-t border-surface-border pt-8">
            <h2 className="font-display text-h2 text-secondary-800">About this devotional</h2>
            {about.map((paragraph, index) => (
              <p key={`en-${index}`} className="mt-4 text-body leading-relaxed text-ink-muted">{paragraph}</p>
            ))}
            {aboutHi.map((paragraph, index) => (
              <p key={`hi-${index}`} className="mt-4 font-devanagari text-body leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </section>
        )}

        <div className="mt-10">
        {sacredText ? (
          <SacredTextReader
            text={sacredText}
            title={devotional.titleHi || devotional.title}
            language={devotional.language}
          />
        ) : (
          <section className="border-t border-surface-border pt-8">
            <p className="text-body text-ink-muted">
              The text of this devotional has not been recorded yet.
            </p>
          </section>
        )}
        </div>

        {(devotionalHasAudio(devotional) || sacredText) && (
          <div className="mt-10">
            <DevotionalListen
              id={devotional._id}
              title={devotional.title}
              deity={devotional.deity}
              audioSrc={audioSrc || undefined}
              text={sacredText || devotional.description || ''}
              speechLang={speechLang}
            />
          </div>
        )}

        {(deityCollectionSlug || devotional.categorySlug) && (
          <section className="mt-10 border-t border-surface-border pt-8">
            <h2 className="font-display text-h2 text-secondary-800">Continue reading</h2>
            <ul className="mt-4 space-y-2 text-body">
              {deityCollectionSlug && devotional.deity && (
                <li>
                  <Link
                    href={`/devotionals/deity/${deityCollectionSlug}`}
                    className="text-primary-700 no-underline hover:text-maroon hover:underline"
                  >
                    More devotionals for {devotional.deity}
                  </Link>
                </li>
              )}
              {devotional.category && (
                <li>
                  <Link
                    href={devotionalCategoryHref(devotional)}
                    className="text-primary-700 no-underline hover:text-maroon hover:underline"
                  >
                    All {devotional.category} texts
                  </Link>
                </li>
              )}
              {deityProfile && (
                <li>
                  <Link
                    href={`/deities/${deityProfile.slug}`}
                    className="text-primary-700 no-underline hover:text-maroon hover:underline"
                  >
                    About {deityProfile.name || devotional.deity}
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-section-sm border-t border-surface-border pt-section-sm">
          <div className="page-container">
            <h2 className="font-display text-h1 text-secondary-800">Related devotionals</h2>
            <p className="mt-2 text-body-sm text-ink-muted">
              Other texts recorded for the same deity and devotional form.
            </p>
            <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item._id} className="border-b border-surface-border pb-4">
                  <Link href={devotionalHref(item)} className="group no-underline hover:no-underline">
                    <span className="block font-display text-h4 text-secondary-800 transition-colors group-hover:text-primary-700">
                      {item.title}
                    </span>
                    {item.titleHi && item.titleHi !== item.title && (
                      <span className="mt-1 block font-devanagari text-body-sm text-ink-muted">{item.titleHi}</span>
                    )}
                    <span className="mt-2 block text-caption text-ink-muted">
                      {[item.category, item.deity].filter(Boolean).join(' · ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
