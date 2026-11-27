import { CircleX, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import Price from '../../components/common/Price'
import Rating from '../../components/common/Rating'
import AddToCartButton from '../../components/ProductCard/AddToCartButton'
import StockStatus from '../../components/ProductCard/StockStatus'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useWishlist } from '../../hooks/useWishlist'
import { getProducts } from '../../services/productService'
import { getDefaultPack } from '../../utils/product'

export default function Wishlist() {
  usePageTitle('My Wishlist')
  const { ids, toggleWishlist } = useWishlist()
  const { data: products, loading } = useFetch(getProducts)

  if (loading) return <Loader page label="Loading your wishlist..." />

  const items = ids.map((id) => products.find((product) => product.id === id)).filter(Boolean)

  return (
    <>
      <Breadcrumb title="My Wishlist" items={[{ label: 'Wishlist' }]} />

      <div className="container-page pt-8 lg:pt-12">
        {items.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              text="Tap the heart on any product to save it for later."
              action={<Button to="/shop">Browse products</Button>}
            />
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((product) => {
              const pack = getDefaultPack(product)
              return (
                <li key={product.id} className="card flex flex-wrap items-center gap-4 p-4 sm:gap-6 sm:p-5">
                  <Link to={`/product/${product.slug}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
                    <AssetImage src={product.images[0]} alt="" compact className="size-20 rounded-xl sm:size-24" />
                  </Link>

                  <div className="min-w-32 flex-1">
                    <p className="font-heading text-sm font-bold text-heading sm:text-base">
                      <Link to={`/product/${product.slug}`} className="hover:text-primary">
                        {product.name}
                      </Link>
                    </p>
                    <p className="text-xs text-muted">
                      {pack.label}
                    </p>
                    <div className="mt-1">
                      <Rating value={product.rating} count={product.reviewCount} />
                    </div>
                  </div>

                  <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} className="w-24" />
                  <div className="w-24">
                    <StockStatus stock={product.stock} />
                  </div>

                  <div className="w-full sm:w-40">
                    <AddToCartButton product={product} variant="primary" size="md" />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="flex items-center gap-1.5 text-sm text-body transition-colors hover:text-danger"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <CircleX size={18} aria-hidden="true" /> <span className="sm:hidden">Remove</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
