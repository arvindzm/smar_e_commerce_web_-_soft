import { useEffect, useMemo, useState } from 'react'
import { CartContext } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { getDefaultPack } from '../utils/product'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const ITEMS_KEY = 'grocery_v1_cart'
const COUPON_KEY = 'grocery_v1_coupon'

// Cart items are stored as { productId, packLabel, quantity }.
// Names and prices are always read from the product itself, so they stay up to date.
// Phase 2: for logged-in customers this state will sync with the cart API.
export function CartProvider({ children }) {
  const showToast = useToast()
  const [items, setItems] = useState(() => loadFromStorage(ITEMS_KEY, []))
  const [coupon, setCoupon] = useState(() => loadFromStorage(COUPON_KEY, null))

  useEffect(() => saveToStorage(ITEMS_KEY, items), [items])
  useEffect(() => saveToStorage(COUPON_KEY, coupon), [coupon])

  const value = useMemo(() => {
    const isSame = (item, productId, packLabel) => item.productId === productId && item.packLabel === packLabel

    function addToCart(product, packLabel = getDefaultPack(product).label, quantity = 1) {
      if (product.stock <= 0) {
        showToast(`${product.name} is out of stock`, 'error')
        return
      }
      setItems((current) => {
        const existing = current.find((item) => isSame(item, product.id, packLabel))
        if (!existing) return [...current, { productId: product.id, packLabel, quantity: Math.min(quantity, product.stock) }]
        return current.map((item) =>
          isSame(item, product.id, packLabel)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        )
      })
      showToast(`${product.name} (${packLabel}) added to cart`, 'success', {
        label: 'Checkout →',
        to: '/checkout',
      })
    }

    function updateQuantity(productId, packLabel, quantity) {
      setItems((current) =>
        current.map((item) => (isSame(item, productId, packLabel) ? { ...item, quantity: Math.max(1, quantity) } : item)),
      )
    }

    function removeFromCart(productId, packLabel) {
      setItems((current) => current.filter((item) => !isSame(item, productId, packLabel)))
    }

    function clearCart() {
      setItems([])
      setCoupon(null)
    }

    const count = items.reduce((total, item) => total + item.quantity, 0)

    return { items, count, coupon, setCoupon, addToCart, updateQuantity, removeFromCart, clearCart }
  }, [items, coupon, showToast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
