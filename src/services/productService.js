import api, { emitDbUpdate } from './api'

export async function getProducts({ includeHidden = false } = {}) {
  const { data } = await api.get('/products', { params: { includeHidden } })
  return data
}

export async function getProductBySlug(slug) {
  try {
    const { data } = await api.get(`/products/slug/${encodeURIComponent(slug)}`)
    return data
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}

export async function getProductById(id) {
  try {
    const { data } = await api.get(`/products/${encodeURIComponent(id)}`)
    return data
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  emitDbUpdate('products', data)
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${encodeURIComponent(id)}`, payload)
  emitDbUpdate('products', data)
  return data
}

export async function deleteProduct(id) {
  await api.delete(`/products/${encodeURIComponent(id)}`)
  emitDbUpdate('products', id)
  return true
}
