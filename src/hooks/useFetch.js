import { useEffect, useState } from 'react'

// Runs a service function and tracks its result.
//   const { data, loading, error } = useFetch(getProducts)
// Pass a `key` to run it again when a value changes:
//   useFetch(() => getProductBySlug(slug), slug)
export function useFetch(fetcher, key = '') {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, loading: true }))
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => {
      active = false
    }
    // Re-run only when `key` changes, not on every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
