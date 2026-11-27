import { CheckCircle2, Home, MapPin, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { Input } from '../../components/common/FormField'
import Modal from '../../components/common/Modal'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useToast } from '../../hooks/useToast'
import { loadFromStorage, saveToStorage } from '../../utils/storage'
import { isPhone, isPincode } from '../../utils/validators'

const STORAGE_KEY = 'grocery_v2_saved_addresses'

const seedAddresses = [
  {
    id: 'addr_1',
    name: 'Rahul Sharma',
    phone: '9876543211',
    tag: 'Home',
    line1: 'Flat 402, Royal Palms Residency',
    line2: 'Near Gomti Riverfront, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    isDefault: true,
  },
]

export default function Addresses() {
  usePageTitle('My Delivery Addresses')
  const showToast = useToast()
  const [addresses, setAddresses] = useState(() => loadFromStorage(STORAGE_KEY, seedAddresses))
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tag: 'Home',
    line1: '',
    line2: '',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '',
    isDefault: false,
  })
  const [errors, setErrors] = useState({})

  function saveList(updated) {
    setAddresses(updated)
    saveToStorage(STORAGE_KEY, updated)
  }

  function handleSetDefault(id) {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
    saveList(updated)
    showToast('Default delivery address updated')
  }

  function handleDelete(id) {
    const updated = addresses.filter((a) => a.id !== id)
    saveList(updated)
    showToast('Address removed')
  }

  function handleOpenAdd() {
    setFormData({
      name: '',
      phone: '',
      tag: 'Home',
      line1: '',
      line2: '',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '',
      isDefault: addresses.length === 0,
    })
    setErrors({})
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = {}
    if (!formData.name.trim()) err.name = 'Full name is required'
    if (!isPhone(formData.phone)) err.phone = 'Valid 10-digit phone number is required'
    if (!formData.line1.trim()) err.line1 = 'House / Flat / Area is required'
    if (!formData.city.trim()) err.city = 'City is required'
    if (!isPincode(formData.pincode)) err.pincode = 'Valid 6-digit pincode is required'

    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }

    const newAddr = {
      ...formData,
      id: `addr_${Date.now()}`,
    }

    let updated = addresses
    if (newAddr.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }))
    }
    saveList([...updated, newAddr])
    setModalOpen(false)
    showToast('New address saved successfully')
  }

  return (
    <div className="card p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="!text-2xl">My Delivery Addresses</h1>
          <p className="mt-1 text-sm text-muted">Manage your saved home, work, and family delivery locations.</p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="gap-2">
          <Plus size={16} /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved yet"
          text="Add your delivery address to enjoy quick 1-click checkout."
          action={<Button onClick={handleOpenAdd}>Add an Address</Button>}
        />
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                address.isDefault ? 'border-primary bg-primary-pale/40' : 'border-line bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-surface text-primary">
                      <Home size={14} />
                    </span>
                    <span className="font-heading font-bold text-heading">{address.name}</span>
                  </div>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted">
                    {address.tag || 'Home'}
                  </span>
                </div>

                <address className="mt-3 text-sm not-italic leading-relaxed text-body">
                  {address.line1}
                  {address.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} - <span className="font-semibold">{address.pincode}</span>
                  <br />
                  <span className="text-heading">Phone:</span> {address.phone}
                </address>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-3 text-xs">
                {address.isDefault ? (
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <CheckCircle2 size={15} /> Default Address
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="font-medium text-heading hover:text-primary"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-muted transition-colors hover:text-danger"
                  aria-label="Delete address"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Address Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Delivery Address">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Contact Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="e.g. Rahul Sharma"
            />
            <Input
              label="Mobile Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="10-digit mobile"
            />
          </div>

          <Input
            label="Flat / House / Building / Area"
            required
            value={formData.line1}
            onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
            error={errors.line1}
            placeholder="Flat 402, Royal Heights"
          />

          <Input
            label="Landmark / Street (Optional)"
            value={formData.line2}
            onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
            placeholder="Near City Mall, Sector 4"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={errors.city}
            />
            <Input
              label="State"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="Pincode"
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              error={errors.pincode}
              placeholder="226010"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-semibold text-heading">Address Type:</span>
            {['Home', 'Work', 'Other'].map((tag) => (
              <label key={tag} className="flex cursor-pointer items-center gap-1.5 text-xs text-heading">
                <input
                  type="radio"
                  name="tag"
                  checked={formData.tag === tag}
                  onChange={() => setFormData({ ...formData, tag })}
                />
                {tag}
              </label>
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-2 pt-2 text-xs font-medium text-heading">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="rounded text-primary"
            />
            Make this my default delivery address
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
