import api, { emitDbUpdate } from './api'

export const defaultTaxSettings = {
  enabled: true,
  gstRate: 5,
  taxName: 'GST',
  gstNumber: '09AAACH7409R1ZZ',
  showOnInvoice: true,
}

export async function getTaxSettings() {
  const { data } = await api.get('/settings/tax')
  return data || defaultTaxSettings
}

export async function updateTaxSettings(updates) {
  const { data } = await api.put('/settings/tax', updates)
  emitDbUpdate('tax_settings', data)
  return data
}

export async function resetTaxSettings() {
  const { data } = await api.post('/settings/tax/reset')
  emitDbUpdate('tax_settings', data)
  return data
}
