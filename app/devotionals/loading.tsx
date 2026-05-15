export default function DevotionalsLoading() {
  return (
    <div className="page-container py-12">
      <div className="h-8 w-56 bg-surface-sunken rounded-btn animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-5 w-3/4 bg-surface-sunken rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-sunken rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-surface-sunken rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
