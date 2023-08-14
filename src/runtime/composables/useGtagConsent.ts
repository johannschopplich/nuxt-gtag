import { useHead, useRuntimeConfig } from '#imports'

export function useGtagConsent(
  hasConsent: boolean,
  { id }: {
    /**
     * In case you want to initialize a custom Gtag ID. Make sure to set
     * `initialConsent` to `false` in the module options beforehand.
     */
    id?: string
  } = {},
) {
  const { gtag: { id: defaultId } } = useRuntimeConfig().public

  if (process.client && ('dataLayer' in window)) {
    // The first two `dataLayer` items are typically the `js` and `config` commands
    // that are called during the plugin initialization. Therefore, if the `dataLayer`
    // has more than two items, it is considered to be initialized.
    const isInitialized = (window as any).dataLayer.length > 2

    if (hasConsent) {
      if (!isInitialized) {
        useHead({
          script: [{ src: `https://www.googletagmanager.com/gtag/js?id=${id || defaultId}` }],
        })
      }
      else {
        // Re-enable Google Analytics
        disableGtag(false, id || defaultId)
      }
      return
    }

    disableGtag(true, id || defaultId)
  }
}

/**
 * Disable Google Analytics with GDPR compliance
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
 */
function disableGtag(value: boolean, id: string) {
  (window as any)[`ga-disable-${id}`] = value
}
