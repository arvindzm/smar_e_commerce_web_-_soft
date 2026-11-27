import { createContext, useContext } from 'react'

// Filled in by WishlistProvider (context/WishlistContext.jsx).
export const WishlistContext = createContext(null)

// const { ids, isWishlisted, toggleWishlist } = useWishlist()
export function useWishlist() {
  return useContext(WishlistContext)
}
