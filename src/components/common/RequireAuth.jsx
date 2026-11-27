import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Sends signed-out visitors to the login page, remembering where they wanted to go.
export default function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const message = location.pathname.startsWith('/checkout')
      ? 'Please login or create an account first to purchase products.'
      : undefined
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search, message }}
      />
    )
  }
  return <Outlet />
}
