import type { ModuleOptions } from '../src/module'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useGtag } from '../src/runtime/composables/useGtag'
import { configuredTagIds } from '../src/runtime/utils'

const imports = vi.hoisted(() => ({
  options: {} as Required<ModuleOptions>,
  useHead: vi.fn(),
}))

vi.mock('#imports', () => ({
  useHead: imports.useHead,
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
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  imports.useHead.mockReset()
  configuredTagIds.clear()
})

describe('initialize', () => {
  it('injects the script with loadingStrategy async and its preload link', () => {
    setModuleOptions({ id: 'G-ONE', loadingStrategy: 'async' })
    stubDocument()

    useGtag().initialize()

    expect(imports.useHead).toHaveBeenCalledWith({
      link: [
        {
          rel: 'preload',
          as: 'script',
          href: 'https://www.googletagmanager.com/gtag/js?id=G-ONE',
        },
      ],
      script: [
        {
          'src': 'https://www.googletagmanager.com/gtag/js?id=G-ONE',
          'async': true,
          'data-gtag': '',
        },
      ],
    })
  })
  it('logs the missing tag ID for initialize() without any tag', () => {
    setModuleOptions({})
    stubDocument()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    useGtag().initialize()

    expect(consoleError).toHaveBeenCalledWith('[nuxt-gtag] Missing Google tag ID for initialize()')
    expect(imports.useHead).not.toHaveBeenCalled()
  })
})

describe('initialize with a tag ID', () => {
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
