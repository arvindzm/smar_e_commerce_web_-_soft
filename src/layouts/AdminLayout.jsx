import {
  CreditCard,
  Flame,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Tags,
  TicketPercent,
  Truck,
  Users,
  Wallet,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import AdminHeader from '../components/Admin/AdminHeader'
import { site } from '../data/site'

const navGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'CATALOG',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/categories', label: 'Categories', icon: Tags },
      { to: '/admin/hot-deals', label: 'Deals & Highlights', icon: Flame },
    ],
  },
  {
    title: 'SALES & MARKETING',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { to: '/admin/transactions', label: 'Payments Ledger', icon: Wallet },
      { to: '/admin/customers', label: 'Customers', icon: Users },
      { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
      { to: '/admin/banners', label: 'Delivery, GST & Banners', icon: Truck },
      { to: '/admin/payment-settings', label: 'Payment & UPI QR', icon: CreditCard },
    ],
  },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-primary text-white shadow-sm font-bold'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-2.5 font-heading text-lg font-bold text-white">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-white text-xs font-black shadow-xs">
            S
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold">{site.name}</span>
            <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={closeMenu}
          className="flex size-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5" aria-label="Admin Navigation">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 mb-1.5">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={linkClass} onClick={closeMenu}>
                    <Icon size={17} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Bar: Back to store */}
      <div className="border-t border-white/10 p-3 space-y-1 bg-slate-950/40">
        <Link
          to="/"
          className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Store size={16} aria-hidden="true" />
            <span>Storefront</span>
          </span>
          <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-slate-300">Live</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
        >
          <LogOut size={15} aria-hidden="true" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/70 flex">
      {/* Desktop Sticky Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-slate-900 shadow-xl lg:flex z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} inert={!open}>
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-slate-900 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader onOpenMenu={() => setOpen(true)} />

        {/* Dynamic Admin Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-line bg-white/80 px-6 py-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-muted">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-heading">{site.name} Control Center</span>
            <span>· All systems normal</span>
          </div>
          <span className="mt-2 sm:mt-0 text-[11px] text-muted">
            Admin v2.5 · Powered by Antigravity
          </span>
        </footer>
      </div>
    </div>
  )
}
