import { ExternalLink, Printer, SearchX, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import AssetImage from '../../../components/common/AssetImage'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { Input, Select } from '../../../components/common/FormField'
import Loader from '../../../components/common/Loader'
import PrintableInvoice from '../../../components/Invoice/PrintableInvoice'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getOrderById, updateOrder } from '../../../services/orderService'
import { getProducts } from '../../../services/productService'
import { formatPrice } from '../../../utils/formatPrice'
import { formatDate, orderStatuses, orderStatusVariant, paymentLabels, paymentStatusVariant } from '../../../utils/orderStatus'

const paymentStatuses = ['Pending', 'Paid', 'Refunded', 'Failed']

const courierPartners = [
  'SMAR In-House Express',
  'Blue Dart Express',
  'Delhivery Logistics',
  'Shadowfax Logistics',
  'DTDC Courier',
  'Ecom Express',
  'Local Store Van Delivery',
]

// Rendered only once the order has loaded, so the dropdowns start on its values.
function StatusPanel({ order, onUpdated }) {
  const showToast = useToast()
  const [saved, setSaved] = useState({
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryPartner: order.deliveryPartner || 'SMAR In-House Express',
    trackingNumber: order.trackingNumber || '',
    deliveryAgent: order.deliveryAgent || '',
    estimatedDelivery: order.estimatedDelivery || '',
  })

  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [deliveryPartner, setDeliveryPartner] = useState(order.deliveryPartner || 'SMAR In-House Express')
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [deliveryAgent, setDeliveryAgent] = useState(order.deliveryAgent || '')
  const [estimatedDelivery, setEstimatedDelivery] = useState(order.estimatedDelivery || '')
  const [busy, setBusy] = useState(false)

  const changed =
    status !== saved.status ||
    paymentStatus !== saved.paymentStatus ||
    deliveryPartner !== saved.deliveryPartner ||
    trackingNumber !== saved.trackingNumber ||
    deliveryAgent !== saved.deliveryAgent ||
    estimatedDelivery !== saved.estimatedDelivery

  async function save() {
    setBusy(true)
    const payload = {
      status,
      paymentStatus,
      deliveryPartner,
      trackingNumber,
      deliveryAgent,
      estimatedDelivery,
    }
    const updated = await updateOrder(order.id, payload)
    setSaved({ ...payload })
    setBusy(false)
    if (onUpdated) onUpdated(updated)
    showToast(`Order ${order.id} delivery & payment details updated!`, 'success')
  }

  return (
    <div className="space-y-5">
      {/* ORDER & PAYMENT STATUS */}
      <div className="card space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="!text-lg">Order Status</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant={orderStatusVariant[saved.status]}>{saved.status}</Badge>
            <Badge variant={paymentStatusVariant[saved.paymentStatus]}>Payment: {saved.paymentStatus}</Badge>
          </div>
        </div>

        <Select label="Order Lifecycle Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          {orderStatuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Select label="Payment Status" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
          {paymentStatuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <div className="rounded-lg bg-surface p-3 text-xs text-muted space-y-1">
          <p>
            Method: <strong className="text-heading font-medium">{paymentLabels[order.paymentMethod] || order.paymentMethod}</strong>
          </p>
          {order.paymentId && (
            <p className="font-mono text-[11px] truncate">Txn ID: {order.paymentId}</p>
          )}
        </div>
      </div>

      {/* DISPATCH & COURIER LOGISTICS */}
      <div className="card space-y-4 p-5 sm:p-6">
        <h2 className="!text-lg flex items-center gap-2">
          <Truck size={18} className="text-primary" /> Delivery Logistics
        </h2>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
            Courier / Delivery Partner
          </label>
          <select
            value={deliveryPartner}
            onChange={(e) => setDeliveryPartner(e.target.value)}
            className="w-full rounded-lg border border-line bg-white py-2 px-3 text-sm font-medium text-heading focus:border-primary focus:outline-none"
          >
            {courierPartners.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
            Tracking / AWB Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. FB-EXP-908124"
            className="w-full rounded-lg border border-line bg-white py-2 px-3 text-sm font-mono text-heading focus:border-primary focus:outline-none uppercase"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
            Delivery Boy / Agent Info
          </label>
          <input
            type="text"
            value={deliveryAgent}
            onChange={(e) => setDeliveryAgent(e.target.value)}
            placeholder="Name & Mobile, e.g. Ramesh (+91 98765 43210)"
            className="w-full rounded-lg border border-line bg-white py-2 px-3 text-sm text-heading focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
            Estimated Delivery Date
          </label>
          <input
            type="date"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="w-full rounded-lg border border-line bg-white py-2 px-3 text-sm text-heading focus:border-primary focus:outline-none"
          />
        </div>

        <Button onClick={save} loading={busy} disabled={!changed} fullWidth className="mt-2 font-bold">
          {changed ? 'Save Delivery & Status Changes' : 'No Changes'}
        </Button>
        <p className="text-[11px] text-muted text-center">
          Tracking info is visible to the customer on their order details page.
        </p>
      </div>
    </div>
  )
}

export default function AdminOrderDetails() {
  const { id } = useParams()
  usePageTitle(`Order ${id}`)

  const orderRequest = useFetch(() => getOrderById(id), id)
  const productsRequest = useFetch(getProducts)
  const [showInvoice, setShowInvoice] = useState(false)
  const [liveOrder, setLiveOrder] = useState(null)

  if (orderRequest.loading || productsRequest.loading) return <Loader label="Loading order..." />

  const order = liveOrder || orderRequest.data
  if (!order) {
    return (
      <EmptyState
        icon={SearchX}
        title="Order not found"
        text="This order does not exist."
        action={<Button to="/admin/orders">Back to orders</Button>}
      />
    )
  }

  const productFor = (productId) => productsRequest.data?.find((product) => product.id === productId)
  const { address, customer, totals } = order

  return (
    <>
      <AdminPageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.createdAt)} · Payment: ${order.paymentStatus}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setShowInvoice(true)} variant="primary" className="gap-2 font-bold shadow-xs">
            <Printer size={16} /> Print Tax Invoice / Receipt
          </Button>
          <Button to="/admin/orders" variant="outline">
            Back to Orders
          </Button>
        </div>
      </AdminPageHeader>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          {/* Products Table Card */}
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="!text-lg">Ordered Products</h2>
              <span className="text-xs text-muted font-medium">{order.items.length} items</span>
            </div>

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
                      <p className="truncate font-medium text-heading">
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

            <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
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

          {/* Customer & Address Details */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h2 className="!text-lg">Customer</h2>
              <p className="mt-3 font-bold text-heading">{customer.name}</p>
              <p className="text-sm mt-1 text-slate-600">
                <a href={`tel:${customer.phone}`} className="hover:text-primary font-medium">
                  📞 {customer.phone}
                </a>
                <br />
                <a href={`mailto:${customer.email}`} className="break-words hover:text-primary">
                  ✉️ {customer.email}
                </a>
              </p>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="!text-lg">Delivery Address</h2>
              <address className="mt-3 text-sm not-italic leading-relaxed text-slate-700">
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
                <br />
                {address.city}, {address.state} - <strong>{address.pincode}</strong>
              </address>
              {order.notes && <p className="mt-3 rounded-lg bg-surface p-2.5 text-xs text-muted"><strong>Note:</strong> {order.notes}</p>}
            </div>
          </div>
        </div>

        {/* Status & Logistics Sidebar */}
        <StatusPanel order={order} onUpdated={(up) => setLiveOrder(up)} />
      </div>

      {/* Tax Invoice & Receipt Modal */}
      {showInvoice && <PrintableInvoice order={order} onClose={() => setShowInvoice(false)} />}
    </>
  )
}
