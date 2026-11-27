import { loadFromStorage, saveToStorage } from '../utils/storage'

// PHASE 1 ONLY. A tiny stand-in for the database: each collection is seeded from
// a file in src/data and then kept in the browser's localStorage, so changes made
// in the admin demo survive a page refresh. Phase 2 deletes this file and the
// services call the real API instead.
const PREFIX = 'grocery_v19_'

export function readCollection(name, seed) {
  return loadFromStorage(PREFIX + name, seed)
}

export function writeCollection(name, records) {
  saveToStorage(PREFIX + name, records)
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('grocery_db_updated', { detail: { name, records } }))
    }
  } catch { }
}

// Mimics a short network wait so loading states can be seen and tested.
export function respond(data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), 150))
}

export function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}`
}

export function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
