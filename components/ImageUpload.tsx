"use client"

import { useEffect, useRef, useState } from 'react'
import { getTempleCardImage, getTempleHeroImage } from '../lib/temple-image'
import SarvdevImage from './SarvdevImage'
import type { SarvdevMediaAsset, SarvdevMediaKind } from '../lib/media-asset'

type Props = {
  value?: string
  media?: SarvdevMediaAsset | null
  onChange: (url: string) => void
  onMediaChange?: (media: SarvdevMediaAsset | null) => void
  folder?: string
  label?: string
  language?: 'en' | 'hi'
  guidance?: 'card' | 'hero' | 'gallery' | 'general' | 'devotionalCard' | 'devotionalHero' | 'darshanCard' | 'darshanHero' | 'blogCard' | 'blogHero' | 'blogOg'
  kind?: SarvdevMediaKind
}

type PendingImage = {
  file: File
  previewUrl: string
  width: number
  height: number
  warnings: string[]
}

function getClientWarnings(width: number, height: number, size: number, guidance: Props['guidance'] = 'general') {
  const warnings: string[] = []
  const ratio = width / height
  const megapixels = (width * height) / 1_000_000

  if (width < 1600 || height < 900) {
    warnings.push('Recommended minimum is 1600x900 for crisp hero and retina display use.')
  }
  if (megapixels < 1.8) {
    warnings.push('Resolution is low for premium temple/deity presentation.')
  }
  if (ratio < 0.85) {
    warnings.push('Portrait crop risk: check crown, head, feet, aura, ornaments and vahan before saving.')
  }
  if (guidance === 'devotionalCard' && (width < 1600 || height < 900)) {
    warnings.push('Devotional card recommendation is 1600x900 minimum. AI generation target: 2000x1125 with centered sacred subject and no text near edges.')
  }
  if (guidance === 'devotionalHero' && (width < 2400 || height < 1350 || ratio < 1.65)) {
    warnings.push('Devotional hero recommendation is 2400x1350. Keep 15-20% safe margin because hero images use cover crops.')
  }
  if (guidance === 'darshanCard' && (width < 1600 || height < 900 || ratio < 1.65)) {
    warnings.push('Darshan thumbnail/card recommendation is 1600x900. AI generation target: 2000x1125.')
  }
  if (guidance === 'darshanHero' && (width < 3360 || height < 1440 || ratio < 2.1)) {
    warnings.push('Darshan hero recommendation is 3360x1440 with cinematic safe framing and no crop-risk near edges.')
  }
  if (guidance === 'blogCard' && (width < 1600 || height < 900 || ratio < 1.65)) {
    warnings.push('Blog card/detail recommendation is 1600x900 minimum. AI generation target: 2000x1125 with the subject centered and no text near edges.')
  }
  if (guidance === 'blogHero' && (width < 1600 || height < 900 || ratio < 1.65)) {
    warnings.push('Blog hero recommendation is 1600x900 or wider. Keep the editorial subject centered with generous safe margins.')
  }
  if (guidance === 'blogOg' && (width < 1200 || height < 630 || ratio < 1.75 || ratio > 2.05)) {
    warnings.push('OG image recommendation is 1200x630. Keep text and subject away from the edges.')
  }
  if (guidance === 'card' && (width < 2400 || height < 2400)) {
    warnings.push('Card image recommendation is 3000x3000 square-safe with the subject centered and smaller in frame.')
  }
  if (guidance === 'hero' && (width < 3000 || height < 1200 || ratio < 1.9)) {
    warnings.push('Hero image recommendation is 3360x1440 cinematic panorama with environment-first composition.')
  }
  if (ratio > 3.2) {
    warnings.push('Very wide image: verify cards and mobile views do not lose sacred details.')
  }
  if (size > 8 * 1024 * 1024) {
    warnings.push('Large source file. Delivery is optimized, but uploads over 8MB should be reviewed.')
  }

  return warnings
}

async function inspectImage(file: File, guidance: Props['guidance'] = 'general'): Promise<PendingImage> {
  const previewUrl = URL.createObjectURL(file)

  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = reject
      img.src = previewUrl
    })

    return {
      file,
      previewUrl,
      width: dimensions.width,
      height: dimensions.height,
      warnings: getClientWarnings(dimensions.width, dimensions.height, file.size, guidance),
    }
  } catch {
    return {
      file,
      previewUrl,
      width: 0,
      height: 0,
      warnings: ['Preview dimensions could not be read. Please choose another image or review manually.'],
    }
  }
}

function helperText(guidance: Props['guidance'] = 'general', language: Props['language'] = 'en') {
  if (language === 'hi') {
    if (guidance === 'card') return 'लिस्टिंग, कार्ड और मोबाइल प्रीव्यू में उपयोग होता है। अनुशंसित 3000x3000। विषय को केंद्र में, छोटे आकार में और सुरक्षित मार्जिन के साथ रखें।'
    if (guidance === 'hero') return 'सिनेमाई हीरो बैनर और स्लाइडर में उपयोग होता है। अनुशंसित 3360x1440। पैनोरमिक रचना रखें और कोई पवित्र तत्व किनारों से न छुए।'
    if (guidance === 'gallery') return 'वैकल्पिक गैलरी चित्र। कम से कम 2400px चौड़ा रखें और मुख्य पवित्र तत्वों को किनारों से दूर रखें।'
    return 'सुरक्षित फ्रेम शीर्ष-केंद्र पैनोरमिक क्रॉप का उपयोग करता है।'
  }
  if (guidance === 'card') return 'Used in listings, cards and mobile previews. Recommended 3000x3000. Keep subject centered, avoid close-up, keep safe margins.'
  if (guidance === 'hero') return 'Used in cinematic hero banners and sliders. Recommended 3360x1440. Use panoramic composition, huge atmosphere, no edge touching.'
  if (guidance === 'devotionalCard') return 'Used in devotional cards. Recommended 1600x900; AI target 2000x1125. Keep the deity or symbol centered with no text near edges.'
  if (guidance === 'devotionalHero') return 'Used in devotional detail heroes and social previews. Recommended 2400x1350 with 15-20% safe margin for cover crops.'
  if (guidance === 'darshanCard') return 'Used for Daily Darshan thumbnails and cards. Recommended 1600x900; AI target 2000x1125.'
  if (guidance === 'darshanHero') return 'Used for Daily Darshan hero visuals. Recommended 3360x1440, cinematic safe framing, no crop-risk.'
  if (guidance === 'blogCard') return 'Used in blog cards and article previews. Recommended 1600x900; AI target 2000x1125. Keep subject centered, no text near edges.'
  if (guidance === 'blogHero') return 'Used in blog article heroes. Recommended 1600x900 or wider with editorial subject centered and generous safe margins.'
  if (guidance === 'blogOg') return 'Used for social sharing. Recommended 1200x630. Keep key content inside the center safe area.'
  if (guidance === 'gallery') return 'Optional gallery image. Recommended 2400px+ wide with important sacred elements away from edges.'
  return 'Safe frame uses top-center panoramic crop.'
}

export default function ImageUpload({ value, media, onChange, onMediaChange, folder = 'sarvdev/uploads', label = 'Image', language = 'en', guidance = 'general', kind = 'other' }: Props) {
  const hi = language === 'hi'
  const t = hi
    ? { onlyImage: 'केवल चित्र फ़ाइलें स्वीकार हैं', tooLarge: 'चित्र 15MB से छोटा होना चाहिए', previewError: 'नेटवर्क त्रुटि, फिर से प्रयास करें', uploadFailed: 'अपलोड विफल हुआ', url: 'Cloudinary चित्र URL या नीचे अपलोड करें', choose: 'चित्र चुनें', upload: 'अपलोड करें', uploading: 'अपलोड हो रहा है...', remove: 'हटाएँ', preview: 'पूर्वावलोकन', heroPreview: 'हीरो क्रॉप पूर्वावलोकन' }
    : { onlyImage: 'Only image files are allowed', tooLarge: 'Image must be smaller than 15MB', previewError: 'Network error, try again', uploadFailed: 'Upload failed', url: 'Cloudinary image URL or upload below', choose: 'Choose Image', upload: 'Upload & Use', uploading: 'Uploading...', remove: 'Remove', preview: 'Preview', heroPreview: 'Hero crop preview' }
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<PendingImage | null>(null)
  const [serverWarnings, setServerWarnings] = useState<string[]>([])
  const [optimizedPreview, setOptimizedPreview] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    }
  }, [pending?.previewUrl])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError(t.onlyImage); return }
    if (file.size > 15 * 1024 * 1024) { setError(t.tooLarge); return }

    setError('')
    setServerWarnings([])
    setOptimizedPreview('')
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    setPending(await inspectImage(file, guidance))
  }

  const uploadPending = async () => {
    if (!pending) return
    setError('')
    setUploading(true)
    try {
      const signatureResponse = await fetch('/api/upload/signature', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: pending.file.name, mimeType: pending.file.type, bytes: pending.file.size, folder }),
      })
      const signed = await signatureResponse.json()
      if (!signatureResponse.ok) throw new Error(signed.error || t.uploadFailed)
      const fd = new FormData()
      fd.append('file', pending.file)
      fd.append('api_key', signed.apiKey)
      fd.append('signature', signed.signature)
      Object.entries(signed.params as Record<string, string | number | boolean>).forEach(([key, item]) => fd.append(key, String(item)))
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`, { method: 'POST', body: fd })
      const data = await cloudinaryResponse.json()
      if (cloudinaryResponse.ok) {
        const media: SarvdevMediaAsset = { url: data.secure_url, publicId: data.public_id, assetId: data.asset_id, version: data.version, width: data.width, height: data.height, format: data.format, bytes: data.bytes, folder, kind }
        onChange(media.url || '')
        onMediaChange?.(media)
        setOptimizedPreview(media.url || '')
        setServerWarnings([])
        setPending(null)
      } else {
        setError(typeof data.error === 'string' ? data.error : data.error?.message || t.uploadFailed)
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t.previewError)
    } finally {
      setUploading(false)
    }
  }

  const currentPreview = optimizedPreview || value || media?.url || ''
  const previewInput = media?.publicId || media?.url ? media : currentPreview
  const previewImage = currentPreview ? getTempleCardImage(previewInput) : null
  const heroPreview = pending?.previewUrl ? pending.previewUrl : currentPreview ? getTempleHeroImage(previewInput).src : ''
  const safePreviewSrc = pending?.previewUrl || currentPreview
  const allWarnings = [...(pending?.warnings || []), ...serverWarnings]

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_11rem] gap-4 items-start">
        <div className="space-y-3">
          <input
            type="text"
            value={value || ''}
            onChange={e => { onChange(e.target.value); onMediaChange?.(null); setOptimizedPreview('') }}
            placeholder={t.url}
            className="admin-input w-full text-sm"
          />

          {pending && (
            <div className="rounded-xl border border-orange-200 bg-orange-50/50 overflow-hidden">
              <div className="relative aspect-[16/9] bg-gray-100">
                <img src={pending.previewUrl} alt="Pending preview" className="absolute inset-0 h-full w-full object-contain object-center p-3" />
              </div>
              <div className="p-3 text-xs text-gray-700">
                <p className="font-semibold">{pending.file.name}</p>
                <p className="text-gray-500 mt-0.5">{pending.width}x{pending.height}px - {(pending.file.size / 1024 / 1024).toFixed(2)}MB</p>
              </div>
            </div>
          )}

          {allWarnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
              {allWarnings.map((warning, index) => <p key={index}>{warning}</p>)}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="admin-btn admin-btn-ghost px-4 py-2 text-xs disabled:opacity-60 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {t.choose}
            </button>

            {pending && (
              <button
                type="button"
                onClick={uploadPending}
                disabled={uploading}
                className="admin-btn admin-btn-primary px-4 py-2 text-xs disabled:opacity-60"
              >
                {uploading ? t.uploading : t.upload}
              </button>
            )}

            {value && (
              <button type="button" onClick={() => { onChange(''); onMediaChange?.(null); setOptimizedPreview('') }} className="text-xs text-red-500 hover:text-red-700">
                {t.remove}
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            {previewImage ? (
              <SarvdevImage image={previewImage} alt={t.preview} className="absolute inset-0" imgClassName="object-cover" renderMode="auto" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{t.preview}</div>
            )}
          </div>
          {heroPreview && (
            <div className="relative aspect-[21/9] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={heroPreview} alt={t.heroPreview} className="absolute inset-0 h-full w-full object-contain object-center p-2" />
            </div>
          )}
          <p className="text-[11px] text-gray-400">{helperText(guidance, language)}</p>
        </div>
      </div>

      {safePreviewSrc && (
        <SafeCropPreview
          src={safePreviewSrc}
          guidance={guidance}
          language={language}
          width={pending?.width}
          height={pending?.height}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}

function SafeCropPreview({ src, guidance, language = 'en', width, height }: { src: string; guidance: Props['guidance']; language?: Props['language']; width?: number; height?: number }) {
  const hi = language === 'hi'
  const ratio = width && height ? width / height : null
  const frames = [
    { label: hi ? 'डेस्कटॉप' : 'Desktop', ratio: '21 / 9', note: hi ? 'चौड़ा हीरो' : 'wide hero' },
    { label: hi ? 'टैबलेट' : 'Tablet', ratio: '16 / 9', note: hi ? 'मानक हीरो' : 'standard hero' },
    { label: hi ? 'मोबाइल' : 'Mobile', ratio: '4 / 5', note: hi ? 'पोर्ट्रेट हीरो' : 'portrait hero' },
  ]
  const heroLike = guidance === 'hero' || guidance === 'devotionalHero' || guidance === 'darshanHero' || guidance === 'blogHero' || guidance === 'blogOg'
  const warnings = [
    !ratio ? 'Preview uses safe-contain because source dimensions are not available.' : '',
    ratio && ratio < 1 && heroLike ? 'Portrait image in hero: safe-contain will protect top and bottom.' : '',
    ratio && ratio < 1.25 && heroLike ? 'Square/near-square hero: review mobile and desktop safe zones.' : '',
    ratio && ratio < 2.12 && heroLike ? 'Bottom crop danger: keep lotus, feet, vahan and foreground aura above the red bottom band.' : '',
    ratio && ratio > 2.8 ? 'Very wide image: review mobile side clipping.' : '',
  ].filter(Boolean)

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/55 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900">{hi ? 'सुरक्षित क्रॉप पूर्वावलोकन' : 'Safe crop preview'}</p>
          <p className="text-[11px] text-amber-800">{hi ? 'डेस्कटॉप, टैबलेट और मोबाइल फ्रेम सुरक्षित क्षेत्र के संकेतों के साथ पूरा चित्र दिखाते हैं।' : 'Desktop, tablet and mobile frames use contain preview plus safe-zone guides.'}</p>
        </div>
        {warnings.length > 0 && (
          <div className="flex max-w-full flex-wrap gap-1.5">
            {warnings.map((warning) => (
              <span key={warning} className="max-w-full rounded-xl bg-white px-2.5 py-1 text-left text-[11px] font-semibold leading-snug text-amber-800">{warning}</span>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {frames.map((frame) => (
          <div key={frame.label}>
            <div className="relative overflow-hidden rounded-lg border border-amber-200 bg-stone-900" style={{ aspectRatio: frame.ratio }}>
              <img src={src} alt={`${frame.label} crop preview`} className="absolute inset-0 h-full w-full object-contain object-center p-2" />
              <div className="pointer-events-none absolute inset-x-[8%] inset-y-[10%] rounded-md border border-dashed border-amber-200/85" />
              <div className="pointer-events-none absolute inset-x-[18%] inset-y-[18%] rounded border border-white/35" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] border-t border-red-300/90 bg-red-500/20" />
              <div className="pointer-events-none absolute inset-x-[12%] bottom-[18%] h-[14%] rounded-b-md border-b-2 border-emerald-200/80" />
              <span className="pointer-events-none absolute bottom-1 left-2 rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-100">{hi ? 'निचला क्रॉप खतरा' : 'bottom crop danger'}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-amber-900">{frame.label}</span>
              <span className="text-[10px] text-amber-700">{frame.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
