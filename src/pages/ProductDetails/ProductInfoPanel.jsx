import { BadgeCheck, CreditCard, RotateCcw, Store, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { useFetch } from '../../hooks/useFetch'
import { getDeliverySettings } from '../../services/bannerService'
import { formatPrice } from '../../utils/formatPrice'

// Tinted side panel with delivery, returns, payment and quality notes.
export default function ProductInfoPanel() {
  const { data: deliverySettings } = useFetch(getDeliverySettings)
  const freeAbove =
    deliverySettings?.freeDeliveryAbove !== undefined
      ? Number(deliverySettings.freeDeliveryAbove)
      : site.freeDeliveryAbove

  const points = [
    { icon: Truck, title: 'Fast Delivery', text: `Free delivery on orders above ${formatPrice(freeAbove)}.` },
    { icon: RotateCcw, title: 'Easy Returns', text: 'See our return and refund policy for details.' },
    { icon: CreditCard, title: 'Payment', text: `${site.paymentMethods.join(', ')}.` },
    { icon: BadgeCheck, title: 'Quality Assured', text: 'Cleaned, sorted and freshly packed.' },
  ]
  return (
    <aside className="overflow-hidden rounded-2xl border border-line bg-primary-pale" aria-label="Purchase information">
      <div className="flex items-center justify-between gap-3 bg-primary px-5 py-4 text-white">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Store size={18} aria-hidden="true" /> Sold by {site.name}
        </span>
        <Link to="/shop" className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-heading hover:bg-primary-light">
          View Store
        </Link>
      </div>
      <ul className="divide-y divide-line">
        {points.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 px-5 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-sm font-bold text-heading">{title}</span>
              <span className="block text-sm">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
