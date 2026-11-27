import AssetImage from '../../../components/common/AssetImage'
import Countdown from '../../../components/common/Countdown'
import Price from '../../../components/common/Price'
import ProgressBar from '../../../components/common/ProgressBar'
import Rating from '../../../components/common/Rating'
import AddToCartButton from '../../../components/ProductCard/AddToCartButton'
import ProductMiniItem from '../../../components/ProductCard/ProductMiniItem'
import { Link } from 'react-router-dom'
import { getDefaultPack } from '../../../utils/product'

function MiniList({ title, products }) {
  return (
    <div className="card p-4 sm:p-5">
      <h3 className="rounded-xl bg-primary-light px-4 py-3 !text-lg after:mt-2 after:block after:h-0.5 after:w-16 after:bg-primary">
        {title}
      </h3>
      <ul className="mt-5 space-y-5">
        {products.map((product) => (
          <li key={product.id}>
            <ProductMiniItem product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function DealOfTheWeek({ product, endsAt, title = 'Deal of the week', subtitle }) {
  if (!product) return null
  const pack = getDefaultPack(product)

  return (
    <div className="card flex flex-col p-4 sm:p-5">
      <h3 className="!text-lg">{title}</h3>
      <Countdown targetDate={endsAt} variant="primary" className="mt-3" />
      <p className="mt-2 text-xs text-muted">{subtitle || "Don't miss this opportunity at a special price."}</p>
      <Link to={`/product/${product.slug}`} className="mx-auto mt-4 block w-full max-w-44">
        <AssetImage src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-xl" />
      </Link>
      <div className="mt-4">
        <Rating value={product.rating} count={product.reviewCount} showStars />
      </div>
      <Price regularPrice={pack.regularPrice} salePrice={pack.salePrice} className="mt-1.5" />
      <p className="mt-1 font-heading text-sm font-bold text-heading">
        <Link to={`/product/${product.slug}`} className="hover:text-primary">
          {product.name} · {pack.label}
        </Link>
      </p>
      <ProgressBar value={product.stock} max={product.stock + product.sold} label={`Available only: ${product.stock}`} className="mt-3" />
      <div className="mt-auto pt-4">
        <AddToCartButton product={product} variant="primary" size="md" />
      </div>
    </div>
  )
}

// Three short product lists plus the "Deal of the week" card.
export default function ProductListsSection({
  featured,
  topSelling,
  onSale,
  dealProduct,
  dealEndsAt,
  featuredTitle = 'Featured Products',
  showFeatured = true,
  weeklyDealTitle,
  weeklyDealSubtitle,
}) {
  return (
    <section className="container-page section-gap" aria-label="Product highlights">
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:gap-5 ${
          dealProduct && showFeatured
            ? 'xl:grid-cols-4'
            : !dealProduct && !showFeatured
              ? 'xl:grid-cols-2'
              : 'xl:grid-cols-3'
        }`}
      >
        {showFeatured && <MiniList title={featuredTitle} products={featured} />}
        <MiniList title="Top Selling Products" products={topSelling} />
        <MiniList title="On-sale Products" products={onSale} />
        {dealProduct && (
          <DealOfTheWeek
            product={dealProduct}
            endsAt={dealEndsAt}
            title={weeklyDealTitle}
            subtitle={weeklyDealSubtitle}
          />
        )}
      </div>
    </section>
  )
}
