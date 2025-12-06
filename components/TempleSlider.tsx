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
    <section className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black">
      {/* Background Images - Current & Next for smooth transition */}
      <div className="absolute inset-0">
        {/* Current Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          key={`current-${currentIndex}`}
        >
          <img
            src={currentTemple.image || 'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=2400&q=80'}
            alt={currentTemple.title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        </div>
        
        {/* Next Image - Pre-loaded for smooth transition */}
        <div 
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
          key={`next-${currentIndex}`}
        >
          <img
            src={nextTemple.image || 'https://images.unsplash.com/photo-1532623727643-c1e0c83c0b1e?auto=format&fit=crop&w=2400&q=80'}
            alt={nextTemple.title}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-end pb-20">
        <div 
          className={`max-w-4xl transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}
          key={`content-${currentIndex}`}
        >
          {/* Location Tag */}
          {currentTemple.location && (
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-orange-600/90 backdrop-blur-md text-white rounded-full text-sm font-medium border border-orange-500/30 hover:bg-orange-700/90 transition-colors shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="tracking-wide">{currentTemple.location}</span>
            </div>
          )}

          {/* Temple Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] font-playfair tracking-tight">
            {currentTemple.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl leading-relaxed font-light">
            {currentTemple.description.substring(0, 200)}...
          </p>

          {/* CTA Button - Google Arts style */}
          <Link
            href={`/temples/${currentTemple.slug || generateSlug(currentTemple.title)}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-full font-semibold text-lg hover:bg-orange-700 transition-all hover:scale-105 shadow-2xl group"
          >
            <span>Explore Temple</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows - Minimalist */}
      <button
        onClick={handlePrevSlide}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orange-600/90 backdrop-blur-md text-white hover:bg-orange-700 transition-all flex items-center justify-center group border border-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        aria-label="Previous"
      >
        <svg className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNextSlide}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orange-600/90 backdrop-blur-md text-white hover:bg-orange-700 transition-all flex items-center justify-center group border border-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        aria-label="Next"
      >
        <svg className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Indicators - Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {temples.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className="group relative disabled:cursor-not-allowed"
            aria-label={`Slide ${index + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? 'w-12 bg-orange-600 shadow-lg shadow-orange-600/50'
                : 'w-1.5 bg-white/40 group-hover:bg-orange-500/70 group-hover:w-8'
            }`} />
          </button>
        ))}
      </div>

      {/* Counter Badge - Top Right */}
      <div className="absolute top-8 right-8 px-5 py-2.5 bg-orange-600/90 backdrop-blur-md text-white rounded-full text-sm font-medium border border-orange-500/30 shadow-lg">
        <span className="font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5 text-white/80">/</span>
        <span className="text-white/90">{String(temples.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}
