import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '../../utils/cn'

const fieldClass =
  'w-full rounded-lg border bg-white px-4 py-3 text-sm text-heading placeholder:text-muted transition-colors duration-200 focus:border-primary focus:outline-none'

// Shared wrapper: label on top, the field, then the error message.
function FormField({ label, error, required, id, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-heading">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function useField(error, className) {
  const id = useId()
  return {
    id,
    fieldProps: {
      id,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
      className: cn(fieldClass, error ? 'border-danger' : 'border-line', className),
    },
  }
}

export function Input({ label, error, className, type, disableToggle = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password' && !disableToggle
  const { id, fieldProps } = useField(error, cn(isPasswordField && 'pr-11', className))
  const resolvedType = isPasswordField ? (showPassword ? 'text' : 'password') : type

  return (
    <FormField label={label} error={error} required={props.required} id={id}>
      {isPasswordField ? (
        <div className="relative">
          <input {...fieldProps} type={resolvedType} {...props} />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      ) : (
        <input {...fieldProps} type={type} {...props} />
      )}
    </FormField>
  )
}

export function Textarea({ label, error, className, rows = 4, ...props }) {
  const { id, fieldProps } = useField(error, className)
  return (
    <FormField label={label} error={error} required={props.required} id={id}>
      <textarea rows={rows} {...fieldProps} {...props} />
    </FormField>
  )
}

export function Select({ label, error, className, children, ...props }) {
  const { id, fieldProps } = useField(error, className)
  return (
    <FormField label={label} error={error} required={props.required} id={id}>
      <select {...fieldProps} {...props}>
        {children}
      </select>
    </FormField>
  )
}

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2.5 text-sm text-heading', className)}>
      <input type="checkbox" className="size-4 rounded accent-primary" {...props} />
      {label}
    </label>
  )
}

export function Radio({ label, className, ...props }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-heading', className)}>
      <input type="radio" className="size-4 accent-primary" {...props} />
      {label}
    </label>
  )
}
