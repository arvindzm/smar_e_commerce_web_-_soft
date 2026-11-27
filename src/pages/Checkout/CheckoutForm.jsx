import { Input, Select, Textarea } from '../../components/common/FormField'
import { states } from '../../data/states'

// Customer and delivery address fields.
export default function CheckoutForm({ values, errors, onChange }) {
  const field = (name) => ({
    value: values[name],
    onChange: (event) => onChange(name, event.target.value),
    error: errors[name],
  })

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="!text-xl">Billing &amp; Delivery Details</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input label="First Name" required autoComplete="given-name" {...field('firstName')} />
        <Input label="Last Name" required autoComplete="family-name" {...field('lastName')} />
        <Input label="Mobile Number" type="tel" required autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile number" {...field('phone')} />
        <Input label="Email Address" type="email" required autoComplete="email" {...field('email')} />

        <div className="sm:col-span-2">
          <Input label="Flat / House No., Building, Street" required autoComplete="address-line1" {...field('line1')} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Area, Landmark (optional)" autoComplete="address-line2" {...field('line2')} />
        </div>

        <Input label="City" required autoComplete="address-level2" {...field('city')} />
        <Select label="State" required autoComplete="address-level1" {...field('state')}>
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <Input label="PIN Code" required autoComplete="postal-code" inputMode="numeric" {...field('pincode')} />

        <div className="sm:col-span-2">
          <Textarea label="Order Notes (optional)" rows={3} placeholder="Notes about your order, e.g. delivery instructions." {...field('notes')} />
        </div>
      </div>
    </div>
  )
}
