import { Banknote, CreditCard, Landmark, Lock, QrCode, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getPaymentGatewaySettings } from '../../services/paymentService'

const defaultMethods = [
  {
    id: 'upi',
    key: 'allowUPI',
    label: 'Instant UPI (GPay / PhonePe / Paytm / BHIM)',
    badge: 'Fast & Instant',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: QrCode,
    text: 'Scan dynamic QR code or pay directly through any UPI application with instant approval.',
  },
  {
    id: 'cod',
    key: 'allowCOD',
    label: 'Cash on Delivery (COD)',
    badge: 'Pay at Doorstep',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: Banknote,
    text: 'Pay comfortably with cash or UPI QR directly to the delivery partner when your order arrives.',
  },
  {
    id: 'card',
    key: 'allowCards',
    label: 'Credit / Debit Cards',
    badge: 'Visa / RuPay / Master',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: CreditCard,
    text: 'Safe & encrypted card payments supported across all Indian and international banks.',
  },
  {
    id: 'netbanking',
    key: 'allowNetBanking',
    label: 'Net Banking',
    badge: '50+ Banks',
    badgeColor: 'bg-purple-100 text-purple-800',
    icon: Landmark,
    text: 'Seamless direct account debit via SBI, HDFC, ICICI, Axis, PNB and other top Indian banks.',
  },
]

export default function PaymentMethods({ value, onChange }) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getPaymentGatewaySettings().then(setSettings)
  }, [])

  // Filter based on admin configuration if present
  const availableMethods = defaultMethods.filter((m) => {
    if (!settings) return true
    return settings[m.key] !== false
  })

  return (
    <fieldset className="card p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
        <div>
          <legend className="font-heading text-xl font-bold text-heading">Payment Method</legend>
          <p className="mt-0.5 text-xs text-muted">Select how you want to pay for this grocery order</p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ShieldCheck size={14} /> 100% Secure Checkout
        </span>
      </div>

      <div className="mt-5 space-y-3.5">
        {availableMethods.map((method) => {
          const isSelected = value === method.id
          const Icon = method.icon

          return (
            <label
              key={method.id}
              className={`group flex items-start gap-4 rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary-pale/40 shadow-xs ring-1 ring-primary/20'
                  : 'border-line bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Radio Indicator */}
              <div className="pt-0.5">
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onChange(method.id)}
                  className="size-4.5 cursor-pointer accent-primary"
                />
              </div>

              {/* Icon Container */}
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition ${
                  isSelected ? 'bg-primary text-white shadow-2xs' : 'bg-surface text-slate-600 group-hover:text-primary'
                }`}
              >
                <Icon size={20} />
              </div>

              {/* Text & Meta */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-heading text-sm sm:text-base font-bold ${isSelected ? 'text-primary' : 'text-heading'}`}>
                    {method.label}
                  </span>
                  {method.badge && (
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${method.badgeColor}`}>
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{method.text}</p>
              </div>
            </label>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/70 px-4 py-3 text-xs font-medium text-slate-600">
        <Lock size={15} className="text-emerald-700 shrink-0" />
        <span>End-to-end 256-bit SSL encrypted. Payment details are never stored unencrypted.</span>
      </div>
    </fieldset>
  )
}
