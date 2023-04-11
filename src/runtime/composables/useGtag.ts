import type { Gtag } from '../types'
import { useNuxtApp } from '#imports'

export function useGtag(): Gtag {
  // Return a proxy to avoid errors when using the gtag function server-side
  // or when the Gtag ID is not set
  return useNuxtApp()?.$gtag ?? (() => {})
}
