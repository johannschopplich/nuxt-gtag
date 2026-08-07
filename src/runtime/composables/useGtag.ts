import type { ModuleOptions } from '../../module'
import type { Gtag } from '../types'
import { withQuery } from 'ufo'
import { useHead, useRuntimeConfig } from '#imports'
import { disableAnalytics as _disableAnalytics, enableAnalytics as _enableAnalytics } from '../analytics'
import { configuredTagIds, gtag, initGtag, resolveTags } from '../utils'

export function useGtag() {
  const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
  const rawTags = resolveTags(options)

  let _gtag: Gtag
  if (import.meta.server)
    _gtag = () => {}
  else if (import.meta.client)
    _gtag = gtag

  const getTag = (id?: string) => {
    const tags = [...rawTags]
    let tag = tags.find(tag => tag.id === id)

    if (!tag) {
      if (id) {
        tag = {
          id,
          initCommands: options.initCommands,
          config: options.config,
        }
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
   * Manually initializes the Google tag library.
   *
   * @remarks
   * If no custom Google tag ID is provided, the default Google tag ID from the module options will be used.
   */
  const initialize = (
    /**
     * In case you want to initialize a custom Google tag ID. Make sure to set
     * `initMode` to `manual` in the module options beforehand.
     */
    id?: string,
  ) => {
    if (import.meta.client) {
      const { tag, tags } = getTag(id)
      if (!tag)
        return

      const pendingTags = tags.filter(candidate => !configuredTagIds.has(candidate.id))
      if (pendingTags.length > 0)
        initGtag({ tags: pendingTags })

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
   * Disables Google Analytics measurement.
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
   * Enables Google Analytics measurement if it was previously disabled.
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
