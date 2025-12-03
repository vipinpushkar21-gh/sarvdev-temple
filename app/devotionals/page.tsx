import sarvdev, { Devotional } from '../../data/sarvdev'

export const metadata = { title: 'Devotionals' }

export default function DevotionalsPage() {
  const devotionals: Devotional[] = sarvdev.devotionals || []

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-playfair text-slate-900 dark:text-slate-100">Devotionals</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">Bhajans, stotras and devotional audio for daily practice.</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devotionals.map((d: Devotional) => (
            <article key={d.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl overflow-hidden shadow-sm p-4 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 flex-grow">{d.description}</p>

              <div className="mt-4">
                {d.audio ? (
                  <audio controls src={d.audio} className="w-full rounded-md" />
                ) : (
                  <p className="text-sm text-slate-500">No audio available</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

