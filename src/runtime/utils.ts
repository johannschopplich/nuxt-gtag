import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'

export function gtag(..._args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

/**
 * Tag IDs already handed to the `config` command.
 *
 * @remarks
 * `window.dataLayer` cannot stand in for this: a third-party snippet such as Google Tag Manager
 * may have created it before Nuxt hydrates, which says nothing about what this module configured.
 */
export const configuredTagIds = new Set<string>()

export function initGtag({ tags }: { tags: GoogleTagOptions[] }) {
  window.dataLayer = window.dataLayer || []

  for (const tag of tags) {
    for (const command of tag.initCommands ?? [])
      gtag(...command)
  }

  gtag('js', new Date())
  for (const tag of tags) {
    gtag('config', tag.id, tag.config ?? {})
    configuredTagIds.add(tag.id)
  }
}

export function resolveTags(options: Required<ModuleOptions>) {
  const tags: GoogleTagOptions[] = options.tags.filter(Boolean)
    .map(tag => typeof tag === 'string' ? { id: tag } : tag)

  if (options.id) {
    const { id, config, initCommands } = options
    tags.unshift({ id, config, initCommands })
  }

  // A tag ID named by both `id` and `tags` would otherwise be configured twice.
  // `id` comes first and wins, since it carries the top-level `initCommands`
  // and `config`.
  const tagsById = new Map<string, GoogleTagOptions>()
  for (const tag of tags) {
    if (!tagsById.has(tag.id))
      tagsById.set(tag.id, tag)
  }

  return [...tagsById.values()]
}
