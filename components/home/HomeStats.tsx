interface HomeStatsProps {
  initial: { temples: number; devotionals: number; categories: number }
}

export default function HomeStats({ initial }: HomeStatsProps) {
  return (
    <div className="mt-12 flex flex-wrap gap-8 fade-up delay-5">
      {[
        { value: initial.temples, label: 'Temples' },
        { value: initial.devotionals, label: 'Devotionals' },
        { value: initial.categories, label: 'Categories' },
      ].map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <span className="text-h2 font-serif font-bold text-gradient">
            {stat.value > 0 ? `${stat.value.toLocaleString()}+` : '—'}
          </span>
          <span className="text-caption text-ink-muted uppercase tracking-wider">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
