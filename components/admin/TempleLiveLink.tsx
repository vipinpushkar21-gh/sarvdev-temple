"use client"

import Link from 'next/link'

type TempleLiveLinkProps = {
  slug?: string
  status?: string
  templeTitle?: string
  templeTitleHi?: string
  label?: string
  className?: string
  language?: string
  variant?: 'row' | 'detail'
}

const PUBLIC_STATUSES = new Set(['', 'approved', 'published', 'active'])

function cleanSlug(slug?: string) {
  return String(slug || '').trim().replace(/^\/+|\/+$/g, '')
}

function isPublicStatus(status?: string) {
  return PUBLIC_STATUSES.has(String(status || '').trim().toLowerCase())
}

function ExternalIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H6.75A2.25 2.25 0 0 0 4.5 8.25v9A2.25 2.25 0 0 0 6.75 19.5h9A2.25 2.25 0 0 0 18 17.25V10.5M15 4.5h4.5M19.5 4.5V9M19.5 4.5l-9 9" />
    </svg>
  )
}

export default function TempleLiveLink({
  slug,
  status,
  templeTitle,
  templeTitleHi,
  label,
  className,
  language = 'en',
  variant = 'row',
}: TempleLiveLinkProps) {
  const hi = language === 'hi'
  const safeSlug = cleanSlug(slug)
  const hasSlug = Boolean(safeSlug)
  const isLive = hasSlug && isPublicStatus(status)
  const defaultLabel = variant === 'detail'
    ? (hi ? 'इस मंदिर को लाइव देखें' : 'View This Temple Live')
    : (hi ? 'लाइव देखें' : 'View Live')
  const text = label || defaultLabel
  const disabledTitle = !hasSlug
    ? (hi ? 'सार्वजनिक URL बनाने के लिए पहले मंदिर को सहेजें।' : 'Save the temple first to generate its public URL.')
    : (hi ? 'यह मंदिर अभी सार्वजनिक रूप से उपलब्ध नहीं है।' : 'This temple is not publicly available yet.')
  const accessibleTitle = hi ? (templeTitleHi || templeTitle || '') : (templeTitle || templeTitleHi || '')
  const ariaLabel = accessibleTitle
    ? (hi ? `${accessibleTitle} को लाइव देखें` : `View ${accessibleTitle} live`)
    : text
  const baseClass = className || 'admin-btn admin-btn-ghost px-4 py-2 text-sm'
  const content = (
    <>
      <ExternalIcon />
      <span>{text}</span>
    </>
  )

  if (!isLive) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClass} inline-flex cursor-not-allowed items-center gap-1.5 opacity-50`}
        role="link"
        title={disabledTitle}
      >
        {content}
      </span>
    )
  }

  return (
    <Link
      href={`/temples/${encodeURIComponent(safeSlug)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${baseClass} inline-flex items-center gap-1.5`}
      title={ariaLabel}
    >
      {content}
    </Link>
  )
}
