export type MainNavItem = {
  id: string
  label: string
  labelKey: string
  href: string
  icon: string
  mega?: 'temples'
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    labelKey: 'nav.home',
    href: '/',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  },
  {
    id: 'deities',
    label: 'Deities',
    labelKey: 'nav.deities',
    href: '/deities',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  {
    id: 'temples',
    label: 'Temples',
    labelKey: 'nav.temples',
    href: '/temples',
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4',
    mega: 'temples',
  },
  {
    id: 'daily-darshan',
    label: 'Daily Darshan',
    labelKey: 'nav.dailyDarshan',
    href: '/daily-darshan',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    id: 'devotionals',
    label: 'Devotionals',
    labelKey: 'nav.devotionals',
    href: '/devotionals',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    labelKey: 'nav.events',
    href: '/events',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    id: 'spiritual-icons',
    label: 'Spiritual Icons',
    labelKey: 'nav.spiritualIcons',
    href: '/spiritual-icons',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
  {
    id: 'panchang',
    label: 'Panchang',
    labelKey: 'nav.panchang',
    href: '/panchang',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    id: 'blog',
    label: 'Blog',
    labelKey: 'nav.blog',
    href: '/blog',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    labelKey: 'nav.bookmarks',
    href: '/bookmarks',
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  },
  {
    id: 'list-temple',
    label: 'List Temple',
    labelKey: 'nav.listTemple',
    href: '/list-temple',
    icon: 'M12 4v16m8-8H4',
  },
]

export const MOBILE_BOTTOM_NAV_ITEMS = MAIN_NAV_ITEMS.filter((item) =>
  ['home', 'deities', 'temples', 'daily-darshan', 'devotionals'].includes(item.id)
)

export const FOOTER_QUICK_LINKS = MAIN_NAV_ITEMS
