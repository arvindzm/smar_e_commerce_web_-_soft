import { Plus, Trash2 } from 'lucide-react'
import { Input } from '../../../components/common/FormField'

// Rows of pack size + regular price + sale price. The first row is the default
// shown on product cards.
export default function PackSizeEditor({ packSizes, errors = {}, onChange }) {
  function updateRow(index, field, value) {
    onChange(packSizes.map((pack, position) => (position === index ? { ...pack, [field]: value } : pack)))
  }

  function addRow() {
    onChange([...packSizes, { label: '', regularPrice: '', salePrice: '' }])
  }

  function removeRow(index) {
    onChange(packSizes.filter((_, position) => position !== index))
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-heading">
        Weight / Pack Sizes <span className="text-danger">*</span>
      </legend>
      <p className="mb-3 text-xs text-muted">The first row is the default price shown on product cards.</p>

      <ul className="space-y-3">
        {packSizes.map((pack, index) => (
          <li key={index} className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start">
            <Input
              label={index === 0 ? 'Pack size' : undefined}
              placeholder="e.g. 1 kg"
              value={pack.label}
              onChange={(event) => updateRow(index, 'label', event.target.value)}
              error={errors[`pack${index}label`]}
            />
            <Input
              label={index === 0 ? 'Regular price' : undefined}
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="0"
              value={pack.regularPrice}
              onChange={(event) => updateRow(index, 'regularPrice', event.target.value)}
              error={errors[`pack${index}regular`]}
            />
            <Input
              label={index === 0 ? 'Sale price' : undefined}
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Same as regular"
              value={pack.salePrice}
              onChange={(event) => updateRow(index, 'salePrice', event.target.value)}
              error={errors[`pack${index}sale`]}
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={packSizes.length === 1}
              className={`flex size-11 items-center justify-center rounded-lg text-heading transition-colors hover:bg-danger-light hover:text-danger disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-heading ${index === 0 ? 'sm:mt-8' : ''}`}
              aria-label={`Remove pack size ${index + 1}`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary"
      >
        <Plus size={15} aria-hidden="true" /> Add another pack size
      </button>
    </fieldset>
  )
}
