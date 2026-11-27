import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import { Checkbox, Input } from '../../components/common/FormField'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { isEmail, isPhone } from '../../utils/validators'

export default function Register() {
  usePageTitle('Create Account')
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useToast()
  const { signUp } = useAuth()

  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!values.name.trim()) found.name = 'Your name is required.'
    if (!isEmail(values.email)) found.email = 'Enter a valid email address.'
    if (!isPhone(values.phone)) found.phone = 'Enter a valid 10-digit mobile number.'
    if (values.password.length < 6) found.password = 'Use at least 6 characters.'
    if (values.confirm !== values.password) found.confirm = 'Both passwords must match.'
    if (!values.agree) found.agree = 'Please accept the terms to continue.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    const result = await signUp({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      password: values.password,
    })
    setBusy(false)

    if (result.error) {
      showToast(result.error, 'error')
      return
    }
    navigate(location.state?.from || '/account', { replace: true })
  }

  return (
    <>
      <Breadcrumb title="Create Account" items={[{ label: 'Register' }]} />

      <div className="container-page max-w-lg pt-8 lg:pt-12">
        <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
          <h1 className="!text-2xl">Create your account</h1>
          <p className="mt-1.5 text-sm">It only takes a minute, and checkout gets faster.</p>

          {(location.state?.message || location.state?.from === '/checkout') && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {location.state?.message || 'Create your free account to continue and place your order.'}
            </div>
          )}

          <div className="mt-6 space-y-5">
            <Input
              label="Full Name"
              required
              autoComplete="name"
              value={values.name}
              onChange={(event) => setField('name', event.target.value)}
              error={errors.name}
            />
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
              label="Mobile Number"
              type="tel"
              required
              autoComplete="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={values.phone}
              onChange={(event) => setField('phone', event.target.value)}
              error={errors.phone}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => setField('password', event.target.value)}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              autoComplete="new-password"
              value={values.confirm}
              onChange={(event) => setField('confirm', event.target.value)}
              error={errors.confirm}
            />
          </div>

          <div className="mt-5">
            <Checkbox
              label="I agree to the Terms & Conditions and Privacy Policy."
              checked={values.agree}
              onChange={(event) => setField('agree', event.target.checked)}
            />
            {errors.agree && (
              <p className="mt-2 text-xs text-danger" role="alert">
                {errors.agree}
              </p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" loading={busy} className="mt-6">
            Create Account
          </Button>

          <p className="mt-5 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
