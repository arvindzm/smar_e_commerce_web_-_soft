import { Link } from 'react-router-dom'
import AssetImage from '../common/AssetImage'

// Round category tile with food imagery, hindi badge, and count
export default function CategoryCard({ category, productCount }) {
  return (
    <Link to={`/category/${category.slug}`} className="group block text-center">
      <span className="mx-auto block aspect-square w-24 sm:w-28 md:w-32 overflow-hidden rounded-full border-2 border-line bg-surface p-1 shadow-xs transition-all duration-300 group-hover:border-primary group-hover:shadow-card">
        <AssetImage
          src={category.image}
          alt={category.name}
          compact
          className="size-full rounded-full transition-transform duration-500 group-hover:scale-110"
          imgClassName="object-cover"
        />
      </span>
      <span className="mt-3 block font-heading text-sm font-bold text-heading transition-colors group-hover:text-primary sm:text-base">
        {category.name}
      </span>
      <span className="mt-0.5 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-[11px] font-semibold text-primary">
        {productCount} {productCount === 1 ? 'Item' : 'Items'}
      </span>
    </Link>
  )
}
