// Slider with two handles for choosing a minimum and maximum price.
// value: [low, high]. Styles are in index.css (.dual-range).
export default function PriceRange({ min, max, value, onChange, step = 5 }) {
  const [low, high] = value
  const span = max - min || 1
  const left = ((low - min) / span) * 100
  const right = 100 - ((high - min) / span) * 100

  return (
    <div className="dual-range">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line">
        <div className="absolute h-full rounded-full bg-primary" style={{ left: `${left}%`, right: `${right}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={(event) => onChange([Math.min(Number(event.target.value), high - step), high])}
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={(event) => onChange([low, Math.max(Number(event.target.value), low + step)])}
        aria-label="Maximum price"
      />
    </div>
  )
}
