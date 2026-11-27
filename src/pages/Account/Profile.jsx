import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import { Input } from '../../components/common/FormField'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { isEmail, isPhone } from '../../utils/validators'

export default function Profile() {
  usePageTitle('My Profile')
  const { user, saveProfile } = useAuth()
  const showToast = useToast()

  const [values, setValues] = useState({ name: user.name, email: user.email, phone: user.phone || '' })
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
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    const result = await saveProfile({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    })
    setBusy(false)
    if (result.error) showToast(result.error, 'error')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-5 sm:p-8">
      <h1 className="!text-2xl">My Profile</h1>
      <p className="mt-1.5 text-sm">Keep your contact details up to date so we can reach you about your orders.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Input label="Full Name" required value={values.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} />
        <Input label="Email Address" type="email" required value={values.email} onChange={(event) => setField('email', event.target.value)} error={errors.email} />
        <Input label="Mobile Number" type="tel" required inputMode="numeric" value={values.phone} onChange={(event) => setField('phone', event.target.value)} error={errors.phone} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-heading">SMAR Club Member</p>
            <p className="text-xs text-muted">Eligible for special discounts & priority delivery</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          <CheckCircle2 size={14} /> Active
        </span>
      </div>

      <Button type="submit" loading={busy} className="mt-6">
        Save Changes
      </Button>
    </form>
  )
}
