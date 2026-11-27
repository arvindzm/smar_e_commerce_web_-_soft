import { Link } from 'react-router-dom'
import HeroSlider from '../../components/Banner/HeroSlider'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import SectionHeading from '../../components/common/SectionHeading'
import ProductCard from '../../components/ProductCard/ProductCard'
import { heroSlides } from '../../data/banners'
import { site } from '../../data/site'
import { useFetch } from '../../hooks/useFetch'
import { getCategories } from '../../services/categoryService'
import { getProducts } from '../../services/productService'
import BrandTrustSection from './sections/BrandTrustSection'
import CategorySection from './sections/CategorySection'
import FeaturesSection from './sections/FeaturesSection'
import HeroMilletsSection from './sections/HeroMilletsSection'

export default function Home() {
  const productsRequest = useFetch(getProducts)
  const categoriesRequest = useFetch(getCategories)

  if (productsRequest.loading || categoriesRequest.loading) {
    return <Loader page label="Loading fresh groceries..." />
  }
  if (productsRequest.error) {
    return <EmptyState title="Something went wrong" text="We could not load the store. Please refresh the page." />
  }

  const products = productsRequest.data || []
  const categories = categoriesRequest.data || []

  const topSelling = [...products].sort((a, b) => b.sold - a.sold)

  return (
    <>
      <h1 className="sr-only">{site.name} - 100% Shuddh & Fresh Groceries</h1>

      {/* 1. Full-width Hero Promo Slider */}
      <div className="w-full">
        <HeroSlider slides={heroSlides} />
      </div>

      {/* 2. Express Delivery & Freshness Guarantees Bar */}
      <FeaturesSection />

      {/* 3. Millets, Sattu & Supergrains */}
      <HeroMilletsSection products={products} />

      {/* 4. Shop by Category Circles */}
      {categories.length > 0 && (
        <CategorySection categories={categories} products={products} />
      )}

      {/* 4. Popular Grocery Staples (Clean 6-column grid) */}
      <section className="container-page section-gap" aria-label="Popular grocery staples">
        <SectionHeading title="Popular Grocery Staples">
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            View All Products →
          </Link>
        </SectionHeading>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-6">
          {topSelling.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Why Choose SMAR: Purity Promise & Fast WhatsApp Ordering */}
      <BrandTrustSection />
    </>
  )
}
