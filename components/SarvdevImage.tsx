'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { TEMPLE_PLACEHOLDER, type ImageRenderMode, type SarvdevImageSource } from '../lib/temple-image'

type Props = {
  image: SarvdevImageSource
  alt: string
  className?: string
  imgClassName?: string
  loading?: 'eager' | 'lazy'
  draggable?: boolean
  renderMode?: ImageRenderMode
}

export default function SarvdevImage({
  image,
  alt,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  draggable,
  renderMode,
}: Props) {
  const frameRef = useRef<HTMLSpanElement>(null)
  const [src, setSrc] = useState(image.src)
  const [srcSet, setSrcSet] = useState(image.srcSet)
  const [fallbackUsed, setFallbackUsed] = useState(false)
  const [autoContain, setAutoContain] = useState(false)

  useEffect(() => {
    setSrc(image.src)
    setSrcSet(image.srcSet)
    setFallbackUsed(false)
    setAutoContain(false)
  }, [image.src, image.srcSet, image.fallback])

  const requestedMode = renderMode || image.renderMode || 'auto'
  const prefersFocalSafe = requestedMode === 'focal-safe' || (requestedMode === 'auto' && image.role === 'deityHero')
  const effectiveMode: Exclude<ImageRenderMode, 'auto'> =
    requestedMode === 'safe-contain' || autoContain
      ? 'safe-contain'
      : requestedMode === 'cinematic-cover'
        ? 'cinematic-cover'
        : prefersFocalSafe
          ? 'focal-safe'
          : 'safe-cover'

  const isContainMode = effectiveMode === 'safe-contain'
  const containPadding = image.role === 'deityHero'
    ? 'clamp(16px, 3vw, 56px) clamp(12px, 2.4vw, 44px) clamp(28px, 5vw, 92px)'
    : 'clamp(10px, 2.2vw, 32px)'

  const frameStyle = useMemo(
    () => ({
      backgroundImage: isContainMode
        ? `linear-gradient(135deg, rgba(20,12,8,0.92), rgba(95,54,20,0.55)), url("${image.placeholder}")`
        : `url("${image.placeholder}")`,
    }),
    [image.placeholder, isContainMode]
  )

  const handleError = () => {
    if (!fallbackUsed && src !== image.fallback) {
      setFallbackUsed(true)
      setSrc(image.fallback)
      setSrcSet('')
      return
    }

    setSrc(TEMPLE_PLACEHOLDER)
    setSrcSet('')
  }

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (requestedMode !== 'auto') return
    const img = event.currentTarget
    const frame = frameRef.current
    if (!frame || !img.naturalWidth || !img.naturalHeight) return

    const frameRatio = frame.clientWidth / Math.max(frame.clientHeight, 1)
    const imageRatio = img.naturalWidth / img.naturalHeight
    const isHero = image.role === 'templeHero' || image.role === 'deityHero' || image.role === 'blogHero'
    const isDeityHero = image.role === 'deityHero'
    const isSacredCard = image.role === 'deityCard' || image.role === 'templeCard' || image.role === 'blogCard'
    const squareIntoWideHero = isHero && frameRatio >= 1.55 && imageRatio <= 1.35
    const portraitIntoWide = frameRatio >= 1.35 && imageRatio <= 0.95
    const panoramaIntoTallMobile = isHero && frameRatio <= 0.9 && imageRatio >= 1.8
    const deityHeroVerticalCropRisk = isDeityHero && frameRatio > imageRatio * 1.08
    const cardAspectMismatch = isSacredCard && (imageRatio <= 0.82 || imageRatio >= 1.45)
    const extremeMismatch = frameRatio / imageRatio > 1.55 || imageRatio / frameRatio > 1.65

    setAutoContain(Boolean(squareIntoWideHero || portraitIntoWide || panoramaIntoTallMobile || deityHeroVerticalCropRisk || cardAspectMismatch || extremeMismatch))
  }

  const img = (
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={image.sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={draggable}
      className={`sarvdev-cinematic-image ${imgClassName}`}
      style={{
        objectFit: isContainMode ? 'contain' : 'cover',
        objectPosition: isContainMode ? 'center center' : image.objectPosition,
        padding: isContainMode ? containPadding : undefined,
        transform: isContainMode ? 'none' : undefined,
      }}
      onError={handleError}
      onLoad={handleLoad}
    />
  )

  return (
    <span
      ref={frameRef}
      className={`sarvdev-image-frame sarvdev-render-${effectiveMode} ${autoContain ? 'sarvdev-crop-risk' : ''} ${className}`}
      style={frameStyle}
      data-render-mode={effectiveMode}
      data-image-role={image.role}
    >
      {image.sources && image.sources.length > 0 && srcSet ? (
        <picture>
          {image.sources.map((source) => (
            <source key={source.media} media={source.media} srcSet={source.srcSet} sizes={source.sizes} />
          ))}
          {img}
        </picture>
      ) : img}
    </span>
  )
}
