import { getDeliverySettings } from '../services/bannerService'
import { getHotDealSettings, getWeeklyDealSettings } from '../services/dealService'
import { getProducts } from '../services/productService'
import { getTaxSettings } from '../services/taxService'
import { computeTotals } from '../utils/cartTotals'
import { getDefaultPack, getPack } from '../utils/product'
import { useCart } from './useCart'
import { useFetch } from './useFetch'

// Joins the cart items with their product details.
// Returns { lines, totals, loading }, where each line is { product, pack, quantity, lineTotal }.
export function useCartLines() {
  const { items, coupon } = useCart()
  const { data: products, loading: productsLoading } = useFetch(getProducts)
  const { data: dealSettings, loading: dealLoading } = useFetch(getHotDealSettings)
  const { data: weeklySettings } = useFetch(getWeeklyDealSettings)
  const { data: deliverySettings } = useFetch(getDeliverySettings)
  const { data: taxSettings } = useFetch(getTaxSettings)

  const lines = (products ? items : [])
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      if (!product) return null // The product was removed from the store.
      let pack = getPack(product, item.packLabel)

      // Apply hot deal offer price if active on this product
      if (dealSettings?.enabled !== false && dealSettings?.dealPrices?.[item.productId]) {
        const defaultPack = getDefaultPack(product)
        if (item.packLabel === defaultPack.label) {
          const cfg = dealSettings.dealPrices[item.productId]
          const offer = typeof cfg === 'object' ? Number(cfg.offerPrice) : Number(cfg)
          if (offer > 0) {
            pack = { ...pack, salePrice: offer }
          }
        }
      }

      // Apply weekly deal offer price if active on this product
      if (weeklySettings?.enabled !== false && weeklySettings?.productId === item.productId && weeklySettings?.offerPrice) {
        const defaultPack = getDefaultPack(product)
        if (item.packLabel === defaultPack.label) {
          const offer = Number(weeklySettings.offerPrice)
          if (offer > 0) {
            pack = { ...pack, salePrice: offer }
          }
        }
      }

      return { product, pack, quantity: item.quantity, lineTotal: pack.salePrice * item.quantity }
    })
    .filter(Boolean)

  return { lines, totals: computeTotals(lines, coupon, deliverySettings, taxSettings), loading: productsLoading || dealLoading }
}
