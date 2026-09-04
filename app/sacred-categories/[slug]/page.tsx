import { permanentRedirect } from 'next/navigation'
import { getRegistryEntry } from '@/lib/sacred-category-registry'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getRegistryEntry(slug)
  const canonical = `https://sarvdev.com/temples/pilgrimage/${slug}`
  return {
    title: entry?.seoTitle ?? `${slug} — Sarvdev`,
    description: entry?.seoDescription ?? entry?.description,
    alternates: { canonical },
    robots: { index: false, follow: true },
  }
}

export default async function SacredCategorySlugRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/temples/pilgrimage/${slug}`)
}
