"use client"

interface YouTubeEmbedProps {
  videoId: string
  title: string
  description?: string
  thumbnailUrl?: string
  uploadDate?: string
  duration?: string
  className?: string
}

export default function YouTubeEmbed({
  videoId,
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  className = '',
}: YouTubeEmbedProps) {
  const thumb = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${videoId}`
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description || title,
    thumbnailUrl: thumb,
    uploadDate: uploadDate || new Date().toISOString(),
    contentUrl: watchUrl,
    embedUrl,
    ...(duration && { duration }),
    publisher: {
      '@type': 'Organization',
      name: 'Sarvdev',
      url: 'https://sarvdev.com',
    },
  }

  return (
    <div className={`relative ${className}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <div className="relative w-full rounded-xl overflow-hidden shadow-md" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`${embedUrl}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <p className="text-caption text-ink-muted mt-2">{title}</p>
    </div>
  )
}
