import { TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StatCard({
  icon: Icon,
  label,
  value,
  to,
  tone = 'primary',
  trend,
  subtitle,
}) {
  const tones = {
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accent: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  }

  const content = (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-muted tracking-wide uppercase">{label}</span>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
            tones[tone] || tones.primary
          }`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3">
        <span className="block font-heading text-2xl font-bold text-heading sm:text-3xl tracking-tight">
          {value}
        </span>
        <div className="mt-1.5 flex items-center gap-2">
          {trend && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              <TrendingUp size={11} /> {trend}
            </span>
          )}
          {subtitle && <span className="text-xs text-muted truncate">{subtitle}</span>}
        </div>
      </div>
    </div>
  )

  const className =
    'card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/50'

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }
  return <div className={className}>{content}</div>
}
