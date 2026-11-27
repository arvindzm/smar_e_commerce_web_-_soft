import api from './api'

export async function register({ name, email, phone, password }) {
  try {
    const { data } = await api.post('/auth/register', { name, email, phone, password })
    return data
  } catch (err) {
    if (err.response?.data?.error) {
      return { error: err.response.data.error }
    }
    return { error: 'Unable to register right now. Please try again.' }
  }
}

export async function login({ email, password }) {
  try {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  } catch (err) {
    if (err.response?.data?.error) {
      return { error: err.response.data.error }
    }
    return { error: 'Unable to sign in right now. Please try again.' }
  }
}

export async function updateProfile(id, changes) {
  try {
    const { data } = await api.put(`/auth/profile/${encodeURIComponent(id)}`, changes)
    return data
  } catch (err) {
    if (err.response?.data?.error) {
      return { error: err.response.data.error }
    }
    return { error: 'Unable to update profile right now.' }
  }
}
