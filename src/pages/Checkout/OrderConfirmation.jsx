import { CircleCheck, SearchX } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getOrderById } from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'

const paymentLabels = { cod: 'Cash on Delivery', upi: 'UPI', card: 'Credit / Debit Card', netbanking: 'Net Banking' }

// Shown right after an order is placed.
export default function OrderConfirmation() {
  const { id } = useParams()
  usePageTitle('Order Confirmed')
  const { data: order, loading } = useFetch(() => getOrderById(id), id)

  if (loading) return <Loader page label="Loading your order..." />

  if (!order) {
    return (
      <EmptyState
        icon={SearchX}
        title="Order not found"
        text="We could not find this order."
        action={<Button to="/shop">Continue shopping</Button>}
      />
    )
  }

  const { address, customer } = order

  return (
    <>
      <Breadcrumb title="Order Confirmed" items={[{ label: 'Order Confirmed' }]} />

      <div className="container-page max-w-3xl pt-8 lg:pt-12">
        <div className="card p-6 text-center sm:p-10">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent-light text-accent">
            <CircleCheck size={40} aria-hidden="true" />
          </span>
          <h1 className="mt-5 !text-2xl">Thank you for your order!</h1>
          <p className="mt-2">
            Your order <strong className="text-heading">{order.id}</strong> has been placed. We will contact you on{' '}
            {customer.phone} to confirm the delivery.
          </p>

          <dl className="mt-7 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Delivery address</dt>
              <dd className="mt-1.5 text-sm text-heading">
                {customer.name}
                <br />
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
                <br />
                {address.city}, {address.state} - {address.pincode}
              </dd>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Payment</dt>
              <dd className="mt-1.5 text-sm text-heading">
                {paymentLabels[order.paymentMethod] || order.paymentMethod}
                <br />
                Status: {order.paymentStatus}
                <br />
                Total: <strong>{formatPrice(order.totals.total)}</strong>
              </dd>
            </div>
          </dl>

          <ul className="mt-6 divide-y divide-line rounded-xl border border-line text-left">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.packLabel}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-heading">
                  {item.name} <span className="text-muted">({item.packLabel})</span> × {item.quantity}
                </span>
                <span className="font-semibold text-heading">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to={`/track-order?id=${order.id}`}>Track Order Live</Button>
            <Button to="/shop" variant="outline">Continue Shopping</Button>
            <Button to="/account/orders" variant="outline">
              View My Orders
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
