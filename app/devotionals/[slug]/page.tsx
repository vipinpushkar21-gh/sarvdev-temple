import sarvdev, { Devotional } from '../../../data/sarvdev'
import Link from 'next/link'

type Props = { params: { slug: string } }

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function DevotionalDetailPage({ params }: Props) {
  const { slug } = params

  const devotional = sarvdev.devotionals.find((d: Devotional) => d.id === slug || slugify(d.title) === slug)

  if (!devotional) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Devotional not found</h1>
        <p className="text-slate-600 mb-6">We couldn't find the devotional you're looking for.</p>
        <Link href="/devotionals" className="text-emerald-600 hover:underline">Back to devotionals</Link>
      </main>
    )
  }

  // devotional may optionally include extra fields like lyrics, meaning, image
  const anyDev: any = devotional

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="space-y-6">
        <header>
          <h1 className="text-3xl font-playfair font-semibold">{devotional.title}</h1>
          {devotional.description && <p className="mt-2 text-slate-600">{devotional.description}</p>}
        </header>

        {anyDev.image && (
          <div className="w-full rounded-lg overflow-hidden">
            <img src={anyDev.image} alt={devotional.title} className="w-full h-auto object-cover rounded-md" />
          </div>
        )}

        {devotional.audio && (
          <section>
            <h3 className="text-lg font-medium mb-2">Audio</h3>
            <audio controls src={devotional.audio} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </section>
        )}

        {anyDev.lyrics && (
          <section>
            <h3 className="text-lg font-medium">Lyrics</h3>
            <pre className="whitespace-pre-wrap mt-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-md">{anyDev.lyrics}</pre>
          </section>
        )}

        {anyDev.meaning && (
          <section>
            <h3 className="text-lg font-medium">Meaning / Notes</h3>
            <p className="mt-2 text-sm text-slate-700">{anyDev.meaning}</p>
          </section>
        )}

        <footer className="pt-4">
          <Link href="/devotionals" className="text-emerald-600 hover:underline">← Back to devotionals</Link>
        </footer>
      </article>
    </main>
  )
}
