import type { ModuleOptions } from '../src/module'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useGtag } from '../src/runtime/composables/useGtag'
import { configuredTagIds } from '../src/runtime/utils'

const imports = vi.hoisted(() => ({
  options: {} as Required<ModuleOptions>,
}))

vi.mock('#imports', () => ({
  useHead: () => {},
  useRuntimeConfig: () => ({
    public: { gtag: imports.options },
  }),
}))

function setModuleOptions(options: Partial<ModuleOptions>) {
  imports.options = {
    enabled: true,
    initMode: 'manual',
    id: '',
    initCommands: [],
    config: {},
    tags: [],
    loadingStrategy: 'defer',
    url: 'https://www.googletagmanager.com/gtag/js',
    ...options,
  }
}

function stubDocument() {
  const dataLayer: IArguments[] = []
  vi.stubGlobal('window', { dataLayer })
  vi.stubGlobal('document', {
    head: {
      querySelector: () => null,
    },
  })
  return () => dataLayer.map(command => Array.from(command))
}

afterEach(() => {
  vi.unstubAllGlobals()
  configuredTagIds.clear()
})

describe('initialize', () => {
  it('runs the top-level initCommands and js once across tag IDs', () => {
    setModuleOptions({
      initCommands: [
        [
          'consent',
          'default',
          { analytics_storage: 'denied' },
        ],
      ],
    })
    const readDataLayer = stubDocument()

    const { initialize } = useGtag()
    initialize('G-TENANT-A')
    initialize('G-TENANT-B')

    expect(readDataLayer()).toEqual([
      [
        'consent',
        'default',
        { analytics_storage: 'denied' },
      ],
      [
        'js',
        expect.any(Date),
      ],
      ['config', 'G-TENANT-A', {}],
      ['config', 'G-TENANT-B', {}],
    ])
  })
})
