import { Link } from 'react-router-dom'
import SectionHeading from '../../../components/common/SectionHeading'
import ProductCarousel from '../../../components/Slider/ProductCarousel'
import SliderArrows from '../../../components/Slider/SliderArrows'
import { useSwiperNav } from '../../../hooks/useSwiperNav'

export default function FlashSaleSection({ products }) {
  const nav = useSwiperNav()
  if (products.length === 0) return null

  return (
    <section className="container-page section-gap">
      <SectionHeading title="Flash Sales Today">
        <Link to="/shop" className="text-sm font-medium text-heading hover:text-primary">
          View All Deals
        </Link>
        <SliderArrows onPrev={nav.prev} onNext={nav.next} />
      </SectionHeading>
      <ProductCarousel products={products} onSwiper={nav.onSwiper} showSold />
    </section>
  )
}
