import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/common/Loader'
import RequireAuth from './components/common/RequireAuth'
import AdminLayout from './layouts/AdminLayout'
import CustomerLayout from './layouts/CustomerLayout'
import Home from './pages/Home/Home'

// The homepage loads with the app; every other page is fetched when it is first
// opened, which keeps the first load small.
const About = lazy(() => import('./pages/About/About'))
const AdminCategories = lazy(() => import('./pages/Admin/Categories/CategoryList'))
const AdminCoupons = lazy(() => import('./pages/Admin/Coupons/CouponManager'))
const AdminCustomers = lazy(() => import('./pages/Admin/Customers/CustomerList'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'))
const AdminHotDeals = lazy(() => import('./pages/Admin/HotDeals/HotDealsManager'))
const AdminPaymentSettings = lazy(() => import('./pages/Admin/PaymentSettings/PaymentSettings'))
const AdminOrderDetails = lazy(() => import('./pages/Admin/Orders/AdminOrderDetails'))
const AdminOrders = lazy(() => import('./pages/Admin/Orders/OrderList'))
const AdminPaymentTransactions = lazy(() => import('./pages/Admin/Orders/PaymentTransactions'))
const AdminProductForm = lazy(() => import('./pages/Admin/Products/ProductForm'))
const AdminProducts = lazy(() => import('./pages/Admin/Products/ProductList'))
const AccountLayout = lazy(() => import('./pages/Account/AccountLayout'))
const Addresses = lazy(() => import('./pages/Account/Addresses'))
const Cart = lazy(() => import('./pages/Cart/Cart'))
const Categories = lazy(() => import('./pages/Shop/Categories'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const DesignSystem = lazy(() => import('./pages/DesignSystem/DesignSystem'))
const FAQ = lazy(() => import('./pages/FAQ/FAQ'))
const Login = lazy(() => import('./pages/Auth/Login'))
const MyOrders = lazy(() => import('./pages/Orders/MyOrders'))
const NotFound = lazy(() => import('./pages/NotFound'))
const OrderConfirmation = lazy(() => import('./pages/Checkout/OrderConfirmation'))
const OrderDetails = lazy(() => import('./pages/Orders/OrderDetails'))
const OrderTracking = lazy(() => import('./pages/Orders/OrderTracking'))
const PolicyPage = lazy(() => import('./pages/Policies/PolicyPage'))
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'))
const Profile = lazy(() => import('./pages/Account/Profile'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Shop = lazy(() => import('./pages/Shop/Shop'))
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'))

export default function App() {
  return (
    <Suspense fallback={<Loader page />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/hot-deals" element={<AdminHotDeals />} />
          <Route path="/admin/banners" element={<AdminHotDeals />} />
          <Route path="/admin/payment-settings" element={<AdminPaymentSettings />} />
          <Route path="/admin/payments" element={<AdminPaymentSettings />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/transactions" element={<AdminPaymentTransactions />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
        </Route>

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/search" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/track-order" element={<OrderTracking />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pages that need the customer to be signed in before purchasing or viewing account. */}
          <Route element={<RequireAuth />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route element={<AccountLayout />}>
              <Route path="/account" element={<Profile />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route path="/account/orders/:id" element={<OrderDetails />} />
              <Route path="/account/addresses" element={<Addresses />} />
            </Route>
          </Route>

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
          <Route path="/terms" element={<PolicyPage type="terms" />} />
          <Route path="/refund-policy" element={<PolicyPage type="refund" />} />
          <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />

          {/* Developer reference page for the design system. */}
          <Route path="/design-system" element={<DesignSystem />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
