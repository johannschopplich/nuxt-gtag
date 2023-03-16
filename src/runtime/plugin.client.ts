import type { Gtag } from './types'
import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const { gtag: gtagOpts } = useRuntimeConfig().public

  if (!gtagOpts.id)
    return

  // @ts-expect-error: `dataLayer` is not defined
  window.dataLayer = window.dataLayer || []

  const gtag: Gtag = (...args: any[]) => {
    (window as any).dataLayer.push(args)
  }

  gtag('js', new Date())
  gtag('config', gtagOpts.id, gtagOpts.config)

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gtagOpts.id}`,
        async: true,
      },
    ],
  })

  return {
    provide: {
      gtag,
    },
  }
})
