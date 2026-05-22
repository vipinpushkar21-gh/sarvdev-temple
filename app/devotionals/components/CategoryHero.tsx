import Link from 'next/link'
import { BookOpen, Library, Music2 } from 'lucide-react'
import SarvdevImage from '../../../components/SarvdevImage'
import { getDevotionalHeroImage } from '../../../lib/devotional-image'

const DEFAULT_HERO = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

type Props = {
  label: string
  hindi?: string
  description: string
  count: number
  deityCount: number
  audioCount: number
}

export default function CategoryHero({ label, hindi, description, count, deityCount, audioCount }: Props) {
  const image = getDevotionalHeroImage(DEFAULT_HERO)

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <SarvdevImage image={image} alt={`${label} devotionals`} className="absolute inset-0" imgClassName="object-cover" loading="eager" renderMode="auto" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/68 to-stone-950/25" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface to-transparent" />

      <div className="page-container relative z-10 py-16 md:py-24">
        <nav className="mb-8 flex items-center gap-2 text-sm text-stone-300">
          <Link href="/devotionals" className="text-stone-200 hover:text-amber-200">Devotionals</Link>
          <span>/</span>
          <span className="font-semibold text-white">{label}</span>
        </nav>

        <div className="flex max-w-5xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
              <Library className="h-4 w-4" />
              Devotional Category
            </div>
            {hindi && <p className="mb-2 font-devanagari text-2xl font-bold text-amber-200">{hindi}</p>}
            <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-black leading-none tracking-normal text-white">{label}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100">{description}</p>
          </div>

          <div className="grid min-w-[280px] grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 text-center backdrop-blur">
              <div className="text-2xl font-black">{count}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-stone-300">Items</div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 text-center backdrop-blur">
              <div className="text-2xl font-black">{deityCount}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-stone-300">Deities</div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 text-center backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-2xl font-black"><Music2 className="h-5 w-5" />{audioCount}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-stone-300">Audio</div>
            </div>
          </div>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-950">
          <BookOpen className="h-4 w-4" />
          Lyrics, chanting support and deity discovery
        </div>
      </div>
    </section>
  )
}
