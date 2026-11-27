import { createContext, useContext } from 'react'

// Filled in by ToastProvider (context/ToastContext.jsx).
export const ToastContext = createContext(null)

// const showToast = useToast(); showToast('Added to cart'); showToast('Failed', 'error')
export function useToast() {
  return useContext(ToastContext)
}
