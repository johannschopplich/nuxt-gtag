import type { ModuleOptions } from '../module'
import { initGtag } from './gtag'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const { id, config, initialConsent, loadingStrategy }
   = useRuntimeConfig().public.gtag as Required<ModuleOptions>

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
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        [strategy]: true,
      },
    ],
  })
})
