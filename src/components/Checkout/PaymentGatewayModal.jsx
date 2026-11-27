import {
  AlertCircle,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Landmark,
  Lock,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultPaymentGatewaySettings, getPaymentGatewaySettings } from '../../services/paymentService'
import { formatPrice } from '../../utils/formatPrice'
import Button from '../common/Button'

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  total,
  paymentMethod,
  customer,
  onPaymentSuccess,
}) {
  const [activeTab, setActiveTab] = useState(paymentMethod === 'card' ? 'card' : paymentMethod === 'netbanking' ? 'netbanking' : 'upi')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [timer, setTimer] = useState(300) // 5 minutes countdown
  const [upiApp, setUpiApp] = useState('gpay')
  const [customUpi, setCustomUpi] = useState('')
  const [settings, setSettings] = useState(defaultPaymentGatewaySettings)
  const [copied, setCopied] = useState(false)

  // Card details state
  const [cardData, setCardData] = useState({
    number: '4111 2222 3333 4444',
    name: customer?.name || 'Authorized Cardholder',
    expiry: '12/28',
    cvv: '889',
  })
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otpValue, setOtpValue] = useState('')

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('State Bank of India')

  useEffect(() => {
    if (isOpen) {
      getPaymentGatewaySettings().then((s) => {
        if (s) setSettings(s)
      })
      setSuccess(false)
      setFailed(false)
      setShowOtpScreen(false)
      setOtpValue('')
      setTimer(300)
    }
  }, [isOpen])

  useEffect(() => {
    if (paymentMethod === 'card') setActiveTab('card')
    else if (paymentMethod === 'netbanking') setActiveTab('netbanking')
    else setActiveTab('upi')
  }, [paymentMethod])

  useEffect(() => {
    if (!isOpen || success || failed) return
    const interval = setInterval(() => {
      setTimer((curr) => (curr > 0 ? curr - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen, success, failed])

  if (!isOpen) return null

  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const formattedTimer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  const isTestMode = settings.mode === 'test'

  function completeTransaction(methodKey) {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      const txnPrefix = isTestMode ? 'TXN_TEST_' : 'TXN_LIVE_'
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase()
      const txnId = `${txnPrefix}${dateStr}_${randStr}`

      setTimeout(() => {
        onPaymentSuccess(txnId, methodKey || activeTab)
      }, 1200)
    }, 1400)
  }

  function handleInstantTestPay() {
    completeTransaction(activeTab)
  }

  function handleSimulateFailure() {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setFailed(true)
    }, 1000)
  }

  function handleFillTestCard(type) {
    if (type === 'visa') {
      setCardData({
        number: '4111 2222 3333 4444',
        name: customer?.name || 'SMAR Test User',
        expiry: '12/28',
        cvv: '456',
      })
    } else if (type === 'mastercard') {
      setCardData({
        number: '5500 0000 0000 0004',
        name: customer?.name || 'SMAR Test User',
        expiry: '09/29',
        cvv: '789',
      })
    } else {
      setCardData({
        number: '6072 1234 5678 9012',
        name: customer?.name || 'SMAR Test User',
        expiry: '10/30',
        cvv: '123',
      })
    }
  }

  function handleCardProceed() {
    // If in test mode, show OTP verification simulator
    if (isTestMode) {
      setShowOtpScreen(true)
    } else {
      completeTransaction('card')
    }
  }

  function handleVerifyOtp() {
    completeTransaction('card')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all my-8">
        {/* Gateway Brand Header */}
        <div className="flex items-center justify-between border-b border-line bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-black">
              S
            </span>
            <div>
              <p className="font-heading text-sm font-bold leading-tight">SMAR Payments</p>
              <p className="text-[10px] text-slate-400">Green Way Enterprises · 256-Bit SSL Secured</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 ${
                isTestMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <ShieldCheck size={11} /> {isTestMode ? '🧪 Sandbox Test' : '🚀 Live'}
            </span>
            {!processing && !success && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
                aria-label="Close payment"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Sandbox Notice Bar with 1-Click Fast Approve */}
        {isTestMode && !success && !failed && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-900">
              <Zap size={14} className="text-amber-600 shrink-0" />
              <span>
                <strong>Testing Sandbox:</strong> Paise nahi katenge.
              </span>
            </div>
            <button
              type="button"
              onClick={handleInstantTestPay}
              disabled={processing}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-amber-700 transition"
            >
              <Zap size={12} /> 1-Click Test Pay
            </button>
          </div>
        )}

        {/* Amount Banner */}
        <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
          <div>
            <span className="text-[11px] text-muted block">Paying to SMAR (Green Way Enterprises)</span>
            <span className="text-xs font-semibold text-heading">{customer?.name || 'Customer'}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted block">Total Payable</span>
            <span className="font-heading text-lg font-black text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="p-8 text-center space-y-3.5">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 size={38} />
            </span>
            <h3 className="text-lg font-bold text-heading">Payment Successful!</h3>
            <p className="text-xs text-muted">
              {formatPrice(total)} received securely. Finalizing order and generating official invoice...
            </p>
            <div className="rounded-xl bg-surface border border-line p-3 font-mono text-[11px] text-slate-700">
              Payment ID: {isTestMode ? 'TXN_TEST_' : 'TXN_LIVE_'}verified ✓
            </div>
          </div>
        ) : failed ? (
          /* FAILED STATE */
          <div className="p-8 text-center space-y-4">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle size={38} />
            </span>
            <h3 className="text-lg font-bold text-heading">Payment Failed / Declined</h3>
            <p className="text-xs text-muted">
              The transaction was cancelled or declined. You can retry with a different method.
            </p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => {
                setFailed(false)
                setShowOtpScreen(false)
              }}
              className="gap-2"
            >
              <RotateCcw size={15} /> Try Again
            </Button>
          </div>
        ) : showOtpScreen ? (
          /* OTP VERIFICATION SIMULATOR SCREEN */
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-heading text-sm font-bold text-heading">Enter Bank OTP</h4>
              <p className="text-xs text-slate-500">
                OTP sent to mobile linked with card ending in {cardData.number.slice(-4)}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-900">
              <span>Test Sandbox OTP: </span>
              <strong className="font-mono font-bold text-sm">123456</strong>
              <button
                type="button"
                onClick={() => setOtpValue('123456')}
                className="ml-2 font-bold underline hover:text-amber-950"
              >
                (Auto-Fill)
              </button>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center text-xl font-mono font-bold tracking-widest rounded-xl border border-line p-3 focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              fullWidth
              size="lg"
              loading={processing}
              onClick={handleVerifyOtp}
              className="gap-1.5"
            >
              <Lock size={15} /> Verify &amp; Pay {formatPrice(total)}
            </Button>

            <button
              type="button"
              onClick={() => setShowOtpScreen(false)}
              className="w-full text-center text-xs text-muted hover:text-heading pt-1"
            >
              ← Back to Card Details
            </button>
          </div>
        ) : (
          /* NORMAL PAYMENT MODAL BODY */
          <div>
            {/* Tab Selection */}
            <div className="flex border-b border-line bg-white text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  activeTab === 'upi'
                    ? 'border-primary text-primary bg-primary-pale/30'
                    : 'border-transparent text-muted hover:text-heading'
                }`}
              >
                UPI / QR Code
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  activeTab === 'card'
                    ? 'border-primary text-primary bg-primary-pale/30'
                    : 'border-transparent text-muted hover:text-heading'
                }`}
              >
                Cards (Debit/Credit)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`flex-1 py-3 text-center border-b-2 transition ${
                  activeTab === 'netbanking'
                    ? 'border-primary text-primary bg-primary-pale/30'
                    : 'border-transparent text-muted hover:text-heading'
                }`}
              >
                Net Banking
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* TAB 1: UPI & QR CODE FLOW */}
              {activeTab === 'upi' && (() => {
                const upiId = settings.upiId || 'smar@okhdfcbank'
                const merchantName = settings.merchantName || 'SMAR (GREEN WAY ENTERPRISES)'
                const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR&tn=SMAR-Order-Payment`
                const qrSrc =
                  settings.qrType === 'custom' && settings.customQrUrl
                    ? settings.customQrUrl
                    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiPayload)}`

                function handleCopyUpi() {
                  navigator.clipboard?.writeText(upiId)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }

                return (
                  <div className="space-y-4 text-center">
                    {/* QR Code Container */}
                    <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary-pale/20 p-4 max-w-[240px]">
                      {/* Live QR Image */}
                      <div className="size-40 rounded-xl bg-white p-2 shadow-sm border border-line flex items-center justify-center overflow-hidden">
                        <img
                          src={qrSrc}
                          alt="UPI Payment QR Code"
                          className="size-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextElementSibling.style.display = 'block'
                          }}
                        />
                        <div className="hidden size-full text-slate-800">
                          <QrCode className="size-full text-primary" />
                        </div>
                      </div>

                      <p className="mt-2 text-xs font-bold text-slate-800">Scan &amp; Pay {formatPrice(total)}</p>
                      <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[200px]">{merchantName}</p>

                      {/* Copy UPI Pill */}
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white px-3 py-1 font-mono text-[11px] font-bold text-primary shadow-2xs hover:bg-primary hover:text-white transition"
                      >
                        {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copied ? 'Copied!' : upiId}</span>
                      </button>

                      <span className="mt-1.5 text-[10px] text-amber-800 font-semibold">QR valid for {formattedTimer}</span>
                    </div>

                    {settings.instructions && (
                      <p className="text-[11px] text-muted max-w-xs mx-auto leading-relaxed">
                        {settings.instructions}
                      </p>
                    )}

                    {/* Popular App Shortcuts */}
                    <div>
                      <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                        Fast UPI App Simulation
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'gpay', label: 'Google Pay', color: 'hover:border-blue-500' },
                          { id: 'phonepe', label: 'PhonePe', color: 'hover:border-purple-500' },
                          { id: 'paytm', label: 'Paytm', color: 'hover:border-sky-500' },
                          { id: 'bhim', label: 'BHIM UPI', color: 'hover:border-orange-500' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setUpiApp(app.id)}
                            className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                              upiApp === app.id
                                ? 'border-primary bg-primary-pale text-primary ring-1 ring-primary'
                                : 'border-line text-heading ' + app.color
                            }`}
                          >
                            <Smartphone size={16} className="mx-auto mb-1 text-muted" />
                            <span className="block text-[10px] truncate">{app.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* TAB 2: CARD FLOW */}
              {activeTab === 'card' && (
                <div className="space-y-3.5">
                  {/* Preset Test Cards (In Test Mode) */}
                  {isTestMode && (
                    <div>
                      <p className="text-[11px] font-bold uppercase text-muted mb-1.5 flex items-center justify-between">
                        <span>Select Test Card</span>
                        <span className="text-[10px] text-amber-800 font-semibold">1-Click Auto-Fill</span>
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleFillTestCard('visa')}
                          className="rounded-lg border border-line bg-surface p-1.5 text-center text-[10px] font-bold text-slate-800 hover:border-primary hover:text-primary transition"
                        >
                          Visa (4111...)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillTestCard('mastercard')}
                          className="rounded-lg border border-line bg-surface p-1.5 text-center text-[10px] font-bold text-slate-800 hover:border-primary hover:text-primary transition"
                        >
                          Master (5500...)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillTestCard('rupay')}
                          className="rounded-lg border border-line bg-surface p-1.5 text-center text-[10px] font-bold text-slate-800 hover:border-primary hover:text-primary transition"
                        >
                          RuPay (6072...)
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted block mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full rounded-lg border border-line bg-surface py-2 pl-3 pr-10 text-xs font-mono font-bold text-heading"
                      />
                      <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full rounded-lg border border-line bg-surface py-2 px-3 text-xs text-heading font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-muted block mb-1">Valid Thru</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-line bg-surface py-2 px-3 text-xs font-mono text-heading"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-muted block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full rounded-lg border border-line bg-surface py-2 px-3 text-xs font-mono text-heading"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted">
                    Supports RuPay, Visa, Mastercard &amp; Maestro cards with 3D Secure OTP verification.
                  </p>
                </div>
              )}

              {/* TAB 3: NET BANKING FLOW */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase text-muted">Select Your Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'State Bank of India',
                      'HDFC Bank',
                      'ICICI Bank',
                      'Axis Bank',
                      'Punjab National Bank',
                      'Kotak Mahindra Bank',
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                          selectedBank === b
                            ? 'border-primary bg-primary-pale text-primary ring-1 ring-primary'
                            : 'border-line text-heading hover:border-slate-300'
                        }`}
                      >
                        <Landmark size={14} className="inline mr-1.5 opacity-70" />
                        {b}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted">
                    Selected Bank: <strong>{selectedBank}</strong>. You will be redirected to simulated bank authorization.
                  </p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={processing}
                  onClick={activeTab === 'card' ? handleCardProceed : () => completeTransaction(activeTab)}
                  className="gap-2 font-bold"
                >
                  <Lock size={15} />
                  {activeTab === 'card'
                    ? `Proceed to OTP (${formatPrice(total)})`
                    : `Approve & Pay ${formatPrice(total)}`}
                </Button>

                {/* Simulate Failure Button for Testing */}
                {isTestMode && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleSimulateFailure}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      🧪 Test: Simulate Decline/Failure
                    </button>
                    <span className="text-[10px] text-slate-400">Gateway: {settings.provider}</span>
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
                  <ShieldCheck size={13} className="text-primary" />
                  <span>256-bit bank encrypted checkout · 100% Safe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
