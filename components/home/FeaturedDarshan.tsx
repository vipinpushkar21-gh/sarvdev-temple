import Link from 'next/link'
import SarvdevImage from '@/components/SarvdevImage'
import { getTempleHeroImage } from '@/lib/temple-image'

type Darshan = {
  title?: string
  description?: string
  temple?: string
  templeName?: string
  templeSlug?: string
  deity?: string
  location?: string
  city?: string
  state?: string
  isLive?: boolean
  darshanType?: string
  type?: string
  image?: string
  imageCard?: string
  imageHero?: string
  thumbnail?: string
  primaryMedia?: any
  cardMedia?: any
  heroMedia?: any
}

export default function FeaturedDarshan({ darshan }: { darshan?: Darshan | null }) {
  if (!darshan?.title) return null

  const temple = darshan.templeName || darshan.temple
  const location = darshan.location || [darshan.city, darshan.state].filter(Boolean).join(', ')
  const isLive = darshan.isLive || darshan.darshanType === 'live' || darshan.type === 'live'
  const templeHref = darshan.templeSlug ? `/temples/${darshan.templeSlug}` : null
  const description = darshan.description || 'A quiet moment of worship, shared through Sarvdev.'
  const selectedMedia = [darshan.heroMedia, darshan.primaryMedia, darshan.cardMedia].find(
    (media) => Number(media?.width) > 0 && Number(media?.height) > 0
  )
  const mediaRatio = selectedMedia ? Number(selectedMedia.width) / Number(selectedMedia.height) : null
  // Unknown and vertical source artwork is never allowed to crop into a poster.
  // The shared image component still applies its existing focal-safe treatment to landscape media.
  const mediaRenderMode = !mediaRatio || mediaRatio < 1.18 ? 'safe-contain' : 'auto'

  return (
    <section className="relative overflow-hidden bg-dark-sacred py-section-sm text-white sm:py-section">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(181,138,58,0.14),transparent_30%),linear-gradient(145deg,#171411,#22160f)]" />
      <div className="page-container relative">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-accent-200">A moment of worship</p>
          <h2 className="mt-2 font-display text-h1 text-white">Featured Darshan</h2>
        </div>

        <article className="grid overflow-hidden border border-white/10 bg-white/[0.03] lg:h-[clamp(32.5rem,42vw,38.75rem)] lg:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
          <div className="relative h-[clamp(16.25rem,72vw,20rem)] overflow-hidden bg-[#2a1d13] lg:h-full">
            <SarvdevImage
              image={getTempleHeroImage(darshan)}
              alt={darshan.title}
              className="absolute inset-0"
              renderMode={mediaRenderMode}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/42 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#171411]/20" />
            {isLive && <span className="absolute left-5 top-5 border border-red-200/25 bg-red-950/70 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.12em] text-red-100">Live now</span>}
          </div>

          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-9 xl:p-10">
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-accent-200">{isLive ? 'Live Darshan' : 'Daily Darshan'}</p>
            <h3 className="mt-3 font-display text-[2rem] leading-tight text-white sm:text-[2.35rem]">{darshan.title}</h3>
            <p className="mt-4 text-body-sm leading-6 text-stone-200 line-clamp-3">{description}</p>

            {(temple || darshan.deity || location) && (
              <dl className="mt-5 space-y-2 border-t border-white/10 pt-5 text-body-sm">
                {temple && <div className="flex gap-3"><dt className="w-16 shrink-0 text-stone-400">Temple</dt><dd className="text-stone-100">{temple}</dd></div>}
                {darshan.deity && <div className="flex gap-3"><dt className="w-16 shrink-0 text-stone-400">Deity</dt><dd className="text-stone-100">{darshan.deity}</dd></div>}
                {location && <div className="flex gap-3"><dt className="w-16 shrink-0 text-stone-400">Place</dt><dd className="text-stone-100">{location}</dd></div>}
              </dl>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/daily-darshan" className="btn btn-primary no-underline hover:no-underline">Watch Darshan <Arrow /></Link>
              {templeHref && <Link href={templeHref} className="btn border border-white/20 bg-transparent text-white no-underline hover:border-accent-200 hover:bg-white/10 hover:text-white">Temple details</Link>}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function Arrow() { return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg> }
