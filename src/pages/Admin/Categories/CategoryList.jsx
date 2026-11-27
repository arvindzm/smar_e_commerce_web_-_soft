import { Download, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import ConfirmDialog from '../../../components/Admin/ConfirmDialog'
import DataTable from '../../../components/Admin/DataTable'
import ImageUploader from '../../../components/Admin/ImageUploader'
import AssetImage from '../../../components/common/AssetImage'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { Checkbox, Input, Textarea } from '../../../components/common/FormField'
import Loader from '../../../components/common/Loader'
import Modal from '../../../components/common/Modal'
import { useFetch } from '../../../hooks/useFetch'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../../services/categoryService'
import { getProducts } from '../../../services/productService'
import { exportCategoriesToExcel } from '../../../utils/exportExcel'

const emptyCategory = { name: '', description: '', visible: true }

export default function CategoryList() {
  usePageTitle('Categories')
  const showToast = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = edit
  const [values, setValues] = useState(emptyCategory)
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const categoriesRequest = useFetch(() => getCategories({ includeHidden: true }), refreshKey)
  const productsRequest = useFetch(() => getProducts({ includeHidden: true }), refreshKey)

  const refresh = () => setRefreshKey((key) => key + 1)

  function openForm(category) {
    setEditing(category || {})
    setValues(
      category
        ? {
            name: category.name,
            description: category.description || '',
            visible: category.visible,
          }
        : emptyCategory,
    )
    setImages(category?.image ? [category.image] : [])
    setErrors({})
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!values.name.trim()) {
      setErrors({ name: 'Category name is required.' })
      return
    }

    const data = { ...values, image: images[0] || '' }
    setBusy(true)
    if (editing.id) {
      await updateCategory(editing.id, data)
      showToast(`${data.name} has been updated`)
    } else {
      await createCategory(data)
      showToast(`${data.name} has been added`)
    }
    setBusy(false)
    setEditing(null)
    refresh()
  }

  async function toggleVisibility(category) {
    await updateCategory(category.id, { visible: !category.visible })
    showToast(`${category.name} is now ${category.visible ? 'hidden' : 'visible'}`)
    refresh()
  }

  async function confirmDelete() {
    setBusy(true)
    await deleteCategory(pendingDelete.id)
    setBusy(false)
    showToast(`${pendingDelete.name} has been deleted`)
    setPendingDelete(null)
    refresh()
  }

  if (categoriesRequest.loading || productsRequest.loading) return <Loader label="Loading categories..." />

  const countFor = (categoryId) => productsRequest.data.filter((product) => product.categoryId === categoryId).length

  const columns = [
    {
      key: 'category',
      header: 'Category',
      render: (category) => (
        <div className="flex items-center gap-3">
          <AssetImage src={category.image} alt="" compact className="size-12 shrink-0 rounded-lg" imgClassName="object-cover size-12 rounded-lg" />
          <div className="min-w-0">
            <p className="font-medium text-heading">{category.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'slug', header: 'Link', render: (category) => <code className="text-xs text-muted">/category/{category.slug}</code> },
    { key: 'products', header: 'Products', render: (category) => countFor(category.id) },
    {
      key: 'visible',
      header: 'Status',
      render: (category) => <Badge variant={category.visible ? 'success' : 'neutral'}>{category.visible ? 'Visible' : 'Hidden'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (category) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => toggleVisibility(category)}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            aria-label={category.visible ? `Hide ${category.name}` : `Show ${category.name}`}
          >
            {category.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            type="button"
            onClick={() => openForm(category)}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-primary-light hover:text-primary"
            aria-label={`Edit ${category.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(category)}
            className="flex size-9 items-center justify-center rounded-lg text-heading transition-colors hover:bg-danger-light hover:text-danger"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  const productCount = pendingDelete ? countFor(pendingDelete.id) : 0

  return (
    <>
      <AdminPageHeader title="Categories" description="Categories you add here appear in the product form and on the website.">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            exportCategoriesToExcel(categoriesRequest.data, countFor)
            showToast(`Exported ${categoriesRequest.data.length} categories to Excel!`)
          }}
          className="gap-1.5"
        >
          <Download size={15} /> Export Excel
        </Button>
        <Button onClick={() => openForm(null)} size="sm" className="gap-1.5">
          <Plus size={16} aria-hidden="true" /> Add Category
        </Button>
      </AdminPageHeader>

      {categoriesRequest.data.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No categories yet"
            text="Add your first category so products can be grouped."
            action={<Button onClick={() => openForm(null)}>Add Category</Button>}
          />
        </div>
      ) : (
        <DataTable caption="All categories" columns={columns} rows={categoriesRequest.data} getRowKey={(category) => category.id} />
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Category Name"
            required
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }))
              setErrors({})
            }}
            error={errors.name}
          />
          <Textarea
            label="Description"
            rows={3}
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          />
          <ImageUploader images={images} onChange={setImages} label="Category Image" multiple={false} />
          <Checkbox
            label="Show on the website"
            checked={values.visible}
            onChange={(event) => setValues((current) => ({ ...current, visible: event.target.checked }))}
          />
          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              {editing?.id ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete category"
        message={
          productCount > 0
            ? `"${pendingDelete?.name}" still has ${productCount} product${productCount === 1 ? '' : 's'}. Those products will have no category until you move them. Delete anyway?`
            : `Delete "${pendingDelete?.name}"? This cannot be undone.`
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={busy}
      />
    </>
  )
}
