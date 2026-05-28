'use client'

import { useEffect, useMemo, useState, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Activity,
  Bell,
  BookOpenText,
  CalendarDays,
  ChevronDown,
  CircleGauge,
  Database,
  FileSearch,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Users,
  Video,
  X,
} from 'lucide-react'

type AdminUser = { name: string; email: string; role: string }
type NavItem = { href: string; label: string; icon: ComponentType<{ className?: string }> }
type NavGroup = { title: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: CircleGauge },
      { href: '/admin/activity', label: 'Activity Log', icon: Activity },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/deities', label: 'Deities', icon: Star },
      { href: '/admin/temples', label: 'Temples', icon: Sparkles },
      { href: '/admin/darshan', label: 'Daily Darshan', icon: Video },
      { href: '/admin/devotionals', label: 'Devotionals', icon: Music },
      { href: '/admin/events', label: 'Events', icon: CalendarDays },
      { href: '/admin/spiritual-icons', label: 'Spiritual Icons', icon: SunMedium },
      { href: '/admin/blogs', label: 'Blog', icon: BookOpenText },
    ],
  },
  {
    title: 'Temple Intelligence',
    items: [
      { href: '/admin/temples/missing-data', label: 'Missing Data', icon: FileSearch },
      { href: '/admin/temples/shakti-peeth-mapping', label: 'Shakti Peeth Mapping', icon: ShieldCheck },
      { href: '/admin/images/audit', label: 'Image Audit', icon: ImageIcon },
      { href: '/admin/images/external-audit', label: 'External Image Audit', icon: ImageIcon },
      { href: '/admin/seo', label: 'SEO Center', icon: Globe },
      { href: '/admin/import', label: 'Bulk Import', icon: Database },
    ],
  },
  {
    title: 'Community',
    items: [
      { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
      { href: '/admin/forum', label: 'Forum', icon: Users },
      { href: '/admin/users', label: 'Admin Users', icon: Users },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
      { href: '/admin/settings', label: 'Site Settings', icon: Settings },
    ],
  },
]

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'A'
}

function isItemActive(pathname: string, href: string) {
  if (href === '/admin/dashboard') return pathname === href || pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function getPageTitle(pathname: string) {
  const exact = ALL_ITEMS.find((item) => isItemActive(pathname, item.href))
  if (exact) return exact.label
  const segments = pathname.split('/').filter(Boolean).filter((segment) => !/^[a-f0-9]{24}$/i.test(segment))
  const last = segments[segments.length - 1] || 'dashboard'
  return last.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [user, setUser] = useState<AdminUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((group) => [group.title, true]))
  )

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.user?.role === 'admin') setUser(data.user)
        else router.push('/login')
      })
      .catch(() => router.push('/login'))
      .finally(() => setAuthChecked(true))
  }, [router])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((value) => !value)
      }
      if (event.key === 'Escape') setCommandOpen(false)
      if (typing) return
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_ITEMS
    return ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q) || item.href.toLowerCase().includes(q))
  }, [query])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/login')
    router.refresh()
  }

  if (!authChecked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0F1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-500" />
            <div className="absolute inset-2 flex items-center justify-center rounded-full bg-orange-500/10">
              <span className="text-sm font-black text-orange-300">S</span>
            </div>
          </div>
          <p className="text-sm font-semibold tracking-wide text-white/50">Loading admin back office...</p>
        </div>
      </div>
    )
  }

  const pageTitle = getPageTitle(pathname)

  return (
    <div className="admin-app-shell flex min-h-screen">
      {sidebarOpen && <button aria-label="Close admin menu" className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 lg:sticky ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-[78px]' : 'w-[292px]'}`}>
        <div className={`flex h-16 items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
          <Link href="/admin/dashboard" className={`flex min-w-0 items-center gap-3 no-underline hover:no-underline ${collapsed ? 'justify-center' : ''}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-black text-white shadow-lg shadow-orange-500/20">S</span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block text-sm font-black tracking-tight text-white">Sarvdev Admin</span>
                <span className="block truncate text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Back office</span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {!collapsed && (
          <button type="button" onClick={() => setCommandOpen(true)} className="mx-4 mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white">
            <Search className="h-4 w-4" />
            Search admin...
            <span className="ml-auto rounded-lg bg-white/10 px-1.5 py-0.5 text-[10px] text-white/35">Ctrl K</span>
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => {
            const groupActive = group.items.some((item) => isItemActive(pathname, item.href))
            const open = collapsed || openGroups[group.title] || groupActive
            return (
              <div key={group.title} className="mb-4">
                {!collapsed && (
                  <button
                    type="button"
                    className="mb-2 flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/30 transition hover:bg-white/5 hover:text-white/55"
                    onClick={() => setOpenGroups((state) => ({ ...state, [group.title]: !state[group.title] }))}
                  >
                    {group.title}
                    <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                )}
                {open && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = isItemActive(pathname, item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`admin-nav-link ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="mb-2 hidden w-full items-center justify-center rounded-xl p-2 text-white/35 transition hover:bg-white/10 hover:text-white lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <div className={`flex items-center gap-3 rounded-2xl bg-white/5 p-2 ${collapsed ? 'justify-center' : ''}`}>
            <span className="admin-avatar h-9 w-9 text-xs">{getInitials(user.name)}</span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white/90">{user.name}</span>
                  <span className="block truncate text-[11px] font-medium text-white/35">{user.email}</span>
                </span>
                <button type="button" onClick={handleLogout} className="rounded-xl p-2 text-white/35 transition hover:bg-red-500/10 hover:text-red-300" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="admin-content flex min-w-0 flex-1 flex-col">
        <header className="admin-header sticky top-0 z-30 flex min-h-16 items-center gap-3 px-4 py-3 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">Admin Console</p>
            <h1 className="truncate text-lg font-black text-gray-950">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setCommandOpen(true)} className="admin-topbar-pill hidden md:inline-flex">
              <Search className="h-4 w-4" />
              Search
            </button>
            <Link href="/" target="_blank" className="admin-topbar-pill no-underline hover:no-underline">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <Link href="/admin/temples/new" className="admin-btn admin-btn-primary hidden sm:inline-flex px-4 py-2 text-sm">
              Add Content
            </Link>
            <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 md:flex">
              <span className="admin-avatar h-8 w-8 text-xs">{getInitials(user.name)}</span>
              <span className="max-w-[160px] truncate text-sm font-bold text-gray-700">{user.name}</span>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {commandOpen && (
        <>
          <button aria-label="Close search" className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm" onClick={() => setCommandOpen(false)} />
          <div className="admin-command-panel">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <Search className="h-5 w-5 text-orange-600" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search modules, tools, audits..."
                className="min-h-10 flex-1 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setCommandOpen(false)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[440px] overflow-y-auto p-2">
              {filteredItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setCommandOpen(false)} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-400">{item.href}</span>
                    </span>
                  </Link>
                )
              })}
              {filteredItems.length === 0 && <p className="px-4 py-8 text-center text-sm font-semibold text-gray-400">No admin module found.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
