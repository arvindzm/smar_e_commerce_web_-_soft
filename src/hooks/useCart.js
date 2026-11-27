import { createContext, useContext } from 'react'

// Filled in by CartProvider (context/CartContext.jsx).
export const CartContext = createContext(null)

// const { items, count, coupon, setCoupon, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
export function useCart() {
  return useContext(CartContext)
}
