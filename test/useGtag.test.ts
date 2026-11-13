import type { ModuleOptions } from '../src/module'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useGtag } from '../src/runtime/composables/useGtag'
import { useTrackEvent } from '../src/runtime/composables/useTrackEvent'
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

  it('holds a consent update sent before initialize(id) until after the config command', () => {
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

    const { gtag, initialize } = useGtag()
    gtag('consent', 'update', { analytics_storage: 'granted' })
    initialize('G-TENANT')

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
      ['config', 'G-TENANT', {}],
      [
        'consent',
        'update',
        { analytics_storage: 'granted' },
      ],
    ])
  })

  it('holds a useTrackEvent event sent before initialize() until after the config command', () => {
    setModuleOptions({ id: 'G-ONE' })
    const readDataLayer = stubDocument()

    useTrackEvent('login')
    useGtag().initialize()

    expect(readDataLayer()).toEqual([
      [
        'js',
        expect.any(Date),
      ],
      ['config', 'G-ONE', {}],
      ['event', 'login'],
    ])
  })
})
