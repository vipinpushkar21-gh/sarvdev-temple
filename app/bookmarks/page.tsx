"use client"

import { useFavourites } from '../../lib/favourites'
import { useTranslation } from '../../lib/translation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { TEMPLE_PLACEHOLDER } from '../../lib/temple-image'

export default function BookmarksPage() {
  const { bookmarks, remove, clear } = useFavourites()
  const { language } = useTranslation()

  const temples = bookmarks.filter((b) => b.type === 'temple')
  const devotionals = bookmarks.filter((b) => b.type === 'devotional')
  const isEmpty = bookmarks.length === 0

  return (
    <main>
      <div className="relative overflow-hidden bg-gradient-to-br from-surface-sunken via-surface to-primary-50/15 border-b border-surface-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-36 h-36 bg-accent/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="page-container py-12 md:py-16 relative z-10">
          <h1 className="text-display-lg font-serif text-secondary-800 leading-tight">
            {language === 'hi' ? 'मेरे बुकमार्क' : 'My Bookmarks'}
          </h1>
          <p className="mt-3 text-body text-ink-muted max-w-2xl">
            {language === 'hi'
              ? 'आपके सहेजे गए मंदिर और भक्ति सामग्री।'
              : 'Your saved temples and devotional content.'}
          </p>
          <div className="mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </div>

      <div className="page-container py-10">
        {isEmpty ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <h2 className="text-h3 text-secondary-700 mb-2">
              {language === 'hi' ? 'कोई बुकमार्क नहीं' : 'No bookmarks yet'}
            </h2>
            <p className="text-body-sm text-ink-muted mb-6 max-w-md mx-auto">
              {language === 'hi'
                ? 'मंदिरों और भक्ति सामग्री पर बुकमार्क बटन दबाकर यहाँ सहेजें।'
                : 'Tap the bookmark icon on temples and devotionals to save them here.'}
            </p>
            <Link href="/temples" className="btn btn-primary no-underline hover:no-underline group">
              {language === 'hi' ? 'मंदिर देखें' : 'Browse Temples'}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        ) : (
          <>
            {bookmarks.length > 1 && (
              <div className="flex justify-end mb-6">
                <button onClick={clear} className="btn btn-ghost btn-sm text-semantic-error group">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  {language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
                </button>
              </div>
            )}

            {/* Temples */}
            {temples.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <h2 className="text-h3 font-serif text-secondary-800">
                    {language === 'hi' ? 'सहेजे गए मंदिर' : 'Saved Temples'}
                    <span className="ml-2 text-body-sm font-normal text-ink-muted">({temples.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {temples.map((t) => (
                    <BookmarkCard key={t.id} item={t} onRemove={remove} language={language} />
                  ))}
                </div>
              </section>
            )}

            {/* Devotionals */}
            {devotionals.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-sm">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
                  </div>
                  <h2 className="text-h3 font-serif text-secondary-800">
                    {language === 'hi' ? 'सहेजी गई भक्ति सामग्री' : 'Saved Devotionals'}
                    <span className="ml-2 text-body-sm font-normal text-ink-muted">({devotionals.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {devotionals.map((d) => (
                    <BookmarkCard key={d.id} item={d} onRemove={remove} language={language} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}

function BookmarkCard({
  item,
  onRemove,
  language,
}: {
  item: { id: string; type: string; title: string; slug: string; image?: string }
  onRemove: (id: string) => void
  language: string
}) {
  const href = item.type === 'temple' ? `/temples/${item.slug}` : `/devotionals/${item.slug}`
  const [imgSrc, setImgSrc] = useState(item.image || TEMPLE_PLACEHOLDER)

  return (
    <div className="card-interactive flex flex-col">
      <Link href={href} className="no-underline hover:no-underline group flex-1">
        {item.image && (
          <div className="relative h-36 w-full bg-surface-sunken rounded-t-card overflow-hidden">
            <Image
              src={imgSrc}
              alt={item.title}
              fill
              className="object-cover"
              onError={() => setImgSrc(TEMPLE_PLACEHOLDER)}
            />
          </div>
        )}
        <div className="p-4">
          <span className="badge badge-primary text-caption mb-2">
            {item.type === 'temple'
              ? language === 'hi' ? 'मंदिर' : 'Temple'
              : language === 'hi' ? 'भक्ति' : 'Devotional'}
          </span>
          <h3 className="text-h4 text-secondary-700 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={() => onRemove(item.id)}
          className="btn btn-ghost btn-sm text-semantic-error w-full"
        >
          {language === 'hi' ? 'हटाएं' : 'Remove'}
        </button>
      </div>
    </div>
  )
}
