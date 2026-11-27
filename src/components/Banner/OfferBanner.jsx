import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '../common/AssetImage'
import Button from '../common/Button'
import { tones } from './tones'

// Determines class, style, and contrast for preset tone or any custom hex/rgb color
function getToneConfig(tone) {
  if (!tone) {
    return { className: tones.peach || 'bg-[#fdebe4]', style: {}, isDark: false }
  }

  // 1. If it's a known preset in tones.js (e.g. 'darkGreen', 'peach', 'teal', etc.)
  if (tones[tone]) {
    const isDark = tones[tone].includes('text-white') || tone === 'darkGreen'
    return { className: tones[tone], style: {}, isDark }
  }

  // 2. If it's a hex code, rgb, or hsl
  const isColorCode = tone.startsWith('#') || tone.startsWith('rgb') || tone.startsWith('hsl')
  if (isColorCode) {
    let isDark = false
    if (tone.startsWith('#')) {
      const hex = tone.replace('#', '')
      const fullHex = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
      const r = parseInt(fullHex.substring(0, 2), 16) || 0
      const g = parseInt(fullHex.substring(2, 4), 16) || 0
      const b = parseInt(fullHex.substring(4, 6), 16) || 0
      const luminance = (r * 299 + g * 587 + b * 114) / 1000
      isDark = luminance < 140
    }
    return {
      className: isDark ? 'text-white' : 'text-heading',
      style: { backgroundColor: tone },
      isDark,
    }
  }

  // Fallback
  return { className: tones.peach || 'bg-[#fdebe4]', style: {}, isDark: false }
}

// Wide banner with either a full-bleed graphical image OR text + small image + button.
export default function OfferBanner({ banner, buttonVariant = 'accent' }) {
  const isImageOnly = banner.imageOnly || (!banner.title && !banner.text)

  if (isImageOnly) {
    return (
      <Link
        to={banner.link || '/shop'}
        aria-label={banner.title || 'Special offer'}
        className="group relative flex h-52 sm:h-60 lg:h-64 w-fit shrink-0 max-w-full overflow-hidden rounded-2xl shadow-xs transition-shadow duration-300 hover:shadow-md"
      >
        <AssetImage
          src={banner.image}
          alt={banner.title || 'Special offer'}
          className="h-full w-auto max-w-full transition-transform duration-500 group-hover:scale-105"
          imgClassName="h-full w-auto max-w-full object-contain"
        />
      </Link>
    )
  }

  const { className: toneClass, style: toneStyle, isDark } = getToneConfig(banner.tone)

  return (
    <div
      style={toneStyle}
      className={`group flex h-52 sm:h-60 lg:h-64 w-full lg:max-w-[480px] items-center gap-5 sm:gap-6 overflow-hidden rounded-2xl p-5 sm:p-7 ${toneClass}`}
    >
      <AssetImage
        src={banner.image}
        alt=""
        className="hidden aspect-square w-24 sm:w-32 shrink-0 rounded-xl transition-transform duration-500 group-hover:scale-105 sm:flex"
      />
      <div>
        <h3 className={`!text-xl sm:!text-2xl font-bold ${isDark ? '!text-white' : 'text-heading'}`}>{banner.title}</h3>
        <p className={`mt-1 text-sm font-medium line-clamp-2 ${isDark ? 'text-white/85' : 'text-heading/80'}`}>{banner.text}</p>
        <Button to={banner.link} variant={buttonVariant} className="mt-4 sm:mt-5 py-2 px-4 text-sm">
          Shop Now <ArrowRight size={15} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
