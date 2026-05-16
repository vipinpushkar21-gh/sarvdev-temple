interface HomeStatsProps {
  initial: { temples: number; devotionals: number; categories: number }
}

export default function HomeStats({ initial }: HomeStatsProps) {
  return (
    <div className="mt-12 flex flex-wrap gap-6 md:gap-10 fade-up delay-6">
      {[
        { value: initial.temples, label: 'Temples', icon: '🛕' },
        { value: initial.devotionals, label: 'Devotionals', icon: '🎵' },
        { value: initial.categories, label: 'Categories', icon: '📿' },
      ].map((stat) => (
        <div key={stat.label} className="flex items-center gap-3 group">
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
          <div>
            <span className="text-h2 font-display font-bold bg-gradient-to-r from-primary-300 via-accent-300 to-temple-gold-light bg-clip-text text-transparent tabular-nums">
              {stat.value > 0 ? `${stat.value.toLocaleString()}+` : '—'}
            </span>
            <span className="block font-cinzel text-[10px] text-sandstone-400 uppercase tracking-[0.15em]">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
