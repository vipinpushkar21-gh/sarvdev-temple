import Hero from '../../components/Hero'
export const metadata = { title: 'Booking' }

type Slot = {
  id: string
  title: string
  description: string
  time: string
  price?: string
}

const sampleSlots: Slot[] = [
  { id: 's1', title: 'Morning Aarti Slot', description: 'Morning aarti and blessing (30 mins)', time: '06:00 AM - 06:30 AM', price: 'Free' },
  { id: 's2', title: 'Special Pooja', description: 'Conduct a special pooja with priest (45 mins)', time: '10:00 AM - 10:45 AM', price: '$15' },
  { id: 's3', title: 'Evening Aarti', description: 'Evening aarti with lamps and bhajans (30 mins)', time: '07:00 PM - 07:30 PM', price: 'Free' },
  { id: 's4', title: 'Archana', description: 'One-on-one archana and prasadam (20 mins)', time: '05:00 PM - 05:20 PM', price: '$8' },
]

export default function BookingPage() {
  return (
    <>
      <Hero title="Online Booking" subtitle="Reserve pooja and darshan slots." />
      <main className="max-w-6xl mx-auto px-4 py-12">

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSlots.map((slot) => (
            <article key={slot.id} className="flex flex-col justify-between bg-background rounded-xl p-4 shadow-sm border border-accent">
              <div>
                <h3 className="text-lg font-semibold text-primary">{slot.title}</h3>
                <p className="mt-2 text-sm text-text">{slot.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-text">{slot.time}</div>
                  {slot.price && <div className="text-sm font-medium text-text">{slot.price}</div>}
                </div>

                <button
                  className="ml-4 btn btn-primary"
                  aria-label={`Book ${slot.title}`}
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
    </>
  )
}

