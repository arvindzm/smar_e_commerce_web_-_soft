import api, { emitDbUpdate } from './api'

export const defaultCoupons = [
  {
    id: 'cpn_fresh20',
    code: 'FRESH20',
    title: 'Super discount for your first purchase',
    text: 'Use this code to get 20% off on your first purchase',
    discountType: 'percentage',
    discountValue: 20,
    percentOff: 20,
    amountOff: 0,
    minOrder: 0,
    maxDiscount: 0,
    active: true,
    featuredOnBanner: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cpn_flat100',
    code: 'FLAT100',
    title: 'Flat ₹100 Off on Orders',
    text: 'Save ₹100 instantly on orders above ₹499',
    discountType: 'fixed',
    discountValue: 100,
    percentOff: 0,
    amountOff: 100,
    minOrder: 499,
    maxDiscount: 0,
    active: true,
    featuredOnBanner: false,
    createdAt: new Date().toISOString(),
  },
]

export async function getCoupons() {
  const { data } = await api.get('/coupons')
  return data
}

export async function getFeaturedBannerCoupon() {
  const { data } = await api.get('/coupons/featured-banner')
  return data
}

export async function createCoupon(payload) {
  try {
    const { data } = await api.post('/coupons', payload)
    emitDbUpdate('coupons', data)
    return data
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error)
    }
    throw err
  }
}

export async function updateCoupon(id, updates) {
  const { data } = await api.put(`/coupons/${encodeURIComponent(id)}`, updates)
  emitDbUpdate('coupons', data)
  return data
}

export async function deleteCoupon(id) {
  await api.delete(`/coupons/${encodeURIComponent(id)}`)
  emitDbUpdate('coupons', id)
  return true
}

export async function validateCoupon(code, subtotal = 0) {
  const cleanCode = (code || '').trim().toUpperCase()
  if (!cleanCode) return null
  const { data } = await api.post('/coupons/validate', { code: cleanCode, subtotal })
  return data
}
