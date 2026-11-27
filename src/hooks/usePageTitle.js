import { useEffect } from 'react'
import { site } from '../data/site'

// Sets the browser tab title, e.g. "Shop | Your Store".
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name
  }, [title])
}
