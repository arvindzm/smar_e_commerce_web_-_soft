import { useRef } from 'react'

// Lets custom arrow buttons control a Swiper carousel.
// const nav = useSwiperNav()
// <SliderArrows onPrev={nav.prev} onNext={nav.next} />  <Swiper onSwiper={nav.onSwiper} />
export function useSwiperNav() {
  const swiperRef = useRef(null)

  return {
    onSwiper: (swiper) => {
      swiperRef.current = swiper
    },
    prev: () => swiperRef.current?.slidePrev(),
    next: () => swiperRef.current?.slideNext(),
  }
}
