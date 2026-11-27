import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { resolveImage } from '../../utils/assets'

const logoUrl =
  resolveImage('logo/logo.svg') ||
  resolveImage('logo/logo.png') ||
  resolveImage('logo/logo.webp') ||
  resolveImage('logo/logo.jpg') ||
  resolveImage('logo/Untitled design - 2026-11-13T172331.571.png')

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${site.name} - ${site.brandTaglineEn}`}
          className="h-11 w-auto max-w-[170px] sm:max-w-[200px] object-contain sm:h-14"
        />
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Leaf size={22} className="text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-heading text-xl font-extrabold tracking-tight text-heading sm:text-2xl">
              SMAR<span className="text-xs align-top font-bold text-primary">™</span>
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-primary">
              सेहत का खज़ाना
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}
