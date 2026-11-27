import api, { emitDbUpdate } from './api'

export async function getHotDealSettings() {
  const { data } = await api.get('/settings/hot-deal')
  return data
}

export async function updateHotDealSettings(updates) {
  const { data } = await api.put('/settings/hot-deal', updates)
  emitDbUpdate('hot_deal_settings', data)
  return data
}

export async function resetHotDealSettings() {
  const { data } = await api.post('/settings/hot-deal/reset')
  emitDbUpdate('hot_deal_settings', data)
  return data
}

export async function getWeeklyDealSettings() {
  const { data } = await api.get('/settings/weekly-deal')
  return data
}

export async function updateWeeklyDealSettings(updates) {
  const { data } = await api.put('/settings/weekly-deal', updates)
  emitDbUpdate('weekly_deal_settings', data)
  return data
}

export async function resetWeeklyDealSettings() {
  const { data } = await api.post('/settings/weekly-deal/reset')
  emitDbUpdate('weekly_deal_settings', data)
  return data
}

export async function getFeaturedSettings() {
  const { data } = await api.get('/settings/featured')
  return data
}

export async function updateFeaturedSettings(updates) {
  const { data } = await api.put('/settings/featured', updates)
  emitDbUpdate('featured_settings', data)
  return data
}

export async function resetFeaturedSettings() {
  const { data } = await api.post('/settings/featured/reset')
  emitDbUpdate('featured_settings', data)
  return data
}
