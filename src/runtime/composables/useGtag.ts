import { gtag } from '../gtag'
import type { Gtag } from '../types'
import { useRuntimeConfig } from '#imports'

export function useGtag(): Gtag {
  const { gtag: { id } } = useRuntimeConfig().public

  // Return a noop function if this composable is called on the server
  // or if there is no Gtag ID configured
  if (!id || process.server)
    return () => {}

  return gtag
}
