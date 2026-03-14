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
    <article className="temple-card-2030 group">
      <Link href={`/temples/${slug}`} className="block no-underline hover:no-underline">
        <div className="card-img-wrap">
          <Image
            src={imgSrc}
            alt={temple.title}
            fill
            className="object-cover"
            onError={() => setImgSrc(TEMPLE_PLACEHOLDER)}
          />
          {/* Location overlay on image */}
          {temple.location && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium text-white/90"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="truncate max-w-[150px]">{temple.location.replace(/https?:\/\/[^\s,]+/g, '').trim().split(',')[0]}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-h4 text-secondary-700 font-serif group-hover:text-primary-600 transition-colors duration-300">{temple.title}</h3>
          {temple.description && (
            <p className="mt-2.5 text-body-sm text-ink-muted line-clamp-2 leading-relaxed">{temple.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-caption font-semibold text-primary-600 group-hover:translate-x-1 transition-transform duration-300">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}
