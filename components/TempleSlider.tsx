"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Temple {
  _id: string
  title: string
  description: string
  image?: string
  location?: string
  slug: string
}

export default function TempleSlider() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    fetchTemples()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || temples.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % temples.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, temples.length])

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        // Filter approved temples with images
        const featured = data
          .filter((t: Temple) => t.image)
          .slice(0, 10) // Show first 10 temples
        setTemples(featured)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % temples.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + temples.length) % temples.length)
    setIsAutoPlaying(false)
  }

  if (temples.length === 0) return null

  const currentTemple = temples[currentIndex]

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentTemple.image || 'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=2000&q=80'}
          alt={currentTemple.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div className="max-w-3xl space-y-4 animate-fade-in">
          {/* Location Badge */}
          {currentTemple.location && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {currentTemple.location}
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold text-white font-playfair leading-tight">
            {currentTemple.title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 line-clamp-2 max-w-2xl">
            {currentTemple.description.substring(0, 180)}...
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href={`/temples/${currentTemple.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all hover:scale-105 shadow-lg"
            >
              Explore Temple
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {temples.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-full text-sm font-medium">
        {currentIndex + 1} / {temples.length}
      </div>
    </section>
  )
}
