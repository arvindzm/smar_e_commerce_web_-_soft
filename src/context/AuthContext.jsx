import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import * as authService from '../services/authService'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const STORAGE_KEY = 'grocery_v12_user'

// PHASE 1 DEMO ONLY: the signed-in customer is remembered in this browser.
// Phase 2 will store a JWT and verify it with the backend on every request.
export function AuthProvider({ children }) {
  const showToast = useToast()
  const [user, setUser] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEY, null) || loadFromStorage('grocery_v1_user', null)
    if (saved && saved.email && saved.email.includes('freshbhojan')) {
      saved.email = saved.email.replace(/freshbhojan\.com/gi, 'smar.com')
    }
    return saved
  })

  useEffect(() => saveToStorage(STORAGE_KEY, user), [user])

  const value = useMemo(
    () => ({
      user,

      async signIn(credentials) {
        const result = await authService.login(credentials)
        if (result.user) {
          setUser(result.user)
          showToast(`Welcome back, ${result.user.name}`)
        }
        return result
      },

      async signUp(details) {
        const result = await authService.register(details)
        if (result.user) {
          setUser(result.user)
          showToast('Your account has been created')
        }
        return result
      },

      async saveProfile(changes) {
        const result = await authService.updateProfile(user.id, changes)
        if (result.user) {
          setUser(result.user)
          showToast('Your details have been saved')
        }
        return result
      },

      signOut() {
        setUser(null)
        showToast('You have been signed out')
      },
    }),
    [user, showToast],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
