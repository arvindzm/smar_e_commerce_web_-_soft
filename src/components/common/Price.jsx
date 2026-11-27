import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/formatPrice'

// Shows the selling price, with the regular price struck through when discounted.
export default function Price({ regularPrice, salePrice, className, large = false }) {
  const discounted = salePrice < regularPrice

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
      <span className={cn('font-semibold text-heading', large ? 'font-heading text-3xl font-bold' : 'text-base')}>
        {formatPrice(salePrice)}
      </span>
      {discounted && (
        <span className={cn('text-muted line-through', large ? 'text-base' : 'text-sm')}>
          <span className="sr-only">Regular price </span>
          {formatPrice(regularPrice)}
        </span>
      )}
    </p>
  )
}
