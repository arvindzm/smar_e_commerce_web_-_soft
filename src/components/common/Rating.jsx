import { Star } from 'lucide-react'

// Compact: one star with the number (used on product cards).
// Full (showStars): five stars, filled up to the rating (used on the product page).
export default function Rating({ value, count, showStars = false }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" aria-label={`Rated ${value} out of 5`}>
      {showStars ? (
        <span className="flex gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={star <= Math.round(value) ? 'fill-star text-star' : 'fill-line text-line'}
            />
          ))}
        </span>
      ) : (
        <Star size={14} className="fill-star text-star" aria-hidden="true" />
      )}
      <span className="font-medium text-heading">{value}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </div>
  )
}
