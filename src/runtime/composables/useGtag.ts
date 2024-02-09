import { withQuery } from 'ufo'
import { disableGtag, enableGtag, gtag, initGtag } from '../gtag'
import type { ResolvedModuleOptions } from '../../module'
import type { Gtag, UseGtagConsentOptions } from '../types'
import { useHead, useRuntimeConfig } from '#imports'

export function useGtag() {
  const { tags, url } = useRuntimeConfig().public.gtag as Required<ResolvedModuleOptions>

  let _gtag: Gtag
  // Return a noop function if this composable is called on the server.
  if (process.server)
    _gtag = () => {}
  else if (process.client)
    _gtag = gtag

  const setConsent = (options: UseGtagConsentOptions) => {
    if (process.client) {
      const hasConsent = options.hasConsent ?? true
      const tag = tags?.find(tag => tag.id === options.id) ?? tags?.[0] ?? { id: options.id }

      if (!tag) {
        console.error('[nuxt-gtag] Missing Google tag ID')
        return
      }

      if (!hasConsent) {
        disableGtag(tag.id)
        return
      }

      // Initialize `dataLayer` if the client plugin didn't initialize it
      // (because no ID was provided in the module options).
      if (!window.dataLayer)
        initGtag({ tags: [tag] })

      // If the `dataLayer` has more than two items
      // it is considered to be initialized.
      if (window.dataLayer!.length > 2) {
        // Re-enable Google Analytics if it was disabled before.
        enableGtag(tag.id)
        return
      }

      // Inject the Google tag script.
      useHead({
        script: [{ src: withQuery(url, { id: tag.id }) }],
      })
    }
  }

  const grantConsent = (
    /**
     * In case you want to initialize a custom Google tag ID. Make sure to set
     * `initialConsent` to `false` in the module options beforehand.
     */
    id?: string,
  ) => {
    setConsent({ id, hasConsent: true })
  }

  const revokeConsent = (
    /**
     * In case you want to initialize a custom Google tag ID. Make sure to set
     * `initialConsent` to `false` in the module options beforehand.
     */
    id?: string,
  ) => {
    setConsent({ id, hasConsent: false })
  }

  return {
    gtag: _gtag!,
    setConsent,
    grantConsent,
    revokeConsent,
  }
}
