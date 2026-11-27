import { CircleX } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import QuantityStepper from '../../components/common/QuantityStepper'
import Rating from '../../components/common/Rating'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatPrice'

// Shared pieces used by both the mobile card and the desktop table row.
function useRowParts(line) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, pack, quantity } = line

  const removeButton = (
    <button
      type="button"
      onClick={() => removeFromCart(product.id, pack.label)}
      className="flex items-center gap-1.5 text-sm text-body transition-colors hover:text-danger"
      aria-label={`Remove ${product.name} (${pack.label}) from cart`}
    >
      <CircleX size={18} aria-hidden="true" /> <span className="md:hidden lg:inline">Remove</span>
    </button>
  )

  const details = (
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <Link to={`/product/${product.slug}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <AssetImage src={product.images[0]} alt="" compact className="size-20 rounded-xl sm:size-24" />
      </Link>
      <div className="min-w-0">
        <p className="font-heading text-sm font-bold text-heading sm:text-base">
          <Link to={`/product/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </p>
        <p className="truncate text-xs text-muted">
          {pack.label}
        </p>
        <div className="mt-1">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
      </div>
    </div>
  )

  const stepper = (
    <QuantityStepper
      value={quantity}
      onChange={(next) => updateQuantity(product.id, pack.label, next)}
      max={Math.max(1, product.stock)}
    />
  )

  return { removeButton, details, stepper }
}

// Mobile: each cart item as a card in a list.
export function CartItemCard({ line }) {
  const { removeButton, details, stepper } = useRowParts(line)

  return (
    <li className="card p-4">
      {details}
      <div className="mt-4 flex items-center justify-between gap-3">
        {stepper}
        <p className="font-heading text-lg font-bold text-heading">{formatPrice(line.lineTotal)}</p>
      </div>
      <div className="mt-3 border-t border-line pt-3">{removeButton}</div>
    </li>
  )
}

// Desktop: each cart item as a table row.
export default function CartItemRow({ line }) {
  const { removeButton, details, stepper } = useRowParts(line)

  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-5 pr-4">{removeButton}</td>
      <td className="py-5 pr-4">{details}</td>
      <td className="py-5 pr-4 text-sm font-medium text-heading">{formatPrice(line.pack.salePrice)}</td>
      <td className="py-5 pr-4">{stepper}</td>
      <td className="py-5 text-right font-heading font-bold text-heading">{formatPrice(line.lineTotal)}</td>
    </tr>
  )
}
