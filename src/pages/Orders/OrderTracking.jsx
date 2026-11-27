import { CheckCircle2, ClipboardList, MapPin, Package, PackageCheck, Printer, Search, Truck, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import Badge from '../../components/common/Badge'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import PrintableInvoice from '../../components/Invoice/PrintableInvoice'
import { usePageTitle } from '../../hooks/usePageTitle'
import { trackOrders } from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate, orderStatuses, orderStatusVariant, paymentLabels, paymentStatusVariant } from '../../utils/orderStatus'

const trackingSteps = [
  { key: 'Processing', label: 'Order Placed', subtitle: 'Confirmed & queued for milling/packing', icon: ClipboardList },
  { key: 'Packed', label: 'Packed & QC', subtitle: 'Hygienically sealed & quality verified', icon: PackageCheck },
  { key: 'Shipped', label: 'Out / Shipped', subtitle: 'Dispatched with delivery partner', icon: Truck },
  { key: 'Delivered', label: 'Delivered', subtitle: 'Handed over at doorstep', icon: CheckCircle2 },
]

function TrackingTimeline({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <XCircle size={22} className="shrink-0 text-rose-600" />
        <div>
          <p className="font-bold">Order Cancelled</p>
          <p className="text-xs text-rose-700">This order has been cancelled. Contact support if any refund is pending.</p>
        </div>
      </div>
    )
  }

  const currentIndex = Math.max(0, orderStatuses.slice(0, 4).indexOf(status))

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      {trackingSteps.map((step, index) => {
        const Icon = step.icon
        const completed = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div
            key={step.key}
            className={`relative rounded-xl border p-3.5 transition ${
              completed
                ? isCurrent
                  ? 'border-primary bg-primary-pale/50 ring-1 ring-primary/30'
                  : 'border-emerald-200 bg-emerald-50/50'
                : 'border-line bg-surface/50 opacity-65'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  completed ? 'bg-primary text-white shadow-2xs' : 'bg-white text-muted border border-line'
                }`}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className={`text-xs font-bold ${completed ? 'text-heading' : 'text-muted'}`}>{step.label}</p>
                <span
                  className={`text-[10px] font-semibold ${
                    isCurrent ? 'text-primary' : completed ? 'text-emerald-700' : 'text-muted'
                  }`}
                >
                  {isCurrent ? 'Current Stage' : completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-muted">{step.subtitle}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function OrderTracking() {
  usePageTitle('Track Your Order')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('id') || ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState([])
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  async function runLookup(term) {
    const clean = (term || '').trim()
    if (!clean) return
    setLoading(true)
    setSearched(true)
    try {
      const found = await trackOrders(clean)
      setResults(found || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      runLookup(initialQuery)
    }
  }, [initialQuery])

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchParams({ id: query.trim() })
    runLookup(query)
  }

  function handleQuickPick(sample) {
    setQuery(sample)
    setSearchParams({ id: sample })
    runLookup(sample)
  }

  return (
    <>
      <Breadcrumb title="Order Tracking" items={[{ label: 'Order Tracking' }]} />

      <div className="container-page max-w-4xl pt-8 lg:pt-12 space-y-6">
        {/* Search Box Card */}
        <div className="card p-6 sm:p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-pale text-primary">
            <Truck size={28} />
          </span>
          <h1 className="mt-4 !text-2xl sm:!text-3xl font-heading font-bold text-heading">
            Track Your Order Live
          </h1>
          <p className="mt-1.5 text-sm text-muted max-w-xl mx-auto">
            Enter your <strong>Order ID</strong> (e.g. ORD-10004), <strong>Tracking / AWB Number</strong>, or{' '}
            <strong>Registered Mobile Number</strong> to check live delivery progress.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID, AWB Tracking No, or Phone (e.g. ORD-10004)"
                className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm text-heading focus:border-primary focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" loading={loading} className="shrink-0 gap-2">
              <Search size={16} /> Track Order
            </Button>
          </form>

          {/* Quick Demo Sample Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span>Quick test:</span>
            {['ORD-10004', 'ORD-10003', 'ORD-10002', 'ORD-10001'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleQuickPick(sample)}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-heading hover:border-primary hover:text-primary transition"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <Loader label="Fetching live order tracking..." />}

        {/* Empty Search Result */}
        {!loading && searched && results.length === 0 && (
          <div className="card p-8 text-center space-y-3">
            <Package size={36} className="mx-auto text-muted" />
            <h2 className="text-lg font-bold text-heading">No matching order found</h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              We could not find any order for <strong className="text-heading">{query}</strong>. Please double-check your Order ID, AWB Tracking Number, or Phone Number.
            </p>
            <div className="pt-2">
              <Button to="/account/orders" variant="outline" size="sm">
                View My Account Orders
              </Button>
            </div>
          </div>
        )}

        {/* Matched Orders */}
        {!loading &&
          results.map((order) => (
            <div key={order.id} className="space-y-4">
              {/* Order Overview & Timeline */}
              <div className="card p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="!text-xl font-heading font-bold text-heading">Order {order.id}</h2>
                      <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>
                      <Badge variant={paymentStatusVariant[order.paymentStatus]}>
                        Payment: {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Placed on {formatDate(order.createdAt)} · Customer: <strong className="text-heading">{order.customer?.name}</strong>
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setInvoiceOrder(order)}
                    className="gap-1.5"
                  >
                    <Printer size={15} /> Print Invoice
                  </Button>
                </div>

                {/* Live 4-Step Visual Timeline */}
                <TrackingTimeline status={order.status} />

                {/* Logistics & AWB Info */}
                <div className="mt-5 rounded-xl border border-primary/20 bg-primary-pale/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Truck size={18} />
                    </span>
                    <div>
                      <p className="font-bold text-heading">
                        {order.deliveryPartner || 'SMAR In-House Express'}
                      </p>
                      <p className="text-muted font-mono">
                        {order.trackingNumber
                          ? `AWB / Tracking No: ${order.trackingNumber}`
                          : 'Tracking number will be assigned shortly upon dispatch.'}
                      </p>
                    </div>
                  </div>
                  {order.estimatedDelivery && (
                    <span className="rounded-lg bg-white px-3 py-1.5 font-bold text-primary border border-line shadow-2xs">
                      Est. Delivery: {order.estimatedDelivery}
                    </span>
                  )}
                </div>

                {/* Items & Address Summary */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2 pt-4 border-t border-line">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-3">
                      <MapPin size={14} className="text-primary" /> Delivery Address &amp; Payment
                    </h3>
                    <div className="rounded-xl bg-surface p-3.5 text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-heading">{order.customer?.name}</p>
                      <p>
                        {order.address?.line1}
                        {order.address?.line2 ? `, ${order.address.line2}` : ''}
                      </p>
                      <p>
                        {order.address?.city}, {order.address?.state} - <strong>{order.address?.pincode}</strong>
                      </p>
                      <p className="pt-1 text-muted">
                        Phone: <strong className="text-heading">{order.customer?.phone}</strong>
                      </p>
                      <p className="pt-1 border-t border-line/70 mt-2">
                        Payment: <strong>{paymentLabels[order.paymentMethod] || order.paymentMethod}</strong> · Total:{' '}
                        <strong className="text-primary">{formatPrice(order.totals?.total)}</strong>
                      </p>
                      {order.paymentId && (
                        <p className="font-mono text-[11px] text-muted">Txn ID: {order.paymentId}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-3">
                      <Package size={14} className="text-primary" /> Ordered Items ({order.items?.length || 0})
                    </h3>
                    <ul className="divide-y divide-line rounded-xl border border-line bg-white px-3.5 py-1">
                      {(order.items || []).map((item, idx) => (
                        <li key={`${item.productId}-${idx}`} className="flex items-center gap-3 py-2.5 text-xs">
                          <AssetImage
                            src={item.image}
                            alt={item.name}
                            compact
                            className="size-10 shrink-0 rounded-lg border border-line"
                            imgClassName="object-contain size-10 rounded-lg"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-heading">{item.name}</p>
                            <p className="text-[11px] text-muted">
                              {item.packLabel} × {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono font-semibold text-heading">{formatPrice(item.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Account link note */}
        <div className="text-center text-xs text-muted pb-4">
          Want to see your full order history?{' '}
          <Link to="/account/orders" className="font-semibold text-primary hover:underline">
            Go to My Orders →
          </Link>
        </div>
      </div>

      {invoiceOrder && <PrintableInvoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </>
  )
}
