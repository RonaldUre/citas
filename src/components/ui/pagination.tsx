interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const prev = () => onPageChange(Math.max(1, page - 1))
  const next = () => onPageChange(Math.min(totalPages, page + 1))

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 border rounded">
        Anterior
      </button>
      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <button onClick={next} disabled={page === totalPages} className="px-3 py-1 border rounded">
        Siguiente
      </button>
    </div>
  )
}