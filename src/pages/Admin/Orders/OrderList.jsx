import { Eye, Printer, Search, ShoppingBag, Download, CheckCircle2, Clock, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import DataTable from '../../../components/Admin/DataTable'
import StatCard from '../../../components/Admin/StatCard'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Loader from '../../../components/common/Loader'
import PrintableInvoice from '../../../components/Invoice/PrintableInvoice'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getOrders } from '../../../services/orderService'
import { exportOrdersToExcel } from '../../../utils/exportExcel'
import { formatPrice } from '../../../utils/formatPrice'
import { formatDate, orderStatuses, orderStatusVariant, paymentLabels, paymentStatusVariant } from '../../../utils/orderStatus'

export default function OrderList() {
  usePageTitle('Orders')
  const showToast = useToast()
  const { data: ordersData, loading } = useFetch(getOrders)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  if (loading) return <Loader page label="Loading orders..." />

  const orders = ordersData || []
  const search = query.trim().toLowerCase()
  const rows = orders.filter((order) => {
    if (status && order.status !== status) return false
    if (paymentFilter && order.paymentStatus !== paymentFilter) return false
    if (!search) return true
    return [
      order.id,
      order.trackingNumber,
      order.paymentId,
      order.customer?.name,
      order.customer?.phone,
      order.customer?.email,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search)
  })

  const totalOrderValue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totals?.total || 0), 0)
  const paidCount = orders.filter((o) => o.paymentStatus === 'Paid').length
  const pendingCodCount = orders.filter((o) => o.paymentStatus === 'Pending' && o.status !== 'Cancelled').length
  const shippedOrDeliveredCount = orders.filter((o) => o.status === 'Shipped' || o.status === 'Delivered').length

  function handleExportExcel() {
    exportOrdersToExcel(rows)
    showToast(`Exported ${rows.length} order(s) to Excel!`)
  }

  const columns = [
    {
      key: 'id',
      header: 'Order',
      render: (order) => (
        <div>
          <Link to={`/admin/orders/${order.id}`} className="font-bold text-primary hover:underline block">
            {order.id}
          </Link>
          {order.trackingNumber && (
            <span className="font-mono text-[10px] text-muted">{order.trackingNumber}</span>
          )}
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div>
          <p className="font-medium text-heading">{order.customer.name}</p>
          <p className="text-xs text-muted">{order.customer.phone}</p>
        </div>
      ),
    },
    { key: 'date', header: 'Date', render: (order) => <span className="whitespace-nowrap">{formatDate(order.createdAt)}</span> },
    {
      key: 'items',
      header: 'Products',
      render: (order) => (
        <span className="block max-w-52 truncate" title={order.items.map((item) => item.name).join(', ')}>
          {order.items.length} item{order.items.length === 1 ? '' : 's'} · {order.items.map((item) => item.name).join(', ')}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Amount & Mode',
      render: (order) => (
        <div>
          <span className="font-heading font-bold text-heading block">{formatPrice(order.totals.total)}</span>
          <span className="text-[11px] text-muted">{paymentLabels[order.paymentMethod] || order.paymentMethod || 'COD'}</span>
        </div>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (order) => (
        <div className="space-y-1">
          <Badge variant={paymentStatusVariant[order.paymentStatus]}>{order.paymentStatus}</Badge>
          {order.paymentId && <span className="block font-mono text-[10px] text-muted truncate max-w-28">{order.paymentId}</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Fulfillment',
      render: (order) => <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (order) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setInvoiceOrder(order)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            title="Print Invoice"
            aria-label={`Print invoice for ${order.id}`}
          >
            <Printer size={16} />
          </button>
          <Link
            to={`/admin/orders/${order.id}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            title="View &amp; Update Order"
            aria-label={`View ${order.id}`}
          >
            <Eye size={16} />
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders &amp; Fulfillment" description={`${orders.length} total order${orders.length === 1 ? '' : 's'} placed in your store.`}>
        <Button to="/admin/transactions" variant="outline" size="sm">
          Payments Ledger
        </Button>
        <Button type="button" onClick={handleExportExcel} size="sm" className="gap-1.5">
          <Download size={15} /> Export Orders (Excel)
        </Button>
      </AdminPageHeader>

      {/* Order Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orders.length}
          subtitle={`${formatPrice(totalOrderValue)} gross value`}
          tone="primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="Paid Orders"
          value={paidCount}
          subtitle="Verified payments"
          tone="info"
        />
        <StatCard
          icon={Clock}
          label="Pending COD"
          value={pendingCodCount}
          subtitle="Due on doorstep delivery"
          tone="warning"
        />
        <StatCard
          icon={Truck}
          label="Shipped / Delivered"
          value={shippedOrDeliveredCount}
          subtitle="Dispatched &amp; completed"
          tone="purple"
        />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 sm:max-w-sm focus-within:border-primary">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order ID, AWB, Txn ID, name or phone"
            aria-label="Search orders"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by order status"
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Order Statuses</option>
          {orderStatuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          aria-label="Filter by payment status"
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Payment Statuses</option>
          {['Paid', 'Pending', 'Refunded', 'Failed'].map((option) => (
            <option key={option} value={option}>
              Payment: {option}
            </option>
          ))}
        </select>
        {(query || status || paymentFilter) && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setStatus('')
              setPaymentFilter('')
            }}
            className="text-xs font-semibold text-primary hover:underline px-2"
          >
            Reset
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ShoppingBag}
            title={orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            text={orders.length === 0 ? 'Orders placed in the store will appear here.' : 'Try a different search or status.'}
          />
        </div>
      ) : (
        <DataTable caption="All orders" columns={columns} rows={rows} getRowKey={(order) => order.id} />
      )}

      {invoiceOrder && <PrintableInvoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  )
}
