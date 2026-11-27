import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

// Wraps every customer-facing page with the header and footer.
export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
