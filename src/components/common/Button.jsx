import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  accent: 'bg-primary text-white hover:bg-primary-dark',
  soft: 'bg-primary-light text-primary-dark hover:bg-primary hover:text-white',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  white: 'bg-white text-heading hover:bg-primary hover:text-white',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

// Pass `to` to render a router link that looks like a button.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  loading = false,
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-200',
    'disabled:opacity-60',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} disabled={loading || disabled} {...props}>
      {loading && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
