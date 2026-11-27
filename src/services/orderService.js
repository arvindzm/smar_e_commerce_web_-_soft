import api, { emitDbUpdate } from './api'

export async function getOrders() {
  const { data } = await api.get('/orders')
  return data
}

export async function getOrderById(id) {
  try {
    const { data } = await api.get(`/orders/${encodeURIComponent(id)}`)
    return data
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}

export async function trackOrders(query) {
  const clean = (query || '').trim()
  if (!clean) return []
  const { data } = await api.get('/orders/track', { params: { q: clean } })
  return data
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  emitDbUpdate('orders', data)
  emitDbUpdate('products', null)
  return data
}

export async function updateOrder(id, changes) {
  const { data } = await api.patch(`/orders/${encodeURIComponent(id)}`, changes)
  emitDbUpdate('orders', data)
  return data
}
