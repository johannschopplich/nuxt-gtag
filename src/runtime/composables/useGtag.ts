import type { Gtag } from '../types'

export function useGtag(): Gtag {
  // Return a proxy to avoid errors when using the gtag function server-side
  // or when the gtag plugin is not enabled
  return useNuxtApp()?.$gtag ?? (() => {})
}
