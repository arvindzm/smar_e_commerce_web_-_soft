import { ShieldCheck } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import { privacyPolicy, refundPolicy, shippingPolicy, terms } from '../../data/content'
import { site } from '../../data/site'
import { usePageTitle } from '../../hooks/usePageTitle'

const policies = {
  privacy: { title: 'Privacy Policy', sections: privacyPolicy },
  terms: { title: 'Terms & Conditions', sections: terms },
  refund: { title: 'Return & Refund Policy', sections: refundPolicy },
  shipping: { title: 'Shipping & Delivery Policy', sections: shippingPolicy },
}

// One component serves all policy pages; `type` picks which text to show.
export default function PolicyPage({ type }) {
  const { title, sections } = policies[type] || policies.privacy
  usePageTitle(title)

  return (
    <>
      <Breadcrumb title={title} items={[{ label: title }]} />

      <div className="container-page max-w-4xl pt-8 lg:pt-12">
        <article className="card p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
            <div>
              <h1 className="!text-2xl">{title}</h1>
              <p className="mt-1 text-xs text-muted">Legal &amp; Regulatory Documentation · Last Updated: November 2026</p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={14} /> FSSAI Certified
            </span>
          </div>

          {/* Legal Business Ownership Notice */}
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-emerald-950 text-sm">
              Operated by {site.legalName} ({site.name})
            </p>
            <p className="mt-1">
              <strong>FSSAI Central License:</strong> {site.fssaiNumber} ({site.fssaiCategory}) · <strong>DGFT IEC:</strong> {site.ieCode} · <strong>PAN:</strong> {site.pan}
            </p>
            <p className="mt-0.5 text-slate-600">
              <strong>Registered Office:</strong> {site.address}
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {sections.map((section) => (
              <section key={section.heading} className="rounded-xl border border-line bg-surface/50 p-4 sm:p-5">
                <h2 className="!text-base font-bold text-heading">{section.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body whitespace-pre-line">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </>
  )
}
