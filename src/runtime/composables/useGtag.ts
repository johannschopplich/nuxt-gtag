import { gtag } from '../gtag'
import type { Gtag } from '../types'

export function useGtag(): Gtag {
  // Return a noop function if this composable is called on the server
  if (process.server)
    return () => {}

  return gtag
}
