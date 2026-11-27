import { getDefaultPack, isInStock } from './product'

const priceOf = (product) => getDefaultPack(product).salePrice

const sorters = {
  popular: (a, b) => b.sold - a.sold,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => priceOf(a) - priceOf(b),
  'price-desc': (a, b) => priceOf(b) - priceOf(a),
  rating: (a, b) => b.rating - a.rating,
}

export const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

// Applies the shop filters and sorting.
// filters: { query, categoryId, min, max, rating, inStock, sort }
export function filterProducts(products, categories, filters) {
  const query = (filters.query || '').trim().toLowerCase()
  const categoryNames = Object.fromEntries(categories.map((category) => [category.id, category.name]))

  const matches = products.filter((product) => {
    const price = priceOf(product)
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false
    if (filters.min !== null && price < filters.min) return false
    if (filters.max !== null && price > filters.max) return false
    if (filters.rating && product.rating < filters.rating) return false
    if (filters.inStock && !isInStock(product)) return false
    if (query) {
      const packLabels = (product.packSizes || []).map((p) => p.label).join(' ')
      const text = [
        product.name,
        product.description,
        product.sku,
        packLabels,
        categoryNames[product.categoryId],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const words = query.split(/\s+/).filter(Boolean)
      const matchesAll = words.every((word) => text.includes(word))
      if (!matchesAll) return false
    }
    return true
  })

  return matches.sort(sorters[filters.sort] || sorters.popular)
}

// Lowest and highest price in the catalogue, rounded to the nearest 10.
export function getPriceBounds(products) {
  if (products.length === 0) return { min: 0, max: 100 }
  const prices = products.map(priceOf)
  return { min: Math.floor(Math.min(...prices) / 10) * 10, max: Math.ceil(Math.max(...prices) / 10) * 10 }
}
