import api, { emitDbUpdate } from './api'

export async function getCategories({ includeHidden = false } = {}) {
  const { data } = await api.get('/categories', { params: { includeHidden } })
  return data
}

export async function createCategory(payload) {
  const { data } = await api.post('/categories', payload)
  emitDbUpdate('categories', data)
  return data
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${encodeURIComponent(id)}`, payload)
  emitDbUpdate('categories', data)
  return data
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${encodeURIComponent(id)}`)
  emitDbUpdate('categories', id)
  return true
}
