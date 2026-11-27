const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// formatPrice(1250) -> "₹1,250"
export function formatPrice(amount) {
  return rupees.format(amount)
}

// discountPercent(100, 80) -> 20
export function discountPercent(regularPrice, salePrice) {
  if (!regularPrice || !salePrice || salePrice >= regularPrice) return 0
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100)
}
