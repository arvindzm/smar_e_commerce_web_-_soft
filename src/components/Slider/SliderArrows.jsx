import { ChevronLeft, ChevronRight } from 'lucide-react'

const arrowClass =
  'flex size-10 items-center justify-center rounded-full border border-line bg-white text-heading transition-colors hover:border-primary hover:bg-primary hover:text-white'

export default function SliderArrows({ onPrev, onNext }) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onPrev} className={arrowClass} aria-label="Previous">
        <ChevronLeft size={18} />
      </button>
      <button type="button" onClick={onNext} className={arrowClass} aria-label="Next">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
