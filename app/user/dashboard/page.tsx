'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFavourites } from '@/lib/favourites'

type Account = { id: string; name: string; email: string; role: string; status: string; photo?: string; phone?: string; city?: string; state?: string }

const roleLabel: Record<string, string> = { user: 'Devotee', temple: 'Temple manager', pandit: 'Pandit / Pujari', admin: 'Administrator' }

export default function UserDashboardPage() {
  const router = useRouter()
  const { bookmarks } = useFavourites()
  const [user, setUser] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        if (ok && data.user) setUser(data.user)
        else setError(data.error || 'We could not load your account.')
      })
      .catch(() => setError('We could not load your account.'))
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    setLoggingOut(true)
    try { await fetch('/api/auth/logout', { method: 'POST' }) } finally { router.replace('/'); router.refresh() }
  }

  if (loading) return <main className="min-h-screen bg-surface flex items-center justify-center"><span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-700 border-t-transparent" aria-label="Loading account" /></main>
  if (!user) return <main className="min-h-screen bg-surface px-4 py-20 text-center"><p className="font-serif text-2xl text-ink">Your account is unavailable</p><p className="mt-2 text-sm text-ink-muted">{error || 'Please sign in again.'}</p><Link className="mt-5 inline-block text-sm font-medium text-primary-800 underline" href="/login">Go to sign in</Link></main>

  const location = [user.city, user.state].filter(Boolean).join(', ')
  const portalLink = user.role === 'temple' ? { href: '/temple-portal', label: 'Open temple portal' } : user.role === 'pandit' ? { href: '/pandit-portal', label: 'Open pandit portal' } : null

  return <main className="min-h-screen bg-surface px-4 py-9 sm:px-6 sm:py-14">
    <div className="mx-auto max-w-4xl">
      <div className="flex items-start justify-between gap-4 border-b border-surface-border pb-6">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Account</p><h1 className="mt-2 font-serif text-3xl text-ink">Your place in Sarvdev</h1><p className="mt-2 text-sm text-ink-muted">A quiet home for your Sarvdev account and saved discoveries.</p></div>
        <button type="button" disabled={loggingOut} onClick={logout} className="shrink-0 text-sm text-ink-muted underline underline-offset-4 hover:text-ink disabled:opacity-60">{loggingOut ? 'Signing out…' : 'Sign out'}</button>
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-[1.1fr_.9fr]">
        <section className="border border-surface-border bg-white p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Account identity</p><div className="mt-4 flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 font-serif text-lg text-primary-800">{user.name.charAt(0).toUpperCase()}</div><div><h2 className="font-serif text-2xl text-ink">{user.name}</h2><p className="mt-1 text-sm text-ink-muted">{user.email}</p></div></div><dl className="mt-6 divide-y divide-surface-border border-y border-surface-border text-sm"><div className="flex justify-between gap-4 py-3"><dt className="text-ink-muted">Account role</dt><dd className="font-medium text-ink">{roleLabel[user.role] || user.role}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-ink-muted">Status</dt><dd className="font-medium text-ink capitalize">{user.status}</dd></div>{location && <div className="flex justify-between gap-4 py-3"><dt className="text-ink-muted">Location</dt><dd className="text-right font-medium text-ink">{location}</dd></div>}{user.phone && <div className="flex justify-between gap-4 py-3"><dt className="text-ink-muted">Phone</dt><dd className="font-medium text-ink">{user.phone}</dd></div>}</dl></section>
        <div className="space-y-5"><section className="border border-surface-border bg-white p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">My Sacred Space</p><h2 className="mt-2 font-serif text-2xl text-ink">Saved discoveries</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{bookmarks.length ? `${bookmarks.length} saved ${bookmarks.length === 1 ? 'item' : 'items'} on this browser and device.` : 'Save temples, deities, devotionals, Darshan and events as you explore.'}</p><Link href="/bookmarks" className="mt-5 inline-block text-sm font-medium text-primary-800 underline underline-offset-4">Open My Sacred Space</Link></section>
        {portalLink && <section className="border border-surface-border bg-surface-sunken p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Your role</p><h2 className="mt-2 font-serif text-2xl text-ink">{roleLabel[user.role]}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">Use your approved role access to continue your Sarvdev work.</p><Link href={portalLink.href} className="mt-5 inline-block text-sm font-medium text-primary-800 underline underline-offset-4">{portalLink.label}</Link></section>}</div>
      </div>
      <section className="mt-5 border border-surface-border bg-white p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Continue exploring</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/temples" className="text-ink underline underline-offset-4">Temples</Link><Link href="/deities" className="text-ink underline underline-offset-4">Deities</Link><Link href="/daily-darshan" className="text-ink underline underline-offset-4">Daily Darshan</Link><Link href="/devotionals" className="text-ink underline underline-offset-4">Devotionals</Link><Link href="/events" className="text-ink underline underline-offset-4">Festivals</Link><Link href="/panchang" className="text-ink underline underline-offset-4">Panchang</Link></div></section>
    </div>
  </main>
}
