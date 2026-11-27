import { ArrowRight } from 'lucide-react'
import AssetImage from '../../../components/common/AssetImage'
import Button from '../../../components/common/Button'
import SectionHeading from '../../../components/common/SectionHeading'
import ProductCardHorizontal from '../../../components/ProductCard/ProductCardHorizontal'

// Wide product cards with a tall promo banner on the right.
export default function BestSellsSection({ products, banner }) {
  if (products.length === 0) return null

  return (
    <section className="container-page section-gap">
      <SectionHeading title="Daily Best Sells" />
      <div className="grid gap-4 lg:gap-5 xl:grid-cols-12">
        <div className="grid gap-4 md:grid-cols-2 lg:gap-5 xl:col-span-8">
          {products.map((product) => (
            <ProductCardHorizontal key={product.id} product={product} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-[hsl(40_45%_92%)] p-6 text-center sm:flex-row sm:text-left xl:col-span-4 xl:flex-col xl:text-center">
          <div>
            <h3 className="!text-2xl">{banner.title}</h3>
            <p className="mt-1.5 text-sm font-medium text-heading">{banner.text}</p>
            <Button to={banner.link} variant="primary" className="mt-5">
              Shop Now <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
          <AssetImage src={banner.image} alt="" className="aspect-[4/3] w-full max-w-xs rounded-xl xl:mt-auto xl:max-w-none" />
        </div>
      </div>
    </section>
  )
}
