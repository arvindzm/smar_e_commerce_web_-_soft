import axios from 'axios'

// Central Axios client communicating with the live Express + SQLite backend.
// In production single-server deployment, defaults to same-origin '/api'.
// For split frontend/backend hosting (e.g. Vercel + Render), set VITE_API_URL in .env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

export function emitDbUpdate(name, records) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('grocery_db_updated', { detail: { name, records } }))
    }
  } catch {}
}

export default api
