import type { ModuleOptions } from '../src/module'
import { vi } from 'vitest'

export function moduleOptions(options: Partial<ModuleOptions> = {}): Required<ModuleOptions> {
  return {
    enabled: true,
    initMode: 'auto',
    id: '',
    initCommands: [],
    config: {},
    tags: [],
    loadingStrategy: 'defer',
    url: 'https://www.googletagmanager.com/gtag/js',
    ...options,
  }
}

export function stubDataLayer() {
  const dataLayer: IArguments[] = []
  vi.stubGlobal('window', { dataLayer })
  return () => dataLayer.map(command => Array.from(command))
}
