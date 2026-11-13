import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'
import { withQuery } from 'ufo'

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

/**
 * `initCommands` lists already run, by reference.
 *
 * @remarks
 * The top-level list rides along with every tag ID it applies to. Run again, its
 * `consent` `default` would land after an earlier `consent` `update`.
 */
const executedInitCommands = new WeakSet<object>()

export function initGtag({ tags }: { tags: GoogleTagOptions[] }) {
  window.dataLayer = window.dataLayer || []

  for (const tag of tags) {
    if (!tag.initCommands || executedInitCommands.has(tag.initCommands))
      continue

    for (const command of tag.initCommands)
      gtag(...command)
    executedInitCommands.add(tag.initCommands)
  }

  if (configuredTagIds.size === 0)
    gtag('js', new Date())

  for (const tag of tags) {
    gtag('config', tag.id, tag.config ?? {})
    configuredTagIds.add(tag.id)
  }
}

/**
 * Builds the `useHead` input that loads the `gtag.js` script for a tag ID.
 */
export function createScriptHead(options: Required<ModuleOptions>, id: string) {
  const src = withQuery(options.url, { id })
  // Sanitize loading strategy to be either `async` or `defer`.
  const strategy = options.loadingStrategy === 'async'
    ? 'async'
    : 'defer'

  return {
    link: [
      {
        rel: 'preload' as const,
        as: 'script' as const,
        href: src,
      },
    ],
    script: [
      {
        src,
        [strategy]: true,
        'data-gtag': '',
      },
    ],
  }
}

export function resolveTags(options: Required<ModuleOptions>) {
  const tags: GoogleTagOptions[] = options.tags.filter(Boolean)
    .map(tag => typeof tag === 'string'
      ? { id: tag }
      : tag)

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

  return [
    ...tagsById.values(),
  ]
}
