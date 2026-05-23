"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SarvdevImage from '../../components/SarvdevImage'
import { getBlogCardImage, getBlogHeroImage } from '../../lib/temple-image'
import { formatBlogDate, getBlogExcerpt, getBlogPath, listToCsv, normalizeStringList } from '../../lib/blog-utils'

const BASE_URL = 'https://sarvdev.com'
const BLOG_HERO_IMAGE = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/image_2_xljqwa'

type Blog = {
  _id: string
  title: string
  titleHi?: string
  slug?: string
  excerpt?: string
  excerptHi?: string
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
  readingTime?: number
}

function getReadingTime(blog: Blog) {
  return blog.readingTime ? `${blog.readingTime} min read` : '3 min read'
}

function uniqueInOrder(values: string[]) {
  const seen = new Set<string>()
  return values.filter((value) => {
    if (!value || seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPosts(Array.isArray(data) ? data : [])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const categories = useMemo(() => ['All', ...uniqueInOrder(posts.map((post) => post.category || 'Editorial'))], [posts])
  const topics = useMemo(() => uniqueInOrder(posts.flatMap((post) => normalizeStringList(post.tags))).slice(0, 14), [posts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((post) => {
      const haystack = [post.title, post.titleHi, post.excerpt, post.excerptHi, post.category, listToCsv(post.tags), post.author].filter(Boolean).join(' ').toLowerCase()
      if (category !== 'All' && (post.category || 'Editorial') !== category) return false
      if (q && !haystack.includes(q)) return false
      return true
    })
  }, [posts, search, category])

  const featured = filtered.find((post) => post.featured) || filtered[0]
  const latest = featured ? filtered.filter((post) => post._id !== featured._id) : filtered
  const heroImage = getBlogHeroImage({ imageHero: BLOG_HERO_IMAGE, image: BLOG_HERO_IMAGE })
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filtered.slice(0, 24).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}${getBlogPath(post)}`,
      name: post.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="blog-magazine-hero relative min-h-[620px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage image={heroImage} alt="Sarvdev spiritual blog" className="absolute inset-0 opacity-50" imgClassName="object-cover" loading="eager" renderMode="auto" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[620px] flex-col justify-end pb-14 pt-24">
          <div className="max-w-5xl">
            <span className="inline-flex rounded-full border border-amber-300/35 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-100 backdrop-blur">Sarvdev Journal</span>
            <h1 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-serif leading-[0.94] tracking-normal text-white drop-shadow-2xl">Blog</h1>
            <p className="mt-3 font-devanagari text-3xl font-bold text-amber-100 md:text-4xl">आध्यात्मिक ज्ञान और मंदिर मार्गदर्शन</p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-100">A premium spiritual magazine for Hindu dharma learning, temple travel, devotional practice, rituals, festivals, and sacred living.</p>

            <div className="mt-8 grid max-w-4xl gap-3 rounded-3xl border border-white/15 bg-white/12 p-3 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles, rituals, deities, festivals..."
                className="min-h-14 rounded-2xl border border-white/10 bg-white/95 px-5 text-base font-semibold text-stone-900 outline-none placeholder:text-stone-500"
              />
              <Link href="#latest" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-amber-500 px-6 text-sm font-black text-stone-950 no-underline shadow-lg hover:bg-amber-400 hover:no-underline">Explore Articles</Link>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-surface pb-20">
        <div className="page-container -mt-10 relative z-20">
          <div className="grid gap-3 rounded-3xl border border-amber-200 bg-white p-4 shadow-xl sm:grid-cols-3">
            <Stat label="Published articles" value={posts.length} />
            <Stat label="Categories" value={categories.length - 1} />
            <Stat label="Popular topics" value={topics.length} />
          </div>
        </div>

        <div className="sticky top-0 z-30 mt-8 border-y border-amber-200/60 bg-white/90 shadow-sm backdrop-blur-xl">
          <div className="page-container flex gap-2 overflow-x-auto py-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${category === item ? 'border-orange-500 bg-orange-500 text-white shadow-md' : 'border-amber-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="page-container pt-10">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 rounded-3xl bg-white shadow-sm animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <section className="rounded-3xl border border-amber-200 bg-white p-10 text-center shadow-sm">
              <p className="font-serif text-3xl text-stone-950">No articles found</p>
              <p className="mt-2 text-stone-600">Try another topic or clear the search filter.</p>
            </section>
          ) : (
            <>
              {featured && (
                <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                  <Link href={getBlogPath(featured)} className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-amber-200 bg-stone-950 text-white no-underline shadow-2xl hover:no-underline">
                    <SarvdevImage image={getBlogHeroImage(featured)} alt={featured.title} className="absolute inset-0 opacity-75" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" renderMode="auto" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{featured.category || 'Editorial'}</Badge>
                        <Badge>Featured</Badge>
                      </div>
                      <h2 className="mt-4 text-4xl font-serif leading-tight text-white md:text-5xl">{featured.title}</h2>
                      {featured.titleHi && <p className="mt-2 font-devanagari text-2xl font-bold text-amber-100">{featured.titleHi}</p>}
                    </div>
                  </Link>

                  <div className="rounded-[2rem] border border-amber-200 bg-white p-7 shadow-xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Featured Article</p>
                    <p className="mt-4 text-lg leading-8 text-stone-700">{getBlogExcerpt(featured)}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {normalizeStringList(featured.tags).slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">#{tag}</span>)}
                    </div>
                    <div className="mt-6 grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-3">
                      <Mini label="Author" value={featured.author || 'Sarvdev Editorial'} />
                      <Mini label="Reading" value={getReadingTime(featured)} />
                      <Mini label="Published" value={formatBlogDate(featured) || 'Recently'} />
                    </div>
                    <Link href={getBlogPath(featured)} className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-black text-white no-underline hover:bg-orange-600 hover:no-underline">Read featured article</Link>
                  </div>
                </section>
              )}

              <section id="latest" className="mt-14">
                <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">Latest Articles</p>
                    <h2 className="mt-1 text-4xl font-serif text-stone-950">Dharma Learning Hub</h2>
                  </div>
                  <p className="text-sm font-semibold text-stone-500">{filtered.length} articles found</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(latest.length ? latest : filtered).map((post) => <BlogCard key={post._id} post={post} />)}
                </div>
              </section>

              <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                <div className="rounded-[2rem] border border-amber-200 bg-white p-7 shadow-xl">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Popular Topics</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <button key={topic} onClick={() => setSearch(topic)} className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-stone-700 hover:border-orange-300 hover:bg-orange-100">
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-stone-950 p-7 text-white shadow-xl">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Sarvdev Newsletter</p>
                  <h2 className="mt-3 text-3xl font-serif">Spiritual reading for your week</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-300">Get temple guides, festival explainers, devotional practice notes, and editorial updates as Sarvdev grows.</p>
                  <Link href="/contact" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-stone-950 no-underline hover:bg-amber-300 hover:no-underline">Stay Connected</Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  )
}

function BlogCard({ post }: { post: Blog }) {
  return (
    <article className="blog-premium-card group overflow-hidden rounded-[1.75rem] border border-amber-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      <Link href={getBlogPath(post)} className="block no-underline hover:no-underline">
        <div className="relative aspect-video overflow-hidden bg-stone-100">
          <SarvdevImage image={getBlogCardImage(post)} alt={post.title} className="absolute inset-0" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" renderMode="auto" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {post.featured && <Badge>Featured</Badge>}
            <Badge>{post.category || 'Editorial'}</Badge>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-500">
            <span>{formatBlogDate(post) || 'Recently'}</span>
            <span>|</span>
            <span>{getReadingTime(post)}</span>
            <span>|</span>
            <span>{post.author || 'Sarvdev Editorial'}</span>
          </div>
          <h3 className="mt-3 text-2xl font-serif leading-tight text-stone-950 group-hover:text-orange-700">{post.title}</h3>
          {post.titleHi && <p className="mt-1 font-devanagari text-lg font-bold text-orange-800">{post.titleHi}</p>}
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{getBlogExcerpt(post)}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {normalizeStringList(post.tags).slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600">{tag}</span>)}
          </div>
        </div>
      </Link>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-5 text-center">
      <div className="text-3xl font-black text-stone-950">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide text-stone-500">{label}</div>
    </div>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-black uppercase tracking-wide text-stone-400">{label}</div>
      <div className="mt-1 text-sm font-bold text-stone-800">{value}</div>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-black text-stone-900 shadow-sm backdrop-blur">{children}</span>
}
