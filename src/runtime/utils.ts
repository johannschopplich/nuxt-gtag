import type { ModuleOptions } from '../module'
import type { GoogleTagOptions } from './types'
import { toRaw } from '#imports'

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
