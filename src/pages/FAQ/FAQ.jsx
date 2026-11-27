import { ChevronDown, HelpCircle, MessageCircle, Phone, ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import Button from '../../components/common/Button'
import { site } from '../../data/site'
import { usePageTitle } from '../../hooks/usePageTitle'

const faqs = [
  {
    category: 'Orders & Delivery',
    icon: Truck,
    questions: [
      {
        q: 'What are the delivery charges and how do I get Free Delivery?',
        a: `We provide Free Express Doorstep Delivery on all orders of ₹${site.freeDeliveryAbove} and above. For orders below ₹${site.freeDeliveryAbove}, a nominal standard delivery fee of ₹${site.deliveryCharge} is charged to cover local logistics across Lucknow.`,
      },
      {
        q: 'How fast will my order be delivered?',
        a: 'Orders placed before 2:00 PM are generally delivered the same day or within 24 hours. You can also specify special delivery time preferences during checkout in the customer note.',
      },
      {
        q: 'Which areas do you deliver to in Lucknow?',
        a: 'We deliver across Lucknow including Hazratganj, Gomti Nagar, Aliganj, Chowk, Tahseen Gunj, Indira Nagar, Rajajipuram, Aminabad, Mahanagar, Vikas Nagar, and surrounding localities.',
      },
      {
        q: 'Can I track my order status?',
        a: 'Yes! You can view live real-time status of your order anytime in "My Account > My Orders", or message our delivery support team on WhatsApp at +91 79858 90783 with your Order ID.',
      },
    ],
  },
  {
    category: 'Payments & COD',
    icon: ShieldCheck,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We support all popular payment modes: Cash on Delivery (COD), Instant UPI QR (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and Net Banking across 50+ banks.',
      },
      {
        q: 'Can I pay via UPI when the delivery arrives on Cash on Delivery?',
        a: 'Yes, our delivery partners carry our official SMAR UPI QR standee, so you can easily scan and pay using GPay, PhonePe, or Paytm at your doorstep.',
      },
      {
        q: 'Is online payment secure on your store?',
        a: 'Absolutely. All online payments are encrypted with bank-grade 256-bit SSL protocols complying with RBI and PCI-DSS standards.',
      },
    ],
  },
  {
    category: 'Quality, Purity & FSSAI',
    icon: HelpCircle,
    questions: [
      {
        q: 'Are SMAR products certified by FSSAI?',
        a: `Yes, our parent entity GREEN WAY ENTERPRISES operates under FSSAI Central License No. ${site.fssaiNumber} and DGFT IEC ${site.ieCode}. All our staples, flours, millets, and spices undergo rigorous quality and purity checks.`,
      },
      {
        q: 'How do you ensure chakki freshness and purity of staples?',
        a: 'Our flours (Atta, Besan, Sattu) are milled fresh directly from clean, hand-picked whole grains without any maida mixing, preservatives, or chemical bleaching. Our spices are 100% natural and unadulterated.',
      },
      {
        q: 'Can I place bulk or wholesale orders for kitchen or commercial use?',
        a: 'Yes, we are licensed wholesale suppliers and exporters. For bulk inquiries (50kg+ bags or restaurant supplies), please reach out directly via call/WhatsApp at +91 79858 90783 or email mazhar.abbas2008@gmail.com.',
      },
    ],
  },
  {
    category: 'Returns & Cancellations',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is your Return & Replacement policy?',
        a: 'If you receive an incorrect, damaged, or unsatisfactory product, you can request an instant replacement or refund within 7 days of delivery. Our customer support will arrange doorstep pickup promptly.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Prepaid online refunds are credited back to your original source (UPI/Card/Bank) within 24 to 48 business hours. For COD orders, refunds can be instantly transferred via UPI to your phone number.',
      },
      {
        q: 'Can I cancel an order before dispatch?',
        a: 'Yes, you can cancel your order from your "My Orders" page or by simply messaging our WhatsApp helpline before the order is marked Out for Delivery.',
      },
    ],
  },
]

export default function FAQ() {
  usePageTitle('Frequently Asked Questions (FAQ)')
  const [openItems, setOpenItems] = useState({ '0-0': true, '1-0': true })

  function toggle(id) {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />

      <div className="mt-6 text-center max-w-2xl mx-auto">
        <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          Help &amp; Answers
        </span>
        <h1 className="mt-3 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base leading-relaxed">
          Have questions about our chakki-fresh staples, delivery timelines, payment options, or quality guarantees? Find fast answers below.
        </p>
      </div>

      <div className="mt-10 max-w-3xl mx-auto space-y-8">
        {faqs.map((section, sectionIdx) => {
          const SectionIcon = section.icon
          return (
            <div key={section.category} className="card p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <SectionIcon size={20} />
                </div>
                <h2 className="!text-lg font-bold text-heading">
                  {section.category}
                </h2>
              </div>

              <div className="divide-y divide-line">
                {section.questions.map((item, qIdx) => {
                  const itemId = `${sectionIdx}-${qIdx}`
                  const isOpen = Boolean(openItems[itemId])
                  return (
                    <div key={item.q} className="py-3.5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => toggle(itemId)}
                        className="flex w-full items-center justify-between gap-4 text-left font-semibold text-heading transition hover:text-primary"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm sm:text-base">{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                          {item.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Contact Support CTA Box */}
        <div className="rounded-2xl border border-primary/30 bg-primary-pale/40 p-6 text-center sm:p-8">
          <h3 className="text-lg font-bold text-heading sm:text-xl">
            Still need help or want to order directly?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Our friendly customer care team in Lucknow is available from 9:00 AM to 9:00 PM daily.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent('Hello SMAR, I have a query regarding my order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${site.phoneClean || site.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-heading shadow-xs hover:border-primary hover:text-primary transition"
            >
              <Phone size={18} />
              Call {site.phone}
            </a>
            <Button to="/contact" variant="outline">
              Contact Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
