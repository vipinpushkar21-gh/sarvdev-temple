import Link from 'next/link'
import Image from 'next/image'
import type { Temple } from '../data/sarvdev'

type Props = {
  temple: Temple
}

export default function TempleCard({ temple }: Props) {
  const slug = temple.slug || temple.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <article className="card-interactive overflow-hidden">
      <Link href={`/temples/${slug}`} className="block no-underline hover:no-underline">
        {temple.image ? (
          <div className="relative h-48 w-full bg-surface-sunken">
            <Image src={temple.image} alt={temple.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-48 w-full bg-primary-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
            </svg>
          </div>
        )}

        <div className="p-5">
          <h3 className="text-h4 text-secondary-700 font-serif">{temple.title}</h3>
          <p className="mt-2 text-body-sm text-ink-muted line-clamp-3">{temple.description}</p>
        </div>
      </Link>
    </article>
  )
}
