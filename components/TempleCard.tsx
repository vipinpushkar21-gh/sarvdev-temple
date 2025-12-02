import Link from 'next/link'
import Image from 'next/image'
import type { Temple } from '../data/sarvdev'

type Props = {
  temple: Temple
}

export default function TempleCard({ temple }: Props) {
  // Use slug from temple object if provided, otherwise generate from title
  const slug = temple.slug || temple.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <article className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/temples/${slug}`} className="block">
        {temple.image ? (
          <div className="relative h-40 w-full">
            <Image src={temple.image} alt={temple.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-r from-emerald-200 to-emerald-400 flex items-center justify-center text-2xl font-medium text-white">
            🛕
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{temple.title}</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{temple.description}</p>
        </div>
      </Link>
    </article>
  )
}
