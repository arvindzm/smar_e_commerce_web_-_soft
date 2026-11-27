import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Flame,
  IndianRupee,
  Package,
  Plus,
  ShoppingBag,
  Tags,
  TicketPercent,
  TrendingUp,
  Truck,
  Users,
  Wallet
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../../components/Admin/StatCard'
import AssetImage from '../../../components/common/AssetImage'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Loader from '../../../components/common/Loader'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getCategories } from '../../../services/categoryService'
import { getCustomers } from '../../../services/customerService'
import { getOrders } from '../../../services/orderService'
import { getProducts } from '../../../services/productService'
import { exportOrdersToExcel, exportPaymentsToExcel } from '../../../utils/exportExcel'
import { formatPrice } from '../../../utils/formatPrice'
import { formatDate, orderStatuses, orderStatusVariant, paymentStatusVariant } from '../../../utils/orderStatus'
import { getDefaultPack } from '../../../utils/product'

// Beautiful, responsive bar chart of sales over the last 7 days.
function SalesChart({ orders }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  const [today] = useState(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - index))
    return { date, total: 0, orderCount: 0 }
  })

  orders.forEach((order) => {
    const placed = new Date(order.createdAt)
    placed.setHours(0, 0, 0, 0)
    const day = days.find((entry) => entry.date.getTime() === placed.getTime())
    if (day && order.status !== 'Cancelled') {
      day.total += order.totals.total
      day.orderCount += 1
    }
  })

  const totalSales7Days = days.reduce((sum, d) => sum + d.total, 0)
  const highest = Math.max(...days.map((day) => day.total), 800)

  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <h2 className="!text-lg font-bold text-heading">Sales Performance</h2>
          <p className="text-xs text-muted">Daily store revenue over the last 7 days</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-muted block">7-Day Total</span>
          <span className="text-lg font-bold text-primary">{formatPrice(totalSales7Days)}</span>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="relative mt-6 pt-4 pb-2">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-line w-full" />
          <div className="border-b border-dashed border-line w-full" />
          <div className="border-b border-line w-full" />
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex h-48 items-end gap-2 sm:gap-4 px-2">
          {days.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.total / highest) * 100))
            const isHovered = hoveredDay === idx

            return (
              <div
                key={day.date.toISOString()}
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
                className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-center text-xs text-white shadow-lg pointer-events-none animate-in fade-in zoom-in-95">
                    <p className="font-bold">{formatPrice(day.total)}</p>
                    <p className="text-[10px] text-slate-300">
                      {day.orderCount} order{day.orderCount === 1 ? '' : 's'}
                    </p>
                  </div>
                )}

                {/* Amount label */}
                <span className="mb-2 text-[11px] font-semibold text-heading truncate transition-opacity duration-200">
                  {day.total > 0 ? formatPrice(day.total) : '₹0'}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-surface rounded-t-xl overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isHovered
                        ? 'bg-emerald-500 shadow-md scale-105'
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`mt-2.5 text-xs font-medium transition-colors ${
                    isHovered ? 'text-primary font-bold' : 'text-muted'
                  }`}
                >
                  {day.date.toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-muted">
        <span>Average order: {formatPrice(orders.length ? Math.round(totalSales7Days / (orders.length || 1)) : 0)}</span>
        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
          <TrendingUp size={13} /> Updated just now
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  usePageTitle('Admin Dashboard')
  const showToast = useToast()
  const productsRequest = useFetch(() => getProducts({ includeHidden: true }))
  const categoriesRequest = useFetch(() => getCategories({ includeHidden: true }))
  const ordersRequest = useFetch(getOrders)
  const customersRequest = useFetch(getCustomers)

  if (productsRequest.loading || categoriesRequest.loading || ordersRequest.loading || customersRequest.loading) {
    return <Loader page label="Loading store dashboard..." />
  }

  const products = productsRequest.data || []
  const categories = categoriesRequest.data || []
  const orders = ordersRequest.data || []
  const customers = customersRequest.data || []

  const revenue = orders
    .filter((order) => order.status !== 'Cancelled')
    .reduce((total, order) => total + order.totals.total, 0)

  const paidRevenue = orders
    .filter((order) => order.paymentStatus === 'Paid')
    .reduce((total, order) => total + order.totals.total, 0)

  const pendingCodRevenue = orders
    .filter((order) => order.paymentStatus === 'Pending' && order.status !== 'Cancelled')
    .reduce((total, order) => total + order.totals.total, 0)

  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5)
  const outOfStock = products.filter((product) => product.stock === 0)

  // Top selling products sorted by sold count
  const topProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4)

  return (
    <div className="space-y-6">
      {/* 1. Header & Welcome Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-line shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="!text-2xl font-bold text-heading">Store Dashboard</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Real-time sales, payment collections, order fulfillment &amp; Excel reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              exportOrdersToExcel(orders)
              showToast(`Downloaded Sales & Orders report (${orders.length} orders)!`)
            }}
            className="gap-1.5"
          >
            <Download size={15} /> Sales Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              exportPaymentsToExcel(orders)
              showToast(`Downloaded Payments Ledger (${orders.length} transactions)!`)
            }}
            className="gap-1.5"
          >
            <Download size={15} /> Payments Excel
          </Button>
          <Button to="/admin/products/new" variant="primary" size="sm" className="gap-1.5">
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={formatPrice(revenue)}
          trend="+18.4%"
          subtitle={`${orders.length} order${orders.length === 1 ? '' : 's'} placed`}
          tone="primary"
          to="/admin/transactions"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={orders.length}
          trend="+12%"
          subtitle="All active &amp; verified"
          tone="info"
          to="/admin/orders"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={products.length}
          subtitle={`${products.length - outOfStock.length} in stock`}
          tone="accent"
          to="/admin/products"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={customers.length}
          trend="+25%"
          subtitle="Registered &amp; guest"
          tone="warning"
          to="/admin/customers"
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={categories.length}
          subtitle="Grocery &amp; Spices"
          tone="purple"
          to="/admin/categories"
        />
      </div>

      {/* 2.5 Payment Collection & Fulfillment Pipeline Overview */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Payment Summary Card */}
        <div className="card p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Wallet size={18} />
              </span>
              <div>
                <h2 className="!text-base font-bold text-heading">Payment Settlement Overview</h2>
                <p className="text-xs text-muted">Online Gateway vs Cash on Delivery</p>
              </div>
            </div>
            <Link to="/admin/transactions" className="text-xs font-bold text-primary hover:underline">
              Open Ledger →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 size={14} /> Paid / Collected
              </span>
              <span className="mt-1 block font-heading text-xl font-bold text-emerald-950">
                {formatPrice(paidRevenue)}
              </span>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                <Clock size={14} /> Pending COD
              </span>
              <span className="mt-1 block font-heading text-xl font-bold text-amber-950">
                {formatPrice(pendingCodRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Fulfillment Pipeline Card */}
        <div className="card p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Truck size={18} />
              </span>
              <div>
                <h2 className="!text-base font-bold text-heading">Order Fulfillment Pipeline</h2>
                <p className="text-xs text-muted">Live breakdown by dispatch stage</p>
              </div>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">
              Manage Orders →
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {orderStatuses.map((st) => {
              const cnt = orders.filter((o) => o.status === st).length
              return (
                <Link
                  key={st}
                  to="/admin/orders"
                  className="rounded-xl border border-line bg-surface/60 p-2.5 text-center hover:border-primary hover:bg-primary-pale/30 transition"
                >
                  <span className="block font-heading text-lg font-bold text-heading">{cnt}</span>
                  <span className="block text-[10px] font-semibold text-muted truncate">{st}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Stock Warning Alert Banner (if any) */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm font-bold text-amber-900">
              Inventory Attention Needed
            </p>
            <p className="mt-0.5 text-xs text-amber-800">
              {outOfStock.length > 0 && (
                <span className="font-semibold">{outOfStock.length} product(s) out of stock. </span>
              )}
              {lowStock.length > 0 && (
                <span>{lowStock.length} running low: </span>
              )}
              <span className="font-medium text-amber-950">
                {[...outOfStock, ...lowStock].map((p) => p.name).join(', ')}
              </span>
            </p>
          </div>
          <Link
            to="/admin/products"
            className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Update Stock
          </Link>
        </div>
      )}

      {/* 4. Sales Chart & Recent Orders Grid */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Sales Chart (7 Cols) */}
        <div className="xl:col-span-7">
          <SalesChart orders={orders} />
        </div>

        {/* Quick Actions & Store Health (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          {/* Quick Operations card */}
          <div className="card p-5 sm:p-6">
            <h2 className="!text-lg font-bold text-heading mb-1">Quick Shortcuts</h2>
            <p className="text-xs text-muted mb-4">Direct shortcuts to frequent management tasks</p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/products/new"
                className="group flex flex-col gap-2 rounded-xl border border-line bg-surface/50 p-3.5 hover:border-primary hover:bg-primary-pale/40 transition-all"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                  <Plus size={18} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-heading group-hover:text-primary">
                    Add Product
                  </span>
                  <span className="block text-[11px] text-muted">New SKU / Stock</span>
                </div>
              </Link>

              <Link
                to="/admin/coupons"
                className="group flex flex-col gap-2 rounded-xl border border-line bg-surface/50 p-3.5 hover:border-primary hover:bg-primary-pale/40 transition-all"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <TicketPercent size={18} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-heading group-hover:text-primary">
                    Discount Coupons
                  </span>
                  <span className="block text-[11px] text-muted">Promos & Offers</span>
                </div>
              </Link>

              <Link
                to="/admin/hot-deals"
                className="group flex flex-col gap-2 rounded-xl border border-line bg-surface/50 p-3.5 hover:border-primary hover:bg-primary-pale/40 transition-all"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Flame size={18} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-heading group-hover:text-primary">
                    Deals & Highlights
                  </span>
                  <span className="block text-[11px] text-muted">Featured items</span>
                </div>
              </Link>

              <Link
                to="/admin/banners"
                className="group flex flex-col gap-2 rounded-xl border border-line bg-surface/50 p-3.5 hover:border-primary hover:bg-primary-pale/40 transition-all"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Truck size={18} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-heading group-hover:text-primary">
                    Delivery Rules
                  </span>
                  <span className="block text-[11px] text-muted">Free delivery cap</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="card p-5 sm:p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="!text-lg font-bold text-heading">Top Performing Items</h2>
                <p className="text-xs text-muted">Highest units ordered this month</p>
              </div>
              <Link to="/admin/products" className="text-xs font-semibold text-primary hover:underline">
                View catalog →
              </Link>
            </div>

            <div className="space-y-3">
              {topProducts.map((product) => {
                const pack = getDefaultPack(product)
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AssetImage
                        src={product.images[0]}
                        alt={product.name}
                        compact
                        className="size-10 rounded-lg shrink-0 object-cover border border-line"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/admin/products`}
                          className="block text-xs font-semibold text-heading truncate hover:text-primary"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-muted">{pack.label}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-xs font-bold text-heading">
                        {formatPrice(pack.salePrice)}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {product.sold || 0} sold
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Table (Clean & Fits Perfectly) */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
          <div>
            <h2 className="!text-lg font-bold text-heading">Recent Store Orders</h2>
            <p className="text-xs text-muted">Latest purchases placed by customers</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>View All Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-line/60">
          {orders.slice(0, 5).map((order) => {
            const customerInitials = order.customer.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()

            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-surface/50 rounded-xl px-2 transition-colors"
              >
                {/* Order & Customer */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-pale text-primary font-bold text-xs">
                    {customerInitials}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="font-bold text-xs text-heading hover:text-primary transition-colors"
                    >
                      {order.id}
                    </Link>
                    <p className="text-xs text-muted truncate">
                      {order.customer.name} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                {/* Date & Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                  <span className="text-muted hidden md:inline">{formatDate(order.createdAt)}</span>
                  <Badge variant={paymentStatusVariant[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                  <Badge variant={orderStatusVariant[order.status]}>
                    {order.status}
                  </Badge>
                  <span className="font-heading font-bold text-sm text-heading min-w-16 text-right">
                    {formatPrice(order.totals.total)}
                  </span>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface transition-colors"
                    title="View order details"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
