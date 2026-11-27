// Joins class names and skips empty values: cn('a', false, 'b') -> "a b"
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
