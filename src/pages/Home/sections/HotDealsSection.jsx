import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../../../components/common/AssetImage'
import Button from '../../../components/common/Button'
import Countdown from '../../../components/common/Countdown'
import SectionHeading from '../../../components/common/SectionHeading'
import ProductCarousel from '../../../components/Slider/ProductCarousel'
import SliderArrows from '../../../components/Slider/SliderArrows'
import { useSwiperNav } from '../../../hooks/useSwiperNav'

const breakpoints = {
  0: { slidesPerView: 2, spaceBetween: 12 },
  640: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
  1536: { slidesPerView: 4, spaceBetween: 20 },
}

// Teal countdown panel on the left, product carousel on the right.
export default function HotDealsSection({ deal, products }) {
  const nav = useSwiperNav()
  if (products.length === 0) return null

  return (
    <section className="container-page section-gap">
      <SectionHeading title="Hot Deals Today">
        <Link to="/shop" className="text-sm font-medium text-heading hover:text-primary">
          View All Deals
        </Link>
        <SliderArrows onPrev={nav.prev} onNext={nav.next} />
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="flex flex-col sm:flex-row lg:flex-col overflow-hidden rounded-2xl bg-primary text-left lg:col-span-4 h-full justify-between">
          <div className="p-6 lg:p-7 pb-3 sm:pb-6 lg:pb-4 flex flex-col sm:w-1/2 lg:w-full">
            <span className="inline-block rounded-md bg-warning px-3 py-1 text-xs font-semibold text-white w-fit">
              {deal.tag}
            </span>
            <h3 className="mt-3 !text-2xl font-bold !text-white">{deal.title}</h3>
            <p className="mt-1 text-sm font-medium text-white/90">{deal.text}</p>
            <Countdown targetDate={deal.endsAt} onDark className="mt-3 justify-start" />
            <Button to={deal.link} variant="white" className="mt-3.5 w-fit">
              Explore Shop <ShoppingCart size={16} aria-hidden="true" />
            </Button>
          </div>
          <div className="relative w-full flex-1 min-h-[220px] overflow-hidden sm:w-1/2 lg:w-full flex items-center justify-center">
            <AssetImage
              src={deal.image}
              alt={deal.title || 'Deal of the day'}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <ProductCarousel products={products} onSwiper={nav.onSwiper} breakpoints={breakpoints} showSold />
        </div>
      </div>
    </section>
  )
}
