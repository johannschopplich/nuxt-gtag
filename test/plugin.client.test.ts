import type { NuxtApp } from 'nuxt/app'
import type { ModuleOptions } from '../src/module'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { moduleOptions, stubDataLayer } from './helpers'

const imports = vi.hoisted(() => ({
  options: {} as Required<ModuleOptions>,
}))

vi.mock('#imports', () => ({
  defineNuxtPlugin: ({ setup }: { setup: () => void }) => setup,
  useHead: () => {},
  useRuntimeConfig: () => ({
    public: { gtag: imports.options },
  }),
}))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('plugin', () => {
  it('pushes js and config for id with initMode auto', async () => {
    imports.options = moduleOptions({ id: 'G-ONE' })
    const readDataLayer = stubDataLayer()
    const { default: plugin } = await import('../src/runtime/plugin.client')

    plugin({} as NuxtApp)

    expect(readDataLayer()).toEqual([
      [
        'js',
        expect.any(Date),
      ],
      ['config', 'G-ONE', {}],
    ])
  })

  it('pushes nothing to window.dataLayer with initMode manual', async () => {
    imports.options = moduleOptions({
      initMode: 'manual',
      id: 'G-ONE',
      initCommands: [
        [
          'consent',
          'default',
          { analytics_storage: 'denied' },
        ],
      ],
    })
    const readDataLayer = stubDataLayer()
    const { default: plugin } = await import('../src/runtime/plugin.client')

    plugin({} as NuxtApp)

    expect(readDataLayer()).toEqual([])
  })
})
