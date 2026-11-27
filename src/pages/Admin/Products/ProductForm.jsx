import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import ImageUploader from '../../../components/Admin/ImageUploader'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { Checkbox, Input, Select, Textarea } from '../../../components/common/FormField'
import Loader from '../../../components/common/Loader'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getCategories } from '../../../services/categoryService'
import { createProduct, getProductById, updateProduct } from '../../../services/productService'
import PackSizeEditor from './PackSizeEditor'

// Turns a saved product into the strings the form fields need.
function toFormValues(product) {
  if (!product) {
    return {
      values: { name: '', description: '', categoryId: '', sku: '', stock: '', badge: '', customBadge: '', featured: false, visible: true },
      packSizes: [{ label: '', regularPrice: '', salePrice: '' }],
      images: [],
    }
  }
  return {
    values: {
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      sku: product.sku || '',
      stock: String(product.stock),
      badge: product.badge === 'best' ? '' : (product.badge || ''),
      customBadge: product.customBadge || '',
      featured: product.featured,
      visible: product.visible,
    },
    packSizes: product.packSizes.map((pack) => ({
      label: pack.label,
      regularPrice: String(pack.regularPrice),
      salePrice: String(pack.salePrice),
    })),
    images: product.images,
  }
}

// The fields themselves. Rendered only once any product being edited has loaded,
// so every field starts with the right value.
function ProductFields({ product, categories }) {
  const navigate = useNavigate()
  const showToast = useToast()
  const isEdit = Boolean(product)

  const [initial] = useState(() => toFormValues(product))
  const [values, setValues] = useState(initial.values)
  const [packSizes, setPackSizes] = useState(initial.packSizes)
  const [images, setImages] = useState(initial.images)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  function validate() {
    const found = {}
    if (!values.name.trim()) found.name = 'Product name is required.'
    if (!values.categoryId) found.categoryId = 'Please select a category.'
    if (values.stock === '' || Number(values.stock) < 0) found.stock = 'Enter the stock quantity (0 or more).'
    if (!values.description.trim()) found.description = 'A short description is required.'

    packSizes.forEach((pack, index) => {
      if (!pack.label.trim()) found[`pack${index}label`] = 'Required.'
      if (pack.regularPrice === '' || Number(pack.regularPrice) <= 0) found[`pack${index}regular`] = 'Enter a price.'
      if (pack.salePrice !== '' && Number(pack.salePrice) > Number(pack.regularPrice)) {
        found[`pack${index}sale`] = 'Cannot exceed the regular price.'
      }
    })

    return found
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      showToast('Please correct the highlighted fields', 'error')
      setTimeout(() => document.querySelector('main [aria-invalid="true"]')?.focus(), 0)
      return
    }

    const data = {
      ...values,
      stock: Number(values.stock),
      badge: values.badge || null,
      customBadge: values.badge === 'custom' ? (values.customBadge?.trim() || null) : null,
      images,
      // An empty sale price means the product is not discounted.
      packSizes: packSizes.map((pack) => ({
        label: pack.label.trim(),
        regularPrice: Number(pack.regularPrice),
        salePrice: Number(pack.salePrice === '' ? pack.regularPrice : pack.salePrice),
      })),
    }

    setBusy(true)
    if (isEdit) {
      await updateProduct(product.id, data)
      showToast(`${data.name} has been updated`)
    } else {
      await createProduct(data)
      showToast(`${data.name} has been added`)
    }
    setBusy(false)
    navigate('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AdminPageHeader
        title={isEdit ? 'Edit Product' : 'Add Product'}
        description={isEdit ? 'Update the details of this product.' : 'Add a new product to your store.'}
      >
        <Button to="/admin/products" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          {isEdit ? 'Save Changes' : 'Add Product'}
        </Button>
      </AdminPageHeader>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="card space-y-5 p-5 sm:p-6">
            <h2 className="!text-lg">Basic Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Product Name" required value={values.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} />
              <Input label="SKU / Item Code" placeholder="e.g. FLOUR-5KG" value={values.sku} onChange={(event) => setField('sku', event.target.value)} />
            </div>
            <Textarea label="Description" required rows={4} value={values.description} onChange={(event) => setField('description', event.target.value)} error={errors.description} />
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-5 !text-lg">Pricing &amp; Pack Sizes</h2>
            <PackSizeEditor packSizes={packSizes} errors={errors} onChange={setPackSizes} />
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-5 !text-lg">Images</h2>
            <ImageUploader images={images} onChange={setImages} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="card space-y-5 p-5 sm:p-6">
            <h2 className="!text-lg">Organisation</h2>
            <Select label="Category" required value={values.categoryId} onChange={(event) => setField('categoryId', event.target.value)} error={errors.categoryId}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Input label="Stock Quantity" required type="number" min="0" inputMode="numeric" value={values.stock} onChange={(event) => setField('stock', event.target.value)} error={errors.stock} />
            <Select label="Offer / Badge Tag" value={values.badge} onChange={(event) => setField('badge', event.target.value)}>
              <option value="">None (No Offer Badge)</option>
              <option value="offer">Special Offer</option>
              <option value="sale">Sale / Discount</option>
              <option value="deal">Hot Deal</option>
              <option value="new">New Arrival</option>
              <option value="custom">Custom Offer Text</option>
            </Select>
            {values.badge === 'custom' && (
              <Input
                label="Custom Offer Tag Text"
                placeholder="e.g. 20% OFF or Festive Offer"
                value={values.customBadge}
                onChange={(event) => setField('customBadge', event.target.value)}
              />
            )}
          </div>

          <div className="card space-y-4 p-5 sm:p-6">
            <h2 className="!text-lg">Visibility</h2>
            <Checkbox label="Featured product" checked={values.featured} onChange={(event) => setField('featured', event.target.checked)} />
            <Checkbox label="Show on the website" checked={values.visible} onChange={(event) => setField('visible', event.target.checked)} />
            <p className="text-xs text-muted">Hidden products stay in your admin list but are not shown to customers.</p>
          </div>
        </div>
      </div>
    </form>
  )
}

// Used for both "Add Product" and "Edit Product".
export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  usePageTitle(isEdit ? 'Edit Product' : 'Add Product')

  const categoriesRequest = useFetch(() => getCategories({ includeHidden: true }))
  const productRequest = useFetch(() => (isEdit ? getProductById(id) : Promise.resolve(null)), id || 'new')

  if (categoriesRequest.loading || productRequest.loading) return <Loader label="Loading..." />

  if (isEdit && !productRequest.data) {
    return (
      <EmptyState
        icon={SearchX}
        title="Product not found"
        text="This product may have been deleted."
        action={<Button to="/admin/products">Back to products</Button>}
      />
    )
  }

  return <ProductFields key={id || 'new'} product={productRequest.data} categories={categoriesRequest.data} />
}
