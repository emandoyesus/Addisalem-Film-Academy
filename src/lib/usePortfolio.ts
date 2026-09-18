import { useEffect, useState } from 'react'
import { fetchPortfolio, firebaseConfigured, type PortfolioItem } from './firebase'

/* Loads the owner-managed portfolio once per mount. Empty while Firestore is
   unconfigured or unreachable, so the markup can simply hide itself. */
export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!(await firebaseConfigured())) {
        if (!cancelled) setReady(true)
        return
      }
      try {
        const remote = await fetchPortfolio()
        if (!cancelled) setItems(remote)
      } catch {
        /* Stay empty when Firestore is unreachable. */
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { items, ready }
}
