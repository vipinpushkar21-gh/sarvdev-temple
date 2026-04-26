"use client"

type Props = {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (v: number) => void
}

const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }

export default function StarRating({ value, max = 5, size = 'md', interactive = false, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label={`Rating: ${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${sizes[size]} transition-transform duration-150 ${interactive ? 'cursor-pointer hover:scale-125 focus:outline-none' : 'cursor-default'}`}
            aria-label={interactive ? `Rate ${i + 1} star` : undefined}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={filled ? '#FF9933' : 'none'}
                stroke={filled ? '#FF9933' : '#A89880'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
