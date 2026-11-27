import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../hooks/useToast'
import { WishlistContext } from '../hooks/useWishlist'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const STORAGE_KEY = 'grocery_v1_wishlist'

// The wishlist is a list of product ids.
export function WishlistProvider({ children }) {
  const showToast = useToast()
  const [ids, setIds] = useState(() => loadFromStorage(STORAGE_KEY, []))

  useEffect(() => saveToStorage(STORAGE_KEY, ids), [ids])

  const value = useMemo(() => {
    const isWishlisted = (productId) => ids.includes(productId)

    function toggleWishlist(product) {
      if (isWishlisted(product.id)) {
        setIds((current) => current.filter((id) => id !== product.id))
        showToast(`${product.name} removed from wishlist`)
      } else {
        setIds((current) => [...current, product.id])
        showToast(`${product.name} added to wishlist`)
      }
    }

    return { ids, isWishlisted, toggleWishlist }
  }, [ids, showToast])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
