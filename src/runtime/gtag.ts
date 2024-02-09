import type { GoogleTagOptions } from './types'

// eslint-disable-next-line unused-imports/no-unused-vars
export function gtag(command: string, ...args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

/**
 * Initialize the Google tag.
 */
export function initGtag({ tags }: { tags: GoogleTagOptions[] }) {
  window.dataLayer = window.dataLayer || []

  gtag('js', new Date())
  for (const tag of tags)
    gtag('config', tag.id, tag.config)
}

/**
 * Disable the Google tag if it is a Google Analytics property.
 *
 * @remarks
 * The Google tag library includes a `window['ga-disable-GA_MEASUREMENT_ID']`
 * property that, when set to `true`, turns off the Google tag from sending data.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
 */
export function disableGtag(id: string) {
  (window as any)[`ga-disable-${id}`] = true
}

/**
 * Enable Google Analytics if it was disabled before.
 */
export function enableGtag(id: string) {
  const key = `ga-disable-${id}`

  if (key in window)
    delete (window as any)[key]
}
