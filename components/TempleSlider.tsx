"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Temple {
  _id: string
  title: string
  description: string
  image?: string
  location?: string
  slug?: string
}

export default function TempleSlider() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-')      // Replace multiple hyphens with single
      .trim()
  }

  useEffect(() => {
    fetchTemples()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || temples.length === 0) return

    const interval = setInterval(() => {
      handleNextSlide()
    }, 6000) // Change slide every 6 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, temples.length, currentIndex])

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        // Filter approved temples with images
        const featured = data
          .filter((t: Temple) => t.image)
          .slice(0, 12) // Show first 12 temples
        setTemples(featured)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    }
  }

  const handleNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % temples.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const handlePrevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + temples.length) % temples.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  if (temples.length === 0) return null

  const currentTemple = temples[currentIndex]
  const nextTemple = temples[(currentIndex + 1) % temples.length]

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden bg-secondary-900">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Current Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          key={`current-${currentIndex}`}
        >
          <img
            src={currentTemple.image || 'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=2400&q=80'}
            alt={currentTemple.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/30 to-secondary-900/10"></div>
        </div>
        
        {/* Next Image — preloaded for crossfade */}
        <div 
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
          key={`next-${currentIndex}`}
        >
          <img
            src={nextTemple.image || 'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=2400&q=80'}
            alt={nextTemple.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/30 to-secondary-900/10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full page-container flex items-end pb-16">
        <div 
          className={`max-w-3xl transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          key={`content-${currentIndex}`}
        >
          {currentTemple.location && (
            <span className="badge bg-primary/90 text-white mb-4 inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {currentTemple.location}
            </span>
          )}

          <h2 className="text-display-lg text-white font-serif leading-tight mb-4">
            {currentTemple.title}
          </h2>

          <p className="text-body text-white/80 mb-8 max-w-2xl line-clamp-3">
            {currentTemple.description.substring(0, 200)}...
          </p>

          <Link
            href={`/temples/${currentTemple.slug || generateSlug(currentTemple.title)}`}
            className="btn btn-primary btn-lg no-underline hover:no-underline"
          >
            Explore Temple
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        disabled={isTransitioning}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-btn bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-30"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNextSlide}
        disabled={isTransitioning}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-btn bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center disabled:opacity-30"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {temples.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className="disabled:cursor-not-allowed"
            aria-label={`Slide ${index + 1}`}
          >
            <div className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-6 text-caption text-white/60 font-medium">
        {String(currentIndex + 1).padStart(2, '0')} / {String(temples.length).padStart(2, '0')}
      </div>
    </section>
  )
}
