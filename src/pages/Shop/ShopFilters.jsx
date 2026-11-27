import { Star } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import { Checkbox } from '../../components/common/FormField'
import PriceRange from '../../components/common/PriceRange'
import { formatPrice } from '../../utils/formatPrice'

function FilterCard({ title, children }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 border-b border-line pb-3 !text-lg">{title}</h2>
      {children}
    </div>
  )
}

const ratingOptions = [
  { value: 0, label: 'Any rating' },
  { value: 4.5, label: '4.5 & up' },
  { value: 4, label: '4 & up' },
]

// Sidebar filters. The parent page owns the filter values (they live in the URL).
export default function ShopFilters({ categories, counts, totalCount, filters, priceBounds, onCategory, onChange, onClear }) {
  // The slider moves freely; the price filter is applied when "Filter" is pressed.
  const [range, setRange] = useState([filters.min ?? priceBounds.min, filters.max ?? priceBounds.max])

  const categoryButton = (active) =>
    `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
      active ? 'bg-primary-light font-semibold text-primary' : 'text-heading hover:bg-surface hover:text-primary'
    }`

  return (
    <div className="space-y-5">
      <FilterCard title="Product Category">
        <ul className="space-y-1">
          <li>
            <button type="button" className={categoryButton(!filters.categorySlug)} onClick={() => onCategory('')}>
              All Products <span className="text-xs text-muted">({totalCount})</span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                className={categoryButton(filters.categorySlug === category.slug)}
                onClick={() => onCategory(category.slug)}
              >
                {category.name} <span className="text-xs text-muted">({counts[category.id] || 0})</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterCard>

      <FilterCard title="Filter by Price">
        <PriceRange min={priceBounds.min} max={priceBounds.max} value={range} onChange={setRange} />
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button size="sm" onClick={() => onChange({ min: range[0], max: range[1] })}>
            Filter
          </Button>
          <p className="text-sm">
            Price:{' '}
            <span className="font-semibold text-heading">
              {formatPrice(range[0])} - {formatPrice(range[1])}
            </span>
          </p>
        </div>
      </FilterCard>

      <FilterCard title="Filter by Rating">
        <ul className="space-y-2.5">
          {ratingOptions.map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-heading">
                <input
                  type="radio"
                  name="rating-filter"
                  className="size-4 accent-primary"
                  checked={(filters.rating || 0) === option.value}
                  onChange={() => onChange({ rating: option.value || '' })}
                />
                {option.value > 0 && <Star size={14} className="fill-star text-star" aria-hidden="true" />}
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      </FilterCard>

      <FilterCard title="Availability">
        <Checkbox
          label="In stock only"
          checked={filters.inStock}
          onChange={(event) => onChange({ stock: event.target.checked })}
        />
      </FilterCard>

      <Button variant="outline" fullWidth onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}
