import {
  Banknote,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { accountLinks, policyLinks } from '../../data/navigation'
import { site } from '../../data/site'
import { useFetch } from '../../hooks/useFetch'
import { getCategories } from '../../services/categoryService'
import Logo from '../Header/Logo'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { data } = useFetch(getCategories)
  const categoryLinks = (data || []).slice(0, 6).map((category) => ({
    label: category.name,
    to: `/category/${category.slug}`,
  }))

  return (
    <footer className="mt-16 border-t border-emerald-200/70 bg-[#f2fdf6] lg:mt-24">
      {/* Main Footer Container */}
      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 items-start">
          {/* 1. Left Column: Brand & Legal Registration Info */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              A Brand by {site.legalName}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              {site.tagline}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs text-heading">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">{site.address}</span>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-primary transition">
                  <Mail size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span>{site.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneClean || site.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 hover:text-primary transition">
                  <Phone size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-semibold">{site.phone}</span>
                </a>
              </li>
            </ul>

            <div className="rounded-xl bg-surface border border-line p-3 text-[11px] text-slate-600 space-y-1">
              <p><strong>Kind of Business:</strong> Wholesale, Retail, Importer &amp; Exporter</p>
              <p><strong>Proprietor / In-charge:</strong> {site.proprietor}</p>
            </div>
          </div>

          {/* 2. Middle Column: Quick Links + The 3 Trust & Quality Cards in the Empty Space */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-7">
            {/* 3 Quick Link Columns */}
            <div className="grid grid-cols-3 gap-4">
              {/* Policies & Legal */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-heading uppercase tracking-wider">
                  Policies &amp; Legal
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {policyLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/about" className="transition-colors hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="transition-colors hover:text-primary">
                      FAQ &amp; Help
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="transition-colors hover:text-primary">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* My Account */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-heading uppercase tracking-wider">
                  My Account
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {accountLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Categories */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-heading uppercase tracking-wider">
                  Top Categories
                </h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {categoryLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/shop" className="font-semibold text-primary hover:underline">
                      View All Products →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Official Government & Quality Trust Cards */}
            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-3.5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. FSSAI Central License Card */}
                <div className="flex flex-col rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-2.5 transition hover:shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <img
                      src="/fssai-logo.png"
                      alt="FSSAI - Food Safety and Standards Authority of India"
                      className="h-6 w-auto object-contain"
                      loading="lazy"
                    />
                    <span className="rounded bg-emerald-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Central License
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-900 leading-tight">FSS Act, 2006</p>
                  <p className="font-mono text-[11px] font-bold text-slate-900 mt-1 leading-tight">
                    Lic: {site.fssaiNumber}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                    FoSCoS Registered &amp; Certified
                  </p>
                </div>

                {/* 2. Government of India Emblem Logo Card (Logo Only) */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:shadow-2xs">
                  <img
                    src="/emblem-india.jpg"
                    alt="Government of India Emblem"
                    className="h-14 w-auto object-contain"
                    loading="lazy"
                  />
                  <span className="mt-2 rounded bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Govt. of India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right Column: We Accept (Icons Only) + PCI DSS + Connect With Us */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-5">
            <div>
              <h2 className="mb-3 text-xs font-bold text-heading uppercase tracking-wider">
                We Accept
              </h2>
              {/* Payment Mode Icons Only - Clean Modern Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* UPI */}
                <div
                  title="Instant UPI Payments"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-emerald-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 54 20" className="h-4 w-auto">
                    <path d="M12 2l6 8-6 8h-4l6-8-6-8h4z" fill="#007938" />
                    <path d="M6 2l6 8-6 8H2l6-8-6-8h4z" fill="#F47920" />
                    <text x="22" y="15" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="#2E3192">UPI</text>
                  </svg>
                </div>

                {/* Google Pay */}
                <div
                  title="Google Pay"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-blue-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 52 20" className="h-4 w-auto">
                    <path d="M7.8 8.4v3.3h4.7c-.2 1.1-1.3 3.3-4.7 3.3-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1c1.6 0 2.7.7 3.3 1.3l2.6-2.5C12 2.1 10.1 1.2 7.8 1.2 3.8 1.2.6 4.4.6 8.4s3.2 7.2 7.2 7.2c4.2 0 6.9-2.9 6.9-7 0-.5 0-.8-.1-1.2H7.8z" fill="#4285F4" />
                    <path d="M2.7 8.4c0-.5.1-1.1.3-1.6L.4 5.2C-.1 6.2-.3 7.3-.3 8.4s.2 2.2.7 3.2l2.6-1.6c-.2-.5-.3-1.1-.3-1.6z" fill="#FBBC05" />
                    <path d="M7.8 4.8c1.6 0 2.7.7 3.3 1.3l2.6-2.5C12 2.1 10.1 1.2 7.8 1.2 4.7 1.2 2 3.1.9 5.8l2.6 1.6C4.1 5.9 5.8 4.8 7.8 4.8z" fill="#EA4335" />
                    <path d="M7.8 15.6c2.3 0 4.2-.8 5.6-2.1l-2.6-2c-.8.5-1.7.9-3 .9-2 0-3.7-1.1-4.3-2.6L.9 11.4c1.1 2.7 3.8 4.2 6.9 4.2z" fill="#34A853" />
                    <text x="18" y="14.5" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#5F6368">Pay</text>
                  </svg>
                </div>

                {/* PhonePe */}
                <div
                  title="PhonePe"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-purple-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 65 20" className="h-4 w-auto">
                    <rect width="20" height="20" rx="5" fill="#5f259f" />
                    <text x="10" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#ffffff">पे</text>
                    <text x="24" y="14.5" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="800" fill="#5f259f">PhonePe</text>
                  </svg>
                </div>

                {/* Paytm */}
                <div
                  title="Paytm Wallet & UPI"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-sky-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 50 18" className="h-3.5 w-auto">
                    <text x="0" y="14" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#002970">pay</text>
                    <text x="26" y="14" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#00BAF2">tm</text>
                  </svg>
                </div>

                {/* Visa */}
                <div
                  title="Visa Debit & Credit Cards"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-blue-500 hover:shadow-xs"
                >
                  <svg viewBox="0 0 45 16" className="h-3.5 w-auto">
                    <text x="1" y="13" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fontStyle="italic" fill="#1434CB" letterSpacing="-0.5">VISA</text>
                  </svg>
                </div>

                {/* Mastercard */}
                <div
                  title="Mastercard"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-amber-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 32 20" className="h-4 w-auto">
                    <circle cx="10" cy="10" r="8" fill="#EB001B" />
                    <circle cx="22" cy="10" r="8" fill="#F79E1B" fillOpacity="0.88" />
                  </svg>
                </div>

                {/* RuPay */}
                <div
                  title="RuPay Indian Cards"
                  className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs transition hover:border-orange-400 hover:shadow-xs"
                >
                  <svg viewBox="0 0 50 18" className="h-3.5 w-auto">
                    <text x="0" y="13.5" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fontStyle="italic" fill="#097938">Ru</text>
                    <text x="19" y="13.5" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fontStyle="italic" fill="#F47920">Pay</text>
                    <path d="M42 4l3 5-3 5h3l3-5-3-5h-3z" fill="#097938" />
                    <path d="M45 4l3 5-3 5h3l3-5-3-5h-3z" fill="#F47920" />
                  </svg>
                </div>

                {/* Net Banking */}
                <div
                  title="Net Banking (SBI, HDFC, ICICI & 50+ Banks)"
                  className="flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1 shadow-2xs transition hover:border-purple-300 hover:shadow-xs"
                >
                  <Landmark size={12} className="text-purple-700 shrink-0" />
                  <span className="text-[9px] font-bold text-slate-800 tracking-tight">NetBanking</span>
                </div>

                {/* Cash on Delivery */}
                <div
                  title="Cash on Delivery (Pay at Doorstep)"
                  className="flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1 shadow-2xs transition hover:border-emerald-300 hover:shadow-xs"
                >
                  <Banknote size={12} className="text-emerald-700 shrink-0" />
                  <span className="text-[9px] font-bold text-slate-800 tracking-tight">COD</span>
                </div>
              </div>
            </div>

            {/* PCI-DSS Safe Checkout Card */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-[11px] text-emerald-900 shadow-2xs">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
              <span className="font-medium">100% Safe &amp; PCI-DSS Encrypted Payments</span>
            </div>

            {/* Social Media Channels with Real Branded Icons */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-heading mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Instagram Icon */}
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow SMAR on Instagram"
                  className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white shadow-2xs hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook Icon */}
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow SMAR on Facebook"
                  className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-[#1877F2] hover:text-white shadow-2xs hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* WhatsApp Direct Icon */}
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with SMAR on WhatsApp"
                  className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-[#25D366] hover:text-white shadow-2xs hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.301-.15-1.78-.877-2.056-.977-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.3-.019-.463.132-.613.136-.134.301-.35.452-.525.15-.176.2-.3.301-.502.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.482 1.079 2.911 1.23 3.112.151.201 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.722.23 1.379.198 1.899.12.58-.088 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.076-.126-.277-.201-.578-.351z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.385A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.597 0-3.093-.454-4.367-1.242l-.313-.195-2.96.822.836-2.883-.205-.327A8.128 8.128 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Statutory Copyright Bar */}
      <div className="border-t border-emerald-200/70 bg-[#f2fdf6] py-5">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p className="text-center sm:text-left">
            Copyright © {currentYear} <span className="font-bold text-slate-900">{site.legalName}</span> ({site.name}™). All rights reserved.
          </p>
          <p className="text-center sm:text-right font-mono text-[11px] text-slate-500">
            FSSAI Lic: <strong className="text-slate-800">{site.fssaiNumber}</strong> · DGFT IEC: <strong className="text-slate-800">{site.ieCode}</strong> · Lucknow, UP
          </p>
        </div>
      </div>
    </footer>
  )
}
