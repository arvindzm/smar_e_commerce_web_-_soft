import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sliders,
  User,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminHeader({ onOpenMenu }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/admin/products?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const notifications = [
    {
      id: 1,
      title: 'New Order #ORD-10004 Received',
      subtitle: 'Sunita Devi placed an order for ₹670',
      time: '15m ago',
      unread: true,
      link: '/admin/orders/ORD-10004',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      subtitle: 'Chana Besan (1 kg) has only 4 packs left',
      time: '1h ago',
      unread: true,
      link: '/admin/products',
      icon: Package,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 3,
      title: 'Storefront Optimization',
      subtitle: 'Clean English catalog and green theme active',
      time: '2h ago',
      unread: false,
      link: '/admin',
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-600',
    },
  ]

  const displayName = user?.name || 'Admin Manager'
  const displayEmail = user?.email || 'admin@smar.com'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-line bg-white px-4 sm:px-6 lg:px-8 shadow-xs">
      {/* Left side: Mobile menu toggle + breadcrumb context */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex size-10 items-center justify-center rounded-lg text-heading hover:bg-surface lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Store Live · Lucknow Hub
          </span>
        </div>
      </div>

      {/* Middle: Global search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, categories..."
            className="w-full rounded-full border border-line bg-surface/70 py-2 pl-9 pr-12 text-xs font-medium text-heading placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-muted border border-line shadow-2xs">
            /
          </kbd>
        </form>
      </div>

      {/* Right side: View Store, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick View Live Store Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-pale px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          title="Open customer storefront in a new tab"
        >
          <span>View Store</span>
          <ExternalLink size={13} />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex size-9 items-center justify-center rounded-full text-heading hover:bg-surface transition-colors"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-line bg-white shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-heading">Notifications</h3>
                  <span className="rounded-full bg-primary-pale px-2 py-0.5 text-[10px] font-bold text-primary">
                    2 New
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-muted hover:text-heading"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="divide-y divide-line/60 max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon
                  return (
                    <Link
                      key={notif.id}
                      to={notif.link}
                      onClick={() => setShowNotifications(false)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-surface/70 transition-colors ${
                        notif.unread ? 'bg-primary-pale/30' : ''
                      }`}
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${notif.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-heading truncate">{notif.title}</p>
                        <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{notif.subtitle}</p>
                        <span className="text-[10px] text-muted/80 mt-1 block">{notif.time}</span>
                      </div>
                      {notif.unread && <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    </Link>
                  )
                })}
              </div>

              <div className="px-4 pt-2 border-t border-line text-center">
                <Link
                  to="/admin/orders"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-1 pl-1.5 sm:pr-3 hover:bg-surface transition-colors border border-line"
            aria-label="User menu"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-2xs">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="block text-xs font-bold text-heading">{displayName}</span>
              <span className="block text-[10px] text-primary font-medium">Store Admin</span>
            </div>
            <ChevronDown size={14} className="text-muted hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-white shadow-xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-line">
                <p className="text-xs font-bold text-heading">{displayName}</p>
                <p className="text-[11px] text-muted truncate">{displayEmail}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/admin"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-heading hover:bg-surface hover:text-primary transition-colors"
                >
                  <Sliders size={14} /> Admin Overview
                </Link>
                <Link
                  to="/"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-heading hover:bg-surface hover:text-primary transition-colors"
                >
                  <ExternalLink size={14} /> Open Storefront
                </Link>
              </div>

              <div className="border-t border-line pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false)
                    signOut()
                    navigate('/login')
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-danger hover:bg-danger-light transition-colors text-left"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
