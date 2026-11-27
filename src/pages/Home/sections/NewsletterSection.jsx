import { useState } from 'react'
import AssetImage from '../../../components/common/AssetImage'
import Button from '../../../components/common/Button'
import { useToast } from '../../../hooks/useToast'

// Email sign-up block. PHASE 1: the address is only validated, not saved or sent
// anywhere. Phase 2 will post it to the backend.
export default function NewsletterSection({ image }) {
  const showToast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setEmail('')
    showToast('Thank you for subscribing to our newsletter!')
  }

  return (
    <section className="container-page section-gap">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-surface px-6 py-10 sm:px-12 md:grid-cols-2 lg:px-20 lg:py-14">
        <div>
          <h2 className="max-w-md">Stay home &amp; get your daily needs from our shop</h2>
          <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-lg">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                aria-invalid={error ? true : undefined}
                className={`min-w-0 flex-1 rounded-lg border bg-white px-4 py-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none ${
                  error ? 'border-danger' : 'border-line'
                }`}
              />
              <Button type="submit" variant="primary" className="!rounded-lg !py-3">
                Subscribe now
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-danger" role="alert">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-heading">We will only use your email to send offers and updates.</p>
          </form>
        </div>
        <AssetImage src={image} alt="" className="mx-auto hidden aspect-[16/10] w-full max-w-md rounded-2xl md:flex" />
      </div>
    </section>
  )
}
