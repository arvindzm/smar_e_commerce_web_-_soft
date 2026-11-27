import { Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { site } from '../../../data/site'
import { useFetch } from '../../../hooks/useFetch'
import { getDeliverySettings } from '../../../services/bannerService'
import { formatPrice } from '../../../utils/formatPrice'

// Row of service promises.
export default function FeaturesSection() {
  const { data: deliverySettings } = useFetch(getDeliverySettings)
  const freeAbove =
    deliverySettings?.freeDeliveryAbove !== undefined
      ? Number(deliverySettings.freeDeliveryAbove)
      : site.freeDeliveryAbove

  const features = [
    { icon: Truck, title: 'Express Delivery', text: `Free on orders above ${formatPrice(freeAbove)}` },
    { icon: ShieldCheck, title: '100% Shuddh & Fresh', text: 'Chakki-milled, 0% chemicals or adulteration' },
    { icon: RotateCcw, title: 'Purity Guarantee', text: 'Quality checked or instant replacement' },
    { icon: Headset, title: 'WhatsApp & Call Help', text: 'Quick ordering assistance on chat' },
  ]
  return (
    <section className="container-page pt-8 sm:pt-10 pb-2" aria-label="Why shop with us">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {features.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-primary-pale p-4 text-center transition-colors duration-300 hover:bg-primary-light sm:flex-row sm:p-5 sm:text-left"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:scale-110">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-sm font-bold text-heading sm:text-base">{title}</span>
              <span className="block text-xs sm:text-sm">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
