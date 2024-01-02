import type { ModuleOptions } from '../module'
import { initGtag } from './gtag'
import { defineNuxtPlugin, useGtag, useHead, useRouter, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { id, config, initialConsent, loadingStrategy, enableAutomaticRouteTracking } = useRuntimeConfig().public.gtag as Required<ModuleOptions>

    if (!id)
      return

    initGtag({ id, config })

    // Set up automatic route tracking
    const router = useRouter()
    const { gtag } = useGtag()
    router.afterEach(() => {
      if (enableAutomaticRouteTracking) {
        gtag('event', 'page_view', {
          page_location: router.currentRoute.value.fullPath,
          page_title: router.currentRoute.value.meta.title,
        })
      }
    })

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
  },
})
