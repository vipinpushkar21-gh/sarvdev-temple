import { BookOpen, Headphones, Search, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import SarvdevImage from '../../../components/SarvdevImage'
import { getDevotionalHeroImage } from '../../../lib/devotional-image'
import type { Devotional } from '../types'

type Props = {
  title: string
  eyebrow?: string
  subtitle?: string
  image?: Devotional | string | null
  stats?: { label: string; value: string | number }[]
  children?: ReactNode
}

export default function DevotionalHero({ title, eyebrow, subtitle, image, stats, children }: Props) {
  const heroImage = getDevotionalHeroImage(image)

  return (
    <section className="relative min-h-[520px] overflow-hidden bg-stone-950 text-white md:min-h-[560px]">
      <SarvdevImage image={heroImage} alt={title} className="absolute inset-0" imgClassName="object-cover" loading="eager" renderMode="cinematic-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/62 to-stone-950/20" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-surface to-transparent" />

      <div className="page-container relative z-10 flex min-h-[520px] flex-col justify-end pb-14 pt-20 md:min-h-[560px] md:pb-20">
        <div className="max-w-4xl">
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {eyebrow}
            </div>
          )}

          <h1 className="max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] font-black leading-[0.95] tracking-normal text-white drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100 md:text-xl">{subtitle}</p>}

          {stats && stats.length > 0 && (
            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-stone-300">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {children && (
            <div className="mt-8 max-w-3xl rounded-2xl border border-white/15 bg-white/12 p-3 shadow-2xl backdrop-blur-xl">
              {children}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-stone-200">
            <span className="inline-flex items-center gap-2"><Search className="h-4 w-4 text-amber-300" /> Search lyrics and chants</span>
            <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-amber-300" /> Audio and TTS ready</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-300" /> Hindi and English reading</span>
          </div>
        </div>
      </div>
    </section>
  )
}
