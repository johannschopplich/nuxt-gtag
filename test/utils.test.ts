import type { ModuleOptions } from '../src/module'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { initGtag, resolveTags } from '../src/runtime/utils'

function moduleOptions(options: Partial<ModuleOptions>) {
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
  } as Required<ModuleOptions>
}

function stubDataLayer() {
  const dataLayer: IArguments[] = []
  vi.stubGlobal('window', { dataLayer })
  return () => dataLayer.map(command => Array.from(command))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resolveTags', () => {
  it('returns an empty list when neither id nor tags is set', () => {
    expect(resolveTags(moduleOptions({}))).toEqual([])
  })

  it('normalizes a string entry of tags to an object', () => {
    expect(resolveTags(moduleOptions({ tags: ['G-STRING'] }))).toEqual([{ id: 'G-STRING' }])
  })

  it('drops a falsy entry of tags', () => {
    const tags = ['G-KEPT', '', undefined] as ModuleOptions['tags']

    expect(resolveTags(moduleOptions({ tags }))).toEqual([{ id: 'G-KEPT' }])
  })

  it('places id before the entries of tags', () => {
    const resolved = resolveTags(moduleOptions({ id: 'G-FIRST', tags: ['G-SECOND'] }))

    expect(resolved.map(tag => tag.id)).toEqual(['G-FIRST', 'G-SECOND'])
  })

  it('configures a tag ID named by both id and tags once, from id', () => {
    const resolved = resolveTags(moduleOptions({
      id: 'G-SAME',
      config: { send_page_view: false },
      tags: [{ id: 'G-SAME', config: { send_page_view: true } }],
    }))

    expect(resolved).toEqual([{
      id: 'G-SAME',
      config: { send_page_view: false },
      initCommands: [],
    }])
  })
})

describe('initGtag', () => {
  it('runs a tag init command before the js command', () => {
    const readDataLayer = stubDataLayer()

    initGtag({ tags: [{ id: 'G-ONE', initCommands: [['consent', 'default', { ad_storage: 'denied' }]] }] })

    expect(readDataLayer()).toEqual([
      ['consent', 'default', { ad_storage: 'denied' }],
      ['js', expect.any(Date)],
      ['config', 'G-ONE', {}],
    ])
  })

  it('configures every tag with its own config', () => {
    const readDataLayer = stubDataLayer()

    initGtag({ tags: [
      { id: 'G-ONE', config: { send_page_view: false } },
      { id: 'G-TWO' },
    ] })

    expect(readDataLayer().filter(([command]) => command === 'config')).toEqual([
      ['config', 'G-ONE', { send_page_view: false }],
      ['config', 'G-TWO', {}],
    ])
  })
})
