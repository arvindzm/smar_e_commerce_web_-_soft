import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import AssetImage from '../common/AssetImage'
import { tones } from './tones'

// Promo banner card: title, subtitle / price, Order Now button and product image.
export default function PromoBanner({ banner }) {
  const isDark = banner.tone === 'teal' || banner.tone === 'green'

  return (
    <Link
      to={banner.link || '/shop'}
      className={`group relative flex h-full items-center justify-between gap-3 overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
        tones[banner.tone] || tones.blue
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-base font-bold leading-tight sm:text-lg">
          {banner.title}
        </h3>
        {banner.subtitle ? (
          <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-white/85' : 'text-body'}`}>
            {banner.subtitle}
          </p>
        ) : banner.startingAt ? (
          <p className={`mt-1 text-xs italic ${isDark ? 'text-white/85' : 'text-heading'}`}>
            Starting at <span className="font-heading text-sm font-bold not-italic">{formatPrice(banner.startingAt)}</span>
          </p>
        ) : null}
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
            isDark
              ? 'bg-white text-heading group-hover:bg-primary-light'
              : 'bg-heading text-white group-hover:bg-primary'
          }`}
        >
          Shop Now <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>

      <div className="relative size-20 shrink-0 sm:size-24">
        <AssetImage
          src={banner.image}
          alt={banner.title}
          className="size-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-105"
          imgClassName="size-full object-contain"
        />
      </div>
    </Link>
  )
}
