import type { GoogleTagOptions } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function gtag(...args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

/**
 * Initialize the Google tag.
 */
export function initGtag({ tags }: { tags: GoogleTagOptions[] }) {
  window.dataLayer = window.dataLayer || []

  for (const tag of tags) {
    for (const command of tag.initCommands ?? [])
      gtag(...command)
  }

  gtag('js', new Date())
  for (const tag of tags) {
    // Always provide a default value for the `config` object
    gtag('config', tag.id, tag.config ?? {})
  }
}
