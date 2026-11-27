import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import CategoryCard from '../../../components/CategoryCard/CategoryCard'
import SectionHeading from '../../../components/common/SectionHeading'

const breakpoints = {
  0: { slidesPerView: 2.5, spaceBetween: 14 },
  640: { slidesPerView: 3.5, spaceBetween: 20 },
  1024: { slidesPerView: 5, spaceBetween: 24 },
  1280: { slidesPerView: 6, spaceBetween: 24 },
}

export default function CategorySection({ categories, products }) {
  const countFor = (categoryId) => products.filter((product) => product.categoryId === categoryId).length

  return (
    <section className="container-page section-gap" aria-label="Shop by category">
      <SectionHeading title="Explore by Category">
        <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">
          View All Categories →
        </Link>
      </SectionHeading>
      <Swiper breakpoints={breakpoints} centerInsufficientSlides>
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryCard category={category} productCount={countFor(category.id)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
