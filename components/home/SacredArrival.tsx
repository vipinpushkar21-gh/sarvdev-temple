import Link from 'next/link'
import SmartSearch from '@/components/SmartSearch'
import SarvdevImage from '@/components/SarvdevImage'
import { getTempleHeroImage } from '@/lib/temple-image'

type HeroTemple = {
  title?: string
  location?: string
  city?: string
  state?: string
  image?: string
  imageHero?: string
  heroImage?: string
  primaryMedia?: any
  heroMedia?: any
}

export default function SacredArrival({ temple }: { temple?: HeroTemple | null }) {
  const location = [temple?.city, temple?.state].filter(Boolean).join(', ') || temple?.location
  const hasMedia = Boolean(temple?.primaryMedia || temple?.heroMedia || temple?.imageHero || temple?.heroImage || temple?.image)

  return (
    <section className="relative isolate overflow-hidden border-b border-surface-border bg-dark-sacred text-white">
      {hasMedia && <SarvdevImage
        image={getTempleHeroImage(temple || {})}
        alt={temple?.title ? `${temple.title}, a sacred temple on Sarvdev` : 'Sacred temple architecture'}
        className="absolute inset-y-0 right-0 hidden w-[62%] sm:block"
        imgClassName="object-cover"
        loading="eager"
        renderMode="auto"
      />}
      {hasMedia && <SarvdevImage
        image={getTempleHeroImage(temple || {})}
        alt=""
        className="absolute right-0 top-0 h-[58%] w-[70%] sm:hidden"
        imgClassName="object-cover"
        loading="eager"
        renderMode="auto"
      />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#171411_0%,#1c140f_46%,rgba(23,20,17,0.74)_62%,rgba(23,20,17,0.3)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(181,138,58,0.14),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,17,0.1)_0%,#171411_100%)] sm:hidden" />

      <div className="page-container relative min-h-[440px] sm:min-h-[540px] lg:min-h-[580px]">
        <div className="relative z-10 flex max-w-[42rem] flex-col justify-center py-5 sm:py-14 lg:py-20">
          <p className="text-overline font-semibold uppercase tracking-[0.16em] text-accent-200">
            Sarvdev · Sacred heritage of India
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-[2.2rem] font-semibold leading-[1] tracking-[-0.025em] text-white sm:mt-5 sm:text-[clamp(2.75rem,5vw,4.2rem)]">
            Discover India&apos;s living sacred heritage.
          </h1>
          <p className="mt-2 max-w-xl font-devanagari text-[1rem] leading-6 text-accent-100 sm:mt-4 sm:text-[1.3rem] sm:leading-8">
            मंदिरों, देवताओं, दर्शन और भक्ति की एक शांत, जीवंत यात्रा
          </p>
          <p className="mt-2 max-w-xl text-body-sm leading-6 text-stone-200 sm:mt-4 sm:text-body sm:leading-relaxed">
            Find revered temples, daily darshan, devotional traditions, festivals and the Panchang through one trusted cultural guide.
          </p>

          <div className="mt-5 max-w-2xl border border-white/15 bg-[#241C17]/65 p-2.5 sm:mt-7 sm:p-4">
            <p className="mb-2 px-1 text-caption font-semibold uppercase tracking-[0.12em] text-accent-100">
              Search Sarvdev
            </p>
            <SmartSearch />
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            <Link href="/temples" className="btn btn-primary no-underline hover:no-underline sm:btn-lg">
              Explore Temples
              <ArrowRight />
            </Link>
            <Link href="/daily-darshan" className="btn border border-white/25 bg-transparent text-white no-underline hover:border-accent-200 hover:bg-white/10 hover:text-white sm:btn-lg">
              Today&apos;s Darshan
            </Link>
          </div>
        </div>

        {temple?.title && (
          <div className="absolute bottom-8 right-8 z-10 hidden max-w-xs border-l border-accent-300 pl-3 text-white lg:block">
            <p className="font-display text-h3 text-white">{temple.title}</p>
            {location && <p className="mt-1 text-caption text-stone-200">{location}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

function ArrowRight() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}
