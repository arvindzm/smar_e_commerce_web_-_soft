import { ChevronDown, LayoutGrid, PhoneCall } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { mainLinks } from '../../data/navigation'
import { site } from '../../data/site'

// A dropdown that opens on hover and on keyboard focus (no JavaScript needed).
const dropdownPanel =
  'invisible absolute left-0 top-full z-50 w-64 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'
const dropdownList = 'rounded-xl border border-line bg-white p-2 shadow-card'
const dropdownLink = 'block rounded-lg px-4 py-2.5 text-sm text-heading transition-colors hover:bg-primary-light hover:text-primary'

const navLinkClass = ({ isActive }) =>
  `py-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-heading'}`

// Desktop navigation row. It stays fixed to the top while scrolling.
export default function Navbar({ categories }) {
  return (
    <nav className="sticky top-0 z-40 hidden bg-white shadow-header lg:block" aria-label="Main">
      <div className="container-page flex items-center gap-8 py-2.5 xl:gap-10">
        {/* Browse Categories Button + Dropdown */}
        <div className="group relative">
          <Link
            to="/categories"
            className="flex items-center gap-2.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark shadow-xs"
            aria-haspopup="true"
          >
            <LayoutGrid size={17} aria-hidden="true" />
            <span>Browse Categories</span>
            <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
          </Link>
          <div className={dropdownPanel}>
            <ul className={dropdownList}>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/category/${category.slug}`} className={dropdownLink}>
                    {category.name}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-line pt-1">
                <Link to="/categories" className={`${dropdownLink} font-semibold !text-primary`}>
                  View all categories →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean, Non-redundant Main Navigation Links */}
        <ul className="flex items-center gap-6 xl:gap-8">
          {mainLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'} className={navLinkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Help & Support Phone */}
        <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="ml-auto flex items-center gap-3 text-sm group">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
            <PhoneCall size={18} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-muted">Need any help? Call us</span>
            <span className="font-semibold text-primary">{site.phone}</span>
          </span>
        </a>
      </div>
    </nav>
  )
}

