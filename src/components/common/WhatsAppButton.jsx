import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { site } from '../../data/site'

export default function WhatsAppButton() {
  const location = useLocation()
  if (!site.whatsapp) return null

  const isCheckout = location.pathname.startsWith('/checkout')
  const isCart = location.pathname.startsWith('/cart')

  const text = encodeURIComponent(`Namaste SMAR! I have an inquiry about fresh food & groceries.`)
  const url = `https://wa.me/${site.whatsapp}?text=${text}`

  // On checkout or cart, position bottom-left so order totals/proceed button are never blocked
  const positionClass = isCheckout || isCart ? 'bottom-5 left-5' : 'bottom-6 right-6'

  return (
    <aside aria-label="WhatsApp Support" className={`fixed ${positionClass} z-40 group`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex size-13 sm:size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba59] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle animated pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" />

        {/* WhatsApp Official Style Icon */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="relative z-10"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.877-2.056-.977-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.3-.019-.463.132-.613.136-.134.301-.35.452-.525.15-.176.2-.3.301-.502.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.482 1.079 2.911 1.23 3.112.151.201 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.722.23 1.379.198 1.899.12.58-.088 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.076-.126-.277-.201-.578-.351z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.385A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.597 0-3.093-.454-4.367-1.242l-.313-.195-2.96.822.836-2.883-.205-.327A8.128 8.128 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
        </svg>

        {/* Hover Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition group-hover:block sm:right-auto sm:left-full sm:ml-3 sm:mr-0">
          Chat with SMAR
        </span>
      </a>
    </aside>
  )
}
