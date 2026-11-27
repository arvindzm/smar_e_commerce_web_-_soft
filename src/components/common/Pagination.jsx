import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const buttonClass =
    'flex size-10 items-center justify-center rounded-lg border border-line text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-heading'

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button type="button" className={cn(buttonClass, 'text-heading')} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
          className={cn(buttonClass, number === page ? 'border-primary bg-primary text-white' : 'text-heading')}
        >
          {number}
        </button>
      ))}
      <button type="button" className={cn(buttonClass, 'text-heading')} onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
