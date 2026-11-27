import { Info } from 'lucide-react'

// Makes clear which features are only simulated until the backend is built.
export default function DemoNotice({ children }) {
  return (
    <p className="flex gap-2.5 rounded-lg bg-warning-light px-4 py-3 text-xs text-heading">
      <Info size={16} className="mt-px shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
