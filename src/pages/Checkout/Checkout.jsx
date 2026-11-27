import { ShieldCheck, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { Checkbox } from '../../components/common/FormField'
import Loader from '../../components/common/Loader'
import PaymentGatewayModal from '../../components/Checkout/PaymentGatewayModal'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useCartLines } from '../../hooks/useCartLines'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { createOrder } from '../../services/orderService'
import { loadFromStorage } from '../../utils/storage'
import { validateCheckout } from '../../utils/validators'
import CartSummary from '../Cart/CartSummary'
import CheckoutForm from './CheckoutForm'
import OrderSummary from './OrderSummary'
import PaymentMethods from './PaymentMethods'

const emptyForm = {
  firstName: '', lastName: '', phone: '', email: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
  notes: '', agree: true,
}

export default function Checkout() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const showToast = useToast()
  const { coupon, clearCart } = useCart()
  const { lines, totals, loading } = useCartLines()

  const { user } = useAuth()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [showGatewayModal, setShowGatewayModal] = useState(false)

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ')
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || ''
      const saved = loadFromStorage('grocery_v2_saved_addresses', [])
      const def = saved.find((a) => a.isDefault) || saved[0]
      setValues((curr) => ({
        ...curr,
        firstName: curr.firstName || firstName,
        lastName: curr.lastName || lastName,
        phone: curr.phone || user.phone || def?.phone || '',
        email: curr.email || user.email || '',
        line1: curr.line1 || def?.line1 || '',
        line2: curr.line2 || def?.line2 || '',
        city: curr.city || def?.city || 'Lucknow',
        state: curr.state || def?.state || 'Uttar Pradesh',
        pincode: curr.pincode || def?.pincode || '',
      }))
    }
  }, [user])

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    // Clear that field's error as soon as it is edited.
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  async function executeOrderCreation(paymentId = null, method = payment, paymentStatus = 'Pending') {
    if (!user) {
      showToast('Please login or register first to purchase products.', 'error')
      navigate('/login', { replace: true, state: { from: '/checkout' } })
      return
    }
    setPlacing(true)
    try {
      const order = await createOrder({
        userId: user.id,
        customer: {
          name: `${values.firstName.trim()} ${values.lastName.trim()}`,
          phone: values.phone.trim(),
          email: values.email.trim(),
        },
        address: {
          line1: values.line1.trim(),
          line2: values.line2.trim(),
          city: values.city.trim(),
          state: values.state,
          pincode: values.pincode.trim(),
        },
        notes: values.notes.trim(),
        paymentMethod: method,
        paymentStatus,
        paymentId,
        couponCode: coupon?.code || null,
        deliveryPartner: 'SMAR In-House Express',
        trackingNumber: `SMAR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        items: lines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          packLabel: line.pack.label,
          unitPrice: line.pack.salePrice,
          price: line.pack.salePrice,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
          image: line.product.images?.[0] || '',
        })),
        totals,
      })

      clearCart()
      setShowGatewayModal(false)
      navigate(`/order-confirmation/${order.id}`, { replace: true })
    } catch (err) {
      showToast(err?.response?.data?.error || 'Could not process order. Please try again.', 'error')
    } finally {
      setPlacing(false)
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    const found = validateCheckout(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      showToast('Please correct the highlighted fields', 'error')
      setTimeout(() => document.querySelector('main [aria-invalid="true"]')?.focus(), 0)
      return
    }

    if (payment === 'cod') {
      executeOrderCreation(null, 'cod', 'Pending')
    } else {
      // Trigger interactive payment gateway modal (UPI / Card / NetBanking)
      setShowGatewayModal(true)
    }
  }

  if (loading) return <Loader page label="Loading checkout..." />

  if (lines.length === 0) {
    return (
      <>
        <Breadcrumb title="Checkout" items={[{ label: 'Checkout' }]} />
        <div className="container-page pt-8 lg:pt-12">
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              text="Add some products before checking out."
              action={<Button to="/shop">Start shopping</Button>}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb title="Checkout" items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <form onSubmit={handleFormSubmit} noValidate className="container-page pt-8 lg:pt-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
          <div className="space-y-6">
            <CheckoutForm values={values} errors={errors} onChange={setField} />
            <PaymentMethods value={payment} onChange={setPayment} />
          </div>

          <div className="space-y-6">
            <OrderSummary lines={lines} />
            <CartSummary totals={totals} showCheckoutButton={false} showCouponForm={true} />

            <div className="card p-5 sm:p-6">
              <Checkbox
                label="I agree to the Terms & Conditions and Privacy Policy."
                checked={values.agree}
                onChange={(event) => setField('agree', event.target.checked)}
                aria-invalid={errors.agree ? true : undefined}
              />
              {errors.agree && (
                <p className="mt-2 text-xs text-danger" role="alert">
                  {errors.agree}
                </p>
              )}
              <Button type="submit" fullWidth size="lg" loading={placing} className="mt-5">
                {payment === 'cod' ? 'Place Order (COD)' : `Proceed to Pay ${totals.total ? '₹' + totals.total : ''}`}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck size={14} className="text-primary" />
                <span>100% Safe Checkout & Fresh Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Interactive Payment Gateway (UPI QR / Cards / Net Banking) */}
      <PaymentGatewayModal
        isOpen={showGatewayModal}
        onClose={() => setShowGatewayModal(false)}
        total={totals.total}
        paymentMethod={payment}
        customer={{ name: `${values.firstName} ${values.lastName}`, phone: values.phone }}
        onPaymentSuccess={(paymentId, method) => executeOrderCreation(paymentId, method, 'Paid')}
      />
    </>
  )
}
