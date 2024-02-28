import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'

export function resolveTags(options: Required<ModuleOptions>) {
  // Normalize tags
  const tags: GoogleTagOptions[] = [...options.tags].filter(Boolean)
    .map(i => typeof i === 'string' ? { id: i } : i)

  if (options.id) {
    const { id, config, initCommands } = options
    tags.unshift({ id, config, initCommands })
  }

  return tags
}
