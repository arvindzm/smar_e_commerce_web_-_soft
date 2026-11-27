import { discountPercent } from '../../utils/formatPrice'
import { getDefaultPack } from '../../utils/product'
import Badge from '../common/Badge'

// Corner tag: Only shown when an offer or badge is explicitly configured from Admin.
// Removed automatic/hardcoded "Best Sale" patch as per user request.
export default function ProductBadge({ product }) {
  if (!product) return null
  const pack = getDefaultPack(product)
  const discount = discountPercent(pack?.regularPrice, pack?.salePrice)

  // 1. Custom offer badge from admin
  if (product.customBadge && product.badge === 'custom') {
    return <Badge variant="sale" corner>{product.customBadge}</Badge>
  }

  // 2. Specific badges configured from Admin
  if (product.badge === 'offer') {
    return <Badge variant="sale" corner>Special Offer</Badge>
  }
  if (product.badge === 'deal') {
    return <Badge variant="sale" corner>Hot Deal</Badge>
  }
  if (product.badge === 'sale') {
    return <Badge variant="sale" corner>{discount > 0 ? `Sale ${discount}%` : 'Sale'}</Badge>
  }
  if (product.badge === 'new') {
    return <Badge variant="new" corner>New</Badge>
  }

  // If no offer is selected in Admin or badge is 'best'/empty, do not display patch
  return null
}

