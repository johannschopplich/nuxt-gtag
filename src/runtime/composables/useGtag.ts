import { disableGtag, enableGtag, gtag, initGtag, configureGtag } from '../gtag'
import type { Gtag, UseGtagConsentOptions } from '../types'
import { useHead, useRuntimeConfig } from '#imports'

export function useGtag() {
  const { gtag: { id: defaultId, config } } = useRuntimeConfig().public

  let _gtag: Gtag
  // Return a noop function if this composable is called on the server.
  if (process.server)
    _gtag = () => {}
  else if (process.client)
    _gtag = gtag

  const setConsent = (options: UseGtagConsentOptions) => {
    if (process.client) {
      const hasConsent = options.hasConsent ?? true
      const id = options.id || defaultId

      if (!hasConsent) {
        disableGtag(id)
        return
      }

      // Initialize `dataLayer` if the client plugin didn't initialize it
      // (because no ID was provided in the module options).
      if (!window.dataLayer)
        initGtag({ id, config })

      // If the `dataLayer` has more than two items
      // it is considered to be initialized.
      if (window.dataLayer!.length > 2) {
        // Re-enable Google Analytics if it was disabled before.
        enableGtag(id)
        return
      }

      // Inject the Google Analytics script.
      useHead({
        script: [{ src: `https://www.googletagmanager.com/gtag/js?id=${id}` }],
      })
    }
  }

  const grantConsent = (
    /**
     * In case you want to initialize a custom Gtag ID. Make sure to set
     * `initialConsent` to `false` in the module options beforehand.
     */
    id?: string,
  ) => {
    setConsent({ id, hasConsent: true })
  }

  const revokeConsent = (
    /**
     * In case you want to initialize a custom Gtag ID. Make sure to set
     * `initialConsent` to `false` in the module options beforehand.
     */
    id?: string,
  ) => {
    setConsent({ id, hasConsent: false })
  }

  const configureSecond = (
    id: string,
    config?: any
  )  => {
    configureGtag({ id, config})
  }

  return {
    gtag: _gtag!,
    setConsent,
    grantConsent,
    revokeConsent,
    configureSecond
  }
}
