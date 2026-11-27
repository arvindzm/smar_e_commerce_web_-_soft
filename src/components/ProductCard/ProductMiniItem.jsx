import { Link } from 'react-router-dom'
import { getDefaultPack } from '../../utils/product'
import AssetImage from '../common/AssetImage'
import Price from '../common/Price'
import Rating from '../common/Rating'

// Compact row: small image, rating, name and price (Featured / Top Selling lists).
export default function ProductMiniItem({ product }) {
  const pack = getDefaultPack(product)

  return (
    <Link to={`/product/${product.slug}`} className="group flex items-center gap-3">
      <AssetImage src={product.images[0]} alt={product.name} compact className="size-16 shrink-0 rounded-lg bg-surface" imgClassName="object-cover size-16 rounded-lg" />
      <div className="min-w-0">
        <Rating value={product.rating} count={product.reviewCount} />
        <p className="mt-0.5 truncate font-heading text-sm font-bold text-heading transition-colors group-hover:text-primary">
          {product.name} <span className="font-body text-xs font-normal text-muted">{pack.label}</span>
        </p>
        <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} />
      </div>
    </Link>
  )
}
