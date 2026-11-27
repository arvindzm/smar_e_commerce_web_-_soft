import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import Pagination from '../../components/common/Pagination'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductCardHorizontal from '../../components/ProductCard/ProductCardHorizontal'
import { useFetch } from '../../hooks/useFetch'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getCategories } from '../../services/categoryService'
import { getProducts } from '../../services/productService'
import { filterProducts, getPriceBounds } from '../../utils/filterProducts'
import ShopFilters from './ShopFilters'
import ShopToolbar from './ShopToolbar'

const PAGE_SIZE = 12
const toNumber = (value) => (value === null || value === '' ? null : Number(value))

// One page serves three routes:
//   /shop              all products
//   /category/:slug    one category
//   /search?q=...      search results
// Every filter is kept in the URL, so a filtered view can be shared or bookmarked.
export default function Shop() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const productsRequest = useFetch(getProducts)
  const categoriesRequest = useFetch(getCategories)

  const isSearch = pathname === '/search'
  const query = params.get('q') || ''
  const categorySlug = slug || params.get('category') || ''
  const categories = categoriesRequest.data || []
  const products = productsRequest.data || []
  const category = categories.find((item) => item.slug === categorySlug)

  const title = isSearch ? (query ? `Search results for "${query}"` : 'Search') : category ? category.name : 'Shop'
  usePageTitle(title)

  if (productsRequest.loading || categoriesRequest.loading) return <Loader page label="Loading products..." />

  if (categorySlug && !category) {
    return (
      <EmptyState
        icon={SearchX}
        title="Category not found"
        text="This category does not exist or is no longer available."
        action={<Button to="/categories">Browse categories</Button>}
      />
    )
  }

  const filters = {
    query,
    categorySlug,
    categoryId: category?.id || '',
    min: toNumber(params.get('min')),
    max: toNumber(params.get('max')),
    rating: toNumber(params.get('rating')),
    inStock: params.get('stock') === '1',
    sort: params.get('sort') || 'popular',
  }

  const results = filterProducts(products, categories, filters)
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), totalPages)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {}
  products.forEach((product) => {
    counts[product.categoryId] = (counts[product.categoryId] || 0) + 1
  })

  // Updates URL filters. Any change other than `page` goes back to page 1.
  function updateParams(changes) {
    const next = new URLSearchParams(params)
    if (!('page' in changes)) next.delete('page')
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === false) next.delete(key)
      else next.set(key, value === true ? '1' : String(value))
    })
    setParams(next)
  }

  function selectCategory(nextSlug) {
    setFiltersOpen(false)
    if (isSearch) {
      updateParams({ category: nextSlug })
      return
    }
    const next = new URLSearchParams(params)
    next.delete('page')
    next.delete('category')
    const suffix = next.size ? `?${next}` : ''
    navigate(nextSlug ? `/category/${nextSlug}${suffix}` : `/shop${suffix}`)
  }

  function clearFilters() {
    setFiltersOpen(false)
    navigate(isSearch && query ? `/search?q=${encodeURIComponent(query)}` : '/shop')
  }

  function changePage(nextPage) {
    updateParams({ page: nextPage === 1 ? '' : nextPage })
    window.scrollTo({ top: 0 })
  }

  const filterPanel = (
    <ShopFilters
      // Remount when the price in the URL changes so the slider shows the applied range.
      key={`${filters.min}-${filters.max}`}
      categories={categories}
      counts={counts}
      totalCount={products.length}
      filters={filters}
      priceBounds={getPriceBounds(products)}
      onCategory={selectCategory}
      onChange={updateParams}
      onClear={clearFilters}
    />
  )

  const breadcrumbItems = isSearch
    ? [{ label: 'Search' }]
    : category
      ? [{ label: 'Shop', to: '/shop' }, { label: category.name }]
      : [{ label: 'Shop' }]

  return (
    <>
      <Breadcrumb title={title} items={breadcrumbItems} />

      <div className="container-page grid gap-8 pt-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:pt-12">
        <aside className="hidden lg:block" aria-label="Filters">
          {filterPanel}
        </aside>

        <section aria-labelledby="product-list-heading">
          {/* Keeps the heading order h1 -> h2 -> h3 for screen readers. */}
          <h2 id="product-list-heading" className="sr-only">
            Products
          </h2>
          <ShopToolbar
            from={results.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            to={Math.min(page * PAGE_SIZE, results.length)}
            total={results.length}
            view={view}
            onViewChange={setView}
            sort={filters.sort}
            onSortChange={(sort) => updateParams({ sort: sort === 'popular' ? '' : sort })}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          {pageItems.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={SearchX}
                title="No products found"
                text="Try a different search term or remove some filters."
                action={<Button onClick={clearFilters}>Clear all filters</Button>}
              />
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 xl:gap-5 2xl:grid-cols-5">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
              {pageItems.map((product) => (
                <ProductCardHorizontal key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </div>
        </section>
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        {filterPanel}
      </Modal>
    </>
  )
}
