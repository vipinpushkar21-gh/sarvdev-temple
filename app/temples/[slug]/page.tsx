import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import BookmarkButton from '@/components/BookmarkButton'
import ShareButtons from '@/components/ShareButtons'
import ReviewSection from '@/components/ReviewSection'
import ClaimTempleButton from '@/components/ClaimTempleButton'
import AdminEditBar from '@/components/AdminEditBar'
import SarvdevImage from '@/components/SarvdevImage'
import { renderTextParagraphs } from '@/components/TextParagraphs'
import { connectDB } from '@/lib/db'
import Temple from '@/models/Temple'
import { getTempleHeroImage, getGalleryImage } from '@/lib/temple-image'
import { hasUsableTempleMedia, getTempleGalleryMedia } from '@/lib/temple-media'
import { findNearbyTemples, type NearbyTemple } from '@/lib/temple-nearby'
import { templeHref, templePlace } from '@/lib/temple-discovery'
import { normalizeTempleText, slugifyTemple } from '@/lib/temple-normalization'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/sacred-categories'
import type { SarvdevMediaAsset, SarvdevMediaInput } from '@/lib/media-asset'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://sarvdev.com'

type TempleFestival = {
  name?: string
  nameHi?: string
  description?: string
  descriptionHi?: string
  month?: string
  crowdScale?: string
}

type TempleFaq = { question?: string; answer?: string }

type TempleRecord = {
  _id: string
  slug?: string
  title: string
  titleHi?: string
  subtitle?: string
  subtitleHi?: string
  description?: string
  descriptionHi?: string
  sacredImportance?: string
  sacredImportanceHi?: string
  religiousImportance?: string
  speciality?: string
  specialityHi?: string
  history?: string
  historyHi?: string
  mythology?: string
  mythologyHi?: string
  templeLegend?: string
  sacredMystery?: string
  architecture?: string
  architectureHi?: string
  architectureStyle?: string
  architectureHighlights?: string
  builtBy?: string
  dynasty?: string
  establishedYear?: string
  timings?: string
  timingSlots?: string[]
  festivals?: TempleFestival[]
  templeFestivals?: string
  festivalsHi?: string
  streetAddress?: string
  location?: string
  city?: string
  district?: string
  state?: string
  country?: string
  latitude?: number
  longitude?: number
  deity?: string
  deityHi?: string
  categories?: string[]
  sacredCategories?: string[]
  sacredCategorySlugs?: string[]
  templeType?: string
  bestSeason?: string
  bestTimeToVisit?: string
  crowdLevel?: string
  dressCode?: string
  photographyAllowed?: string
  prasadamInfo?: string
  specialRituals?: string
  templeRules?: string
  nearestAirport?: string
  nearestRailwayStation?: string
  nearestBusStand?: string
  localTransport?: string
  parkingAvailable?: string
  wheelchairAccess?: string
  accommodationInfo?: string
  faqs?: TempleFaq[]
  galleryMedia?: SarvdevMediaInput[]
  primaryMedia?: SarvdevMediaAsset | null
  cardMedia?: SarvdevMediaAsset | null
  heroMedia?: SarvdevMediaAsset | null
}

function templeSlugQuery(slug: string) {
  const words = slug.split('-').map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean)
  const titleRegex = words.length > 0 ? new RegExp(`^${words.join('[\\s\\W]+')}$`, 'i') : null
  return {
    status: 'approved',
    $or: [
      { slug },
      { titleNormalized: normalizeTempleText(slug.replace(/-/g, ' ')) },
      ...(titleRegex ? [{ title: titleRegex }] : []),
    ],
  }
}

async function loadTemple(slug: string): Promise<TempleRecord | null> {
  await connectDB()
  const row = await Temple.findOne(templeSlugQuery(slug), { __v: 0 }).lean()
  if (!row) return null
  return JSON.parse(JSON.stringify(row)) as TempleRecord
}

function Section({
  id,
  title,
  titleHi,
  children,
}: {
  id?: string
  title: string
  titleHi?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="border-t border-surface-border pt-8">
      <h2 className="font-display text-h2 text-secondary-800">{title}</h2>
      {titleHi && <p className="mt-0.5 font-devanagari text-body-sm text-ink-muted">{titleHi}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Prose({ text }: { text?: string }) {
  if (!text) return null
  return <div className="space-y-4 text-body leading-relaxed text-ink-muted">{renderTextParagraphs(text)}</div>
}

function SubBlock({ title, text }: { title: string; text?: string }) {
  if (!text || !text.trim()) return null
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">{title}</h3>
      <div className="mt-2">
        <Prose text={text} />
      </div>
    </div>
  )
}

function FactRow({ label, value }: { label: string; value?: string }) {
  if (!value || !String(value).trim()) return null
  return (
    <div className="flex flex-col gap-0.5 border-b border-surface-border py-3 sm:flex-row sm:gap-6">
      <dt className="w-56 shrink-0 text-caption uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
      <dd className="text-body-sm text-ink-muted">{value}</dd>
    </div>
  )
}

export default async function TempleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let loaded: TempleRecord | null = null
  let loadFailed = false
  try {
    loaded = await loadTemple(slug)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <main className="page-container py-section-sm">
        <div className="border border-surface-border bg-surface-raised p-8 text-center">
          <h1 className="font-display text-h2 text-secondary-800">This temple page is unavailable right now</h1>
          <p className="mt-2 text-body-sm text-ink-muted">We could not reach the temple archive. Please refresh in a moment.</p>
          <Link href="/temples" className="mt-4 inline-flex text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon">
            Back to all temples
          </Link>
        </div>
      </main>
    )
  }

  const temple = loaded
  if (!temple) notFound()

  const templeSlug = temple.slug || slugifyTemple(temple.title)
  const place = templePlace(temple)
  const illustrated = hasUsableTempleMedia(temple as unknown as Record<string, unknown>)
  const gallery = getTempleGalleryMedia(temple as unknown as Record<string, unknown>)

  const hasCoordinates =
    typeof temple.latitude === 'number' &&
    typeof temple.longitude === 'number' &&
    Math.abs(temple.latitude) <= 90 &&
    Math.abs(temple.longitude) <= 180

  let nearby: NearbyTemple[] = []
  if (hasCoordinates) {
    try {
      nearby = await findNearbyTemples({
        lat: temple.latitude as number,
        lng: temple.longitude as number,
        excludeSlug: templeSlug,
        excludeId: temple._id,
        limit: 6,
      })
    } catch {
      nearby = []
    }
  }

  const knownCategorySlugs = new Set(getAllCategorySlugs())
  const categorySlugs = (temple.sacredCategorySlugs || []).filter(Boolean)
  const categoryNames = Array.from(
    new Set([...(temple.sacredCategories || []), ...(temple.categories || [])].filter(Boolean))
  )

  const festivals = (temple.festivals || []).filter((festival) => festival && (festival.name || festival.description))
  const faqs = (temple.faqs || []).filter((faq) => faq?.question && faq?.answer)

  const timingSlots = (temple.timingSlots || []).filter(Boolean)
  const hasVisitInfo = Boolean(
    temple.streetAddress ||
      temple.location ||
      temple.bestSeason ||
      temple.bestTimeToVisit ||
      temple.dressCode ||
      temple.photographyAllowed ||
      temple.prasadamInfo ||
      temple.specialRituals ||
      temple.templeRules ||
      temple.nearestAirport ||
      temple.nearestRailwayStation ||
      temple.nearestBusStand ||
      temple.localTransport ||
      temple.parkingAvailable ||
      temple.wheelchairAccess ||
      temple.accommodationInfo
  )

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`
    : ''
  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${temple.latitude}&mlon=${temple.longitude}#map=15/${temple.latitude}/${temple.longitude}`
    : ''

  return (
    <>
      <AdminEditBar editHref={`/admin/temples/${temple._id}/edit`} label="Edit temple" />

      <header className="border-b border-surface-border py-section-sm">
        <div className="page-container max-w-4xl">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Temples', href: '/temples' },
              ...(temple.state ? [{ label: temple.state, href: `/temples/state/${slugifyTemple(temple.state)}` }] : []),
              ...(temple.city ? [{ label: temple.city, href: `/temples/city/${slugifyTemple(temple.city)}` }] : []),
              { label: temple.title },
            ]}
          />

          {place && <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">{place}</p>}
          <h1 className="mt-2 font-display text-display-sm text-secondary-800">{temple.title}</h1>
          {temple.titleHi && <p className="mt-1.5 font-devanagari text-h3 text-ink-muted">{temple.titleHi}</p>}

          {temple.deity && (
            <p className="mt-4 text-body text-ink-muted">
              <span className="text-ink-faint">Presiding deity · </span>
              {temple.deity}
              {temple.deityHi ? <span className="font-devanagari"> · {temple.deityHi}</span> : null}
            </p>
          )}

          {categoryNames.length > 0 && (
            <p className="mt-3 text-body-sm text-ink-muted">
              {categorySlugs.length > 0
                ? categorySlugs.map((categorySlug, index) => {
                    const known = getCategoryBySlug(categorySlug)
                    const href = knownCategorySlugs.has(categorySlug)
                      ? `/temples/pilgrimage/${categorySlug}`
                      : `/temples?category=${encodeURIComponent(categorySlug)}`
                    return (
                      <span key={categorySlug}>
                        <Link href={href} className="text-ink-muted no-underline transition-colors hover:text-primary-700">
                          {known?.name || categoryNames[index] || categorySlug}
                        </Link>
                        {index < categorySlugs.length - 1 ? <span className="px-2 text-ink-faint">·</span> : null}
                      </span>
                    )
                  })
                : categoryNames.join(' · ')}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <BookmarkButton
              item={{
                id: temple._id,
                type: 'temple',
                title: temple.title,
                slug: templeSlug,
                subtitle: temple.deity,
                location: place,
              }}
              size="sm"
            />
            <ShareButtons title={temple.title} url={`${BASE_URL}${templeHref({ slug: templeSlug, title: temple.title })}`} />
          </div>
        </div>
      </header>

      <main className="page-container max-w-4xl py-section-sm">
        <div className="space-y-10">
          {illustrated && (
            <div className="relative aspect-[16/9] overflow-hidden border border-surface-border bg-surface-sunken">
              <SarvdevImage
                image={getTempleHeroImage(temple)}
                alt={temple.title}
                className="absolute inset-0"
                imgClassName="object-cover"
                renderMode="auto"
              />
            </div>
          )}

          {(temple.description || temple.descriptionHi) && (
            <section>
              <Prose text={temple.description} />
              {temple.descriptionHi && (
                <div className="mt-5 space-y-4 font-devanagari text-body leading-relaxed text-ink-muted">
                  {renderTextParagraphs(temple.descriptionHi)}
                </div>
              )}
            </section>
          )}

          {(temple.sacredImportance || temple.religiousImportance || temple.speciality) && (
            <Section title="Sacred significance" titleHi="धार्मिक महत्व">
              <SubBlock title="Sacred importance" text={temple.sacredImportance} />
              <SubBlock title="Religious importance" text={temple.religiousImportance} />
              <SubBlock title="Speciality" text={temple.speciality} />
            </Section>
          )}

          {(temple.history || temple.mythology || temple.templeLegend || temple.sacredMystery) && (
            <Section title="History and tradition" titleHi="इतिहास एवं परंपरा">
              <SubBlock title="History" text={temple.history} />
              <SubBlock title="Mythology" text={temple.mythology} />
              <SubBlock title="Temple legend" text={temple.templeLegend} />
              <SubBlock title="Sacred mystery" text={temple.sacredMystery} />
            </Section>
          )}

          {(temple.architecture || temple.architectureStyle || temple.architectureHighlights) && (
            <Section title="Architecture" titleHi="स्थापत्य">
              <SubBlock title="Architecture" text={temple.architecture} />
              <SubBlock title="Style" text={temple.architectureStyle} />
              <SubBlock title="Highlights" text={temple.architectureHighlights} />
              <dl className="mt-6">
                <FactRow label="Built by" value={temple.builtBy} />
                <FactRow label="Dynasty" value={temple.dynasty} />
                <FactRow label="Established" value={temple.establishedYear} />
              </dl>
            </Section>
          )}

          {(temple.timings || timingSlots.length > 0) && (
            <Section title="Temple timings" titleHi="दर्शन समय">
              {temple.timings && <Prose text={temple.timings} />}
              {timingSlots.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {timingSlots.map((slot) => (
                    <li key={slot} className="text-body-sm text-ink-muted">{slot}</li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-caption text-ink-faint">
                Timings are as recorded in the temple archive. Confirm locally before travelling, especially on
                festival days.
              </p>
            </Section>
          )}

          {(festivals.length > 0 || temple.templeFestivals) && (
            <Section title="Festivals at this temple" titleHi="मंदिर के उत्सव">
              {festivals.length > 0 && (
                <ul className="space-y-5">
                  {festivals.map((festival, index) => (
                    <li key={`${festival.name || 'festival'}-${index}`} className="border-b border-surface-border pb-4 last:border-b-0">
                      <p className="font-display text-h3 text-secondary-800">{festival.name}</p>
                      {festival.nameHi && <p className="mt-0.5 font-devanagari text-body-sm text-ink-muted">{festival.nameHi}</p>}
                      {festival.month && <p className="mt-1 text-caption uppercase tracking-[0.12em] text-ink-faint">{festival.month}</p>}
                      {festival.description && (
                        <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">{festival.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {temple.templeFestivals && (
                <div className="mt-5">
                  <Prose text={temple.templeFestivals} />
                </div>
              )}
            </Section>
          )}

          {hasVisitInfo && (
            <Section title="Visit information" titleHi="यात्रा जानकारी">
              <dl>
                <FactRow label="Address" value={[temple.streetAddress, temple.location].filter(Boolean).join(', ')} />
                <FactRow label="City" value={temple.city} />
                <FactRow label="District" value={temple.district} />
                <FactRow label="State" value={temple.state} />
                <FactRow label="Best season" value={temple.bestSeason} />
                <FactRow label="Best time to visit" value={temple.bestTimeToVisit} />
                <FactRow label="Usual crowd" value={temple.crowdLevel} />
                <FactRow label="Dress code" value={temple.dressCode} />
                <FactRow label="Photography" value={temple.photographyAllowed} />
                <FactRow label="Prasadam" value={temple.prasadamInfo} />
                <FactRow label="Special rituals" value={temple.specialRituals} />
                <FactRow label="Temple rules" value={temple.templeRules} />
                <FactRow label="Nearest airport" value={temple.nearestAirport} />
                <FactRow label="Nearest railway station" value={temple.nearestRailwayStation} />
                <FactRow label="Nearest bus stand" value={temple.nearestBusStand} />
                <FactRow label="Local transport" value={temple.localTransport} />
                <FactRow label="Parking" value={temple.parkingAvailable} />
                <FactRow label="Accessibility" value={temple.wheelchairAccess} />
                <FactRow label="Accommodation" value={temple.accommodationInfo} />
              </dl>
            </Section>
          )}

          {hasCoordinates && (
            <Section title="Location" titleHi="स्थान">
              <p className="text-body-sm text-ink-muted">
                {[temple.streetAddress, place].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-2 text-caption uppercase tracking-[0.12em] text-ink-faint">
                {temple.latitude?.toFixed(5)}, {temple.longitude?.toFixed(5)}
              </p>
              <div className="mt-4 flex flex-wrap gap-5">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
                >
                  Get directions →
                </a>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
                >
                  Open on map →
                </a>
              </div>
            </Section>
          )}

          {nearby.length > 0 && (
            <Section title="Temples nearby" titleHi="आसपास के मंदिर">
              <p className="text-body-sm text-ink-muted">
                Measured by straight-line distance from this temple&apos;s recorded coordinates.
              </p>
              <ul className="mt-5 space-y-4">
                {nearby.map((item) => (
                  <li key={item._id} className="border-b border-surface-border pb-4 last:border-b-0">
                    <Link
                      href={templeHref({ slug: item.slug, title: item.title })}
                      className="group no-underline hover:no-underline"
                    >
                      <span className="block font-display text-h3 text-secondary-800 transition-colors group-hover:text-primary-700">
                        {item.title}
                      </span>
                    </Link>
                    <p className="mt-1 text-caption uppercase tracking-[0.12em] text-ink-faint">
                      {[item.city, item.state].filter(Boolean).join(', ')}
                      {item.distanceKm ? ` · ${item.distanceKm.toFixed(1)} km` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {temple.deity && (
            <Section title="Explore more" titleHi="और खोजें">
              <p className="text-body-sm text-ink-muted">
                Deity names here are recorded as free text, so this is a search across the archive rather than a
                linked deity profile.
              </p>
              <div className="mt-4 flex flex-wrap gap-5">
                <Link
                  href={`/temples?q=${encodeURIComponent(temple.deity)}`}
                  className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
                >
                  Search temples of {temple.deity} →
                </Link>
                {temple.city && (
                  <Link
                    href={`/temples/city/${slugifyTemple(temple.city)}`}
                    className="text-body-sm font-semibold text-primary-700 no-underline hover:text-maroon"
                  >
                    More temples in {temple.city} →
                  </Link>
                )}
              </div>
            </Section>
          )}

          {gallery.length > 0 && (
            <Section title="Gallery" titleHi="चित्रावली">
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((media, index) => (
                  <div key={index} className="relative aspect-[4/3] overflow-hidden border border-surface-border bg-surface-sunken">
                    <SarvdevImage
                      image={getGalleryImage(media)}
                      alt={`${temple.title} — ${index + 1}`}
                      className="absolute inset-0"
                      imgClassName="object-cover"
                      renderMode="auto"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {faqs.length > 0 && (
            <Section title="Frequently asked" titleHi="सामान्य प्रश्न">
              <div className="divide-y divide-surface-border border-y border-surface-border">
                {faqs.map((faq, index) => (
                  <details key={index} className="group py-4">
                    <summary className="cursor-pointer list-none text-body font-medium text-secondary-800 marker:hidden">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}

          <div className="border-t border-surface-border pt-8">
            <ReviewSection templeSlug={templeSlug} hideWhenEmpty />
          </div>

          <div className="border-t border-surface-border pt-8">
            <ClaimTempleButton templeId={temple._id} templeName={temple.title} />
          </div>
        </div>
      </main>
    </>
  )
}
