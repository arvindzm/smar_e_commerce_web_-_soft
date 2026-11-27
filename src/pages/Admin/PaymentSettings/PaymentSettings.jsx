import {
  Activity,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Image as ImageIcon,
  Key,
  Landmark,
  Lock,
  QrCode,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import AdminPageHeader from '../../../components/Admin/AdminPageHeader'
import Button from '../../../components/common/Button'
import { Input, Textarea } from '../../../components/common/FormField'
import Loader from '../../../components/common/Loader'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useToast } from '../../../hooks/useToast'
import {
  defaultPaymentGatewaySettings,
  getPaymentGatewaySettings,
  testGatewayConnection,
  updatePaymentGatewaySettings,
} from '../../../services/paymentService'

export default function PaymentSettings() {
  usePageTitle('Payment Gateway & UPI Settings')
  const showToast = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingConn, setTestingConn] = useState(false)
  const [connResult, setConnResult] = useState(null)
  const [showSecret, setShowSecret] = useState(false)
  const [settings, setSettings] = useState(defaultPaymentGatewaySettings)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState(false)

  useEffect(() => {
    getPaymentGatewaySettings().then((data) => {
      if (data) setSettings(data)
      setLoading(false)
    })
  }, [])

  function handleChange(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      handleChange('customQrUrl', event.target?.result)
      handleChange('qrType', 'custom')
      showToast('Custom QR standee uploaded successfully!')
    }
    reader.readAsDataURL(file)
  }

  async function handleTestConnection() {
    setTestingConn(true)
    setConnResult(null)
    try {
      const res = await testGatewayConnection(settings)
      setConnResult(res)
      if (res.success) {
        showToast(res.message, 'success')
      } else {
        showToast(res.message, 'error')
      }
    } catch {
      showToast('Connection test failed. Check the gateway URL.', 'error')
    } finally {
      setTestingConn(false)
    }
  }

  async function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault()
    setSaving(true)
    try {
      await updatePaymentGatewaySettings(settings)
      showToast('Payment Gateway settings saved successfully!')
    } catch {
      showToast('Failed to save settings. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const liveUpiPayload = `upi://pay?pa=${settings.upiId || 'smar@okhdfcbank'}&pn=${encodeURIComponent(
    settings.merchantName || 'SMAR'
  )}&cu=INR&tn=SMAR-Order`

  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
    liveUpiPayload
  )}`

  const activeQrSrc =
    settings.qrType === 'custom' && settings.customQrUrl
      ? settings.customQrUrl
      : dynamicQrUrl

  if (loading) return <Loader page label="Loading payment gateway configuration..." />

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Gateway &amp; UPI Configuration"
        subtitle="Manage Live vs Sandbox Testing Mode, Gateway API URLs, UPI VPA, and checkout payment options."
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            loading={testingConn}
            className="gap-1.5"
          >
            <Activity size={16} /> Test Gateway URL
          </Button>
          <Button onClick={handleSave} loading={saving} className="gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </AdminPageHeader>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Environment Switcher (Testing Mode vs Live Mode) */}
          <div className="card p-5 sm:p-7 space-y-5 border-2 border-emerald-200/80 shadow-xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Zap size={20} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-heading">Gateway Environment Mode</h2>
                  <p className="text-xs text-muted">Switch between Sandbox Testing and Live Production</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  settings.mode === 'live'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {settings.mode === 'live' ? '🚀 Live Mode' : '🧪 Testing Sandbox Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Sandbox Testing Mode (Recommended for testing) */}
              <label
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                  settings.mode === 'test'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-400'
                    : 'border-line bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-amber-200 text-amber-900 text-xs font-black">
                      🧪
                    </span>
                    <span className="font-heading text-sm font-bold text-slate-900">
                      Sandbox / Testing Mode
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="gatewayMode"
                    checked={settings.mode === 'test'}
                    onChange={() => handleChange('mode', 'test')}
                    className="size-4.5 accent-amber-600"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>Abhi ke liye active hai:</strong> Real paise nahi katenge. Test card, test OTP aur UPI QR simulation se order placement verify kar sakte hain.
                </p>
              </label>

              {/* Option 2: Live Production Mode */}
              <label
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                  settings.mode === 'live'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                    : 'border-line bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-emerald-200 text-emerald-900 text-xs font-black">
                      🚀
                    </span>
                    <span className="font-heading text-sm font-bold text-slate-900">
                      Live Production Mode
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="gatewayMode"
                    checked={settings.mode === 'live'}
                    onChange={() => handleChange('mode', 'live')}
                    className="size-4.5 accent-emerald-600"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>Live testing / launch ke liye:</strong> Neeche live gateway URL aur API Key dalein, real bank / UPI se paise collect hone lagenge.
                </p>
              </label>
            </div>
          </div>

          {/* Card 2: Payment Gateway Endpoint URL & Credentials */}
          <div className="card p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-pale text-primary">
                <Globe size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-heading">Gateway URL &amp; API Integration</h2>
                <p className="text-xs text-muted">
                  Bas URL aur API keys dalein, code me kuch badalne ki zaroorat nahi
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Payment Gateway Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleChange('provider', e.target.value)}
                  className="w-full rounded-xl border border-line bg-white p-2.5 text-xs font-semibold text-heading focus:border-primary focus:outline-none"
                >
                  <option value="custom_gateway">Custom Payment Gateway / Webhook URL</option>
                  <option value="razorpay">Razorpay Standard Checkout</option>
                  <option value="phonepe">PhonePe Payment Gateway (PG)</option>
                  <option value="cashfree">Cashfree Payments</option>
                  <option value="paytm">Paytm Payment Gateway</option>
                  <option value="upi_qr">Direct UPI Standee &amp; QR Only</option>
                </select>
              </div>

              {/* Gateway URL Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>
                    Payment Gateway URL / API Endpoint <span className="text-danger">*</span>
                  </span>
                  <span className="text-[11px] font-normal text-primary">
                    {settings.mode === 'live' ? 'Live Endpoint' : 'Test Sandbox Endpoint'}
                  </span>
                </label>
                <div className="relative">
                  <Input
                    value={settings.gatewayUrl}
                    onChange={(e) => handleChange('gatewayUrl', e.target.value)}
                    placeholder="https://api.razorpay.com/v1/checkout or https://secure.your-gateway.com/pay"
                    required
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  💡 <strong>Tip:</strong> Jab aap payment gateway provider se apna live API ya checkout URL prapt karein, bas yahan paste kar dein. Website bina kisi code change ke turant us URL par connect ho jayegi!
                </p>
              </div>

              {/* Key ID & Secret */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Merchant Key ID / Client ID
                  </label>
                  <Input
                    value={settings.keyId}
                    onChange={(e) => handleChange('keyId', e.target.value)}
                    placeholder="e.g. rzp_test_... or mid_998877"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Key Secret / Salt</span>
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-normal"
                    >
                      {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showSecret ? 'Hide' : 'Show'}
                    </button>
                  </label>
                  <Input
                    type={showSecret ? 'text' : 'password'}
                    disableToggle
                    value={settings.keySecret}
                    onChange={(e) => handleChange('keySecret', e.target.value)}
                    placeholder="e.g. sec_test_..."
                  />
                </div>
              </div>

              {/* Callback / Webhook URL (Read-only with Copy) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Webhook / Callback URL (Payment Status Notification)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.callbackUrl || 'https://smarfoods.in/api/payment/callback'}
                    className="w-full rounded-xl border border-line bg-surface p-2.5 font-mono text-xs text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(settings.callbackUrl || 'https://smarfoods.in/api/payment/callback')
                      setCopiedWebhook(true)
                      setTimeout(() => setCopiedWebhook(false), 2000)
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    {copiedWebhook ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Paste this URL into your payment gateway dashboard under Webhook / Redirect settings.
                </p>
              </div>

              {/* Connection Status Pill if tested */}
              {connResult && (
                <div
                  className={`rounded-xl p-3 text-xs flex items-center gap-2.5 ${
                    connResult.success
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border border-rose-300 bg-rose-50 text-rose-900'
                  }`}
                >
                  <Activity size={16} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold">{connResult.message}</p>
                    {connResult.latency && (
                      <p className="text-[11px] opacity-80">
                        Response Latency: {connResult.latency}ms · Mode: {connResult.mode.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: UPI & Payee VPA */}
          <div className="card p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-pale text-primary">
                <QrCode size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-heading">UPI ID &amp; Merchant Identity</h2>
                <p className="text-xs text-muted">Customer payments will be routed directly to this UPI ID</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  UPI ID / VPA <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={settings.upiId}
                    onChange={(e) => handleChange('upiId', e.target.value)}
                    placeholder="e.g. smar@okhdfcbank or 7985890783@upi"
                    required
                  />
                </div>
                {/* Popular Handles Preset Pills */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted">Quick suffixes:</span>
                  {['@okhdfcbank', '@paytm', '@ybl', '@okaxis', '@sbi', '@upi'].map((suffix) => (
                    <button
                      key={suffix}
                      type="button"
                      onClick={() => {
                        const base = settings.upiId.includes('@')
                          ? settings.upiId.split('@')[0]
                          : settings.upiId || 'smar'
                        handleChange('upiId', `${base}${suffix}`)
                      }}
                      className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-slate-600 hover:border-primary hover:text-primary transition"
                    >
                      {suffix}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Payee / Merchant Business Name
                </label>
                <Input
                  value={settings.merchantName}
                  onChange={(e) => handleChange('merchantName', e.target.value)}
                  placeholder="e.g. SMAR (GREEN WAY ENTERPRISES)"
                />
                <p className="mt-1 text-[11px] text-muted">
                  This official name is displayed on customer UPI apps upon scanning the QR.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Checkout Customer Instructions
                </label>
                <Textarea
                  rows={2}
                  value={settings.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  placeholder="Scan QR with any UPI app to complete instant payment."
                />
              </div>
            </div>
          </div>

          {/* Card 4: QR Code Mode (Dynamic vs Custom Shop Standee) */}
          <div className="card p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-pale text-primary">
                <ImageIcon size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-heading">QR Code Mode &amp; Shop Standee</h2>
                <p className="text-xs text-muted">Choose between dynamic smart QR or upload your own store standee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                  settings.qrType === 'dynamic'
                    ? 'border-primary bg-primary-pale/40 shadow-xs ring-1 ring-primary/20'
                    : 'border-line bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-heading">Auto Dynamic QR</span>
                  <input
                    type="radio"
                    name="qrType"
                    checked={settings.qrType === 'dynamic'}
                    onChange={() => handleChange('qrType', 'dynamic')}
                    className="size-4 accent-primary"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Real-time generated QR containing the exact checkout amount &amp; merchant name. (Recommended)
                </p>
              </label>

              <label
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${
                  settings.qrType === 'custom'
                    ? 'border-primary bg-primary-pale/40 shadow-xs ring-1 ring-primary/20'
                    : 'border-line bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-heading">Custom QR Standee</span>
                  <input
                    type="radio"
                    name="qrType"
                    checked={settings.qrType === 'custom'}
                    onChange={() => handleChange('qrType', 'custom')}
                    className="size-4 accent-primary"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Upload an image of your physical Google Pay / PhonePe / Bank QR Standee from your shop.
                </p>
              </label>
            </div>

            {settings.qrType === 'custom' && (
              <div className="rounded-xl border border-dashed border-primary/50 bg-surface p-4 text-center space-y-3">
                <p className="text-xs font-semibold text-slate-700">Upload Shop Standee QR Image</p>
                <input
                  type="file"
                  id="qr-file-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="qr-file-upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary border border-line shadow-2xs hover:bg-slate-50 cursor-pointer"
                >
                  <Upload size={14} /> Select QR Image from Device
                </label>

                {settings.customQrUrl && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleChange('customQrUrl', '')}
                      className="inline-flex items-center gap-1 text-xs text-danger hover:underline"
                    >
                      <Trash2 size={13} /> Remove Custom QR
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 5: Checkout Payment Methods Toggle */}
          <div className="card p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-pale text-primary">
                <CreditCard size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-heading">Active Checkout Payment Methods</h2>
                <p className="text-xs text-muted">Enable or disable specific payment options for customers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label className="flex items-center gap-3 rounded-xl border border-line p-3.5 bg-surface/50 hover:bg-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowUPI}
                  onChange={(e) => handleChange('allowUPI', e.target.checked)}
                  className="size-4.5 accent-primary rounded"
                />
                <div>
                  <p className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <Smartphone size={14} className="text-emerald-600" /> Instant UPI (QR &amp; Apps)
                  </p>
                  <p className="text-[11px] text-muted">GPay, PhonePe, Paytm, BHIM</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-line p-3.5 bg-surface/50 hover:bg-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowCOD}
                  onChange={(e) => handleChange('allowCOD', e.target.checked)}
                  className="size-4.5 accent-primary rounded"
                />
                <div>
                  <p className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <Banknote size={14} className="text-amber-600" /> Cash on Delivery (COD)
                  </p>
                  <p className="text-[11px] text-muted">Doorstep cash / UPI collection</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-line p-3.5 bg-surface/50 hover:bg-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowCards}
                  onChange={(e) => handleChange('allowCards', e.target.checked)}
                  className="size-4.5 accent-primary rounded"
                />
                <div>
                  <p className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-600" /> Credit / Debit Cards
                  </p>
                  <p className="text-[11px] text-muted">Visa, MasterCard, RuPay</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-line p-3.5 bg-surface/50 hover:bg-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowNetBanking}
                  onChange={(e) => handleChange('allowNetBanking', e.target.checked)}
                  className="size-4.5 accent-primary rounded"
                />
                <div>
                  <p className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <Landmark size={14} className="text-purple-600" /> Net Banking
                  </p>
                  <p className="text-[11px] text-muted">50+ Major Indian Banks</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive QR Preview & Gateway Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-5 sm:p-7 sticky top-24 space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Live Gateway Status
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  settings.mode === 'live'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {settings.mode === 'live' ? '● PRODUCTION ACTIVE' : '● TEST SANDBOX'}
              </span>
            </div>

            {/* Gateway summary badge */}
            <div className="rounded-xl border border-line bg-surface p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Provider:</span>
                <span className="font-bold text-slate-900 uppercase">{settings.provider}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Target URL:</span>
                <span className="font-mono text-[11px] font-semibold text-primary truncate max-w-[190px]">
                  {settings.gatewayUrl || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Mode:</span>
                <span className="font-bold text-slate-900">{settings.mode === 'live' ? 'Live Payments' : 'Simulated Test'}</span>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary-pale/20 p-5 text-center">
              {/* QR Image Box */}
              <div className="mx-auto size-48 rounded-2xl bg-white p-3 shadow-md border border-line flex items-center justify-center overflow-hidden">
                <img
                  src={activeQrSrc}
                  alt="Live Preview QR Code"
                  className="size-full object-contain"
                />
              </div>

              <div className="mt-3.5">
                <p className="text-xs font-bold text-slate-800">
                  {settings.merchantName || 'SMAR (GREEN WAY ENTERPRISES)'}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-white px-3 py-1 rounded-full border border-line shadow-2xs">
                    {settings.upiId || 'smar@okhdfcbank'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(settings.upiId || 'smar@okhdfcbank')
                      setCopiedUpi(true)
                      setTimeout(() => setCopiedUpi(false), 2000)
                    }}
                    className="rounded-full bg-white p-1.5 text-muted hover:text-heading shadow-2xs border border-line"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Mode: <strong className="uppercase">{settings.qrType} QR</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 rounded-xl bg-surface p-4 border border-line">
              <p className="font-bold text-heading text-xs">Testing &amp; Live Process:</p>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-slate-600">
                <li><strong>Abhi Testing ke dauran:</strong> Sandbox mode select rahega, order checkout par 1-click test approval ya test cards se check kar sakte hain.</li>
                <li><strong>Jab Live Launch karenge:</strong> Bas Mode ko "Live Production" karke apna Live Gateway URL aur Secret Key paste karein.</li>
                <li>Koi bhi code change ya development ki zaroorat nahi padegi!</li>
              </ul>
            </div>

            <Button type="submit" fullWidth size="lg" loading={saving} className="mt-5">
              <Save size={16} /> Save Payment Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
