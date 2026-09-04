'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import SarvdevImage from '../SarvdevImage'
import { getTempleCardImage, type SarvdevImageSource } from '../../lib/temple-image'

type Tone = 'slate' | 'saffron' | 'green' | 'blue' | 'purple' | 'red' | 'gold'

const toneClass: Record<Tone, string> = {
  slate: 'admin-tone-slate',
  saffron: 'admin-tone-saffron',
  green: 'admin-tone-green',
  blue: 'admin-tone-blue',
  purple: 'admin-tone-purple',
  red: 'admin-tone-red',
  gold: 'admin-tone-gold',
}

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  status,
  actions,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  status?: 'healthy' | 'attention'
  actions?: ReactNode
}) {
  return (
    <div className="admin-page-header">
      <div className="min-w-0">
        {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && (
          <p className="admin-section-subtitle admin-command-status max-w-3xl">
            {status && <span className={`admin-status-dot ${status}`} aria-hidden="true" />}
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </div>
  )
}

export function AdminStatsCard({
  label,
  value,
  helper,
  icon,
  tone = 'saffron',
  href,
}: {
  label: string
  value: string | number
  helper?: string
  icon?: ReactNode
  tone?: Tone
  href?: string
}) {
  const body = (
    <div className={`admin-stat premium ${toneClass[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="stat-label">{label}</p>
          <p className="stat-value">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
          {helper && <p className="mt-2 text-xs font-semibold text-gray-400">{helper}</p>}
        </div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
    </div>
  )

  return href ? <Link href={href} className="block no-underline hover:no-underline">{body}</Link> : body
}

export function AdminSectionCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`admin-card admin-section-card ${className}`}>
      {(title || subtitle || actions) && (
        <div className="admin-section-card-head">
          <div>
            {title && <h2 className="admin-section-title">{title}</h2>}
            {subtitle && <p className="admin-section-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={title || subtitle || actions ? 'admin-section-card-body' : ''}>{children}</div>
    </section>
  )
}

export function AdminFormSection(props: Parameters<typeof AdminSectionCard>[0]) {
  return <AdminSectionCard {...props} className={`admin-form-section ${props.className || ''}`} />
}

export function AdminShell({ children }: { children: ReactNode }) {
  return <div className="admin-shell-surface">{children}</div>
}

export function AdminBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-gray-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-gray-300">/</span>}
          {item.href ? <Link href={item.href} className="text-gray-500 no-underline hover:text-orange-700 hover:no-underline">{item.label}</Link> : <span className="text-gray-900">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function AdminFilterBar({ children }: { children: ReactNode }) {
  return <div className="admin-filter-bar">{children}</div>
}

export function AdminActionButton({
  children,
  href,
  tone = 'ghost',
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  href?: string
  tone?: 'primary' | 'ghost' | 'danger' | 'success'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const className = `admin-btn admin-btn-${tone}`
  if (href) return <Link href={href} className={className}>{children}</Link>
  return <button type={type} onClick={onClick} disabled={disabled} className={`${className} disabled:opacity-50`}>{children}</button>
}

export function AdminStatusBadge({ status }: { status?: string }) {
  const normalized = String(status || 'draft').toLowerCase()
  const color = normalized.includes('active') || normalized.includes('approved') || normalized.includes('published') || normalized.includes('verified')
    ? 'green'
    : normalized.includes('pending') || normalized.includes('draft') || normalized.includes('upcoming')
      ? 'yellow'
      : normalized.includes('featured')
        ? 'orange'
        : 'red'

  return <span className={`admin-badge-${color}`}>{status || 'draft'}</span>
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-mark">S</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function AdminDataTable({ children }: { children: ReactNode }) {
  return <div className="admin-table-wrap"><div className="overflow-x-auto">{children}</div></div>
}

export function AdminImagePreview({
  image,
  alt,
  className = '',
}: {
  image?: SarvdevImageSource | Record<string, unknown>
  alt: string
  className?: string
}) {
  const source = image && 'src' in image ? image as SarvdevImageSource : getTempleCardImage(image as any)
  return (
    <div className={`admin-image-preview ${className}`}>
      <SarvdevImage image={source} alt={alt} className="absolute inset-0" imgClassName="object-cover" renderMode="auto" />
    </div>
  )
}

export function AdminTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; count?: number }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="admin-tabs" role="tablist">
      {tabs.map((tab) => (
        <button key={tab.key} type="button" role="tab" aria-selected={active === tab.key} onClick={() => onChange(tab.key)} className={active === tab.key ? 'active' : ''}>
          <span>{tab.label}</span>
          {typeof tab.count === 'number' && <span className="admin-tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function AdminQuickActions({ actions }: { actions: { href: string; label: string; description?: string; icon?: ReactNode; tone?: Tone }[] }) {
  return (
    <div className="admin-quick-actions">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className={`admin-quick-action ${toneClass[action.tone || 'saffron']}`}>
          {action.icon && <span className="admin-quick-action-icon">{action.icon}</span>}
          <span className="min-w-0">
            <span className="block font-black text-gray-950">{action.label}</span>
            {action.description && <span className="mt-1 block text-xs font-semibold leading-5 text-gray-500">{action.description}</span>}
          </span>
        </Link>
      ))}
    </div>
  )
}
