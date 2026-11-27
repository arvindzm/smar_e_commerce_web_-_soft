import { SearchX } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import SectionHeading from '../../components/common/SectionHeading'
import ProductCarousel from '../../components/Slider/ProductCarousel'
import SliderArrows from '../../components/Slider/SliderArrows'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useSwiperNav } from '../../hooks/useSwiperNav'
import { getCategories } from '../../services/categoryService'
import { getProducts } from '../../services/productService'
import ProductGallery from './ProductGallery'
import ProductInfoPanel from './ProductInfoPanel'
import ProductSummary from './ProductSummary'
import ProductTabs from './ProductTabs'

export default function ProductDetails() {
  const { slug } = useParams()
  const nav = useSwiperNav()
  const productsRequest = useFetch(getProducts)
  const categoriesRequest = useFetch(getCategories)

  const products = productsRequest.data || []
  const product = products.find((item) => item.slug === slug)
  usePageTitle(product ? product.name : 'Product')

  if (productsRequest.loading || categoriesRequest.loading) return <Loader page label="Loading product..." />

  if (!product) {
    return (
      <EmptyState
        icon={SearchX}
        title="Product not found"
        text="This product does not exist or is no longer available."
        action={<Button to="/shop">Browse all products</Button>}
      />
    )
  }

  const category = categoriesRequest.data.find((item) => item.id === product.categoryId)
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id)

  return (
    <>
      <Breadcrumb
        title="Product Details"
        items={[
          { label: 'Shop', to: '/shop' },
          ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      {/* `key` resets the chosen pack size, quantity and image when another product opens. */}
      <div key={product.id} className="container-page pt-8 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,3fr)]">
          <ProductGallery product={product} />
          <ProductSummary product={product} />
          <div className="lg:col-span-2 xl:col-span-1">
            <ProductInfoPanel />
          </div>
        </div>

        <div className="mt-10 lg:mt-14">
          <ProductTabs product={product} category={category} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page section-gap">
          <SectionHeading title="Related Products">
            <SliderArrows onPrev={nav.prev} onNext={nav.next} />
          </SectionHeading>
          <ProductCarousel products={related} onSwiper={nav.onSwiper} />
        </section>
      )}
    </>
  )
}
