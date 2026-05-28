import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Deity from '@/models/Deity'
import { getOGImage } from '@/lib/temple-image'
import { compactText } from '@/lib/text-formatting'

const BASE_URL = 'https://sarvdev.com'

function titleFromSlug(slug: string) {
  return slug.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  try {
    await connectDB()
    const deity = await Deity.findOne({ slug }).lean() as any
    const name = deity?.name || titleFromSlug(slug)
    const nameHi = deity?.nameHi
    const title = `${nameHi ? `${nameHi} - ` : ''}${name} | Sarvdev`
    const description = deity?.metaDescription || deity?.description || deity?.descriptionHi || `Learn about ${name}, mantra, attributes, related temples and devotionals on Sarvdev.`
    const compactDescription = compactText(description).slice(0, 160)
    const image = getOGImage(deity || {}).src
    const url = `${BASE_URL}/deities/${slug}`

    return {
      title,
      description: compactDescription,
      alternates: { canonical: url },
      openGraph: {
        title,
        description: compactDescription,
        url,
        siteName: 'Sarvdev',
        type: 'article',
        images: [{ url: image, width: 1200, height: 630, alt: name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: compactDescription,
        images: [image],
      },
    }
  } catch {
    const name = titleFromSlug(slug)
    return {
      title: `${name} | Sarvdev`,
      description: `Learn about ${name}, mantra, attributes, related temples and devotionals on Sarvdev.`,
      alternates: { canonical: `${BASE_URL}/deities/${slug}` },
    }
  }
}

export default function DeitySlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
