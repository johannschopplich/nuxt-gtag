import type { Gtag } from '../types'
import type { useGtag } from './useGtag'
import { disableAnalytics as _disableAnalytics, enableAnalytics as _enableAnalytics } from '../analytics'

export function useGtagMock(): ReturnType<typeof useGtag> {
  const noop = () => {}

  return {
    gtag: noop as Gtag,
    initialize: noop,
    disableAnalytics: noop,
    enableAnalytics: noop,
  }
}
