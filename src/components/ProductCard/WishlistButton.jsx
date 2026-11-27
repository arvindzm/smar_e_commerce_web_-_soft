import { Heart } from 'lucide-react'
import { useWishlist } from '../../hooks/useWishlist'

export default function WishlistButton({ product, className = '' }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const active = isWishlisted(product.id)

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(product)}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-full shadow-sm transition-colors ${
        active ? 'bg-danger text-white' : 'bg-white text-heading hover:bg-danger hover:text-white'
      } ${className}`}
    >
      <Heart size={16} className={active ? 'fill-current' : ''} />
    </button>
  )
}
