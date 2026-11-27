import { ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// 1. Jumps to the top whenever the customer opens a new page.
// 2. Shows a round "back to top" button whose ring fills as the page is scrolled.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const ringRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      setVisible(window.scrollY > 400)
      if (ringRef.current) {
        ringRef.current.style.background = `conic-gradient(var(--color-primary) ${progress}%, var(--color-line) 0)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      ref={ringRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-5 right-4 z-30 flex size-11 items-center justify-center rounded-full p-0.5 shadow-card transition-all duration-300 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="flex size-full items-center justify-center rounded-full bg-white text-primary">
        <ArrowUp size={18} />
      </span>
    </button>
  )
}
