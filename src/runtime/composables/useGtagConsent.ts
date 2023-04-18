import { gtag } from '../gtag'
import { useHead, useRoute, useRuntimeConfig } from '#imports'

export function useGtagConsent(hasConsent: boolean) {
  const { gtag: { id } } = useRuntimeConfig().public

  if (process.server || !('dataLayer' in window))
    return

  // The first two `dataLayer` items are typically the `js` and `config` commands
  // that are called during the plugin initialization. Therefore, if the `dataLayer`
  // has more than two items, it is considered to be initialized.
  const isInitialized = (window as any).dataLayer.length > 2

  if (hasConsent) {
    if (!isInitialized) {
      useHead({
        script: [{ src: `https://www.googletagmanager.com/gtag/js?id=${id}` }],
      })

      // Send initial `page_view` event
      gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: useRoute().path,
        page_title: document.title,
      })
    }
    else {
      // Re-enable Google Analytics
      disableGtag(false, id)
    }
    return
  }

  disableGtag(true, id)
}

/**
 * Disable Google Analytics with GDPR compliance
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
 */
function disableGtag(value: boolean, id: string) {
  (window as any)[`ga-disable-${id}`] = value
}
