import type { Gtag } from '../types'
import type { useGtag } from './useGtag'

export function useGtagMock(): ReturnType<typeof useGtag> {
  const noop = () => {}

  return {
    gtag: noop as Gtag,
    initialize: noop,
    disableAnalytics: noop,
    enableAnalytics: noop,
  }
}
