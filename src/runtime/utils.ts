import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'
import { toRaw } from 'vue'

export function gtag(..._args: any[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

export function initGtag({ tags }: { tags: GoogleTagOptions[] }) {
  window.dataLayer = window.dataLayer || []

  for (const tag of tags) {
    for (const command of tag.initCommands ?? [])
      gtag(...command)
  }

  gtag('js', new Date())
  for (const tag of tags) {
    // Always provide a default value for the `config` object.
    gtag('config', tag.id, tag.config ?? {})
  }
}

export function resolveTags(options: Required<ModuleOptions>) {
  const _options = toRaw(options)

  const tags: GoogleTagOptions[] = _options.tags.filter(Boolean)
    .map(tag => typeof tag === 'string' ? { id: tag } : tag)

  if (_options.id) {
    const { id, config, initCommands } = _options
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
