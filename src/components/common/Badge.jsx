import { cn } from '../../utils/cn'

const variants = {
  sale: 'bg-danger text-white',
  best: 'bg-info text-white',
  new: 'bg-warning text-white',
  success: 'bg-accent-light text-accent-dark',
  warning: 'bg-warning text-white',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-surface text-heading',
}

// `corner` makes the tag that sits in the top-left corner of a product card.
export default function Badge({ children, variant = 'neutral', corner = false, className }) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium',
        corner ? 'absolute left-0 top-0 z-10 rounded-br-2xl rounded-tl-[calc(var(--radius-card)-1px)]' : 'rounded-full',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
