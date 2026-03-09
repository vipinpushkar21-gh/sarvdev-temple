"use client"

import Link from 'next/link'
import { useTranslation } from '../lib/translation'

const footerNav = [
  {
    heading: 'footer.quickLinks',
    links: [
      { label: 'footer.temples', href: '/temples' },
      { label: 'footer.devotionals', href: '/devotionals' },
      { label: 'footer.events', href: '/events' },
      { label: 'footer.listTemple', href: '/list-temple' },
    ],
  },
  {
    heading: 'footer.resources',
    links: [
      { label: 'footer.blog', href: '/blog' },
      { label: 'footer.panchang', href: '/panchang' },
      { label: 'footer.sacredCategories', href: '/sacred-categories' },
      { label: 'footer.help', href: '/help' },
    ],
  },
  {
    heading: 'footer.legal',
    links: [
      { label: 'footer.about', href: '/about' },
      { label: 'footer.contact', href: '/contact' },
      { label: 'footer.privacy', href: '/privacy' },
      { label: 'footer.terms', href: '/terms' },
    ],
  },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative bg-secondary-800 text-secondary-100 overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="page-container py-14 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5 no-underline hover:no-underline">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/40 transition-all duration-300">
                <span className="text-secondary-900 font-serif font-bold text-lg leading-none">S</span>
              </span>
              <span className="text-h3 font-serif font-bold text-white group-hover:text-accent transition-colors duration-200">
                Sarvdev
              </span>
            </Link>
            <p className="mt-4 text-body-sm text-secondary-300 leading-relaxed">
              A temple directory and devotional hub connecting worshippers with temples, events, and spiritual traditions across the world.
            </p>

            <blockquote className="mt-6 text-body-sm italic text-secondary-300 border-l-2 border-accent/60 pl-4 py-1">
              <span className="font-devanagari text-accent-200">&ldquo;सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः&rdquo;</span>
              <br />
              <span className="text-caption not-italic text-secondary-400 mt-1.5 block">
                May all be happy, may all be free from disease.
              </span>
            </blockquote>
          </div>

          {/* Nav columns */}
          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={t(group.heading)}>
              <h3 className="text-overline uppercase tracking-wider text-accent/70 mb-5">
                {t(group.heading)}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-2 text-body-sm text-secondary-300 no-underline hover:text-white hover:no-underline transition-colors duration-200"
                    >
                      <span className="w-0 h-px bg-primary group-hover/link:w-3 transition-all duration-200" />
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-700/50 relative z-10">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-caption text-secondary-400">
            &copy; {new Date().getFullYear()} Sarvdev. {t('footer.rights')}
          </p>
          <p className="text-caption text-secondary-500 flex items-center gap-1.5">
            Built for the community, with
            <span className="inline-block text-primary animate-pulse">&#9829;</span>
            reverence.
          </p>
        </div>
      </div>
    </footer>
  )
}
