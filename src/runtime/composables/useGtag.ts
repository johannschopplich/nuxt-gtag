import { gtag } from '../utils'
import type { Gtag } from '../types'

export function useGtag(): Gtag {
  // Return a proxy to avoid errors when using the gtag function server-side
  // or when the Gtag ID is not set
  if (process.server)
    return () => {}

  return gtag
}
