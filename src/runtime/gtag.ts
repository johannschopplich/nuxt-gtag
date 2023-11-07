// eslint-disable-next-line unused-imports/no-unused-vars
export function gtag(command: string, ...args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

/**
 * Configure Google Analytics tag.
 */
export function configureGtag({ id, config }: { id: string | string[]; config?: any }) {
  gtag('config', id, config)
}

/**
 * Initialize the Google Analytics script.
 */
export function initGtag({ id: _id, config }: { id: string | string[]; config: any }) {
  window.dataLayer = window.dataLayer || []

  gtag('js', new Date())

  const ids = [].concat(_id)

  for( const id of ids) 
    configureGtag('config', id, config)
}

/**
 * Disable Google Analytics.
 *
 * The Google tag (gtag.js) library includes a `window['ga-disable-MEASUREMENT_ID']`
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
