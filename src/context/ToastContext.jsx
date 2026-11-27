import { CircleAlert, CircleCheck, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContext } from '../hooks/useToast'

const styles = {
  success: { icon: CircleCheck, color: 'text-accent' },
  error: { icon: CircleAlert, color: 'text-danger' },
}

// Wraps the app and shows short messages in the bottom-right corner.
// Supports optional interactive action buttons (e.g. View Cart / Checkout).
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'success', action = null) => {
      const id = crypto.randomUUID()
      // Keep at most the 3 newest messages on screen.
      setToasts((current) => [...current, { id, message, type, action }].slice(-3))
      setTimeout(() => removeToast(id), action ? 4500 : 3000)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto" aria-live="polite">
        {toasts.map((toast) => {
          const { icon: Icon, color } = styles[toast.type] || styles.success
          return (
            <div key={toast.id} className="card flex w-full items-center gap-3 px-4 py-3 shadow-card sm:w-96">
              <Icon size={20} className={`${color} shrink-0`} aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-heading">{toast.message}</p>
              {toast.action && (
                <Link
                  to={toast.action.to}
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  {toast.action.label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-muted hover:text-heading"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
