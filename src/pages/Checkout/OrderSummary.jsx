import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatPrice'

// The list of products being ordered, shown in the checkout summary.
// Includes quick delete and quantity adjustment options.
export default function OrderSummary({ lines }) {
  const { removeFromCart, updateQuantity } = useCart()

  // Calculate total units across all ordered lines
  const totalQuantity = lines.reduce((acc, line) => acc + (Number(line.quantity) || 1), 0)

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="!text-xl">Your Order</h2>
        <span className="rounded-full bg-primary-pale px-2.5 py-0.5 text-xs font-semibold text-primary">
          {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <ul className="mt-5 divide-y divide-line">
        {lines.map((line) => {
          const itemKey = `${line.product.id}-${line.pack.label}`
          return (
            <li key={itemKey} className="flex items-center gap-3 py-3.5 first:pt-0">
              <AssetImage
                src={line.product.images[0]}
                alt={line.product.name}
                compact
                className="size-14 shrink-0 rounded-lg border border-line"
                imgClassName="object-cover size-14 rounded-lg"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-bold text-heading">
                  <Link to={`/product/${line.product.slug}`} className="hover:text-primary">
                    {line.product.name}
                  </Link>
                </p>
                <p className="text-xs text-muted">{line.pack.label}</p>

                {/* Quantity adjustment stepper inside checkout */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="inline-flex items-center rounded-md border border-line bg-surface">
                    <button
                      type="button"
                      onClick={() => {
                        if (line.quantity > 1) {
                          updateQuantity(line.product.id, line.pack.label, line.quantity - 1)
                        } else {
                          removeFromCart(line.product.id, line.pack.label)
                        }
                      }}
                      className="flex size-6 items-center justify-center text-muted transition-colors hover:bg-line hover:text-heading"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="min-w-6 text-center text-xs font-semibold text-heading">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.product.id, line.pack.label, line.quantity + 1)}
                      className="flex size-6 items-center justify-center text-muted transition-colors hover:bg-line hover:text-heading"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-medium text-muted">× {formatPrice(line.pack.salePrice)}</span>
                </div>
              </div>

              {/* Price & Delete Action */}
              <div className="flex flex-col items-end gap-1.5">
                <p className="text-sm font-bold text-heading">{formatPrice(line.lineTotal)}</p>
                <button
                  type="button"
                  onClick={() => removeFromCart(line.product.id, line.pack.label)}
                  className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger-light hover:text-danger"
                  title="Remove item from order"
                  aria-label={`Remove ${line.product.name} from order`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
        <Link to="/shop" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
          <ArrowLeft size={13} /> Add more items
        </Link>
        <span className="text-muted">Instant delivery available</span>
      </div>
    </div>
  )
}
