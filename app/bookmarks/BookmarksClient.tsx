"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUpAZ,
  Bookmark,
  BookOpen,
  CalendarDays,
  Clock3,
  Filter,
  Grid2X2,
  Heart,
  Landmark,
  LogIn,
  MapPin,
  Music2,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react"
import SarvdevImage from "../../components/SarvdevImage"
import { useFavourites, type BookmarkItem } from "../../lib/favourites"
import { getBlogCardImage, getDeityCardImage, getTempleCardImage, getTempleHeroImage } from "../../lib/temple-image"
import { getDevotionalCardImage } from "../../lib/devotional-image"
import { useTranslation } from "../../lib/translation"

type TabKey = "all" | "temple" | "deity" | "devotional" | "event" | "blog"
type SortKey = "recent" | "alpha" | "category" | "location"

const tabs: Array<{ key: TabKey; label: string; icon: LucideIcon }> = [
  { key: "all", label: "All", icon: Grid2X2 },
  { key: "temple", label: "Temples", icon: Landmark },
  { key: "deity", label: "Deities", icon: Sparkles },
  { key: "devotional", label: "Devotionals", icon: Music2 },
  { key: "event", label: "Events", icon: CalendarDays },
  { key: "blog", label: "Blogs", icon: BookOpen },
]

const typeConfig: Record<BookmarkItem["type"], {
  label: string
  plural: string
  icon: LucideIcon
  tab: TabKey
  tone: string
  href: (item: BookmarkItem) => string
}> = {
  temple: {
    label: "Temple",
    plural: "Temples",
    icon: Landmark,
    tab: "temple",
    tone: "bg-orange-50 text-orange-800 border-orange-200",
    href: (item) => `/temples/${item.slug}`,
  },
  deity: {
    label: "Deity",
    plural: "Deities",
    icon: Sparkles,
    tab: "deity",
    tone: "bg-amber-50 text-amber-900 border-amber-200",
    href: (item) => `/deities/${item.slug}`,
  },
  devotional: {
    label: "Devotional",
    plural: "Devotionals",
    icon: Music2,
    tab: "devotional",
    tone: "bg-rose-50 text-rose-900 border-rose-200",
    href: (item) => `/devotionals/${item.slug}`,
  },
  darshan: {
    label: "Daily Darshan",
    plural: "Devotionals",
    icon: Heart,
    tab: "devotional",
    tone: "bg-rose-50 text-rose-900 border-rose-200",
    href: () => "/daily-darshan",
  },
  event: {
    label: "Event",
    plural: "Events",
    icon: CalendarDays,
    tab: "event",
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    href: (item) => `/events/${item.slug}`,
  },
  blog: {
    label: "Blog",
    plural: "Blogs",
    icon: BookOpen,
    tab: "blog",
    tone: "bg-sky-50 text-sky-900 border-sky-200",
    href: (item) => `/blog/${item.slug}`,
  },
}

export default function BookmarksClient() {
  const { bookmarks, remove, clear } = useFavourites()
  const { language } = useTranslation()
  const [hydrated, setHydrated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("recent")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  useEffect(() => setHydrated(true), [])

  const visibleBookmarks = hydrated ? bookmarks : []
  const stats = useMemo(() => ({
    temples: visibleBookmarks.filter((item) => item.type === "temple").length,
    deities: visibleBookmarks.filter((item) => item.type === "deity").length,
    devotionals: visibleBookmarks.filter((item) => item.type === "devotional" || item.type === "darshan").length,
    events: visibleBookmarks.filter((item) => item.type === "event").length,
  }), [visibleBookmarks])

  const categoryOptions = useMemo(() => {
    const values = new Set<string>()
    visibleBookmarks.forEach((item) => values.add(item.category || typeConfig[item.type].label))
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [visibleBookmarks])

  const locationOptions = useMemo(() => {
    const values = new Set<string>()
    visibleBookmarks.forEach((item) => {
      const location = getLocation(item)
      if (location) values.add(location)
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [visibleBookmarks])

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query)
    const items = visibleBookmarks.filter((item) => {
      const cfg = typeConfig[item.type]
      const location = getLocation(item)
      const category = item.category || cfg.label
      const tabMatch = activeTab === "all" || cfg.tab === activeTab
      const categoryMatch = categoryFilter === "all" || category === categoryFilter
      const locationMatch = locationFilter === "all" || location === locationFilter
      const searchText = normalize([item.title, item.subtitle, item.location, item.category, cfg.label].filter(Boolean).join(" "))
      return tabMatch && categoryMatch && locationMatch && (!normalizedQuery || searchText.includes(normalizedQuery))
    })

    return [...items].sort((a, b) => {
      if (sort === "alpha") return a.title.localeCompare(b.title)
      if (sort === "category") return typeConfig[a.type].label.localeCompare(typeConfig[b.type].label) || a.title.localeCompare(b.title)
      if (sort === "location") return getLocation(a).localeCompare(getLocation(b)) || a.title.localeCompare(b.title)
      return (b.addedAt || 0) - (a.addedAt || 0)
    })
  }, [activeTab, categoryFilter, locationFilter, query, sort, visibleBookmarks])

  const isEmpty = hydrated && visibleBookmarks.length === 0
  const hasFilters = activeTab !== "all" || query.trim() || sort !== "recent" || categoryFilter !== "all" || locationFilter !== "all"

  function resetFilters() {
    setActiveTab("all")
    setQuery("")
    setSort("recent")
    setCategoryFilter("all")
    setLocationFilter("all")
  }

  return (
    <main className="min-h-screen bg-surface pb-20">
      <section className="relative min-h-[520px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage
          image={getTempleHeroImage({})}
          alt="Sacred temple collection background"
          className="absolute inset-0 opacity-55"
          imgClassName="object-cover"
          loading="eager"
          renderMode="cinematic-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/68 to-stone-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[520px] flex-col justify-end pb-14 pt-24">
          <div className="max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-amber-200/25 bg-amber-300/15 px-3 py-2 text-sm font-bold text-amber-100 backdrop-blur">
              <Bookmark className="h-4 w-4" />
              Personal Collection
            </div>
            <p className="devanagari text-xl font-semibold text-amber-100">मेरी पवित्र संग्रह</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] font-black leading-none text-white">
              My Sacred Collection
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100">
              Your saved temples, deities, devotionals, events, and stories in one calm place for return visits.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Landmark} label="Saved temples" value={stats.temples} />
              <StatCard icon={Sparkles} label="Saved deities" value={stats.deities} />
              <StatCard icon={Music2} label="Saved devotionals" value={stats.devotionals} />
              <StatCard icon={CalendarDays} label="Saved events" value={stats.events} />
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" />
                <div>
                  <p className="text-sm font-black text-white">Saved on this device</p>
                  <p className="text-sm leading-6 text-stone-200">Login to keep your Sarvdev profile ready for bookmark sync when account sync is enabled.</p>
                </div>
              </div>
              <Link href="/login" className="btn rounded-lg border border-white/20 bg-white text-sm font-black text-stone-950 no-underline hover:bg-amber-50 hover:no-underline">
                <LogIn className="h-4 w-4" />
                Login to Sync
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container -mt-10 relative z-20">
        <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-xl">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const count = tab.key === "all" ? visibleBookmarks.length : visibleBookmarks.filter((item) => typeConfig[item.type].tab === tab.key).length
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-black transition ${
                    activeTab === tab.key
                      ? "border-stone-950 bg-stone-950 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className={`rounded px-2 py-0.5 text-xs ${activeTab === tab.key ? "bg-white/15 text-white" : "bg-stone-100 text-stone-600"}`}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-container pt-6">
        <div className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_12rem_12rem_12rem_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={language === "hi" ? "सहेजे हुए आइटम खोजें" : "Search saved items"}
              className="input min-h-11 pl-10"
            />
          </label>
          <SelectBox icon={ArrowUpAZ} value={sort} onChange={(value) => setSort(value as SortKey)}>
            <option value="recent">Recently saved</option>
            <option value="alpha">Alphabetical</option>
            <option value="category">Category</option>
            <option value="location">Location</option>
          </SelectBox>
          <SelectBox icon={Filter} value={categoryFilter} onChange={setCategoryFilter}>
            <option value="all">All categories</option>
            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
          </SelectBox>
          <SelectBox icon={MapPin} value={locationFilter} onChange={setLocationFilter}>
            <option value="all">All locations</option>
            {locationOptions.map((location) => <option key={location} value={location}>{location}</option>)}
          </SelectBox>
          {hasFilters && (
            <button type="button" onClick={resetFilters} className="btn btn-outline min-h-11 rounded-lg px-4 text-sm">
              <X className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </section>

      <section className="page-container pt-8">
        {!hydrated ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-lg border border-stone-200 bg-white" />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
            <Search className="mx-auto h-9 w-9 text-amber-700" />
            <h2 className="mt-4 text-2xl font-black text-stone-950">No saved items match</h2>
            <p className="mt-2 text-sm leading-6 text-stone-700">Adjust the search, category, or location filter to see more of your collection.</p>
            <button type="button" onClick={resetFilters} className="btn btn-primary mt-5 rounded-lg text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-orange-700">{filtered.length} saved item{filtered.length === 1 ? "" : "s"}</p>
                <h2 className="mt-1 text-3xl font-black text-stone-950">Your collection</h2>
              </div>
              {visibleBookmarks.length > 1 && (
                <button type="button" onClick={clear} className="btn btn-outline rounded-lg text-sm text-red-700">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <BookmarkCard key={`${item.type}-${item.id}`} item={item} onRemove={remove} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

function SelectBox({
  icon: Icon,
  value,
  onChange,
  children,
}: {
  icon: LucideIcon
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="relative block">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input min-h-11 pl-10">
        {children}
      </select>
    </label>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon className="h-5 w-5 text-amber-100" />
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-stone-200">{label}</p>
    </div>
  )
}

function BookmarkCard({ item, onRemove }: { item: BookmarkItem; onRemove: (id: string) => void }) {
  const cfg = typeConfig[item.type]
  const Icon = cfg.icon
  const href = cfg.href(item)
  const image = getBookmarkImage(item)
  const location = getLocation(item)
  const savedDate = item.addedAt ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.addedAt)) : "Saved"

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
      <Link href={href} className="block text-inherit no-underline hover:no-underline">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
          <SarvdevImage image={image} alt={item.title} className="absolute inset-0" imgClassName="object-cover transition duration-700 group-hover:scale-105" renderMode="auto" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-950/5 to-transparent" />
          <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-black ${cfg.tone}`}>
            <Icon className="h-3.5 w-3.5" />
            {cfg.label}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-black leading-snug text-stone-950 transition group-hover:text-orange-700">{item.title}</h3>
          {item.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{item.subtitle}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {location && <InfoPill icon={MapPin} label={location} />}
            <InfoPill icon={Clock3} label={savedDate} />
          </div>
        </div>
      </Link>
      <div className="border-t border-stone-100 p-4">
        <button type="button" onClick={() => onRemove(item.id)} className="btn btn-ghost min-h-11 w-full rounded-lg text-sm text-red-700">
          <Trash2 className="h-4 w-4" />
          Remove Bookmark
        </button>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8 text-center shadow-sm">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-white text-orange-700 shadow-sm">
        <Bookmark className="h-8 w-8" />
      </span>
      <p className="devanagari mt-5 text-lg font-semibold text-orange-900">आपका पवित्र संग्रह खाली है</p>
      <h2 className="mt-2 text-3xl font-black text-stone-950">Your sacred collection is empty</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-600">
        Save temples, deities, devotionals, events, and blogs from across Sarvdev to build a personal path for return visits.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/temples" className="btn btn-primary rounded-lg text-sm no-underline hover:no-underline">
          <Landmark className="h-4 w-4" />
          Explore Temples
        </Link>
        <Link href="/deities" className="btn btn-outline rounded-lg text-sm no-underline hover:no-underline">
          <Sparkles className="h-4 w-4" />
          Explore Deities
        </Link>
        <Link href="/devotionals" className="btn btn-outline rounded-lg text-sm no-underline hover:no-underline">
          <Music2 className="h-4 w-4" />
          Explore Devotionals
        </Link>
      </div>
    </div>
  )
}

function InfoPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-600">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  )
}

function getBookmarkImage(item: BookmarkItem) {
  const input = {
    imageCard: item.imageCard || item.image || null,
    imageHero: item.imageHero || item.imageCard || item.image || null,
    image: item.image || item.imageCard || null,
  }

  if (item.type === "deity") return getDeityCardImage(input)
  if (item.type === "devotional" || item.type === "darshan") return getDevotionalCardImage(input)
  if (item.type === "blog") return getBlogCardImage(input)
  return getTempleCardImage(input)
}

function getLocation(item: BookmarkItem) {
  return item.location || item.subtitle || ""
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]+/gu, " ").replace(/\s+/g, " ").trim()
}
