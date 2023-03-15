import type { Gtag } from './types'

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

  return {
    provide: {
      gtag,
    },
  }
})
