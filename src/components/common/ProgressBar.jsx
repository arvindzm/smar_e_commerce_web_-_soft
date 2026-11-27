import { cn } from '../../utils/cn'

// Thin bar used for "Sold 18/35" and stock levels.
export default function ProgressBar({ value, max, label, className }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={className}>
      <div
        className="h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={cn('h-full rounded-full bg-primary transition-all duration-500')} style={{ width: `${percent}%` }} />
      </div>
      {label && <p className="mt-1.5 text-xs text-heading">{label}</p>}
    </div>
  )
}
