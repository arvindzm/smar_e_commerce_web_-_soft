import { PhoneCall, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { accountLinks, mainLinks, policyLinks } from '../../data/navigation'
import { site } from '../../data/site'
import { useAuth } from '../../hooks/useAuth'
import Logo from './Logo'

function MenuGroup({ title, children }) {
  return (
    <div className="border-t border-line px-5 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <ul>{children}</ul>
    </div>
  )
}

const linkClass = 'block rounded-lg px-3 py-2.5 text-sm font-medium text-heading hover:bg-primary-light hover:text-primary'

// Slide-in side menu for phones and tablets.
export default function MobileMenu({ open, onClose, categories }) {
  const { pathname, search } = useLocation()
  const { user, signOut } = useAuth()
  // Signed-out visitors see "Login / Register"; signed-in ones see nothing extra here.
  const myAccountLinks = user ? accountLinks.filter((link) => link.to !== '/login') : accountLinks

  // Close after the customer taps a link.
  useEffect(() => {
    onClose()
  }, [pathname, search, onClose])

  // Close on Escape and stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <div
        className={`absolute inset-0 bg-heading/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-card transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-surface text-heading hover:bg-danger hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <MenuGroup title="Menu">
          {mainLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `${linkClass} ${isActive ? 'bg-primary-light !text-primary' : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </MenuGroup>

        <MenuGroup title="Categories">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/category/${category.slug}`} className={linkClass}>
                {category.name}
              </Link>
            </li>
          ))}
        </MenuGroup>

        <MenuGroup title={user ? `Hello, ${user.name.split(' ')[0]}` : 'My Account'}>
          {myAccountLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/admin" className={`${linkClass} font-semibold text-primary bg-primary-pale`}>
              ⚙️ Admin Panel
            </Link>
          </li>
          {user && (
            <li>
              <button type="button" onClick={signOut} className={`${linkClass} w-full text-left hover:bg-danger-light hover:text-danger`}>
                Log Out
              </button>
            </li>
          )}
        </MenuGroup>

        <MenuGroup title="Policies">
          {policyLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </MenuGroup>

        <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="mt-auto flex items-center gap-3 border-t border-line bg-primary-pale px-5 py-4 text-sm">
          <PhoneCall size={22} className="text-primary" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-heading">Need any help? Call us</span>
            <span className="font-semibold text-primary">{site.phone}</span>
          </span>
        </a>
      </aside>
    </div>
  )
}
