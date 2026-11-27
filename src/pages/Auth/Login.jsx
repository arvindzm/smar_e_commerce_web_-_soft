import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import { Checkbox, Input } from '../../components/common/FormField'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { isEmail } from '../../utils/validators'

export default function Login() {
  usePageTitle('Login')
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useToast()
  const { signIn } = useAuth()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!isEmail(values.email)) found.email = 'Enter a valid email address.'
    if (!values.password) found.password = 'Password is required.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    const result = await signIn(values)
    setBusy(false)

    if (result.error) {
      showToast(result.error, 'error')
      return
    }
    // Go back to the page the customer came from, or to Admin / Account.
    const fallback = result.user?.role === 'admin' ? '/admin' : '/account'
    navigate(location.state?.from || fallback, { replace: true })
  }

  return (
    <>
      <Breadcrumb title="Login" items={[{ label: 'Login' }]} />

      <div className="container-page max-w-lg pt-8 lg:pt-12">
        <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
          <h1 className="!text-2xl">Welcome back</h1>
          <p className="mt-1.5 text-sm">Sign in to see your orders and saved details.</p>

          {(location.state?.message || location.state?.from === '/checkout') && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {location.state?.message || 'Please login or create an account first to purchase products.'}
            </div>
          )}

          <div className="mt-6 space-y-5">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={(event) => setField('email', event.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => setField('password', event.target.value)}
              error={errors.password}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Checkbox label="Remember me" defaultChecked />
            <button
              type="button"
              onClick={() => showToast('Password reset link has been sent to your registered email.')}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </div>

          <Button type="submit" fullWidth size="lg" loading={busy} className="mt-6">
            Log In
          </Button>

          <p className="mt-5 text-center text-sm">
            New here?{' '}
            <Link to="/register" state={location.state} className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
