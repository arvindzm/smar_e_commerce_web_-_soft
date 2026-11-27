import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Sends the customer to /search?q=...&category=...
export default function SearchBar({ categories = [] }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(() => params.get('q') || '')
  const [category, setCategory] = useState(() => params.get('category') || '')

  useEffect(() => {
    setQuery(params.get('q') || '')
    setCategory(params.get('category') || '')
  }, [params])

  function handleSubmit(event) {
    event.preventDefault()
    const nextParams = new URLSearchParams()
    if (query.trim()) nextParams.set('q', query.trim())
    if (category) nextParams.set('category', category)
    navigate(nextParams.size ? `/search?${nextParams}` : '/shop')
  }

  function handleCategoryChange(event) {
    const nextCat = event.target.value
    setCategory(nextCat)
    if (query.trim()) {
      const nextParams = new URLSearchParams()
      nextParams.set('q', query.trim())
      if (nextCat) nextParams.set('category', nextCat)
      navigate(`/search?${nextParams}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full items-center rounded-lg border border-line bg-white p-1 transition-colors focus-within:border-primary shadow-xs"
    >
      <select
        value={category}
        onChange={handleCategoryChange}
        aria-label="Search in category"
        className="hidden max-w-44 border-r border-line bg-transparent py-2 pl-3 pr-2 text-xs md:text-sm text-heading focus:outline-none md:block"
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for atta, besan, masala, dal..."
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-9 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-dark"
      >
        <Search size={17} />
      </button>
    </form>
  )
}

