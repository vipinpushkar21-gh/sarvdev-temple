"use client"

type AdminPaginationProps = {
  page: number
  limit: number
  total?: number
  hasMore?: boolean
  loading?: boolean
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

const PAGE_SIZES = [20, 50, 100]

export default function AdminPagination({
  page,
  limit,
  total,
  hasMore,
  loading,
  onPageChange,
  onLimitChange,
}: AdminPaginationProps) {
  const safePage = Math.max(1, page)
  const hasTotal = typeof total === 'number' && Number.isFinite(total)
  const totalPages = hasTotal ? Math.max(1, Math.ceil(total / limit)) : undefined
  const canPrev = safePage > 1 && !loading
  const canNext = !loading && (hasTotal ? safePage < (totalPages || 1) : Boolean(hasMore))
  const start = hasTotal && total > 0 ? (safePage - 1) * limit + 1 : 0
  const end = hasTotal ? Math.min(total || 0, safePage * limit) : safePage * limit

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="text-gray-500">
        {hasTotal ? (
          <span>
            Showing <span className="font-semibold text-gray-800">{start}-{end}</span> of{' '}
            <span className="font-semibold text-gray-800">{total}</span>
          </span>
        ) : (
          <span>Page <span className="font-semibold text-gray-800">{safePage}</span></span>
        )}
        {loading && <span className="ml-2 text-orange-600">Loading...</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-gray-500">
          Page size
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            disabled={loading}
            className="admin-input h-9 w-24 py-1 text-sm"
          >
            {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={!canPrev}
          className="admin-btn admin-btn-ghost disabled:opacity-40"
        >
          Prev
        </button>
        <span className="rounded-xl bg-gray-50 px-3 py-2 font-semibold text-gray-700">
          Page {safePage}{totalPages ? ` of ${totalPages}` : ''}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canNext}
          className="admin-btn admin-btn-ghost disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
