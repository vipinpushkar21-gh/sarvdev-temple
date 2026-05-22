"use client"

type Chip = {
  id: string
  label: string
  meta?: string | number
}

type Props = {
  chips: Chip[]
  activeId: string
  onChange: (id: string) => void
  ariaLabel?: string
  className?: string
}

export default function DevotionalFilterChips({
  chips,
  activeId,
  onChange,
  ariaLabel = 'Filter devotionals',
  className = '',
}: Props) {
  return (
    <nav className={`flex gap-2 overflow-x-auto scrollbar-none ${className}`} aria-label={ariaLabel}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onChange(chip.id)}
          aria-pressed={activeId === chip.id}
          className="category-pill whitespace-nowrap shrink-0"
          data-active={activeId === chip.id ? 'true' : 'false'}
        >
          <span>{chip.label}</span>
          {chip.meta !== undefined && <span className="text-caption opacity-70 tabular-nums">{chip.meta}</span>}
        </button>
      ))}
    </nav>
  )
}

