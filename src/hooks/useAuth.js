import { createContext, useContext } from 'react'

// Filled in by AuthProvider (context/AuthContext.jsx).
export const AuthContext = createContext(null)

// const { user, signIn, signUp, signOut, saveProfile } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
