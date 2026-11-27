import { ArrowRight, Heart, Search, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Badge from '../../components/common/Badge'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import Countdown from '../../components/common/Countdown'
import EmptyState from '../../components/common/EmptyState'
import { Checkbox, Input, Radio, Select, Textarea } from '../../components/common/FormField'
import ImagePlaceholder from '../../components/common/ImagePlaceholder'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import Pagination from '../../components/common/Pagination'
import ProgressBar from '../../components/common/ProgressBar'
import QuantityStepper from '../../components/common/QuantityStepper'
import Rating from '../../components/common/Rating'
import SectionHeading from '../../components/common/SectionHeading'
import { useToast } from '../../hooks/useToast'
import { discountPercent, formatPrice } from '../../utils/formatPrice'

const colors = [
  { name: 'Primary', className: 'bg-primary' },
  { name: 'Primary dark', className: 'bg-primary-dark' },
  { name: 'Primary light', className: 'bg-primary-light' },
  { name: 'Primary pale', className: 'bg-primary-pale' },
  { name: 'Accent', className: 'bg-accent' },
  { name: 'Accent light', className: 'bg-accent-light' },
  { name: 'Danger', className: 'bg-danger' },
  { name: 'Warning', className: 'bg-warning' },
  { name: 'Info', className: 'bg-info' },
  { name: 'Star', className: 'bg-star' },
  { name: 'Heading', className: 'bg-heading' },
  { name: 'Surface', className: 'bg-surface' },
]

// A fixed date 3 days ahead, created once when the page loads.
const saleEnds = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

function Block({ title, children }) {
  return (
    <section className="section-gap">
      <SectionHeading title={title} />
      {children}
    </section>
  )
}

// Reference page showing every design-system piece in one place.
export default function DesignSystem() {
  const showToast = useToast()
  const [quantity, setQuantity] = useState(1)
  const [page, setPage] = useState(2)
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const emailError = email && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : ''

  return (
    <>
      <Breadcrumb title="Design System" items={[{ label: 'Design System' }]} />

      <div className="container-page pb-20">
        <Block title="Colours">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {colors.map((color) => (
              <div key={color.name} className="card overflow-hidden">
                <div className={`h-16 ${color.className}`} />
                <p className="px-3 py-2 text-xs font-medium text-heading">{color.name}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography">
          <div className="card space-y-3 p-5 sm:p-8">
            <h1>Heading 1 — Daily Grocery Order</h1>
            <h2>Heading 2 — Flash Sales Today</h2>
            <h3>Heading 3 — Recommended for you</h3>
            <h4>Heading 4 — Deals of the day</h4>
            <h5>Heading 5 — Product title</h5>
            <h6>Heading 6 — Small title</h6>
            <p>
              Body text uses Inter with clear legibility and crisp typography.
            </p>
            <p className="text-sm text-muted">Small muted text for hints and secondary details.</p>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="card space-y-5 p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                Explore Shop <ShoppingCart size={16} />
              </Button>
              <Button variant="accent">
                Shop Now <ArrowRight size={16} />
              </Button>
              <Button variant="soft">
                Add To Cart <ShoppingCart size={16} />
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Delete</Button>
              <span className="rounded-full bg-primary p-2">
                <Button variant="white">White</Button>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Saving</Button>
              <Button disabled>Disabled</Button>
              <Button to="/shop" variant="outline">
                Link button
              </Button>
            </div>
          </div>
        </Block>

        <Block title="Form fields">
          <div className="card grid gap-5 p-5 sm:p-8 md:grid-cols-2">
            <Input label="Full Name" placeholder="Enter your name" required />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailError}
              required
            />
            <Select label="Category" defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              <option>Flours</option>
              <option>Spices</option>
              <option>Pulses</option>
            </Select>
            <Input label="With error" defaultValue="abc" error="This field is not valid." />
            <div className="md:col-span-2">
              <Textarea label="Message" placeholder="Type your message" />
            </div>
            <div className="flex flex-wrap gap-6">
              <Checkbox label="Remember me" defaultChecked />
              <Radio label="Cash on delivery" name="demo-payment" defaultChecked />
              <Radio label="UPI" name="demo-payment" />
            </div>
          </div>
        </Block>

        <Block title="Badges, rating and price">
          <div className="card flex flex-wrap items-center gap-x-8 gap-y-5 p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="sale">Sale {discountPercent(120, 60)}%</Badge>
              <Badge variant="best">Best Sale</Badge>
              <Badge variant="new">New</Badge>
              <Badge variant="success">In Stock</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Out of Stock</Badge>
              <Badge>Neutral</Badge>
            </div>
            <Rating value={4.8} count="17k" />
            <Rating value={4} count={128} showStars />
            <p className="text-sm">
              <span className="text-base font-semibold text-heading">{formatPrice(149)}</span>{' '}
              <span className="text-muted line-through">{formatPrice(199)}</span>
            </p>
          </div>
        </Block>

        <Block title="Product card base">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            <article className="card group relative p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-card sm:p-4">
              <Badge variant="sale" corner>
                Sale 25%
              </Badge>
              <button
                type="button"
                className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white text-heading shadow-sm transition-colors hover:bg-danger hover:text-white"
                aria-label="Add to wishlist"
                onClick={() => showToast('Added to wishlist')}
              >
                <Heart size={16} />
              </button>
              <div className="overflow-hidden rounded-xl">
                <ImagePlaceholder
                  label="Product image"
                  className="aspect-square rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 line-clamp-2 !text-sm sm:!text-base">Chana Besan 1 kg</h3>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-heading">{formatPrice(149)}</span>{' '}
                <span className="text-muted line-through">{formatPrice(199)}</span>
              </p>
              <div className="mt-1.5">
                <Rating value={4.8} count="17k" />
              </div>
              <ProgressBar value={18} max={35} label="Sold: 18/35" className="mt-3" />
              <Button variant="soft" size="sm" fullWidth className="mt-3" onClick={() => showToast('Added to cart')}>
                Add To Cart <ShoppingCart size={16} />
              </Button>
            </article>
          </div>
          <p className="mt-3 text-sm text-muted">
            Preview of the card style only. The real ProductCard component is built with the homepage.
          </p>
        </Block>

        <Block title="Interactive pieces">
          <div className="card grid gap-8 p-5 sm:p-8 md:grid-cols-2">
            <div>
              <h6 className="mb-3">Quantity stepper</h6>
              <QuantityStepper value={quantity} onChange={setQuantity} max={10} />
            </div>
            <div>
              <h6 className="mb-3">Countdown timers</h6>
              <div className="space-y-3">
                <Countdown targetDate={saleEnds} variant="outline" />
                <Countdown targetDate={saleEnds} variant="primary" />
              </div>
            </div>
            <div>
              <h6 className="mb-3">Progress bar</h6>
              <ProgressBar value={18} max={35} label="Sold: 18/35" className="max-w-xs" />
            </div>
            <div>
              <h6 className="mb-3">Pagination</h6>
              <div className="flex justify-start">
                <Pagination page={page} totalPages={5} onChange={setPage} />
              </div>
            </div>
            <div>
              <h6 className="mb-3">Toast messages and modal</h6>
              <div className="flex flex-wrap gap-3">
                <Button variant="soft" onClick={() => showToast('Product added to cart')}>
                  Success toast
                </Button>
                <Button variant="outline" onClick={() => showToast('Something went wrong', 'error')}>
                  Error toast
                </Button>
                <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              </div>
            </div>
            <div>
              <h6 className="mb-3">Image placeholder</h6>
              <ImagePlaceholder label="Banner image 600 x 300" className="h-28 rounded-xl" />
            </div>
          </div>
        </Block>

        <Block title="Loading and empty states">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card">
              <Loader label="Loading products..." />
            </div>
            <div className="card">
              <EmptyState
                icon={Search}
                title="No products found"
                text="Try a different search term or remove some filters."
                action={<Button to="/shop">Browse all products</Button>}
              />
            </div>
          </div>
        </Block>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
        <p className="text-sm">Modals close with the X button, the Escape key, or a click outside.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  )
}
