export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-surface-sunken rounded-btn animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-4 w-1/2 bg-surface-sunken rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-surface-sunken rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="card p-5">
        <div className="h-64 bg-surface-sunken rounded animate-pulse" />
      </div>
    </div>
  )
}
