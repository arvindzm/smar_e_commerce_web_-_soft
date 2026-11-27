import { useState } from 'react'
import SectionHeading from '../../../components/common/SectionHeading'
import ProductCard from '../../../components/ProductCard/ProductCard'

// Product grid with category tabs.
export default function RecommendedSection({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const tabs = [{ id: 'all', name: 'All' }, ...categories]
  const shown = products
    .filter((product) => activeCategory === 'all' || product.categoryId === activeCategory)
    .slice(0, 12)

  return (
    <section className="container-page section-gap">
      <SectionHeading title="Recommended for you">
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === tab.id ? 'bg-primary text-white' : 'text-body hover:bg-primary-light hover:text-primary'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </SectionHeading>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 2xl:grid-cols-6">
        {shown.map((product, index) => (
          // 12 cards fill 2, 3, 4 and 6 columns evenly; with 5 columns only 10 are shown.
          <div key={product.id} className={index >= 10 ? 'xl:hidden 2xl:block' : ''}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
