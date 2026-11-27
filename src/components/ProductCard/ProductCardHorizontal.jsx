import { Link } from 'react-router-dom'
import { getDefaultPack } from '../../utils/product'
import AssetImage from '../common/AssetImage'
import Price from '../common/Price'
import ProgressBar from '../common/ProgressBar'
import Rating from '../common/Rating'
import AddToCartButton from './AddToCartButton'
import ProductBadge from './ProductBadge'

// Wide card with the image on the left (Daily Best Sells).
export default function ProductCardHorizontal({ product }) {
  const pack = getDefaultPack(product)
  const link = `/product/${product.slug}`
  const total = product.sold + product.stock

  return (
    <article className="card group relative flex h-full gap-3 p-3 transition-all duration-300 hover:border-primary hover:shadow-card sm:gap-5 sm:p-4">
      <ProductBadge product={product} />
      <Link to={link} className="relative block w-2/5 shrink-0 self-center overflow-hidden rounded-xl bg-surface" tabIndex={-1} aria-hidden="true">
        <AssetImage
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} />
        <div className="mt-1">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <h3 className="mt-2 !text-sm sm:!text-base">
          <Link to={link} className="line-clamp-2 transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="truncate text-xs text-muted">
          {pack.label}
        </p>
        <ProgressBar value={product.sold} max={total} label={`Sold: ${product.sold}/${total}`} className="mt-2.5" />
        <div className="mt-auto pt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  )
}
