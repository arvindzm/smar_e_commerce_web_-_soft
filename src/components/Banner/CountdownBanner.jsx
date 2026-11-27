import { ArrowRight } from 'lucide-react'
import AssetImage from '../common/AssetImage'
import Button from '../common/Button'
import Countdown from '../common/Countdown'
import { tones } from './tones'

// Wide offer banner with a live countdown.
export default function CountdownBanner({ banner, timerVariant = 'white', buttonVariant = 'primary' }) {
  return (
    <div className={`group flex h-full flex-col items-center gap-5 overflow-hidden rounded-2xl p-6 sm:flex-row sm:p-8 ${tones[banner.tone]}`}>
      <AssetImage
        src={banner.image}
        alt=""
        className="aspect-square w-40 shrink-0 rounded-xl transition-transform duration-500 group-hover:scale-105 sm:w-44"
      />
      <div className="text-center sm:text-left">
        <h3 className="!text-2xl">{banner.title}</h3>
        <p className="mt-1.5 text-sm">{banner.text}</p>
        <Countdown targetDate={banner.endsAt} variant={timerVariant} className="mt-4 justify-center sm:justify-start" />
        <Button to={banner.link} variant={buttonVariant} className="mt-5">
          Shop Now <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
