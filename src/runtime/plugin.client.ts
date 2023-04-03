import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const { gtag: gtagOpts } = useRuntimeConfig().public

  if (!gtagOpts.id)
    return

  // @ts-expect-error: `dataLayer` is not defined
  window.dataLayer = window.dataLayer || []

  function gtag(..._args: any[]) {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', gtagOpts.id, gtagOpts.config)

  // Sanitize loading strategy to be either `async` or `defer`
  const loadingStrategy = gtagOpts.loadingStrategy === 'async' ? 'async' : 'defer'

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gtagOpts.id}`,
        [loadingStrategy]: true,
      },
    ],
  })

  return {
    provide: {
      gtag,
    },
  }
})
