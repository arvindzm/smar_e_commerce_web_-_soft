import { site } from '../data/site'
import api, { emitDbUpdate } from './api'

export const defaultDeliverySettings = {
  enabled: true,
  freeDeliveryAbove: site.freeDeliveryAbove || 700,
  deliveryCharge: site.deliveryCharge || 40,
  title: 'Free Delivery',
  text: 'On all orders above ₹700 - fresh groceries at your doorstep',
}

export const initialOfferBanners = [
  {
    id: 'ob1',
    title: '',
    text: '',
    link: '/shop',
    image: 'banners/20-off.png',
    imageOnly: true,
    tone: 'peach',
    active: true,
  },
  {
    id: 'ob2',
    title: 'Free delivery on orders above ₹700',
    text: 'On all orders above ₹700 - fresh groceries at your doorstep',
    link: '/shop',
    image: 'banners/Free Devilevery.png',
    tone: 'darkGreen',
    imageOnly: false,
    active: true,
  },
]

export async function getDeliverySettings() {
  const { data } = await api.get('/settings/delivery')
  return data || defaultDeliverySettings
}

export async function updateDeliverySettings(updates) {
  const { data } = await api.put('/settings/delivery', updates)
  emitDbUpdate('delivery_settings', data)
  return data
}

export async function getOfferBanners() {
  const { data } = await api.get('/banners/offers')
  return Array.isArray(data) ? data : initialOfferBanners
}

export async function createOfferBanner(bannerData) {
  const { data } = await api.post('/banners/offers', bannerData)
  emitDbUpdate('offer_banners', data)
  return data
}

export async function updateOfferBanner(id, updates) {
  const { data } = await api.put(`/banners/offers/${encodeURIComponent(id)}`, updates)
  emitDbUpdate('offer_banners', data)
  return data
}

export async function deleteOfferBanner(id) {
  await api.delete(`/banners/offers/${encodeURIComponent(id)}`)
  emitDbUpdate('offer_banners', id)
  return true
}

export async function replaceOfferBanners(nextList) {
  const { data } = await api.put('/banners/offers', nextList)
  emitDbUpdate('offer_banners', data)
  return data
}

export async function resetOfferBanners() {
  const { data } = await api.post('/banners/offers/reset')
  emitDbUpdate('offer_banners', data)
  return data
}
