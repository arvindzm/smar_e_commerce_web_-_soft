import { Copy } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

// Dashed strip with a coupon code that copies to the clipboard when clicked.
export default function CouponStrip({ coupon }) {
  const showToast = useToast()
  if (!coupon || coupon.active === false) return null

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(coupon.code)
      showToast(`Coupon code ${coupon.code} copied`)
    } catch {
      showToast('Could not copy the code. Please copy it manually.', 'error')
    }
  }

  const titleText = coupon.title || 'Super discount for your first purchase'

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-primary bg-primary-pale px-6 py-5 text-center lg:flex-row lg:px-12 lg:text-left">
      <p className="font-heading text-lg font-bold text-primary sm:text-xl">
        {titleText}
      </p>
      <button
        type="button"
        onClick={copyCode}
        className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold tracking-wider text-white transition-colors hover:bg-primary-dark cursor-pointer shadow-xs"
        aria-label={`Copy coupon code ${coupon.code}`}
      >
        {coupon.code} <Copy size={15} aria-hidden="true" />
      </button>
      <p className="text-sm text-heading">{coupon.text}</p>
    </div>
  )
}
