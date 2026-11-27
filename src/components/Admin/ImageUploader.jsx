import { Plus, X } from 'lucide-react'
import { useRef } from 'react'
import { useToast } from '../../hooks/useToast'
import AssetImage from '../common/AssetImage'

const MAX_SIZE_MB = 2

// Picks images and keeps them as data URLs so the demo can show them straight away.
// PHASE 2: files will be uploaded to the server and this will store the returned URLs.
export default function ImageUploader({ images, onChange, label = 'Product Images', multiple = true }) {
  const showToast = useToast()
  const inputRef = useRef(null)

  function handleFiles(event) {
    const files = [...event.target.files]
    event.target.value = '' // Allow picking the same file again.

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image`, 'error')
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast(`${file.name} is larger than ${MAX_SIZE_MB} MB`, 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = () => onChange((current) => (multiple ? [...current, reader.result] : [reader.result]))
      reader.readAsDataURL(file)
    })
  }

  function removeAt(index) {
    onChange((current) => current.filter((_, position) => position !== index))
  }

  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-heading">{label}</p>
      <ul className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <li key={image.slice(0, 40) + index} className="relative">
            <AssetImage src={image} alt="" compact className="size-24 rounded-xl border border-line" imgClassName="object-cover size-24 rounded-xl" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-danger text-white shadow-sm hover:opacity-90"
              aria-label={`Remove image ${index + 1}`}
            >
              <X size={14} />
            </button>
            {index === 0 && (
              <span className="absolute inset-x-0 bottom-0 rounded-b-xl bg-heading/70 py-0.5 text-center text-[10px] font-medium text-white">
                Main
              </span>
            )}
          </li>
        ))}

        {(multiple || images.length === 0) && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Plus size={20} aria-hidden="true" />
              <span className="text-xs">Add</span>
            </button>
          </li>
        )}
      </ul>

      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleFiles} className="sr-only" />
      <p className="mt-2 text-xs text-muted">
        PNG, JPG or WebP, up to {MAX_SIZE_MB} MB each. The first image is shown on product cards.
        {multiple && ' Drag is not supported yet; remove and re-add to reorder.'}
      </p>
    </div>
  )
}
