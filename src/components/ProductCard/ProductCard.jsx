import { Link } from 'react-router-dom'
import { getDefaultPack } from '../../utils/product'
import AssetImage from '../common/AssetImage'
import Price from '../common/Price'
import AddToCartButton from './AddToCartButton'
import ProductBadge from './ProductBadge'
import WishlistButton from './WishlistButton'

// Clean, compact modern grocery product card without bloated reviews
export default function ProductCard({ product }) {
  const pack = getDefaultPack(product)
  const link = `/product/${product.slug}`

  return (
    <article className="card group relative flex h-full flex-col p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card sm:p-3">
      <ProductBadge product={product} />
      <WishlistButton product={product} className="absolute right-2.5 top-2.5 z-10" />

      <Link
        to={link}
        className="relative block aspect-square w-full overflow-hidden rounded-lg bg-[#f2fdf6] p-2"
        tabIndex={-1}
        aria-hidden="true"
      >
        <AssetImage
          src={product.images[0]}
          alt={product.name}
          className="size-full rounded-md object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="mt-2.5 flex items-center justify-end text-xs text-muted">
        <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-heading">
          {pack.label}
        </span>
      </div>

      <h3 className="mt-1 !text-sm font-semibold leading-snug">
        <Link to={link} className="line-clamp-2 transition-colors hover:text-primary">
          {product.name}
        </Link>
      </h3>

      <div className="mt-auto pt-2.5">
        <div className="mb-2">
          <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} />
        </div>
        <AddToCartButton product={product} size="sm" />
      </div>
    </article>
  )
}
