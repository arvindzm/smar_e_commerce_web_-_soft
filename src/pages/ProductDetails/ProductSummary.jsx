import { MessageCircle, Share2, Zap } from 'lucide-react'
import { useState } from 'react'
import Badge from '../../components/common/Badge'
import Price from '../../components/common/Price'
import ProgressBar from '../../components/common/ProgressBar'
import QuantityStepper from '../../components/common/QuantityStepper'
import Rating from '../../components/common/Rating'
import AddToCartButton from '../../components/ProductCard/AddToCartButton'
import WishlistButton from '../../components/ProductCard/WishlistButton'
import { site } from '../../data/site'
import { useToast } from '../../hooks/useToast'
import { discountPercent } from '../../utils/formatPrice'
import { getDefaultPack, getPack, isInStock } from '../../utils/product'

// Name, price, pack-size choice, quantity and the buy buttons.
export default function ProductSummary({ product }) {
  const showToast = useToast()
  const [packLabel, setPackLabel] = useState(getDefaultPack(product).label)
  const [quantity, setQuantity] = useState(1)

  const pack = getPack(product, packLabel)
  const discount = discountPercent(pack.regularPrice, pack.salePrice)
  const available = isInStock(product)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        showToast('Product link copied')
      }
    } catch {
      // The customer closed the share sheet; nothing to do.
    }
  }

  const whatsappText = encodeURIComponent(`Hello, I would like to order ${product.name} (${pack.label}) x ${quantity}.`)

  return (
    <div>
      <h1 className="!text-2xl sm:!text-3xl">{product.name}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-5">
        <Rating value={product.rating} count={product.reviewCount} showStars />
        {product.sku && (
          <p className="text-xs">
            SKU: <span className="font-medium text-heading">{product.sku}</span>
          </p>
        )}
      </div>

      <p className="mt-5">{product.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} large />
        {discount > 0 && <Badge variant="sale">Save {discount}%</Badge>}
      </div>
      <p className="mt-1 text-xs">Price for {pack.label}, inclusive of all taxes.</p>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-sm font-semibold text-heading">Weight / Pack Size</legend>
        <div className="flex flex-wrap gap-2">
          {product.packSizes.map((option) => (
            <label
              key={option.label}
              className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary ${
                option.label === packLabel
                  ? 'border-primary bg-primary text-white'
                  : 'border-line text-heading hover:border-primary hover:text-primary'
              }`}
            >
              <input
                type="radio"
                name="pack-size"
                className="sr-only"
                checked={option.label === packLabel}
                onChange={() => setPackLabel(option.label)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 rounded-xl bg-primary-pale p-4">
        {available ? (
          <>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-heading">
              <Zap size={16} className="fill-primary text-primary" aria-hidden="true" />
              {product.stock <= 5 ? 'Products are almost sold out' : 'In stock and ready to ship'}
            </p>
            <ProgressBar value={product.stock} max={product.stock + product.sold} label={`Available only: ${product.stock}`} />
          </>
        ) : (
          <p className="text-sm font-semibold text-danger">This product is currently out of stock.</p>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-heading">Quantity</p>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div className="shrink-0">
            <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
          </div>
          <div className="min-w-28 flex-1">
            <AddToCartButton
              product={product}
              packLabel={packLabel}
              quantity={quantity}
              variant="primary"
              size="md"
              className="!py-2.5 !px-3 !text-xs sm:!text-sm whitespace-nowrap"
            />
          </div>
          <div className="min-w-24 flex-1">
            <AddToCartButton
              product={product}
              packLabel={packLabel}
              quantity={quantity}
              variant="outline"
              size="md"
              className="!py-2.5 !px-3 !text-xs sm:!text-sm whitespace-nowrap !border-primary !text-primary hover:!bg-primary hover:!text-white"
              redirectToCheckout={true}
              label="Buy Now"
            />
          </div>
          <WishlistButton product={product} className="!size-10 shrink-0 border border-line shadow-none" />
          <button
            type="button"
            onClick={share}
            aria-label="Share this product"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-heading transition-colors hover:bg-primary hover:text-white"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {site.whatsapp && (
        <a
          href={`https://wa.me/${site.whatsapp}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[#1ebe5b]"
        >
          <MessageCircle size={16} aria-hidden="true" /> Order on WhatsApp
        </a>
      )}
    </div>
  )
}
