import Image from 'next/image'
import Link from 'next/link'
import sarvdev, { Temple } from '../../../data/sarvdev'

type Props = {
  params: { slug: string }
}

function slugify(text?: string) {
  if (!text) return ''
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export default function TemplePage({ params }: Props) {
  const { slug } = params
  const temples: Temple[] = sarvdev.temples || []

  const temple = temples.find(
    (t) => t.id === slug || slug === slugify(t.title)
  )

  if (!temple) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Temple not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">We couldn't find a temple matching "{slug}".</p>
        <Link href="/temples" className="inline-block mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Back to temples</Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/temples" className="text-sm text-emerald-600 hover:underline">← Back to temples</Link>

      <header className="mt-4">
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">{temple.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{temple.description}</p>
      </header>

      {temple.image && (
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-64 sm:h-80 w-full">
            <Image src={temple.image} alt={temple.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Details</h2>
          <dl className="mt-3 text-sm text-slate-700 dark:text-slate-300 space-y-2">
            {temple.description && (
              <div>
                <dt className="font-medium">About</dt>
                <dd className="mt-1">{temple.description}</dd>
              </div>
            )}

            {('location' in temple) && (
              <div>
                <dt className="font-medium">Location</dt>
                <dd className="mt-1">{(temple as any).location}</dd>
              </div>
            )}

            {('timings' in temple) && (
              <div>
                <dt className="font-medium">Timings</dt>
                <dd className="mt-1">{(temple as any).timings}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Media</h2>
          <div className="mt-3 space-y-4 text-sm text-slate-700 dark:text-slate-300">
            {('video' in temple) && (temple as any).video && (
              <video controls src={(temple as any).video} className="w-full rounded-md bg-black" />
            )}

            {('audio' in temple) && (temple as any).audio && (
              <audio controls src={(temple as any).audio} className="w-full" />
            )}

            {!('video' in temple) && !('audio' in temple) && (
              <p className="text-sm text-slate-600 dark:text-slate-400">No audio or video available for this temple.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
