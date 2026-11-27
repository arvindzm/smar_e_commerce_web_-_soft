import { Copy, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { useFetch } from '../../hooks/useFetch'
import { useToast } from '../../hooks/useToast'
import { getDeliverySettings } from '../../services/bannerService'
import { getFeaturedBannerCoupon } from '../../services/couponService'
import { formatPrice } from '../../utils/formatPrice'

export default function TopBar() {
  const showToast = useToast()
  const couponRequest = useFetch(getFeaturedBannerCoupon)
  const deliveryRequest = useFetch(getDeliverySettings)

  const coupon = couponRequest.data || { code: 'FRESH20', percentOff: 20 }
  const deliverySettings = deliveryRequest.data
  const freeAbove =
    deliverySettings?.freeDeliveryAbove !== undefined
      ? Number(deliverySettings.freeDeliveryAbove)
      : site.freeDeliveryAbove
  const isFreeDeliveryEnabled = deliverySettings?.enabled !== false

  const discountText =
    coupon.discountType === 'fixed'
      ? `Flat ${formatPrice(coupon.discountValue || coupon.amountOff)} OFF`
      : `${coupon.discountValue || coupon.percentOff || 20}% OFF`

  async function copyCoupon() {
    try {
      await navigator.clipboard.writeText(coupon.code)
      showToast(`Coupon ${coupon.code} copied to clipboard!`)
    } catch {
      showToast(`Use coupon ${coupon.code} at checkout`)
    }
  }

  return (
    <div className="bg-primary text-xs text-white sm:text-[13px] border-b border-primary-dark/20">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        {/* Left: Free delivery pill */}
        {isFreeDeliveryEnabled ? (
          <p className="hidden items-center gap-2 lg:flex font-medium">
            <Truck size={15} aria-hidden="true" />
            <span>Free delivery on orders above {formatPrice(freeAbove)}</span>
          </p>
        ) : (
          <div className="hidden lg:block"></div>
        )}

        {/* Center: Interactive Coupon Promo Pill */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles size={14} className="hidden sm:inline text-emerald-200" />
          <span className="font-medium">
            Special Offer: Get <strong>{discountText}</strong> on your first order!
          </span>
          <button
            type="button"
            onClick={copyCoupon}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 px-2.5 py-0.5 text-xs font-bold tracking-wider text-white transition-all cursor-pointer shadow-2xs border border-white/20"
            title="Click to copy coupon code"
          >
            <span>{coupon.code}</span>
            <Copy size={11} aria-hidden="true" />
          </button>
        </div>

        {/* Right: Quick Links */}
        <ul className="hidden items-center gap-4 lg:flex text-xs">
          <li>
            <Link to="/track-order" className="hover:underline opacity-90 hover:opacity-100">
              Order Tracking
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline opacity-90 hover:opacity-100">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:underline opacity-90 hover:opacity-100">
              Help
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
