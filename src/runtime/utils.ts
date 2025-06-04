import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'
import { toRaw } from '#imports'

export function gtag(..._args: any[]) {
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

export function resolveTags(options: Required<ModuleOptions>) {
  const _options = toRaw(options)

  // Normalize tags
  const tags: GoogleTagOptions[] = _options.tags.filter(Boolean)
    .map(i => typeof i === 'string' ? { id: i } : i)

  if (_options.id) {
    const { id, config, initCommands } = _options
    tags.unshift({ id, config, initCommands })
  }

  return tags
}
