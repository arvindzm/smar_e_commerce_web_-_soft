// Order and payment status labels with their badge colours.
export const orderStatuses = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

export const orderStatusVariant = {
  Processing: 'warning',
  Packed: 'neutral',
  Shipped: 'best',
  Delivered: 'success',
  Cancelled: 'danger',
}

export const paymentStatusVariant = {
  Pending: 'warning',
  Paid: 'success',
  Refunded: 'neutral',
  Failed: 'danger',
}

export const paymentLabels = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Credit / Debit Card',
  netbanking: 'Net Banking',
}

// 14 Nov 2026
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
