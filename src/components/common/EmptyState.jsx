import { PackageOpen } from 'lucide-react'

// Shown when a list has nothing in it (empty cart, no search results, etc.).
// Pass a different lucide icon and an action button when needed.
export default function EmptyState({ icon: Icon = PackageOpen, title, text, action }) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon size={34} aria-hidden="true" />
      </span>
      <h3 className="mt-5 !text-xl">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
