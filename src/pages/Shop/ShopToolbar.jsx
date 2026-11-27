import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { sortOptions } from '../../utils/filterProducts'

// Row above the product grid: result count, filter button (mobile), view toggle and sorting.
export default function ShopToolbar({ from, to, total, view, onViewChange, sort, onSortChange, onOpenFilters }) {
  const viewButton = (active) =>
    `flex size-10 items-center justify-center rounded-lg border transition-colors ${
      active ? 'border-primary bg-primary text-white' : 'border-line text-heading hover:border-primary hover:text-primary'
    }`

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-heading" aria-live="polite">
        {total === 0 ? 'No results' : `Showing ${from}-${to} of ${total} result${total === 1 ? '' : 's'}`}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-heading hover:border-primary hover:text-primary lg:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> Filters
        </button>
        <button type="button" className={viewButton(view === 'list')} onClick={() => onViewChange('list')} aria-label="List view" aria-pressed={view === 'list'}>
          <List size={18} />
        </button>
        <button type="button" className={viewButton(view === 'grid')} onClick={() => onViewChange('grid')} aria-label="Grid view" aria-pressed={view === 'grid'}>
          <LayoutGrid size={18} />
        </button>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline">Sort by:</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort products"
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-heading focus:border-primary focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
