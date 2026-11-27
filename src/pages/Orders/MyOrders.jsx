import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getOrders } from '../../services/orderService'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate, orderStatusVariant, paymentStatusVariant } from '../../utils/orderStatus'

export default function MyOrders() {
  usePageTitle('My Orders')
  const { data: orders, loading } = useFetch(getOrders)

  if (loading) return <Loader label="Loading your orders..." />

  if (orders.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon={Package}
          title="No orders yet"
          text="Once you place an order it will appear here."
          action={<Button to="/shop">Start shopping</Button>}
        />
      </div>
    )
  }

  return (
    <div>
      <h1 className="!text-2xl">My Orders</h1>
      <ul className="mt-5 space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-heading">
                  <Link to={`/account/orders/${order.id}`} className="hover:text-primary">
                    {order.id}
                  </Link>
                </p>
                <p className="text-xs">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={orderStatusVariant[order.status]}>{order.status}</Badge>
                <Badge variant={paymentStatusVariant[order.paymentStatus]}>Payment: {order.paymentStatus}</Badge>
              </div>
            </div>

            <p className="mt-3 text-sm">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'} ·{' '}
              <span className="text-heading">{order.items.map((item) => item.name).join(', ')}</span>
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="font-heading text-lg font-bold text-heading">{formatPrice(order.totals.total)}</p>
              <Button to={`/account/orders/${order.id}`} variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
