import { withQuery } from 'ufo'
import type { ModuleOptions } from '../module'
import { initGtag } from './gtag'
import { resolveTags } from './utils'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
    const tags = resolveTags(options)

    if (!tags.length) {
      return
    }

    initGtag({ tags })

    if (options.initMode === 'manual') {
      return
    }

    // Sanitize loading strategy to be either `async` or `defer`
    const strategy = options.loadingStrategy === 'async' ? 'async' : 'defer'

    useHead({
      script: [
        {
          'src': withQuery(options.url, { id: tags[0].id }),
          [strategy]: true,
          'data-gtag': '',
        },
      ],
    })
  },
})
