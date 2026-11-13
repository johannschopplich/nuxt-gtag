import type { ModuleOptions } from '../src/module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGtag } from '../src/runtime/composables/useGtag'
import { useTrackEvent } from '../src/runtime/composables/useTrackEvent'
import { configuredTagIds } from '../src/runtime/utils'
import { moduleOptions, stubDataLayer } from './helpers'

const imports = vi.hoisted(() => ({
  options: {} as Required<ModuleOptions>,
}))

vi.mock('#imports', () => ({
  useHead: () => {},
  useRuntimeConfig: () => ({
    public: { gtag: imports.options },
  }),
}))

beforeEach(() => {
  vi.stubGlobal('document', {
    head: {
      querySelector: () => null,
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  configuredTagIds.clear()
})

describe('initialize', () => {
  it('runs the top-level initCommands and js once across tag IDs', () => {
    imports.options = moduleOptions({
      initCommands: [
        [
          'consent',
          'default',
          { analytics_storage: 'denied' },
        ],
      ],
    })
    const readDataLayer = stubDataLayer()

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
    imports.options = moduleOptions({
      initCommands: [
        [
          'consent',
          'default',
          { analytics_storage: 'denied' },
        ],
      ],
    })
    const readDataLayer = stubDataLayer()

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
    imports.options = moduleOptions({ id: 'G-ONE' })
    const readDataLayer = stubDataLayer()

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
