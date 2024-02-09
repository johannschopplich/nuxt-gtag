import { withQuery } from 'ufo'
import type { ResolvedModuleOptions } from '../module'
import { initGtag } from './gtag'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { tags, initialConsent, loadingStrategy, url } = useRuntimeConfig().public.gtag as Required<ResolvedModuleOptions>

    if (!tags.length)
      return

    initGtag({ tags })

    if (!initialConsent)
      return

    // Sanitize loading strategy to be either `async` or `defer`
    const strategy = loadingStrategy === 'async' ? 'async' : 'defer'

    useHead({
      script: [
        {
          src: withQuery(url, { id: tags[0].id }),
          [strategy]: true,
        },
      ],
    })
  },
})
