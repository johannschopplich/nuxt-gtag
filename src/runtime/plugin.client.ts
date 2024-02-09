import { withQuery } from 'ufo'
import type { ModuleOptions } from '../module'
import { initGtag } from './gtag'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { id, config, initialConsent, loadingStrategy, url } = useRuntimeConfig().public.gtag as Required<ModuleOptions>

    if (!id)
      return

    initGtag({ id, config })

    if (!initialConsent)
      return

    // Sanitize loading strategy to be either `async` or `defer`
    const strategy = loadingStrategy === 'async' ? 'async' : 'defer'

    useHead({
      script: [
        {
          src: withQuery(url, { id }),
          [strategy]: true,
        },
      ],
    })
  },
})
