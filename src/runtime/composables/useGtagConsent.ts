import { gtag } from '../gtag'
import type { UseGtagConsentOptions } from '../types'
import { useHead, useRuntimeConfig } from '#imports'

export function useGtagConsent(
  hasConsent: boolean,
  options?: Omit<UseGtagConsentOptions, 'hasConsent'>,
): void
export function useGtagConsent(options: UseGtagConsentOptions): void
export function useGtagConsent(
  arg1: boolean | UseGtagConsentOptions,
  arg2?: Omit<UseGtagConsentOptions, 'hasConsent'>,
) {
  if (process.client) {
    const { gtag: { id: defaultId, config } } = useRuntimeConfig().public
    const hasConsent = typeof arg1 === 'boolean' ? arg1 : arg1.hasConsent ?? true
    const id = (typeof arg1 === 'boolean' ? arg2?.id : arg1.id) || defaultId

    // Initialize `dataLayer` if the client plugin didn't initialize it
    // (because no ID was provided in the module options).
    if (!window.dataLayer) {
      window.dataLayer = []

      gtag('js', new Date())
      gtag('config', id, config)
    }

    if (hasConsent) {
      // Only if the `dataLayer` has more than two items,
      // it is considered to be initialized.
      if (window.dataLayer.length > 2) {
        // Re-enable Google Analytics if it was disabled before.
        disableGtag(id, false)
      }
      else {
        // Inject the Google Analytics script.
        useHead({
          script: [{ src: `https://www.googletagmanager.com/gtag/js?id=${id}` }],
        })
      }
    }
    else {
      disableGtag(id, true)
    }
  }
}

/**
 * Disable Google Analytics for GDPR compliance.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
 */
function disableGtag(id: string, value: boolean) {
  (window as any)[`ga-disable-${id}`] = value
}
