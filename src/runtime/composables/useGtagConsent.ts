import { loadGtagScript } from '../utils'
import { useRuntimeConfig } from '#imports'

export function useGtagConsent(hasConsent: boolean) {
  if (process.server || !('dataLayer' in window))
    return

  // `js` and `config` are already called on plugin initialization
  const isInitialized = (window as any).dataLayer.length > 2

  if (hasConsent) {
    if (!isInitialized) {
      loadGtagScript()
    }
    else {
      // Re-enable Google Analytics
      disableGtag(false)
    }
    return
  }

  // Disable Google Analytics with GDPR compliance
  // https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
  disableGtag(true)
}

function disableGtag(value: boolean) {
  const { gtag: gtagOpts } = useRuntimeConfig().public
  ;(window as any)[`ga-disable-${gtagOpts.id}`] = value
}
