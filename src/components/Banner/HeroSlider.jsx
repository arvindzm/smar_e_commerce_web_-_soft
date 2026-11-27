import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { useSwiperNav } from '../../hooks/useSwiperNav'
import AssetImage from '../common/AssetImage'

const arrowClass =
  'absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-heading shadow-card transition-all hover:bg-white hover:scale-105 hover:text-primary md:flex'

// Full-width automatic promotional banner slider at the top of the homepage.
export default function HeroSlider({ slides }) {
  const nav = useSwiperNav()

  return (
    <div className="group relative w-full overflow-hidden shadow-xs [--swiper-theme-color:var(--color-primary)]">
      <Swiper
        modules={[Autoplay, Pagination]}
        onSwiper={nav.onSwiper}
        loop={slides.length > 1}
        speed={750}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: false }}
        pagination={{ clickable: true }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.link || '/shop'} className="block w-full overflow-hidden">
              <AssetImage
                src={slide.image}
                alt={slide.title || 'Promotional Banner'}
                className="w-full aspect-[1942/809]"
                imgClassName="w-full h-full object-cover"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" onClick={nav.prev} className={`${arrowClass} left-3 sm:left-6`} aria-label="Previous slide">
        <ChevronLeft size={22} />
      </button>
      <button type="button" onClick={nav.next} className={`${arrowClass} right-3 sm:right-6`} aria-label="Next slide">
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
