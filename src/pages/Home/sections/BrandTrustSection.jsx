import { CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Truck, Utensils, Wheat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../../data/site'

const pillars = [
  {
    icon: Wheat,
    title: 'Traditional Stone-Ground',
    description: 'Slow-milled in traditional stone chakkis to preserve natural germ, bran, and essential nutrients without heat destruction.',
    badge: '100% Unadulterated',
  },
  {
    icon: ShieldCheck,
    title: '0% Preservatives & Chemicals',
    description: 'Every batch of flours, dals, and ground spices is tested for purity. Zero added colors, zero maida, and zero artificial flavors.',
    badge: 'FSSAI Certified Quality',
  },
  {
    icon: Truck,
    title: 'Direct From Local Mandis',
    description: 'We partner directly with farmers in Uttar Pradesh, Madhya Pradesh & Punjab to bring seasonal harvest straight to your kitchen.',
    badge: 'Farm-to-Kitchen',
  },
  {
    icon: Utensils,
    title: 'Freshly Milled On Order',
    description: 'No months-old warehouse stock. Your attas, sattu, and spice powders are ground and packed fresh when you order.',
    badge: 'Chakki Fresh Guarantee',
  },
]

export default function BrandTrustSection() {
  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    'Hello SMAR, I want to order fresh groceries. Here is my list:',
  )}`

  return (
    <section className="container-page section-gap" aria-label="Why Choose SMAR">
      {/* 1. Brand Pillars Grid */}
      <div className="rounded-3xl bg-surface p-6 sm:p-10 lg:p-12 border border-line">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="!text-2xl sm:!text-3xl font-heading font-black text-heading tracking-tight">
            Why 10,000+ Indian Kitchens Trust Our Groceries
          </h2>
          <p className="mt-2 text-sm text-body">
            We reject industrial short-cuts. Bringing you the aroma, nutrition, and authentic taste of traditional chakki grinding.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="card flex flex-col justify-between p-5 rounded-2xl border-line hover:border-primary hover:shadow-card transition-all duration-300"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-pale text-primary mb-4 shadow-2xs">
                    <Icon size={24} />
                  </div>
                  <span className="inline-block rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                    {pillar.badge}
                  </span>
                  <h3 className="font-heading text-base font-bold text-heading mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-body leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Fast 1-Click WhatsApp Grocery Ordering Banner */}
      <div
        className="relative mt-8 overflow-hidden rounded-3xl bg-emerald-950 text-white p-6 sm:p-10 lg:p-12 shadow-card"
        style={{
          backgroundImage: `url('/whatsapp-banner-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        {/* Subtle dark-emerald gradient overlay for crystal-clear text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-emerald-950/92 via-emerald-900/75 to-emerald-950/45"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">

            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white leading-snug drop-shadow-xs">
              Hate Typing Long Grocery Orders? Send Your List On WhatsApp!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/95 leading-relaxed">
              Just snap a photo of your handwritten grocery list or message us directly at{' '}
              <strong className="text-white underline underline-offset-2">{site.phone}</strong>. Our team confirms availability and delivers within hours!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-emerald-900 shadow-lg transition-all hover:bg-emerald-50 hover:scale-105"
            >
              <MessageCircle size={18} className="fill-emerald-700 text-white" />
              <span>Order On WhatsApp</span>
            </a>
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/40 bg-emerald-950/50 backdrop-blur-xs px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/15 text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
