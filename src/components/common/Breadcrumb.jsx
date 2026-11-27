import { ChevronRight, House } from 'lucide-react'
import { Link } from 'react-router-dom'

// Tinted band at the top of inner pages: page title on the left, trail on the right.
// items: [{ label: 'Shop', to: '/shop' }, { label: 'Besan' }]
export default function Breadcrumb({ title, items = [] }) {
  return (
    <div className="bg-primary-pale py-5">
      <div className="container-page flex flex-wrap items-center justify-between gap-2">
        <h1 className="!text-xl">{title}</h1>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link to="/" className="flex items-center gap-1.5 text-heading hover:text-primary">
                <House size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            {items.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-muted" aria-hidden="true" />
                {item.to ? (
                  <Link to={item.to} className="text-heading hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
