'use client'

import { useState } from 'react'
import { getGalleryImage } from '../lib/temple-image'
import SarvdevImage from './SarvdevImage'

type Props = {
  images: string[]
  title: string
}

export default function TempleImageGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const deduped = [...new Set(images.filter(Boolean))]
  const galleryItems = deduped.map((src) => ({
    thumb: getGalleryImage(src),
    full: getGalleryImage(src, 'lightbox'),
  }))
  const tileRatio = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-square']

  if (galleryItems.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {galleryItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setLightbox(idx)}
            className={`group relative overflow-hidden rounded-xl bg-sandstone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${tileRatio[idx % tileRatio.length]}`}
          >
            <SarvdevImage
              image={item.thumb}
              alt={`${title} photo ${idx + 1}`}
              className="absolute inset-0"
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
              renderMode="auto"
            />
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightbox > 0 && (
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div className="relative w-full h-[86vh] max-w-7xl" onClick={(e) => e.stopPropagation()}>
            <SarvdevImage
              image={galleryItems[lightbox].full}
              alt={`${title} photo ${lightbox + 1}`}
              className="absolute inset-0 rounded-xl bg-black"
              imgClassName="sarvdev-image-contain rounded-xl"
              renderMode="safe-contain"
            />
            <p className="absolute -bottom-8 left-0 right-0 text-center text-white/60 text-caption">
              {lightbox + 1} / {galleryItems.length}
            </p>
          </div>

          {lightbox < galleryItems.length - 1 && (
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
