import { useCountdown } from '../../hooks/useCountdown'
import { cn } from '../../utils/cn'

const boxStyles = {
  white: 'bg-white text-heading shadow-sm',
  primary: 'bg-primary text-white',
  outline: 'border border-line bg-white text-heading',
}

// onDark: use white separators when the timer sits on a dark background.
export default function Countdown({ targetDate, variant = 'white', className, onDark = false }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate)
  const parts = [
    { value: days, unit: 'D' },
    { value: hours, unit: 'H' },
    { value: minutes, unit: 'M' },
    { value: seconds, unit: 'S' },
  ]

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="timer">
      {parts.map((part, index) => (
        <div key={part.unit} className="flex items-center gap-1.5">
          {index > 0 && <span className={cn('font-semibold', onDark ? 'text-white' : 'text-heading')}>:</span>}
          <span className={cn('min-w-12 rounded-md px-2 py-1.5 text-center text-xs font-semibold', boxStyles[variant])}>
            {String(part.value).padStart(2, '0')} {part.unit}
          </span>
        </div>
      ))}
    </div>
  )
}
