import { CheckCircle, Printer, X } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../../data/site'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/orderStatus'
import Button from '../common/Button'

// Number to Indian currency words helper
function numberToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const n = Math.floor(Number(num) || 0)
  if (n === 0) return 'Zero Rupees Only'

  function convert(n) {
    if (n < 20) return a[n]
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '')
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '')
  }

  return `${convert(n)} Rupees Only`
}

export default function PrintableInvoice({ order, onClose }) {
  const printRef = useRef(null)

  if (!order) return null

  const { customer, address, totals, items } = order
  const gstNumber = totals.gstNumber || '09AAACH7409R1ZZ'
  const delivery = Number(totals.delivery ?? totals.deliveryCharge ?? 0)
  const gstRate = totals.gstRate !== undefined ? Number(totals.gstRate) : 5
  const deliveryPartner = (order.deliveryPartner || 'SMAR In-House Express').replace(/FreshBhojan/gi, 'SMAR')

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-3 sm:p-6 flex justify-center items-start print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Container Dialog */}
      <div className="relative w-full max-w-3xl my-2 sm:my-6 rounded-2xl bg-white shadow-2xl overflow-hidden print:m-0 print:shadow-none print:max-w-none print:w-full">
        {/* Sticky Action Header - always visible on top! */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-slate-900 px-5 sm:px-6 py-3.5 text-white shadow-md print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex px-2 py-0.5 items-center justify-center rounded-md bg-emerald-700 text-white text-xs font-black tracking-wider">
              SMAR
            </span>
            <p className="font-heading font-bold text-sm">
              Official Tax Invoice · <span className="text-emerald-400 font-mono">{order.id}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={handlePrint} className="gap-1.5 shadow-sm">
              <Printer size={15} /> Print Invoice
            </Button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET */}
        <div ref={printRef} className="p-6 sm:p-10 font-sans text-slate-800 text-xs sm:text-sm print:p-4 print:text-black">
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="SMAR" className="h-11 w-auto object-contain" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {site.name}
                  </h1>
                  <span className="block text-[11px] font-semibold text-emerald-800 tracking-wide">
                    सेहत का खज़ाना
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 font-bold mt-1.5">{site.legalName} (Food &amp; Groceries Division)</p>
              <p className="text-xs text-slate-600 mt-0.5 max-w-sm leading-relaxed">
                {site.address}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Phone: <strong>{site.phone}</strong> | Email: {site.email}
              </p>

              {/* Clean Statutory Badges */}
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-900 border border-emerald-200">
                  FSSAI Central Lic: <span className="font-mono font-bold">{site.fssaiNumber}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-800 border border-slate-200">
                  DGFT IEC: <span className="font-mono font-bold">{site.ieCode}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-900 border border-emerald-200">
                  GSTIN: <span className="font-mono font-bold">{gstNumber}</span>
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-left sm:text-right shrink-0 print:bg-white">
              <span className="inline-block rounded bg-slate-900 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">
                TAX INVOICE
              </span>
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-slate-500">
                  Invoice No: <span className="font-mono font-black text-slate-900 text-sm">INV-{order.id.replace('ORD-', '')}</span>
                </p>
                <p className="text-slate-500">
                  Date: <span className="font-semibold text-slate-900">{formatDate(order.createdAt)}</span>
                </p>
                <p className="text-slate-500">
                  Order Ref: <span className="font-mono font-bold text-slate-900">{order.id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Meta */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed print:bg-white">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1">
                Billed &amp; Shipped To:
              </p>
              <p className="font-bold text-slate-900 text-sm">{customer.name}</p>
              <p className="text-slate-700">{address.line1}</p>
              {address.line2 && <p className="text-slate-700">{address.line2}</p>}
              <p className="text-slate-700">
                {address.city}, {address.state} - <strong>{address.pincode}</strong>
              </p>
              <p className="text-slate-700 mt-1">
                Mobile: <strong>{customer.phone}</strong>
              </p>
              {customer.email && <p className="text-slate-600">Email: {customer.email}</p>}
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1">
                Delivery &amp; Payment Logistics:
              </p>
              <p className="text-slate-700">
                Delivery Mode: <strong>{deliveryPartner}</strong>
              </p>
              {order.trackingNumber && (
                <p className="text-slate-700">
                  AWB / Tracking: <span className="font-mono font-bold text-slate-900">{order.trackingNumber}</span>
                </p>
              )}
              <p className="text-slate-700 mt-1">
                Payment Method: <strong>{order.paymentMethod?.toUpperCase()}</strong>
              </p>
              <p className="text-slate-700">
                Payment Status:{' '}
                <span className={`inline-flex items-center gap-1 font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus === 'Paid' ? 'PAID ✓' : 'PENDING (COD)'}
                </span>
              </p>
              {order.paymentId && (
                <p className="text-slate-600 text-[11px] font-mono mt-0.5">
                  Gateway Txn ID: {order.paymentId}
                </p>
              )}
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="border border-slate-300 px-3 py-2 text-center w-10">#</th>
                  <th className="border border-slate-300 px-3 py-2">Item Description</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Pack</th>
                  <th className="border border-slate-300 px-3 py-2 text-right">Unit Price</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Qty</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">GST %</th>
                  <th className="border border-slate-300 px-3 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const unitPrice = Number(item.unitPrice ?? item.price ?? 0)
                  const qty = Number(item.quantity ?? 1)
                  const lineTotal = Number(item.lineTotal ?? (unitPrice * qty))

                  return (
                    <tr key={`${item.productId}-${idx}`} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="border border-slate-300 px-3 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-slate-600">{item.packLabel}</td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono">{formatPrice(unitPrice)}</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold text-slate-900">{qty}</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-slate-600">{gstRate}%</td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-bold text-slate-900 font-mono">
                        {formatPrice(lineTotal)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Calculations Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7 flex flex-col justify-between rounded-lg border border-slate-200 p-3.5 bg-slate-50/60 print:bg-white text-xs">
              <div>
                <p className="font-bold text-slate-700">Amount in Words:</p>
                <p className="font-semibold text-slate-900 italic mt-0.5">
                  {numberToWords(totals.total)}
                </p>
                {order.notes && (
                  <p className="mt-2 text-slate-600">
                    <strong className="text-slate-800">Customer Note:</strong> {order.notes}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-700">Declaration &amp; Purity Warranty:</p>
                <p>100% natural, pesticide-free &amp; chakki-fresh verified.</p>
                <p>Subject to Lucknow jurisdiction only. This is a computer generated invoice.</p>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Items Subtotal:</span>
                <span className="font-mono font-medium text-slate-900">{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono font-bold">- {formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Delivery Fee:</span>
                <span className="font-mono font-medium text-slate-900">
                  {delivery === 0 ? 'FREE (Orders > ₹700)' : formatPrice(delivery)}
                </span>
              </div>
              {totals.tax > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">
                    {totals.taxName || 'GST'} ({gstRate}%):
                  </span>
                  <span className="font-mono font-medium text-slate-900">{formatPrice(totals.tax)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-emerald-800 font-mono text-base">{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signatory */}
          <div className="mt-8 flex justify-between items-end pt-5 border-t border-slate-300 text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Customer Signature</p>
              <div className="mt-6 border-b border-slate-400 w-36"></div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">For {site.name} ({site.legalName})</p>
              <div className="h-10"></div>
              <p className="text-xs text-slate-500 font-semibold border-t border-slate-400 pt-1 inline-block">
                Authorized Signatory ({site.proprietor})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
