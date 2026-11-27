import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import ProductCard from '../ProductCard/ProductCard'

// Cards per row at each screen width (mobile first).
const defaultBreakpoints = {
  0: { slidesPerView: 2, spaceBetween: 12 },
  640: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 20 },
  1280: { slidesPerView: 5, spaceBetween: 20 },
  1536: { slidesPerView: 6, spaceBetween: 20 },
}

// Swipeable row of product cards. Pair it with useSwiperNav + SliderArrows.
export default function ProductCarousel({ products, onSwiper, breakpoints = defaultBreakpoints, showSold = false }) {
  return (
    <Swiper onSwiper={onSwiper} breakpoints={breakpoints} className="!px-1 !py-2">
      {products.map((product) => (
        <SwiperSlide key={product.id} className="!h-auto">
          <ProductCard product={product} showSold={showSold} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
