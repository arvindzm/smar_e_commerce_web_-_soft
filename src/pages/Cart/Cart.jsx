import { ShoppingCart } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useCart } from '../../hooks/useCart'
import { useCartLines } from '../../hooks/useCartLines'
import { usePageTitle } from '../../hooks/usePageTitle'
import CartItemRow, { CartItemCard } from './CartItemRow'
import CartSummary from './CartSummary'

export default function Cart() {
  usePageTitle('Shopping Cart')
  const { clearCart } = useCart()
  const { lines, totals, loading } = useCartLines()

  if (loading) return <Loader page label="Loading your cart..." />

  return (
    <>
      <Breadcrumb title="Shopping Cart" items={[{ label: 'Cart' }]} />

      <div className="container-page pt-8 lg:pt-12">
        {lines.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              text="Browse our products and add what you need."
              action={<Button to="/shop">Start shopping</Button>}
            />
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
            <div>
              <ul className="space-y-4 md:hidden">
                {lines.map((line) => (
                  <CartItemCard key={`${line.product.id}-${line.pack.label}`} line={line} />
                ))}
              </ul>

              <div className="card hidden p-6 md:block">
                <table className="w-full">
                  <caption className="sr-only">Products in your cart</caption>
                  <thead>
                    <tr className="border-b border-line text-left text-sm font-semibold text-heading">
                      <th scope="col" className="pb-4 pr-4 font-semibold">Delete</th>
                      <th scope="col" className="pb-4 pr-4 font-semibold">Product</th>
                      <th scope="col" className="pb-4 pr-4 font-semibold">Price</th>
                      <th scope="col" className="pb-4 pr-4 font-semibold">Quantity</th>
                      <th scope="col" className="pb-4 text-right font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <CartItemRow key={`${line.product.id}-${line.pack.label}`} line={line} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button to="/shop" variant="outline">
                  Continue Shopping
                </Button>
                <Button variant="danger" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>

            <CartSummary totals={totals} />
          </div>
        )}
      </div>
    </>
  )
}
