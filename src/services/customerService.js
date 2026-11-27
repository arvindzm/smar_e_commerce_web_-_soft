import api from './api'

export async function getCustomers() {
  const { data } = await api.get('/customers')
  return data
}
