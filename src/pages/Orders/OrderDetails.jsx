import { Package, Printer, SearchX, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import PrintableInvoice from '../../components/Invoice/PrintableInvoice'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getOrderById } from '../../services/orderService'
import { getProducts } from '../../services/productService'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate, orderStatuses, orderStatusVariant, paymentLabels, paymentStatusVariant } from '../../utils/orderStatus'

// Progress line: Processing -> Packed -> Shipped -> Delivered.
function OrderProgress({ status }) {
  if (status === 'Cancelled') return null
  const steps = orderStatuses.slice(0, 4)
  const currentIndex = steps.indexOf(status)

  return (
    <ol className="mt-6 flex gap-1">
      {steps.map((step, index) => (
        <li key={step} className="flex-1">
          <span className={`block h-1.5 rounded-full ${index <= currentIndex ? 'bg-primary' : 'bg-line'}`} />
          <span className={`mt-2 block text-xs ${index <= currentIndex ? 'font-medium text-heading' : 'text-muted'}`}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  usePageTitle(`Order ${id}`)
  const [showInvoice, setShowInvoice] = useState(false)
  const orderRequest = useFetch(() => getOrderById(id), id)
  const productsRequest = useFetch(getProducts)

  if (orderRequest.loading || productsRequest.loading) return <Loader label="Loading order..." />

  const order = orderRequest.data
  if (!order) {
    return (
      <div className="card">
        <EmptyState
          icon={SearchX}
          title="Order not found"
          text="We could not find this order."
          action={<Button to="/account/orders">Back to my orders</Button>}
        />
      </div>
    )
  }

  const productFor = (productId) => productsRequest.data?.find((product) => product.id === productId)
  const { address, customer, totals } = order

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="!text-2xl">Order {order.id}</h1>
            <p className="mt-1 text-sm text-muted">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>
            <Badge variant={paymentStatusVariant[order.paymentStatus]}>Payment: {order.paymentStatus}</Badge>
            <Button size="sm" variant="outline" onClick={() => setShowInvoice(true)} className="gap-1.5">
              <Printer size={15} /> Print Invoice
            </Button>
          </div>
        </div>
        <OrderProgress status={order.status} />
      </div>

      {/* Delivery Tracking Bar */}
      <div className="rounded-xl border border-primary/20 bg-primary-pale/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
            <Truck size={18} />
          </span>
          <div>
            <p className="font-bold text-heading">
              {order.deliveryPartner || 'SMAR Express Logistics'}
            </p>
            <p className="text-muted">
              {order.trackingNumber ? `AWB / Tracking No: ${order.trackingNumber}` : 'Tracking will be generated upon dispatch.'}
            </p>
          </div>
        </div>
        {order.estimatedDelivery && (
          <span className="rounded-lg bg-white px-3 py-1.5 font-bold text-primary border border-line shadow-2xs">
            Estimated Delivery: {order.estimatedDelivery}
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="card p-5 sm:p-6">
        <h2 className="!text-lg">Items</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((item, idx) => {
            const product = productFor(item.productId)
            const unitPrice = Number(item.unitPrice ?? item.price ?? 0)
            const quantity = Number(item.quantity ?? 1)
            const lineTotal = Number(item.lineTotal ?? (unitPrice * quantity))

            return (
              <li key={`${item.productId}-${idx}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <AssetImage
                  src={product?.images[0] || item.image}
                  alt=""
                  compact
                  className="size-14 shrink-0 rounded-lg border border-line"
                  imgClassName="object-cover size-14 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-sm font-bold text-heading">
                    {product ? (
                      <Link to={`/product/${product.slug}`} className="hover:text-primary">
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    {item.packLabel} × {quantity} · {formatPrice(unitPrice)} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-heading font-mono">{formatPrice(lineTotal)}</p>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Address & Payment Summary */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h2 className="!text-lg">Delivery Address</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-slate-700">
            <strong>{customer.name}</strong>
            <br />
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.city}, {address.state} - <strong>{address.pincode}</strong>
            <br />
            Phone: {customer.phone}
            {customer.email && (
              <>
                <br />
                Email: {customer.email}
              </>
            )}
          </address>
          {order.notes && <p className="mt-3 rounded-lg bg-surface p-2.5 text-xs text-muted">Note: {order.notes}</p>}
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="!text-lg">Payment Summary</h2>
          <p className="mt-3 text-sm">
            Method: <span className="font-medium text-heading">{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
          </p>
          {order.paymentId && (
            <p className="text-xs text-muted font-mono mt-0.5">Txn ID: {order.paymentId}</p>
          )}

          <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-heading font-mono">{formatPrice(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between gap-4 text-emerald-700">
                <dt>Discount {order.couponCode && `(${order.couponCode})`}</dt>
                <dd className="font-medium font-mono">- {formatPrice(totals.discount)}</dd>
              </div>
            )}
            {(() => {
              const delivery = Number(totals.delivery ?? totals.deliveryCharge ?? 0)
              return (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-medium text-heading font-mono">{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
                </div>
              )
            })()}
            {totals.tax > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">
                  {totals.taxName || 'GST'} {totals.gstRate ? `(${totals.gstRate}%)` : ''}
                </dt>
                <dd className="font-medium text-heading font-mono">{formatPrice(totals.tax)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-line pt-2.5 text-base font-bold text-heading">
              <dt>Total Amount</dt>
              <dd className="text-primary font-mono text-lg">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Invoice modal */}
      {showInvoice && <PrintableInvoice order={order} onClose={() => setShowInvoice(false)} />}
    </div>
  )
}
