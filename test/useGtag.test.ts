import type { ModuleOptions } from '../src/module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
  vi.resetModules()
})

describe('initialize', () => {
  it('runs the top-level initCommands and js once across tag IDs', async () => {
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
    const { useGtag } = await import('../src/runtime/composables/useGtag')

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

  it('skips the top-level initCommands for initialize(id) with tags and no id', async () => {
    imports.options = moduleOptions({
      initCommands: [
        [
          'consent',
          'default',
          { analytics_storage: 'denied' },
        ],
      ],
      tags: ['G-TAGS'],
    })
    const readDataLayer = stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')

    useGtag().initialize('G-CUSTOM')

    expect(readDataLayer()).toEqual([
      [
        'js',
        expect.any(Date),
      ],
      ['config', 'G-CUSTOM', {}],
      ['config', 'G-TAGS', {}],
    ])
  })

  it('holds a consent update sent before initialize(id) until after the config command', async () => {
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
    const { useGtag } = await import('../src/runtime/composables/useGtag')

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

  it('holds a useTrackEvent event sent before initialize() until after the config command', async () => {
    imports.options = moduleOptions({ id: 'G-ONE' })
    const readDataLayer = stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')
    const { useTrackEvent } = await import('../src/runtime/composables/useTrackEvent')

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

  it('pushes a gtag call made after initialize() straight to the dataLayer', async () => {
    imports.options = moduleOptions({ id: 'G-ONE' })
    const readDataLayer = stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')
    const { gtag, initialize } = useGtag()

    initialize()
    const lengthAfterInitialize = readDataLayer().length
    gtag('event', 'login')

    expect(readDataLayer().slice(lengthAfterInitialize)).toEqual([
      ['event', 'login'],
    ])
  })
})
