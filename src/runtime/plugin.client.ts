import type { ModuleOptions } from '../module'
import { useHead, useRuntimeConfig } from '#imports'
import { defineNuxtPlugin } from 'nuxt/app'
import { withQuery } from 'ufo'
import { initGtag, resolveTags } from './utils'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const options = useRuntimeConfig().public.gtag as Required<ModuleOptions>
    const tags = resolveTags(options)

    if (!tags.length)
      return

    initGtag({ tags })

    if (options.initMode === 'manual')
      return

    // Sanitize loading strategy to be either `async` or `defer`
    const strategy = options.loadingStrategy === 'async' ? 'async' : 'defer'

    useHead({
      link: [
        {
          rel: 'preload',
          as: 'script',
          href: withQuery(options.url, { id: tags[0].id }),
        },
      ],
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
