import { withQuery } from 'ufo'
import { disableGtag, enableGtag, gtag, initGtag } from '../gtag'
import type { ModuleOptions } from '../../module'
import type { Gtag, UseGtagConsentOptions } from '../types'
import { resolveTags } from '../utils'
import { useHead, useRuntimeConfig } from '#imports'

export function useGtag() {
  const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
  const tags = resolveTags(options)

  let _gtag: Gtag
  // Return a noop function if this composable is called on the server.
  if (process.server)
    _gtag = () => {}
  else if (process.client)
    _gtag = gtag

  const setConsent = ({
    id,
    hasConsent = true,
  }: UseGtagConsentOptions) => {
    if (process.client) {
      const _tags = [...tags]
      if (id && !_tags.find(tag => tag.id === id))
        _tags.unshift({ id })

      if (!_tags.length) {
        console.error('[nuxt-gtag] Missing Google tag ID')
        return
      }

      if (!hasConsent) {
        disableGtag(_tags[0].id)
        return
      }

      // Initialize `dataLayer` if the client plugin didn't initialize it
      // (because no ID was provided in the module options).
      if (!window.dataLayer)
        initGtag({ tags: _tags })

      // If the `dataLayer` has more than two items
      // it is considered to be initialized.
      if (window.dataLayer!.length > 2) {
        // Re-enable Google Analytics if it was disabled before.
        enableGtag(_tags[0].id)
        return
      }

      // Inject the Google tag script.
      useHead({
        script: [{ src: withQuery(options.url, { id: _tags[0].id }) }],
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
