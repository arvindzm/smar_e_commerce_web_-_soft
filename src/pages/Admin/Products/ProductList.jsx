import { AlertTriangle, CheckCircle2, Download, Eye, EyeOff, Package, Pencil, Plus, Search, Trash2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import ConfirmDialog from '../../../components/Admin/ConfirmDialog'
import DataTable from '../../../components/Admin/DataTable'
import StatCard from '../../../components/Admin/StatCard'
import AssetImage from '../../../components/common/AssetImage'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import Loader from '../../../components/common/Loader'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getCategories } from '../../../services/categoryService'
import { deleteProduct, getProducts, updateProduct } from '../../../services/productService'
import { exportProductsToExcel } from '../../../utils/exportExcel'
import { formatPrice } from '../../../utils/formatPrice'
import { getDefaultPack } from '../../../utils/product'

export default function ProductList() {
  usePageTitle('Products')
  const showToast = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('') // '' | 'in' | 'low' | 'out'
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  const productsRequest = useFetch(() => getProducts({ includeHidden: true }), refreshKey)
  const categoriesRequest = useFetch(() => getCategories({ includeHidden: true }), refreshKey)

  const refresh = () => setRefreshKey((key) => key + 1)

  async function toggleVisibility(product) {
    await updateProduct(product.id, { visible: !product.visible })
    showToast(`${product.name} is now ${product.visible ? 'hidden' : 'visible'}`)
    refresh()
  }

  async function confirmDelete() {
    setBusy(true)
    await deleteProduct(pendingDelete.id)
    setBusy(false)
    showToast(`${pendingDelete.name} has been deleted`)
    setPendingDelete(null)
    refresh()
  }

  if (productsRequest.loading || categoriesRequest.loading) return <Loader label="Loading products..." />

  const products = productsRequest.data || []
  const categories = categoriesRequest.data || []
  const categoryName = (id) => categories.find((category) => category.id === id)?.name || 'Uncategorised'
  const search = query.trim().toLowerCase()

  const rows = products.filter((product) => {
    if (categoryFilter && product.categoryId !== categoryFilter) return false
    if (stockFilter === 'out' && product.stock !== 0) return false
    if (stockFilter === 'low' && !(product.stock > 0 && product.stock <= 5)) return false
    if (stockFilter === 'in' && product.stock <= 5) return false
    if (!search) return true
    return [product.name, product.sku, categoryName(product.categoryId)].join(' ').toLowerCase().includes(search)
  })

  const visibleCount = products.filter((p) => p.visible).length
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  function handleExportExcel() {
    exportProductsToExcel(rows, categoryName)
    showToast(`Exported ${rows.length} product(s) to Excel!`)
  }

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3">
          <AssetImage src={product.images[0]} alt="" compact className="size-12 shrink-0 rounded-lg border border-line" imgClassName="object-cover size-12 rounded-lg" />
          <div className="min-w-0">
            <p className="font-semibold text-heading">{product.name}</p>
            {product.sku && <p className="font-mono text-[11px] text-muted">{product.sku}</p>}
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (product) => categoryName(product.categoryId) },
    {
      key: 'price',
      header: 'Price',
      render: (product) => {
        const pack = getDefaultPack(product)
        return (
          <span className="whitespace-nowrap">
            <strong className="text-heading">{formatPrice(pack.salePrice)}</strong>
            {pack.salePrice < pack.regularPrice && (
              <span className="ml-1.5 text-xs text-muted line-through">{formatPrice(pack.regularPrice)}</span>
            )}
            <span className="block text-xs text-muted">{pack.label}</span>
          </span>
        )
      },
    },
    {
      key: 'stock',
      header: 'Stock & Sold',
      render: (product) => (
        <div>
          {product.stock === 0 ? (
            <Badge variant="danger">Out of stock</Badge>
          ) : product.stock <= 5 ? (
            <Badge variant="warning">{product.stock} left</Badge>
          ) : (
            <span className="font-medium text-heading">{product.stock} in stock</span>
          )}
          <span className="block text-[11px] text-muted mt-0.5">{product.sold || 0} sold</span>
        </div>
      ),
    },
    {
      key: 'flags',
      header: 'Status',
      render: (product) => (
        <div className="flex flex-wrap gap-1.5">
          {product.featured && <Badge variant="best">Featured</Badge>}
          <Badge variant={product.visible ? 'success' : 'neutral'}>{product.visible ? 'Visible' : 'Hidden'}</Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (product) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => toggleVisibility(product)}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            aria-label={product.visible ? `Hide ${product.name}` : `Show ${product.name}`}
          >
            {product.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            aria-label={`Edit ${product.name}`}
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setPendingDelete(product)}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-danger-light hover:text-danger"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Products &amp; Inventory" description={`${products.length} products in your catalog.`}>
        <Button type="button" variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5">
          <Download size={15} /> Export Inventory (Excel)
        </Button>
        <Button to="/admin/products/new" size="sm" className="gap-1.5">
          <Plus size={16} aria-hidden="true" /> Add Product
        </Button>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total SKUs" value={products.length} subtitle="Catalog items" tone="primary" />
        <StatCard icon={CheckCircle2} label="Active Storefront" value={visibleCount} subtitle="Visible to shoppers" tone="info" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStockCount} subtitle="5 or fewer units" tone="warning" />
        <StatCard icon={XCircle} label="Out of Stock" value={outOfStockCount} subtitle="Needs restock" tone="purple" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3.5 sm:max-w-sm focus-within:border-primary">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product name or SKU"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock (&gt;5)</option>
          <option value="low">Low Stock (1-5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <EmptyState
            title={search || categoryFilter || stockFilter ? 'No products match your filters' : 'No products yet'}
            text={search || categoryFilter || stockFilter ? 'Try a different search or filter.' : 'Add your first product to get started.'}
            action={!search && !categoryFilter && !stockFilter && <Button to="/admin/products/new">Add Product</Button>}
          />
        </div>
      ) : (
        <DataTable caption="All products" columns={columns} rows={rows} getRowKey={(product) => product.id} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product"
        message={`Delete "${pendingDelete?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={busy}
      />
    </div>
  )
}
