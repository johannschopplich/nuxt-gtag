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

describe('disableAnalytics', () => {
  it('switches off the first tag ID handed to initialize(id) when called without an ID', async () => {
    imports.options = moduleOptions()
    stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')
    const { initialize, disableAnalytics } = useGtag()

    initialize('G-TENANT-A')
    initialize('G-TENANT-B')
    disableAnalytics()

    expect((window as any)['ga-disable-G-TENANT-A']).toBe(true)
    expect('ga-disable-G-TENANT-B' in window).toBe(false)
  })

  it('prefers the tag from the module options over one handed to initialize(id) when called without an ID', async () => {
    imports.options = moduleOptions({ id: 'G-OPTIONS' })
    stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')
    const { initialize, disableAnalytics } = useGtag()

    initialize('G-TENANT')
    disableAnalytics()

    expect((window as any)['ga-disable-G-OPTIONS']).toBe(true)
    expect('ga-disable-G-TENANT' in window).toBe(false)
  })
})

describe('enableAnalytics', () => {
  it('switches the tag ID handed to initialize(id) back on when called without an ID', async () => {
    imports.options = moduleOptions()
    stubDataLayer()
    const { useGtag } = await import('../src/runtime/composables/useGtag')
    const { initialize, enableAnalytics } = useGtag()

    initialize('G-TENANT')
    Object.assign(window, { 'ga-disable-G-TENANT': true })
    enableAnalytics()

    expect('ga-disable-G-TENANT' in window).toBe(false)
  })
})
