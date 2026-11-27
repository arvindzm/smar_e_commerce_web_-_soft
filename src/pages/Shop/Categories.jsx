import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../../components/common/AssetImage'
import Breadcrumb from '../../components/common/Breadcrumb'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getCategories } from '../../services/categoryService'
import { getProducts } from '../../services/productService'

// Grid of all product categories.
export default function Categories() {
  usePageTitle('Product Categories')
  const categoriesRequest = useFetch(getCategories)
  const productsRequest = useFetch(getProducts)

  if (categoriesRequest.loading || productsRequest.loading) return <Loader page label="Loading categories..." />

  const categories = categoriesRequest.data
  const countFor = (categoryId) => productsRequest.data.filter((product) => product.categoryId === categoryId).length

  return (
    <>
      <Breadcrumb title="Product Categories" items={[{ label: 'Categories' }]} />
      <div className="container-page pt-8 lg:pt-12">
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" text="Categories will appear here once they are added." />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.slug}`}
                  className="card group flex h-full flex-col p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-card sm:p-5"
                >
                  <span className="block overflow-hidden rounded-xl bg-surface">
                    <AssetImage
                      src={category.image}
                      alt={category.name}
                      className="aspect-[4/3] w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                      imgClassName="object-cover"
                    />
                  </span>
                  <span className="mt-4 block font-heading text-base font-bold text-heading group-hover:text-primary sm:text-lg">
                    {category.name}
                  </span>
                  <span className="mt-2 hidden text-sm sm:block">{category.description}</span>
                  <span className="mt-auto flex items-center justify-between pt-3 text-sm font-medium text-primary">
                    {countFor(category.id)} Products <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
