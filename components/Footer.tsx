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
      { label: 'footer.contact', href: '/contact' },
      { label: 'footer.privacy', href: '/privacy' },
      { label: 'footer.terms', href: '/terms' },
    ],
  },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-secondary-800 text-secondary-100">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="text-h3 font-serif font-bold text-white no-underline hover:no-underline">
              Sarvdev
            </Link>
            <p className="mt-3 text-body-sm text-secondary-200 leading-relaxed">
              A temple directory and devotional hub connecting worshippers with temples, events, and spiritual traditions across India.
            </p>

            <blockquote className="mt-6 text-body-sm italic text-secondary-300 border-l-2 border-accent pl-3">
              <span className="font-devanagari">"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</span>
              <br />
              <span className="text-caption not-italic text-secondary-400 mt-1 block">
                May all be happy, may all be free from disease.
              </span>
            </blockquote>
          </div>

          {/* Nav columns */}
          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={t(group.heading)}>
              <h3 className="text-overline uppercase tracking-wider text-secondary-400 mb-4">
                {t(group.heading)}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-secondary-200 no-underline hover:text-white hover:no-underline transition-colors"
                    >
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
      <div className="border-t border-secondary-700">
        <div className="page-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-caption text-secondary-400">
            &copy; {new Date().getFullYear()} Sarvdev. {t('footer.rights')}
          </p>
          <p className="text-caption text-secondary-500">
            Built for the community, with reverence.
          </p>
        </div>
      </div>
    </footer>
  )
}
