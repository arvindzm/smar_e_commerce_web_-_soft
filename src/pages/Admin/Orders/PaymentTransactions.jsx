import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  Landmark,
  Printer,
  RotateCcw,
  Search,
  Smartphone,
  Wallet,
} from 'lucide-react'
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
import { exportPaymentsToExcel } from '../../../utils/exportExcel'
import { formatPrice } from '../../../utils/formatPrice'
import { formatDate, orderStatusVariant, paymentLabels, paymentStatusVariant } from '../../../utils/orderStatus'

function normalizeMethod(method) {
  const m = (method || '').toLowerCase()
  if (m.includes('upi')) return 'upi'
  if (m.includes('card')) return 'card'
  if (m.includes('netbanking') || m.includes('bank')) return 'netbanking'
  return 'cod'
}

export default function PaymentTransactions() {
  usePageTitle('Payments & Transactions')
  const showToast = useToast()
  const { data: ordersData, loading } = useFetch(getOrders)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  if (loading) return <Loader page label="Loading payment transactions..." />

  const orders = ordersData || []

  // Financial KPIs
  const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid')
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'Pending' && o.status !== 'Cancelled')
  const refundedOrFailed = orders.filter((o) => o.paymentStatus === 'Refunded' || o.paymentStatus === 'Failed')

  const totalCollected = paidOrders.reduce((s, o) => s + (o.totals?.total || 0), 0)
  const totalOnlineCollected = paidOrders
    .filter((o) => normalizeMethod(o.paymentMethod) !== 'cod')
    .reduce((s, o) => s + (o.totals?.total || 0), 0)
  const totalCodPending = pendingOrders.reduce((s, o) => s + (o.totals?.total || 0), 0)
  const totalRefundedFailed = refundedOrFailed.reduce((s, o) => s + (o.totals?.total || 0), 0)

  // Method breakdown
  const methodCounts = {
    upi: { label: 'UPI / QR', icon: Smartphone, count: 0, amount: 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    card: { label: 'Debit / Credit Cards', icon: CreditCard, count: 0, amount: 0, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    netbanking: { label: 'Net Banking', icon: Landmark, count: 0, amount: 0, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    cod: { label: 'Cash on Delivery', icon: Banknote, count: 0, amount: 0, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  }

  orders.forEach((o) => {
    if (o.status === 'Cancelled') return
    const key = normalizeMethod(o.paymentMethod)
    methodCounts[key].count += 1
    methodCounts[key].amount += o.totals?.total || 0
  })

  // Filtered rows
  const search = query.trim().toLowerCase()
  const rows = orders.filter((order) => {
    if (statusFilter && order.paymentStatus !== statusFilter) return false
    if (methodFilter && normalizeMethod(order.paymentMethod) !== methodFilter) return false
    if (!search) return true
    return [
      order.id,
      order.paymentId,
      order.customer?.name,
      order.customer?.phone,
      order.paymentMethod,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search)
  })

  function handleExport() {
    exportPaymentsToExcel(rows)
    showToast(`Exported ${rows.length} payment record(s) to Excel!`)
  }

  const columns = [
    {
      key: 'txn',
      header: 'Transaction ID',
      render: (order) => (
        <div>
          <span className="font-mono text-xs font-bold text-heading block">
            {order.paymentId || `COD_${order.id}`}
          </span>
          <span className="text-[11px] text-muted">{formatDate(order.createdAt)}</span>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Order Ref',
      render: (order) => (
        <div className="space-y-1">
          <Link to={`/admin/orders/${order.id}`} className="font-bold text-xs text-primary hover:underline block">
            {order.id}
          </Link>
          <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div>
          <p className="font-medium text-heading">{order.customer?.name}</p>
          <p className="text-xs text-muted">{order.customer?.phone}</p>
        </div>
      ),
    },
    {
      key: 'mode',
      header: 'Payment Mode',
      render: (order) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-heading">
          {paymentLabels[order.paymentMethod] || order.paymentMethod || 'Cash on Delivery'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (order) => (
        <div>
          <span className="font-heading font-bold text-heading block">{formatPrice(order.totals?.total)}</span>
          {order.totals?.discount > 0 && (
            <span className="text-[10px] text-emerald-700">Disc: -{formatPrice(order.totals.discount)}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Payment Status',
      render: (order) => <Badge variant={paymentStatusVariant[order.paymentStatus]}>{order.paymentStatus}</Badge>,
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
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            title="Print Receipt"
            aria-label={`Print invoice for ${order.id}`}
          >
            <Printer size={16} />
          </button>
          <Link
            to={`/admin/orders/${order.id}`}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            title="View Order & Payment"
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
      <AdminPageHeader
        title="Payments &amp; Transactions"
        description="Complete financial ledger of online UPI, Card, Net Banking &amp; COD collections."
      >
        <Button to="/admin/payment-settings" variant="outline" size="sm">
          Gateway Settings
        </Button>
        <Button onClick={handleExport} size="sm" className="gap-1.5">
          <Download size={15} /> Download Excel
        </Button>
      </AdminPageHeader>

      {/* Financial KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Total Collected"
          value={formatPrice(totalCollected)}
          subtitle={`${paidOrders.length} paid order(s)`}
          tone="primary"
        />
        <StatCard
          icon={Wallet}
          label="Online Gateway"
          value={formatPrice(totalOnlineCollected)}
          subtitle="UPI, Cards &amp; Net Banking"
          tone="info"
        />
        <StatCard
          icon={Clock}
          label="Pending COD"
          value={formatPrice(totalCodPending)}
          subtitle={`${pendingOrders.length} doorstep collection(s)`}
          tone="warning"
        />
        <StatCard
          icon={RotateCcw}
          label="Refunded / Failed"
          value={formatPrice(totalRefundedFailed)}
          subtitle={`${refundedOrFailed.length} transaction(s)`}
          tone="purple"
        />
      </div>

      {/* Payment Mode Breakdown Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(methodCounts).map(([key, item]) => {
          const Icon = item.icon
          const isActive = methodFilter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMethodFilter(isActive ? '' : key)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                isActive ? 'border-primary bg-primary-pale/50 ring-1 ring-primary' : 'border-line bg-white hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${item.color}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-heading truncate">{item.label}</p>
                  <p className="text-[11px] text-muted">{item.count} order(s)</p>
                </div>
              </div>
              <span className="font-heading text-sm font-bold text-heading shrink-0">{formatPrice(item.amount)}</span>
            </button>
          )
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 sm:max-w-sm focus-within:border-primary">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Txn ID, Order ID, name or phone..."
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Payment Modes</option>
          <option value="upi">UPI / QR</option>
          <option value="card">Cards (Debit/Credit)</option>
          <option value="netbanking">Net Banking</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>

        {(query || statusFilter || methodFilter) && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setStatusFilter('')
              setMethodFilter('')
            }}
            className="text-xs font-semibold text-primary hover:underline px-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Transactions Table */}
      {rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="No matching payment records"
            text="Try clearing filters or search terms to view all store transactions."
          />
        </div>
      ) : (
        <DataTable caption="Payment transactions ledger" columns={columns} rows={rows} getRowKey={(o) => o.id} />
      )}

      {invoiceOrder && <PrintableInvoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  )
}
