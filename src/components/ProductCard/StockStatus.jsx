// Small availability line: in stock, running low, or out of stock.
export default function StockStatus({ stock }) {
  if (stock <= 0) return <p className="text-xs font-medium text-danger">Out of stock</p>
  if (stock <= 5) return <p className="text-xs font-medium text-warning">Only {stock} left</p>
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-accent-dark">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> In stock
    </p>
  )
}
