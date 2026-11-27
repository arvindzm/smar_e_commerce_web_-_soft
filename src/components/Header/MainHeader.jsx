import { Heart, Menu, ShoppingCart, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import Logo from './Logo'
import SearchBar from './SearchBar'

function HeaderAction({ to, icon: Icon, label, count }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 rounded-full p-2 text-sm font-medium text-heading transition-colors hover:text-primary"
      aria-label={count === undefined ? label : `${label}, ${count} items`}
    >
      <span className="relative">
        <Icon size={22} aria-hidden="true" />
        {count !== undefined && (
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </span>
      <span className="hidden xl:inline">{label}</span>
    </Link>
  )
}

// Logo, search and account / wishlist / cart. Sticks to the top on mobile.
export default function MainHeader({ categories, onMenuOpen }) {
  const { count } = useCart()
  const { ids } = useWishlist()
  const { user } = useAuth()
  // Show the customer's first name once they are signed in.
  const profileLabel = user ? user.name.split(' ')[0] : 'Profile'

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white lg:static">
      <div className="container-page flex items-center gap-2 py-2 sm:gap-4 lg:gap-8 lg:py-2.5">
        <button
          type="button"
          onClick={onMenuOpen}
          className="-ml-2 flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Logo />
        <div className="mx-auto hidden w-full max-w-2xl lg:block">
          <SearchBar categories={categories} />
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <HeaderAction to="/account" icon={User} label={profileLabel} />
          <HeaderAction to="/wishlist" icon={Heart} label="Wishlist" count={ids.length} />
          <HeaderAction to="/cart" icon={ShoppingCart} label="Cart" count={count} />
        </div>
      </div>
      <div className="container-page pb-2 lg:hidden">
        <SearchBar categories={categories} />
      </div>
    </div>
  )
}
