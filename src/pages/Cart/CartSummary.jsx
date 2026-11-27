import { Tag, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import { site } from '../../data/site'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useFetch } from '../../hooks/useFetch'
import { useToast } from '../../hooks/useToast'
import { getDeliverySettings } from '../../services/bannerService'
import { validateCoupon } from '../../services/cartService'
import { formatPrice } from '../../utils/formatPrice'

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'text-base font-semibold text-heading' : 'text-sm'}`}>
      <span className={strong ? '' : 'text-heading'}>{label}</span>
      <span className={strong ? '' : 'font-medium text-heading'}>{value}</span>
    </div>
  )
}

// Price summary card, with the coupon box and the checkout button.
export default function CartSummary({ totals, showCheckoutButton = true, showCouponForm = true }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { coupon, setCoupon } = useCart()
  const { data: deliverySettings } = useFetch(getDeliverySettings)
  const showToast = useToast()
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)

  function handleCheckoutClick() {
    if (!user) {
      showToast('Please login or register first to purchase products.', 'info')
      navigate('/login', {
        state: {
          from: '/checkout',
          message: 'Please login or create an account first to purchase products.',
        },
      })
      return
    }
    navigate('/checkout')
  }

  async function applyCoupon(event) {
    event.preventDefault()
    if (!code.trim()) return
    setChecking(true)
    const match = await validateCoupon(code, totals.subtotal)
    setChecking(false)
    if (match && !match.error) {
      setCoupon(match)
      setCode('')
      showToast(`Coupon ${match.code} applied`)
    } else if (match?.error) {
      showToast(match.error, 'error')
    } else {
      showToast('That coupon code is not valid', 'error')
    }
  }

  const freeAbove = deliverySettings?.freeDeliveryAbove !== undefined ? Number(deliverySettings.freeDeliveryAbove) : site.freeDeliveryAbove
  const isFreeDeliveryEnabled = deliverySettings?.enabled !== false
  const amountToFreeDelivery = freeAbove - (totals.subtotal - totals.discount)

  const discountLabel =
    coupon?.discountType === 'fixed'
      ? `${formatPrice(coupon.discountValue || coupon.amountOff)} off`
      : `${coupon?.discountValue || coupon?.percentOff}% off`

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="!text-xl">Cart Totals</h2>

      {showCouponForm && (
        <div className="mt-5">
          {coupon ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-accent-light px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-accent-dark">
                <Tag size={15} aria-hidden="true" /> {coupon.code} ({discountLabel})
              </span>
              <button type="button" onClick={() => setCoupon(null)} className="text-accent-dark hover:text-danger" aria-label="Remove coupon">
                <X size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="min-w-0 flex-1 rounded-lg border border-line px-4 py-2.5 text-sm uppercase text-heading placeholder:normal-case placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <Button type="submit" variant="primary" loading={checking}>
                Apply
              </Button>
            </form>
          )}
        </div>
      )}

      <div className="mt-5 space-y-3 border-t border-line pt-5">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && <Row label="Discount" value={`- ${formatPrice(totals.discount)}`} />}
        <Row label="Delivery" value={totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)} />
        {totals.tax > 0 && (
          <Row
            label={`${totals.taxName || 'GST'} (${totals.gstRate}%)`}
            value={formatPrice(totals.tax)}
          />
        )}
      </div>

      {isFreeDeliveryEnabled && totals.delivery > 0 && amountToFreeDelivery > 0 && (
        <p className="mt-3 rounded-lg bg-primary-pale px-3 py-2 text-xs text-heading">
          Add {formatPrice(amountToFreeDelivery)} more for free delivery.
        </p>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <Row label="Total" value={formatPrice(totals.total)} strong />
      </div>

      {showCheckoutButton && (
        <div className="mt-6">
          <Button type="button" onClick={handleCheckoutClick} fullWidth size="lg">
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </Button>
          {!user && (
            <p className="mt-2.5 text-center text-xs text-muted">
              Login or free account registration is required before placing an order.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
