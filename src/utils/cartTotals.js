import { site } from '../data/site'

// Works out the money summary for the cart and checkout.
// lines: [{ pack, quantity }], coupon, deliverySettings, taxSettings
export function computeTotals(lines, coupon, deliverySettings, taxSettings) {
  const freeAbove =
    deliverySettings?.freeDeliveryAbove !== undefined
      ? Number(deliverySettings.freeDeliveryAbove)
      : (site.freeDeliveryAbove || 700)
  const charge =
    deliverySettings?.deliveryCharge !== undefined
      ? Number(deliverySettings.deliveryCharge)
      : (site.deliveryCharge || 40)
  const freeEnabled = deliverySettings?.enabled !== false

  const subtotal = lines.reduce((sum, line) => sum + line.pack.salePrice * line.quantity, 0)
  let discount = 0

  if (coupon && subtotal > 0) {
    const minOrder = Number(coupon.minOrder) || 0
    if (subtotal >= minOrder) {
      if (coupon.discountType === 'fixed' || (coupon.amountOff && !coupon.percentOff)) {
        const flat = Number(coupon.discountValue) || Number(coupon.amountOff) || 0
        discount = Math.min(subtotal, flat)
      } else {
        const pct = Number(coupon.discountValue) || Number(coupon.percentOff) || 0
        discount = Math.round((subtotal * pct) / 100)
        if (coupon.maxDiscount && Number(coupon.maxDiscount) > 0) {
          discount = Math.min(discount, Number(coupon.maxDiscount))
        }
      }
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount)
  const isFree = subtotal === 0 || (freeEnabled && afterDiscount >= freeAbove)
  const delivery = isFree ? 0 : charge

  // GST / Tax Calculation (configurable from Admin)
  const taxEnabled = taxSettings?.enabled !== false
  const gstRate = taxEnabled ? (Number(taxSettings?.gstRate) || 5) : 0
  const taxName = taxSettings?.taxName || 'GST'
  const tax = (taxEnabled && gstRate > 0 && afterDiscount > 0)
    ? Math.round((afterDiscount * gstRate) / 100)
    : 0

  const total = afterDiscount + delivery + tax

  return {
    subtotal,
    discount,
    delivery,
    tax,
    gstRate,
    taxName,
    gstNumber: taxSettings?.gstNumber || '',
    total,
  }
}
