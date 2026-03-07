'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Temple } from '../data/sarvdev'
import { getTempleImage, TEMPLE_PLACEHOLDER } from '../lib/temple-image'

type Props = {
  temple: Temple
}

export default function TempleCard({ temple }: Props) {
  const slug = temple.slug || temple.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const [imgSrc, setImgSrc] = useState(getTempleImage(temple))

  return (
    <article className="card-interactive overflow-hidden">
      <Link href={`/temples/${slug}`} className="block no-underline hover:no-underline">
        <div className="relative h-48 w-full bg-surface-sunken">
          <Image
            src={imgSrc}
            alt={temple.title}
            fill
            className="object-cover"
            onError={() => setImgSrc(TEMPLE_PLACEHOLDER)}
          />
        </div>

        <div className="p-5">
          <h3 className="text-h4 text-secondary-700 font-serif">{temple.title}</h3>
          <p className="mt-2 text-body-sm text-ink-muted line-clamp-3">{temple.description}</p>
        </div>
      </Link>
    </article>
  )
}
