import { withQuery } from 'ufo'
import { gtag, initGtag, resolveTags } from '../utils'
import { disableAnalytics as _disableAnalytics, enableAnalytics as _enableAnalytics } from '../analytics'
import type { ModuleOptions } from '../../module'
import type { Gtag } from '../types'
import { useHead, useRuntimeConfig } from '#imports'

export function useGtag() {
  const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
  const rawTags = resolveTags(options)

  let _gtag: Gtag
  // Return a noop function if this composable is called on the server.
  if (import.meta.server)
    _gtag = () => {}
  else if (import.meta.client)
    _gtag = gtag

  const getTag = (id?: string) => {
    const tags = [...rawTags]
    let tag = tags.find(tag => tag.id === id)

    if (!tag) {
      if (id) {
        tag = { id }
        tags.unshift(tag)
      }
      else {
        tag = tags[0]
      }
    }

    if (!tag)
      console.error('[nuxt-gtag] Missing Google tag ID')

    return { tag, tags }
  }

  /**
   * Manually initialize the Google tag library.
   *
   * @remarks
   * If no custom Google tag ID is provided, the default Google tag ID from the module options will be used.
   */
  const initialize = (
    /**
     * In case you want to initialize a custom Google tag ID. Make sure to set
     * `enabled` to `false` in the module options beforehand.
     */
    id?: string,
  ) => {
    if (import.meta.client) {
      const { tag, tags } = getTag(id)
      if (!tag)
        return

      // Initialize `dataLayer` if the client plugin didn't initialize it
      // (because no ID was provided in the module options).
      if (!window.dataLayer)
        initGtag({ tags })

      // Inject the Google tag script if it wasn't injected by the client plugin.
      if (!document.head.querySelector('script[data-gtag]')) {
        useHead({
          script: [{
            'src': withQuery(options.url, { id: tag.id }),
            'data-gtag': '',
          }],
        })
      }
    }
  }

  /**
   * Disable Google Analytics measurement.
   *
   * @remarks
   * The `gtag.js` library includes a `window['ga-disable-GA_MEASUREMENT_ID']`
   * property that, when set to `true`, disables `gtag.js` from sending data to Google Analytics.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out Disable Google Analytics measurement}
   */
  function disableAnalytics(id?: string) {
    if (import.meta.client) {
      const { tag } = getTag(id)
      if (tag)
        _disableAnalytics(tag.id)
    }
  }

  /**
   * Enable Google Analytics measurement if it was previously disabled.
   *
   * @remarks
   * The `gtag.js` library includes a `window['ga-disable-GA_MEASUREMENT_ID']`
   * property that, when set to `true`, disables `gtag.js` from sending data to Google Analytics.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out Disable Google Analytics measurement}
   */
  function enableAnalytics(id?: string) {
    if (import.meta.client) {
      const { tag } = getTag(id)
      if (tag)
        _enableAnalytics(tag.id)
    }
  }

  return {
    gtag: _gtag!,
    initialize,
    disableAnalytics,
    enableAnalytics,
  }
}
