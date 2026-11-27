import { Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/account', label: 'My Profile', icon: User, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/addresses', label: 'My Address', icon: MapPin },
  { to: '/wishlist', label: 'My Wishlist', icon: Heart },
]

// Sidebar and shared frame for every signed-in customer page.
export default function AccountLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-heading hover:bg-primary-light hover:text-primary'
    }`

  return (
    <>
      <Breadcrumb title="My Account" items={[{ label: 'Account' }]} />

      <div className="container-page grid gap-6 pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8 lg:pt-12">
        <aside className="card h-max p-4 sm:p-5" aria-label="Account menu">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-lg font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-heading font-bold text-heading">{user.name}</span>
              <span className="block truncate text-xs">{user.email}</span>
            </span>
          </div>

          <nav className="mt-4">
            <ul className="space-y-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={linkClass}>
                    <Icon size={18} aria-hidden="true" /> {label}
                  </NavLink>
                </li>
              ))}
              <li className="border-t border-line pt-1">
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    navigate('/')
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-danger-light hover:text-danger"
                >
                  <LogOut size={18} aria-hidden="true" /> Log Out
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </>
  )
}
