import Link from 'next/link'

const groups = [
  { title: 'Explore', links: [['Temples', '/temples'], ['Deities', '/deities'], ['Devotionals', '/devotionals'], ['Sacred Stories', '/blog'], ['Daily Darshan', '/daily-darshan'], ['Events', '/events'], ['Sacred Collections', '/temples/pilgrimage']] },
  { title: 'Sarvdev', links: [['About', '/about'], ['Contact', '/contact'], ['Help', '/help'], ['List a Temple', '/list-temple']] },
  { title: 'Policies', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Disclaimer', '/disclaimer'], ['Editorial Policy', '/editorial-policy']] },
]

export default function Footer() {
  return <footer className="border-t border-surface-border bg-[#241C17] pb-20 text-[#F6F1E7] xl:pb-0"><div className="page-container py-12 sm:py-14"><div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]"><div><Link href="/" className="font-serif text-3xl text-[#FFFDF8] no-underline">Sarvdev</Link><p className="mt-4 max-w-xs text-sm leading-6 text-[#D8D0C4]">A growing place to discover temples, sacred traditions and devotional resources.</p><Link href="/list-temple" className="mt-6 inline-block text-sm font-semibold text-[#E9B86A] underline">List a temple</Link></div>{groups.map(group => <nav key={group.title} aria-label={group.title}><h2 className="text-overline uppercase tracking-[.16em] text-[#E9B86A]">{group.title}</h2><ul className="mt-4 space-y-2.5">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-[#D8D0C4] no-underline hover:text-[#FFFDF8]">{label}</Link></li>)}</ul></nav>)}</div><div className="mt-10 border-t border-[#5A4A3B] pt-5 text-xs text-[#B9AD9F]">© {new Date().getFullYear()} Sarvdev. All rights reserved.</div></div></footer>
}
