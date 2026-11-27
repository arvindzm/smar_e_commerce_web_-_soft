import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '../../utils/formatPrice'

// "Description" and "Product Information" tabs.
export default function ProductTabs({ product, category }) {
  const [tab, setTab] = useState('description')

  const tabButton = (name) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-colors ${
      tab === name ? 'bg-primary text-white' : 'text-body hover:bg-primary-light hover:text-primary'
    }`

  const details = [
    ['Product Name', product.name],
    ['Category', category?.name || 'Uncategorised'],
    ['Available Pack Sizes', product.packSizes.map((pack) => `${pack.label} - ${formatPrice(pack.salePrice)}`).join(', ')],
    ['SKU', product.sku || 'Not set'],
    ['Availability', product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'],
  ]

  return (
    <div className="card">
      <div className="flex flex-wrap gap-2 border-b border-line p-4 sm:px-6" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'description'} className={tabButton('description')} onClick={() => setTab('description')}>
          Description
        </button>
        <button type="button" role="tab" aria-selected={tab === 'information'} className={tabButton('information')} onClick={() => setTab('information')}>
          Product Information
        </button>
      </div>
      <div className="p-5 sm:p-8" role="tabpanel">
        {tab === 'description' ? (
          <>
            <h2 className="!text-xl">Product Description</h2>
            <p className="mt-3 max-w-3xl whitespace-pre-line">{product.description}</p>
          </>
        ) : (
          <>
            <h2 className="!text-xl">Product Information</h2>
            <dl className="mt-4 space-y-3">
              {details.map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="inline font-semibold text-heading">{label}: </dt>
                    <dd className="inline">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </div>
  )
}
