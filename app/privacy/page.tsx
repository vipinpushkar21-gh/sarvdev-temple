import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy — Sarvdev', description: 'How Sarvdev handles information shared through public forms.', alternates: { canonical: 'https://sarvdev.com/privacy' } }

const sections = [
  ['Information provided to Sarvdev', 'This can include information sent through contact and temple-submission forms, along with information needed for the site to function.'],
  ['How it is used', 'Information may be used to operate Sarvdev, handle submissions and messages, and improve the public experience. Temple information approved for publication may appear publicly.'],
  ['Choices and questions', 'You may contact Sarvdev about information you have submitted, including correction or deletion requests.'],
]

export default function PrivacyPage() { return <main className="bg-surface pb-20"><article className="page-container max-w-4xl py-12 sm:py-16"><header className="border-l-2 border-primary-700 pl-5"><p className="text-overline uppercase tracking-[.16em] text-primary-700">Policies</p><h1 className="mt-3 font-serif text-4xl text-ink">Privacy</h1><p className="mt-4 text-lg leading-8 text-ink-muted">How information shared with Sarvdev is handled.</p></header><div className="mt-12 divide-y divide-surface-border border-y border-surface-border">{sections.map(([title, text], index) => <section key={title} className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr]"><p className="font-serif text-primary-700">0{index + 1}</p><div><h2 className="font-serif text-2xl text-ink">{title}</h2><p className="mt-2 text-sm leading-7 text-ink-muted">{text}</p></div></section>)}</div><p className="mt-10 text-sm text-ink-muted">Questions about this policy can be sent through <Link href="/contact" className="font-semibold text-primary-800 underline">Contact</Link>.</p></article></main> }
