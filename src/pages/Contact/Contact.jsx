import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import { Input, Textarea } from '../../components/common/FormField'
import { site } from '../../data/site'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import api from '../../services/api'
import { isEmail, isPhone } from '../../utils/validators'

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  usePageTitle('Contact Us')
  const showToast = useToast()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!values.name.trim()) found.name = 'Your name is required.'
    if (!isEmail(values.email)) found.email = 'Enter a valid email address.'
    if (!isPhone(values.phone)) found.phone = 'Enter a valid 10-digit mobile number.'
    if (!values.subject.trim()) found.subject = 'Please add a subject.'
    if (values.message.trim().length < 10) found.message = 'Please write at least 10 characters.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    api
      .post('/inquiries', values)
      .then(() => {
        setValues(emptyForm)
        showToast('Thank you! Your message has been received. Our team will contact you shortly.')
      })
      .catch(() => {
        showToast('Unable to send message right now. Please call us or try again.', 'error')
      })
      .finally(() => {
        setBusy(false)
      })
  }

  const details = [
    { icon: Phone, label: 'Call us', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email us', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Visit us / Registered Office', value: `${site.legalName}, ${site.address}` },
    { icon: Clock, label: 'Open hours', value: 'Monday to Sunday, 8:00 am - 8:00 pm' },
  ]

  return (
    <>
      <Breadcrumb title="Contact Us" items={[{ label: 'Contact' }]} />

      <div className="container-page grid gap-6 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 lg:pt-12">
        <form onSubmit={handleSubmit} noValidate className="card p-5 sm:p-8">
          <h1 className="!text-2xl">Send us a message</h1>
          <p className="mt-1.5 text-sm">Questions about a product, a bulk order or a delivery? Write to us.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Input label="Full Name" required value={values.name} onChange={(event) => setField('name', event.target.value)} error={errors.name} />
            <Input label="Email Address" type="email" required value={values.email} onChange={(event) => setField('email', event.target.value)} error={errors.email} />
            <Input label="Mobile Number" type="tel" required inputMode="numeric" value={values.phone} onChange={(event) => setField('phone', event.target.value)} error={errors.phone} />
            <Input label="Subject" required value={values.subject} onChange={(event) => setField('subject', event.target.value)} error={errors.subject} />
            <div className="sm:col-span-2">
              <Textarea label="Message" rows={5} required value={values.message} onChange={(event) => setField('message', event.target.value)} error={errors.message} />
            </div>
          </div>

          <Button type="submit" loading={busy} className="mt-6">
            Send Message <Send size={16} aria-hidden="true" />
          </Button>
        </form>

        <aside className="card h-max p-5 sm:p-6" aria-label="Contact details">
          <h2 className="!text-xl">Get in touch</h2>
          <ul className="mt-5 space-y-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
                  {href ? (
                    <a href={href} className="block break-words text-sm text-heading hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <span className="block text-sm text-heading">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <img src="/fssai-logo.png" alt="FSSAI" className="h-6 w-auto object-contain" />
              <span className="font-bold text-emerald-900">FSSAI Central Licensed</span>
            </div>
            <p className="mt-2 font-mono font-semibold text-slate-800">
              License No: {site.fssaiNumber}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Food Safety Compliance System (FoSCoS)
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              DGFT IE Code: <strong className="font-mono">{site.ieCode}</strong>
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
