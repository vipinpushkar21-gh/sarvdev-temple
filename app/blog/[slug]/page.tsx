"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminEditBar from '../../../components/AdminEditBar'
import ShareButtons from '../../../components/ShareButtons'
import SarvdevImage from '../../../components/SarvdevImage'
import { getBlogCardImage, getBlogHeroImage } from '../../../lib/temple-image'
import {
  buildBlogKeywords,
  calculateReadingTime,
  formatBlogDate,
  getBlogContent,
  getBlogExcerpt,
  getBlogPath,
  normalizeStringList,
  slugifyBlog,
} from '../../../lib/blog-utils'

const BASE_URL = 'https://sarvdev.com'

type Blog = {
  _id: string
  title: string
  titleHi?: string
  slug?: string
  excerpt?: string
  excerptHi?: string
  content?: string
  contentHi?: string
  body?: string
  category?: string
  tags?: string[] | string
  author?: string
  authorRole?: string
  image?: string
  imageCard?: string
  imageHero?: string
  ogImage?: string
  featured?: boolean
  status?: string
  date?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  readingTime?: number
  relatedTempleSlugs?: string[] | string
  relatedDeitySlugs?: string[] | string
  relatedDevotionalSlugs?: string[] | string
}

type RelatedItem = {
  _id?: string
  title?: string
  name?: string
  slug?: string
  excerpt?: string
  description?: string
  image?: string
  imageCard?: string
  imageHero?: string
  category?: string
  deity?: string
  tags?: string[] | string
}

function getToc(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^#{2,3}\s+/, '').trim()
      return { id: slugifyBlog(text), text }
    })
}

function textTerms(blog: Blog) {
  return buildBlogKeywords(blog).map((term) => term.toLowerCase())
}

function matchesTerms(item: RelatedItem, terms: string[], directSlugs: string[] = []) {
  if (directSlugs.length && item.slug && directSlugs.includes(item.slug)) return true
  const haystack = [item.title, item.name, item.description, item.excerpt, item.category, item.deity, item.slug, normalizeStringList(item.tags).join(' ')].filter(Boolean).join(' ').toLowerCase()
  return terms.some((term) => term.length > 2 && haystack.includes(term))
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<Blog | null>(null)
  const [allBlogs, setAllBlogs] = useState<Blog[]>([])
  const [relatedTemples, setRelatedTemples] = useState<RelatedItem[]>([])
  const [relatedDeities, setRelatedDeities] = useState<RelatedItem[]>([])
  const [relatedDevotionals, setRelatedDevotionals] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${slug}`, { cache: 'no-store' })
        if (res.ok) setPost(await res.json())
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBlog()
  }, [slug])

  useEffect(() => {
    if (!post) return
    const currentPost = post
    let cancelled = false

    async function loadRelated() {
      const terms = textTerms(currentPost)
      const [blogsRes, templesRes, deitiesRes, devotionalsRes] = await Promise.allSettled([
        fetch('/api/blogs'),
        fetch(`/api/temples?limit=8&search=${encodeURIComponent(terms.slice(0, 3).join(' '))}`),
        fetch('/api/deities'),
        fetch('/api/devotionals'),
      ])

      if (cancelled) return

      const readJson = async (result: PromiseSettledResult<Response>) => {
        if (result.status !== 'fulfilled' || !result.value.ok) return []
        const payload = await result.value.json()
        return Array.isArray(payload) ? payload : (payload.data || payload.items || [])
      }
      const [blogs, temples, deities, devotionals] = await Promise.all([
        readJson(blogsRes),
        readJson(templesRes),
        readJson(deitiesRes),
        readJson(devotionalsRes),
      ])

      if (cancelled) return

      setAllBlogs((Array.isArray(blogs) ? blogs : []).filter((item: Blog) => item._id !== currentPost._id && matchesTerms(item as RelatedItem, terms)).slice(0, 4))
      setRelatedTemples((Array.isArray(temples) ? temples : []).filter((item: RelatedItem) => item.slug && matchesTerms(item, terms, normalizeStringList(currentPost.relatedTempleSlugs))).slice(0, 4))
      setRelatedDeities((Array.isArray(deities) ? deities : []).filter((item: RelatedItem) => item.slug && matchesTerms(item, terms, normalizeStringList(currentPost.relatedDeitySlugs))).slice(0, 4))
      setRelatedDevotionals((Array.isArray(devotionals) ? devotionals : []).filter((item: RelatedItem) => (item.slug || item._id) && matchesTerms(item, terms, normalizeStringList(currentPost.relatedDevotionalSlugs))).slice(0, 4))
    }

    loadRelated().catch(() => {})
    return () => { cancelled = true }
  }, [post])

  const content = post ? getBlogContent(post) : ''
  const toc = useMemo(() => getToc(content), [content])

  if (loading) {
    return (
      <main className="page-container section-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-[420px] rounded-[2rem] bg-stone-100" />
          <div className="mx-auto max-w-3xl space-y-3">
            <div className="h-8 rounded bg-stone-100" />
            <div className="h-4 w-2/3 rounded bg-stone-100" />
            <div className="h-4 rounded bg-stone-100" />
            <div className="h-4 rounded bg-stone-100" />
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="page-container section-sm text-center">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-amber-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-serif text-stone-950">Article not found</h1>
          <p className="mt-3 text-stone-600">This article may be draft, archived, or unavailable.</p>
          <Link href="/blog" className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white no-underline hover:bg-orange-600 hover:no-underline">Back to blog</Link>
        </div>
      </main>
    )
  }

  const heroImage = getBlogHeroImage(post)
  const pageUrl = `${BASE_URL}${getBlogPath(post)}`
  const readingTime = post.readingTime || calculateReadingTime(post)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    alternativeHeadline: post.titleHi || undefined,
    description: getBlogExcerpt(post),
    image: heroImage.src,
    url: pageUrl,
    datePublished: post.publishedAt || post.date || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.date || post.createdAt,
    articleSection: post.category,
    keywords: buildBlogKeywords(post).join(', '),
    author: { '@type': 'Organization', name: post.author || 'Sarvdev Editorial' },
    publisher: {
      '@type': 'Organization',
      name: 'Sarvdev',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AdminEditBar editHref={`/admin/blogs/${post._id}/edit`} label="Edit Post" />

      <article>
        <section className="relative min-h-[660px] overflow-hidden bg-stone-950 text-white">
          <SarvdevImage image={heroImage} alt={post.title} className="absolute inset-0 opacity-70" imgClassName="object-cover" loading="eager" renderMode="auto" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/72 to-stone-950/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />
          <div className="page-container relative z-10 flex min-h-[660px] flex-col justify-end pb-16 pt-24">
            <div className="max-w-5xl">
              <div className="flex flex-wrap gap-2">
                <Badge>{post.category || 'Editorial'}</Badge>
                {post.featured && <Badge>Featured</Badge>}
                <Badge>{readingTime} min read</Badge>
              </div>
              <h1 className="mt-5 text-[clamp(2.75rem,7vw,6.5rem)] font-serif leading-[0.95] tracking-normal text-white drop-shadow-2xl">{post.title}</h1>
              {post.titleHi && <p className="mt-4 font-devanagari text-3xl font-bold text-amber-100 md:text-4xl">{post.titleHi}</p>}
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-100">{getBlogExcerpt(post)}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-stone-300">By {post.author || 'Sarvdev Editorial'}</p>
                  <p className="mt-1 text-sm font-bold text-white">{formatBlogDate(post) || 'Recently published'}</p>
                </div>
                <ShareButtons title={post.title} url={typeof window !== 'undefined' ? window.location.href : pageUrl} />
              </div>
            </div>
          </div>
        </section>

        <main className="bg-surface pb-20">
          <div className="page-container -mt-10 relative z-20">
            <div className="grid gap-4 rounded-[2rem] border border-amber-200 bg-white p-4 shadow-xl md:grid-cols-4">
              <Fact label="Category" value={post.category || 'Editorial'} />
              <Fact label="Reading time" value={`${readingTime} minutes`} />
              <Fact label="Author" value={post.author || 'Sarvdev Editorial'} />
              <Fact label="Published" value={formatBlogDate(post) || 'Recently'} />
            </div>
          </div>

          <div className="page-container pt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-8">
              <section className="blog-article-shell">
                {toc.length > 0 && (
                  <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Table of contents</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {toc.map((item) => <a key={item.id} href={`#${item.id}`} className="text-sm font-bold text-stone-700 no-underline hover:text-orange-700 hover:no-underline">{item.text}</a>)}
                    </div>
                  </div>
                )}

                <ArticleContent content={content} />

                {post.contentHi && (
                  <section className="mt-10 rounded-3xl border border-orange-100 bg-orange-50/70 p-6">
                    <h2 className="font-devanagari text-3xl font-bold text-stone-950">हिंदी सारांश</h2>
                    <p className="mt-4 font-devanagari text-lg leading-9 text-stone-800">{post.contentHi}</p>
                  </section>
                )}
              </section>

              <section className="rounded-[2rem] bg-stone-950 p-8 text-white shadow-xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Sarvdev Newsletter</p>
                <h2 className="mt-3 text-3xl font-serif">Continue your spiritual reading</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">Follow Sarvdev for temple guides, festival explainers, dharma learning, and devotional practice notes.</p>
                <Link href="/contact" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-stone-950 no-underline hover:bg-amber-300 hover:no-underline">Stay Connected</Link>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <SidePanel title="Article Tags">
                <div className="flex flex-wrap gap-2">
                  {normalizeStringList(post.tags).length ? normalizeStringList(post.tags).map((tag) => <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{tag}</span>) : <span className="text-sm text-stone-500">No tags set</span>}
                </div>
              </SidePanel>
              <SidePanel title="Related Articles">
                <RelatedList items={allBlogs} basePath={(item) => getBlogPath(item as Blog)} />
              </SidePanel>
              <SidePanel title="Related Temples">
                <RelatedList items={relatedTemples} basePath={(item) => `/temples/${item.slug}`} />
              </SidePanel>
              <SidePanel title="Related Deities">
                <RelatedList items={relatedDeities} basePath={(item) => `/deities/${item.slug}`} />
              </SidePanel>
              <SidePanel title="Related Devotionals">
                <RelatedList items={relatedDevotionals} basePath={(item) => `/devotionals/${item.slug || item._id}`} />
              </SidePanel>
            </aside>
          </div>
        </main>
      </article>
    </>
  )
}

function ArticleContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: ReactNode[] = []
  let listItems: string[] = []

  const flushList = () => {
    if (!listItems.length) return
    elements.push(
      <ul key={`list-${elements.length}`} className="my-6 space-y-2 rounded-3xl bg-stone-50 p-5">
        {listItems.map((item) => <li key={item} className="pl-2 text-lg leading-8 text-stone-700">{item}</li>)}
      </ul>
    )
    listItems = []
  }

  lines.forEach((raw, index) => {
    const line = raw.trim()
    if (!line) {
      flushList()
      return
    }

    if (line.startsWith('- ')) {
      listItems.push(line.slice(2))
      return
    }

    flushList()

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim()
      elements.push(<h2 id={slugifyBlog(text)} key={index} className="scroll-mt-28 pt-4 text-4xl font-serif text-stone-950">{text}</h2>)
      return
    }
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim()
      elements.push(<h3 id={slugifyBlog(text)} key={index} className="scroll-mt-28 pt-2 text-2xl font-serif text-stone-900">{text}</h3>)
      return
    }
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={index} className="my-7 rounded-3xl border-l-4 border-orange-500 bg-orange-50 p-6 font-serif text-2xl leading-10 text-stone-900">{line.slice(2)}</blockquote>)
      return
    }

    elements.push(<p key={index} className="text-lg leading-9 text-stone-700">{line}</p>)
  })

  flushList()

  return <div className="space-y-5">{elements.length ? elements : <p className="text-lg text-stone-600">Article content will appear here.</p>}</div>
}

function RelatedList({ items, basePath }: { items: RelatedItem[]; basePath: (item: RelatedItem) => string }) {
  if (!items.length) return <p className="text-sm leading-6 text-stone-500">Related content will appear as Sarvdev connects more records.</p>

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link key={item._id || item.slug || item.title || item.name} href={basePath(item)} className="group grid grid-cols-[72px_1fr] gap-3 rounded-2xl border border-stone-100 p-2 no-underline hover:border-orange-200 hover:bg-orange-50 hover:no-underline">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <SarvdevImage image={getBlogCardImage(item)} alt={item.title || item.name || 'Related'} className="absolute inset-0" imgClassName="object-cover" renderMode="auto" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-black leading-5 text-stone-900 group-hover:text-orange-700">{item.title || item.name}</p>
            {(item.category || item.deity) && <p className="mt-1 truncate text-xs font-semibold text-stone-500">{[item.category, item.deity].filter(Boolean).join(' / ')}</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}

function SidePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-serif text-stone-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4">
      <p className="text-[11px] font-black uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-black text-stone-900">{value}</p>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-black text-stone-900 shadow-sm backdrop-blur">{children}</span>
}
