import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'
import { isInStock } from '../../utils/product'
import Button from '../common/Button'

export default function AddToCartButton({
  product,
  packLabel,
  quantity = 1,
  variant = 'primary',
  size = 'sm',
  className,
  redirectToCheckout = false,
  label = 'Add To Cart',
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const showToast = useToast()
  const available = isInStock(product)

  const handleClick = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!available) return

    addToCart(product, packLabel, quantity)
    if (redirectToCheckout) {
      if (!user) {
        showToast('Please login or register first to purchase products.', 'info')
        navigate('/login', {
          state: {
            from: '/checkout',
            message: 'Please login or create an account first to purchase products.',
          },
        })
        return
      }
      navigate('/checkout')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth
      disabled={!available}
      className={className}
      onClick={handleClick}
    >
      {available ? (
        <>
          {label} <ShoppingCart size={15} aria-hidden="true" />
        </>
      ) : (
        'Out of Stock'
      )}
    </Button>
  )
}
