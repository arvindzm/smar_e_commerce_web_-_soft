import { useState } from 'react'
import AssetImage from '../../components/common/AssetImage'
import ProductBadge from '../../components/ProductCard/ProductBadge'

// Large product image with clickable thumbnails underneath.
export default function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = product.images.length > 0 ? product.images : [null]

  return (
    <div>
      <div className="card group relative overflow-hidden p-4 sm:p-6">
        <ProductBadge product={product} />
        <AssetImage
          src={images[activeIndex]}
          alt={product.name}
          className="aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <li key={image || index}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={`block w-full overflow-hidden rounded-xl border-2 p-1 transition-colors ${
                  index === activeIndex ? 'border-primary' : 'border-line hover:border-primary/50'
                }`}
              >
                <AssetImage src={image} alt="" compact className="aspect-square w-full rounded-lg" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
