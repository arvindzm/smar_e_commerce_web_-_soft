import { ImageIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

// Clearly marked stand-in shown wherever a real brand image has not been supplied yet.
// compact: icon only, for small thumbnails where the label would not fit.
export default function ImagePlaceholder({ label = 'Image', className, compact = false }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 overflow-hidden border border-dashed border-primary/40 bg-primary-pale text-center text-primary',
        compact ? 'p-1' : 'p-2',
        className,
      )}
      role="img"
      aria-label={`${label} placeholder`}
      title={label}
    >
      <ImageIcon size={compact ? 18 : 22} aria-hidden="true" />
      {!compact && <span className="max-w-full break-all text-[11px] font-medium leading-tight">{label}</span>}
    </div>
  )
}
